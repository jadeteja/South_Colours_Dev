using Microsoft.EntityFrameworkCore;
using Southcolours.Persistence.Context;

namespace Southcolours.API.Health;

public interface IDatabaseReadinessCheck
{
    Task<ReadinessResult> CheckReadinessAsync(CancellationToken cancellationToken = default);
}

public record ReadinessResult(bool IsReady, string Status, string? FailureReason = null);

public class DatabaseReadinessCheck : IDatabaseReadinessCheck
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<DatabaseReadinessCheck> _logger;
    private static volatile bool _cachedReady;
    private static DateTime _lastCheckedUtc = DateTime.MinValue;
    private static readonly TimeSpan CacheDuration = TimeSpan.FromSeconds(30);

    public DatabaseReadinessCheck(IServiceProvider serviceProvider, ILogger<DatabaseReadinessCheck> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public async Task<ReadinessResult> CheckReadinessAsync(CancellationToken cancellationToken = default)
    {
        // Once verified as Ready, cache for CacheDuration to avoid continuous DB probe overhead on every HTTP request
        if (_cachedReady && DateTime.UtcNow - _lastCheckedUtc < CacheDuration)
        {
            return new ReadinessResult(true, "Ready");
        }

        try
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // 1. Check database connectivity with retry for cold start (3 attempts with backoff)
            bool canConnect = false;
            for (int attempt = 1; attempt <= 3; attempt++)
            {
                using var timeoutCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                timeoutCts.CancelAfter(TimeSpan.FromSeconds(10));

                try
                {
                    canConnect = await context.Database.CanConnectAsync(timeoutCts.Token);
                    if (canConnect) break;
                }
                catch
                {
                    if (attempt == 3) throw;
                }

                if (!canConnect && attempt < 3)
                {
                    await Task.Delay(1000 * attempt, cancellationToken);
                }
            }

            if (!canConnect)
            {
                _cachedReady = false;
                _logger.LogWarning("Readiness probe: Database connection check returned false after retries.");
                return new ReadinessResult(false, "Unhealthy", "Database connection unavailable.");
            }

            // 2. Check installation marker & schema readiness
            using (var markerTimeout = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken))
            {
                markerTimeout.CancelAfter(TimeSpan.FromSeconds(10));
                try
                {
                    var marker = await context.InstallationMarkers
                        .OrderByDescending(m => m.Id)
                        .FirstOrDefaultAsync(markerTimeout.Token);

                    if (marker == null || !marker.BootstrapCompleted)
                    {
                        _cachedReady = false;
                        _logger.LogWarning("Readiness probe: Database has not completed installation bootstrap.");
                        return new ReadinessResult(false, "Installing", "Database setup has not been completed.");
                    }
                }
                catch (Exception ex)
                {
                    _cachedReady = false;
                    _logger.LogWarning(ex, "Readiness probe: InstallationMarkers table missing or query failed.");
                    return new ReadinessResult(false, "Installing", "Database setup has not been adopted or completed.");
                }
            }

            // 3. Check pending migrations (schema compatibility)
            using (var migTimeout = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken))
            {
                migTimeout.CancelAfter(TimeSpan.FromSeconds(10));
                var pendingMigrations = await context.Database.GetPendingMigrationsAsync(migTimeout.Token);
                if (pendingMigrations.Any())
                {
                    _cachedReady = false;
                    _logger.LogWarning("Readiness probe: Pending migrations detected ({Count}). Schema incompatible.", pendingMigrations.Count());
                    return new ReadinessResult(false, "IncompatibleSchema", "Database schema upgrade pending.");
                }
            }

            _cachedReady = true;
            _lastCheckedUtc = DateTime.UtcNow;
            return new ReadinessResult(true, "Ready");
        }
        catch (Exception ex)
        {
            _cachedReady = false;
            _logger.LogError(ex, "Readiness probe exception: sanitized diagnostic failure.");
            return new ReadinessResult(false, "Error", "Database readiness probe encountered an error.");
        }
    }
}

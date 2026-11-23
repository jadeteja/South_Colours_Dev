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

    public DatabaseReadinessCheck(IServiceProvider serviceProvider, ILogger<DatabaseReadinessCheck> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public async Task<ReadinessResult> CheckReadinessAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // 1. Check database connectivity with bounded probe timeout
            using var timeoutCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            timeoutCts.CancelAfter(TimeSpan.FromSeconds(5));

            var canConnect = await context.Database.CanConnectAsync(timeoutCts.Token);
            if (!canConnect)
            {
                _logger.LogWarning("Readiness probe: Database connection check returned false.");
                return new ReadinessResult(false, "Unhealthy", "Database connection unavailable.");
            }

            // 2. Check installation marker & schema readiness
            bool hasMarkerTable = false;
            try
            {
                var marker = await context.InstallationMarkers
                    .OrderByDescending(m => m.Id)
                    .FirstOrDefaultAsync(timeoutCts.Token);

                if (marker == null || !marker.BootstrapCompleted)
                {
                    _logger.LogWarning("Readiness probe: Database has not completed installation bootstrap.");
                    return new ReadinessResult(false, "Installing", "Database setup has not been completed.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Readiness probe: InstallationMarkers table missing or query failed.");
                return new ReadinessResult(false, "Installing", "Database setup has not been adopted or completed.");
            }

            // 3. Check pending migrations (schema compatibility)
            var pendingMigrations = await context.Database.GetPendingMigrationsAsync(timeoutCts.Token);
            if (pendingMigrations.Any())
            {
                _logger.LogWarning("Readiness probe: Pending migrations detected ({Count}). Schema incompatible.", pendingMigrations.Count());
                return new ReadinessResult(false, "IncompatibleSchema", "Database schema upgrade pending.");
            }

            return new ReadinessResult(true, "Ready");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Readiness probe exception: sanitized diagnostic failure.");
            return new ReadinessResult(false, "Error", "Database readiness probe encountered an error.");
        }
    }
}

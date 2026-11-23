using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Southcolours.Installation.SqlServer;
using Southcolours.Persistence.Context;
using Southcolours.Persistence.Installation;
using Southcolours.Persistence.Seed;

namespace Southcolours.Installation.Operations;

public class InstallationRunner
{
    private readonly IInstallationStateStore _stateStore;
    private readonly IServiceProvider _serviceProvider;

    public InstallationRunner(IInstallationStateStore stateStore, IServiceProvider serviceProvider)
    {
        _stateStore = stateStore;
        _serviceProvider = serviceProvider;
    }

    public async Task<string> RunInstallationAsync(
        string connectionString, 
        string adminEmail, 
        string adminPassword, 
        bool seedSampleCatalog = false, 
        bool cleanExistingData = false,
        string? customInstallationId = null,
        CancellationToken ct = default)
    {
        var operationId = Guid.NewGuid().ToString("N");
        var installationId = customInstallationId ?? Guid.NewGuid().ToString("N");

        var locked = await _stateStore.AcquireLockAsync(operationId, "InstallationRunner", ct);
        if (!locked)
        {
            throw new InvalidOperationException("Another installation or maintenance operation is currently active. Lock could not be acquired.");
        }

        try
        {
            // 1. Probe target
            await _stateStore.UpdateCheckpointAsync(operationId, "ProbingTarget", "Validating target database environment...", true, ct);
            var probe = await SqlServerTargetProbe.ProbeTargetAsync(connectionString, ct);

            // 2. Ensure Catalog exists
            if (probe.Classification == TargetClassification.Absent)
            {
                await _stateStore.UpdateCheckpointAsync(operationId, "CreatingCatalog", "Creating new SQL Server database catalog...", true, ct);
                await SqlServerProvisioner.EnsureCatalogCreatedAsync(connectionString, ct);
            }

            // 3. Apply Migrations
            await _stateStore.UpdateCheckpointAsync(operationId, "ApplyingMigrations", "Applying Entity Framework schema migrations...", true, ct);
            await SqlServerMigrationRunner.ApplyMigrationsAsync(connectionString, ct);

            // Clean existing sample data if requested or if sample catalog was explicitly unchecked on a reset
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                if (cleanExistingData || !seedSampleCatalog)
                {
                    // Remove all sample catalog items and ledger entries
                    await context.Database.ExecuteSqlRawAsync(
                        "DELETE FROM CartItems; DELETE FROM OrderItems; DELETE FROM WishlistItems; DELETE FROM ProductImages; DELETE FROM ProductVariants; DELETE FROM ProductReviews; DELETE FROM Products; DELETE FROM SubCategories; DELETE FROM Categories; DELETE FROM Banners; DELETE FROM Coupons; DELETE FROM SeedHistoryEntries WHERE SeedId = 'SEED_SAMPLE_CATALOG';",
                        ct);
                }

                // Seed Roles
                await DatabaseSeeder.SeedRolesAsync(context, roleManager, operationId);

                // Optional sample catalog
                if (seedSampleCatalog)
                {
                    await _stateStore.UpdateCheckpointAsync(operationId, "SeedingCatalog", "Seeding sample catalog categories, products, and banners...", true, ct);
                    await DatabaseSeeder.SeedSampleCatalogAsync(context, operationId);
                }

                // 5. Bootstrap First Administrator
                await _stateStore.UpdateCheckpointAsync(operationId, "BootstrappingAdmin", "Registering initial administrator account...", true, ct);
                await FirstAdministratorBootstrap.BootstrapAdminAsync(context, userManager, roleManager, adminEmail, adminPassword, installationId, operationId);
            }

            // 6. Complete and release lock
            await _stateStore.CompleteOperationAsync(operationId, installationId, probe.DatabaseName, "1.0.0", ct);
            return installationId;
        }
        catch (Exception ex)
        {
            await _stateStore.UpdateCheckpointAsync(operationId, "Failed", ex.Message, false, ct);
            await _stateStore.ReleaseLockAsync(operationId, ct);
            throw;
        }
    }
}

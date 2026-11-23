using Microsoft.EntityFrameworkCore;
using Southcolours.Persistence.Context;

namespace Southcolours.Installation.Operations;

public class SqlServerMigrationRunner
{
    public static async Task ApplyMigrationsAsync(string connectionString, CancellationToken ct = default)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseSqlServer(connectionString, b =>
        {
            b.MigrationsAssembly("Southcolours.Persistence");
            b.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null);
        });

        using var context = new ApplicationDbContext(optionsBuilder.Options);
        await context.Database.MigrateAsync(ct);
    }
}

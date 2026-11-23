using Microsoft.Data.SqlClient;

namespace Southcolours.Installation.SqlServer;

public class SqlServerProvisioner
{
    public static async Task EnsureCatalogCreatedAsync(string connectionString, CancellationToken ct = default)
    {
        var builder = new SqlConnectionStringBuilder(connectionString);
        var targetDb = builder.InitialCatalog;
        if (string.IsNullOrWhiteSpace(targetDb))
        {
            throw new InvalidOperationException("Target database name cannot be empty.");
        }

        var masterBuilder = new SqlConnectionStringBuilder(builder.ConnectionString)
        {
            InitialCatalog = "master"
        };

        using var conn = new SqlConnection(masterBuilder.ConnectionString);
        await conn.OpenAsync(ct);

        using var checkCmd = conn.CreateCommand();
        checkCmd.CommandText = "SELECT COUNT(*) FROM sys.databases WHERE name = @dbName";
        checkCmd.Parameters.AddWithValue("@dbName", targetDb);
        var exists = ((int)(await checkCmd.ExecuteScalarAsync(ct) ?? 0)) > 0;

        if (!exists)
        {
            using var createCmd = conn.CreateCommand();
            // Parameterized DB creation query with safely quoted identifier
            var safeDbName = targetDb.Replace("]", "]]");
            createCmd.CommandText = $"CREATE DATABASE [{safeDbName}]";
            await createCmd.ExecuteNonQueryAsync(ct);
        }
    }
}

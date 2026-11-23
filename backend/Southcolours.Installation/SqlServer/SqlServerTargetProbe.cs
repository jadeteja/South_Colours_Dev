using Microsoft.Data.SqlClient;

namespace Southcolours.Installation.SqlServer;

public enum TargetClassification
{
    Absent,
    EmptyCatalog,
    InstalledCatalog,
    PopulatedUnknownCatalog,
    Offline,
    ConnectionFailed
}

public record TargetProbeResult(
    TargetClassification Classification,
    string SanitizedServer,
    string DatabaseName,
    bool CanConnect,
    string? InstallationId = null,
    bool BootstrapCompleted = false,
    string? Details = null
);

public class SqlServerTargetProbe
{
    public static async Task<TargetProbeResult> ProbeTargetAsync(string connectionString, CancellationToken ct = default)
    {
        SqlConnectionStringBuilder builder;
        try
        {
            builder = new SqlConnectionStringBuilder(connectionString);
        }
        catch (Exception ex)
        {
            return new TargetProbeResult(TargetClassification.ConnectionFailed, "Unknown", "Unknown", false, Details: $"Invalid connection string: {ex.Message}");
        }

        var databaseName = builder.InitialCatalog;
        var sanitizedServer = builder.DataSource;

        // Bounded probe timeout
        builder.ConnectTimeout = 10;

        // 1. First probe master to inspect catalog presence and instance health
        var masterBuilder = new SqlConnectionStringBuilder(builder.ConnectionString)
        {
            InitialCatalog = "master"
        };

        bool catalogExistsInMaster = false;
        try
        {
            using var masterConn = new SqlConnection(masterBuilder.ConnectionString);
            await masterConn.OpenAsync(ct);

            using var cmd = masterConn.CreateCommand();
            cmd.CommandText = "SELECT state_desc FROM sys.databases WHERE name = @dbName";
            cmd.Parameters.AddWithValue("@dbName", databaseName);
            var state = (string?)await cmd.ExecuteScalarAsync(ct);

            if (state == null)
            {
                return new TargetProbeResult(TargetClassification.Absent, sanitizedServer, databaseName, true, Details: "Catalog does not exist on instance.");
            }
            if (!string.Equals(state, "ONLINE", StringComparison.OrdinalIgnoreCase))
            {
                return new TargetProbeResult(TargetClassification.Offline, sanitizedServer, databaseName, false, Details: $"Catalog exists but is in state: {state}");
            }
            catalogExistsInMaster = true;
        }
        catch (SqlException)
        {
            // If user has no master access, attempt direct catalog connection
        }
        catch (Exception ex)
        {
            return new TargetProbeResult(TargetClassification.ConnectionFailed, sanitizedServer, databaseName, false, Details: ex.Message);
        }

        // 2. Direct catalog connection probe
        try
        {
            using var conn = new SqlConnection(builder.ConnectionString);
            await conn.OpenAsync(ct);

            // Check if tables exist
            using var tableCmd = conn.CreateCommand();
            tableCmd.CommandText = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'";
            var tableCount = (int)(await tableCmd.ExecuteScalarAsync(ct) ?? 0);

            if (tableCount == 0)
            {
                return new TargetProbeResult(TargetClassification.EmptyCatalog, sanitizedServer, databaseName, true, Details: "Database catalog exists and has no base tables.");
            }

            // Check if InstallationMarkers table exists
            using var markerCheckCmd = conn.CreateCommand();
            markerCheckCmd.CommandText = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'InstallationMarkers'";
            var hasMarkerTable = ((int)(await markerCheckCmd.ExecuteScalarAsync(ct) ?? 0)) > 0;

            if (hasMarkerTable)
            {
                using var readMarkerCmd = conn.CreateCommand();
                readMarkerCmd.CommandText = "SELECT TOP 1 InstallationId, BootstrapCompleted FROM InstallationMarkers ORDER BY Id DESC";
                using var reader = await readMarkerCmd.ExecuteReaderAsync(ct);
                if (await reader.ReadAsync(ct))
                {
                    var installId = reader.GetString(0);
                    var bootstrapCompleted = reader.GetBoolean(1);
                    return new TargetProbeResult(TargetClassification.InstalledCatalog, sanitizedServer, databaseName, true, installId, bootstrapCompleted, Details: "Valid South Colours installation marker detected.");
                }
            }

            // Tables exist but no installation marker -> Populated foreign or pre-existing DB
            return new TargetProbeResult(TargetClassification.PopulatedUnknownCatalog, sanitizedServer, databaseName, true, Details: $"Catalog contains {tableCount} tables with no South Colours installation marker.");
        }
        catch (SqlException ex) when (ex.Number == 4060) // Cannot open database requested by login
        {
            return new TargetProbeResult(TargetClassification.Absent, sanitizedServer, databaseName, false, Details: "Catalog cannot be opened or does not exist.");
        }
        catch (Exception ex)
        {
            return new TargetProbeResult(TargetClassification.ConnectionFailed, sanitizedServer, databaseName, false, Details: ex.Message);
        }
    }
}

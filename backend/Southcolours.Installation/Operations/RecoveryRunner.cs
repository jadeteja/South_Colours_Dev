using Southcolours.Installation.SqlServer;

namespace Southcolours.Installation.Operations;

public class RecoveryRunner
{
    private readonly InstallationRunner _installationRunner;
    private readonly IInstallationStateStore _stateStore;

    public RecoveryRunner(InstallationRunner installationRunner, IInstallationStateStore stateStore)
    {
        _installationRunner = installationRunner;
        _stateStore = stateStore;
    }

    public async Task<string> StartFreshAsync(
        string connectionString, 
        string adminEmail, 
        string adminPassword, 
        bool approvedDataLoss, 
        bool seedSampleData = false,
        CancellationToken ct = default)
    {
        if (!approvedDataLoss)
        {
            throw new InvalidOperationException("Explicit data loss approval is required to initialize a replacement database.");
        }

        var probe = await SqlServerTargetProbe.ProbeTargetAsync(connectionString, ct);
        if (probe.Classification == TargetClassification.PopulatedUnknownCatalog ||
            probe.Classification == TargetClassification.InstalledCatalog)
        {
            throw new InvalidOperationException("Cannot start fresh over an existing non-empty database without manual catalog retirement.");
        }

        // Generates new Installation ID while retaining audit logs in state store
        var newInstallationId = $"REPLACEMENT-{Guid.NewGuid():N}";
        return await _installationRunner.RunInstallationAsync(
            connectionString, 
            adminEmail, 
            adminPassword, 
            seedSampleCatalog: seedSampleData,
            customInstallationId: newInstallationId,
            ct: ct);
    }
}

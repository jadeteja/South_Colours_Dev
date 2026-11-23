using Southcolours.Installation.Operations;
using Southcolours.Installation.SqlServer;
using Xunit;

namespace Southcolours.Tests.Installation;

public class SqlServerInstallationTests
{
    [Fact]
    public void ConnectionProbe_InvalidString_ReturnsConnectionFailed()
    {
        var probe = SqlServerTargetProbe.ProbeTargetAsync("InvalidConnectionString;;").GetAwaiter().GetResult();
        Assert.Equal(TargetClassification.ConnectionFailed, probe.Classification);
        Assert.False(probe.CanConnect);
    }

    [Fact]
    public async Task StateStore_AcquireAndReleaseLock_WorksAtomically()
    {
        var tempDir = Path.Combine(Path.GetTempPath(), "SouthColours_TestState_" + Guid.NewGuid().ToString("N"));
        try
        {
            var store = new InstallationStateStore(tempDir);
            var opId = Guid.NewGuid().ToString("N");
            
            var acquired = await store.AcquireLockAsync(opId, "TestRunner1");
            Assert.True(acquired);

            // Second runner should be rejected while lock is active
            var secondAcquired = await store.AcquireLockAsync(Guid.NewGuid().ToString("N"), "TestRunner2");
            Assert.False(secondAcquired);

            await store.ReleaseLockAsync(opId);

            // After release, second runner can acquire
            var thirdAcquired = await store.AcquireLockAsync(Guid.NewGuid().ToString("N"), "TestRunner2");
            Assert.True(thirdAcquired);
        }
        finally
        {
            if (Directory.Exists(tempDir))
            {
                Directory.Delete(tempDir, true);
            }
        }
    }

    [Fact]
    public async Task StateStore_CheckpointsAndCompletion_PersistDurableRecord()
    {
        var tempDir = Path.Combine(Path.GetTempPath(), "SouthColours_TestState_" + Guid.NewGuid().ToString("N"));
        try
        {
            var store = new InstallationStateStore(tempDir);
            var opId = Guid.NewGuid().ToString("N");
            var installId = "TEST-INSTALL-" + Guid.NewGuid().ToString("N");

            await store.AcquireLockAsync(opId, "Runner");
            await store.UpdateCheckpointAsync(opId, "ApplyingMigrations", "Applying EF Migrations", true);
            await store.CompleteOperationAsync(opId, installId, "SouthColoursDb_Test", "1.0.0");

            var state = await store.GetStateAsync();
            Assert.Equal("Completed", state.CurrentCheckpoint);
            Assert.Equal(installId, state.InstallationId);
            Assert.Equal("SouthColoursDb_Test", state.ApprovedTarget);
            Assert.Null(state.LockHolder);
            Assert.NotEmpty(state.AuditHistory);
        }
        finally
        {
            if (Directory.Exists(tempDir))
            {
                Directory.Delete(tempDir, true);
            }
        }
    }
}

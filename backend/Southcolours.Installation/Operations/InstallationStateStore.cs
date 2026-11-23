using System.Text.Json;

namespace Southcolours.Installation.Operations;

public interface IInstallationStateStore
{
    Task<InstallationRecord> GetStateAsync(CancellationToken ct = default);
    Task<bool> AcquireLockAsync(string operationId, string lockHolder, CancellationToken ct = default);
    Task ReleaseLockAsync(string operationId, CancellationToken ct = default);
    Task UpdateCheckpointAsync(string operationId, string checkpoint, string message, bool success = true, CancellationToken ct = default);
    Task CompleteOperationAsync(string operationId, string installationId, string target, string release, CancellationToken ct = default);
}

public class InstallationStateStore : IInstallationStateStore
{
    private readonly string _stateFilePath;
    private static readonly SemaphoreSlim _fileLock = new(1, 1);

    public InstallationStateStore(string? customStatePath = null)
    {
        var basePath = customStatePath ?? Environment.GetEnvironmentVariable("STATE_DIRECTORY") 
                       ?? Path.Combine(AppContext.BaseDirectory, "state");
        if (!Directory.Exists(basePath))
        {
            Directory.CreateDirectory(basePath);
        }
        _stateFilePath = Path.Combine(basePath, "installation_state.json");
    }

    public async Task<InstallationRecord> GetStateAsync(CancellationToken ct = default)
    {
        await _fileLock.WaitAsync(ct);
        try
        {
            if (!File.Exists(_stateFilePath))
            {
                return new InstallationRecord();
            }

            var json = await File.ReadAllTextAsync(_stateFilePath, ct);
            return JsonSerializer.Deserialize<InstallationRecord>(json) ?? new InstallationRecord();
        }
        finally
        {
            _fileLock.Release();
        }
    }

    public async Task<bool> AcquireLockAsync(string operationId, string lockHolder, CancellationToken ct = default)
    {
        await _fileLock.WaitAsync(ct);
        try
        {
            var record = File.Exists(_stateFilePath)
                ? JsonSerializer.Deserialize<InstallationRecord>(await File.ReadAllTextAsync(_stateFilePath, ct)) ?? new InstallationRecord()
                : new InstallationRecord();

            // Check if lock already held by another non-expired operation
            if (!string.IsNullOrEmpty(record.LockHolder) && record.LockHolder != lockHolder)
            {
                if (record.LockedAtUtc.HasValue && record.LockedAtUtc.Value > DateTime.UtcNow.AddMinutes(-30))
                {
                    return false; // Still active lock held by another
                }
            }

            record.LockHolder = lockHolder;
            record.LockedAtUtc = DateTime.UtcNow;
            record.CurrentOperationId = operationId;
            record.AuditHistory.Add(new AuditEntry
            {
                OperationId = operationId,
                Stage = "LockAcquired",
                Message = $"Lock acquired by {lockHolder}",
                Success = true
            });

            await File.WriteAllTextAsync(_stateFilePath, JsonSerializer.Serialize(record, new JsonSerializerOptions { WriteIndented = true }), ct);
            return true;
        }
        finally
        {
            _fileLock.Release();
        }
    }

    public async Task ReleaseLockAsync(string operationId, CancellationToken ct = default)
    {
        await _fileLock.WaitAsync(ct);
        try
        {
            if (!File.Exists(_stateFilePath)) return;
            var record = JsonSerializer.Deserialize<InstallationRecord>(await File.ReadAllTextAsync(_stateFilePath, ct)) ?? new InstallationRecord();
            if (record.CurrentOperationId == operationId)
            {
                record.LockHolder = null;
                record.LockedAtUtc = null;
                record.AuditHistory.Add(new AuditEntry
                {
                    OperationId = operationId,
                    Stage = "LockReleased",
                    Message = "Lock released",
                    Success = true
                });
                await File.WriteAllTextAsync(_stateFilePath, JsonSerializer.Serialize(record, new JsonSerializerOptions { WriteIndented = true }), ct);
            }
        }
        finally
        {
            _fileLock.Release();
        }
    }

    public async Task UpdateCheckpointAsync(string operationId, string checkpoint, string message, bool success = true, CancellationToken ct = default)
    {
        await _fileLock.WaitAsync(ct);
        try
        {
            var record = File.Exists(_stateFilePath)
                ? JsonSerializer.Deserialize<InstallationRecord>(await File.ReadAllTextAsync(_stateFilePath, ct)) ?? new InstallationRecord()
                : new InstallationRecord();

            record.CurrentOperationId = operationId;
            record.CurrentCheckpoint = checkpoint;
            record.AuditHistory.Add(new AuditEntry
            {
                OperationId = operationId,
                Stage = checkpoint,
                Message = message,
                Success = success
            });

            await File.WriteAllTextAsync(_stateFilePath, JsonSerializer.Serialize(record, new JsonSerializerOptions { WriteIndented = true }), ct);
        }
        finally
        {
            _fileLock.Release();
        }
    }

    public async Task CompleteOperationAsync(string operationId, string installationId, string target, string release, CancellationToken ct = default)
    {
        await _fileLock.WaitAsync(ct);
        try
        {
            var record = File.Exists(_stateFilePath)
                ? JsonSerializer.Deserialize<InstallationRecord>(await File.ReadAllTextAsync(_stateFilePath, ct)) ?? new InstallationRecord()
                : new InstallationRecord();

            record.InstallationId = installationId;
            record.ApprovedTarget = target;
            record.ExpectedRelease = release;
            record.CurrentCheckpoint = "Completed";
            record.LockHolder = null;
            record.LockedAtUtc = null;
            record.AuditHistory.Add(new AuditEntry
            {
                OperationId = operationId,
                Stage = "Completed",
                Message = $"Installation {installationId} successfully finalized.",
                Success = true
            });

            await File.WriteAllTextAsync(_stateFilePath, JsonSerializer.Serialize(record, new JsonSerializerOptions { WriteIndented = true }), ct);
        }
        finally
        {
            _fileLock.Release();
        }
    }
}

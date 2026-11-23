namespace Southcolours.Installation.Operations;

public class InstallationRecord
{
    public string DeploymentId { get; set; } = "default-deployment";
    public string? InstallationId { get; set; }
    public string? ApprovedTarget { get; set; }
    public string? CurrentOperationId { get; set; }
    public string? CurrentCheckpoint { get; set; }
    public string? ExpectedRelease { get; set; }
    public string? LockHolder { get; set; }
    public DateTime? LockedAtUtc { get; set; }
    public List<AuditEntry> AuditHistory { get; set; } = new();
}

public class AuditEntry
{
    public DateTime TimestampUtc { get; set; } = DateTime.UtcNow;
    public string OperationId { get; set; } = string.Empty;
    public string Stage { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool Success { get; set; }
}

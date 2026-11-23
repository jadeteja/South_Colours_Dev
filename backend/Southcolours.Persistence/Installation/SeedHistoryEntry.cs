using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Southcolours.Persistence.Installation;

[Table("SeedHistoryEntries")]
public class SeedHistoryEntry
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string SeedId { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Version { get; set; } = string.Empty;

    public DateTime AppliedAtUtc { get; set; } = DateTime.UtcNow;

    [MaxLength(100)]
    public string? OperationId { get; set; }
}

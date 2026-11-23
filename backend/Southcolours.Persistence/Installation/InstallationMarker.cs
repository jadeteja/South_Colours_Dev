using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Southcolours.Persistence.Installation;

[Table("InstallationMarkers")]
public class InstallationMarker
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string InstallationId { get; set; } = string.Empty;

    public DateTime InstalledAtUtc { get; set; } = DateTime.UtcNow;

    [Required]
    [MaxLength(100)]
    public string InstalledVersion { get; set; } = string.Empty;

    public bool BootstrapCompleted { get; set; }

    [MaxLength(100)]
    public string? OperationId { get; set; }
}

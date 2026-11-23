using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Southcolours.Installation.SqlServer;

namespace Southcolours.Installation.Pages.Setup;

public class ConnectionModel : PageModel
{
    [BindProperty]
    public string ConnectionString { get; set; } = string.Empty;

    public TargetProbeResult? ProbeResult { get; set; }
    public string? ErrorMessage { get; set; }
    public bool CanProceed => ProbeResult != null && 
                             (ProbeResult.Classification == TargetClassification.Absent ||
                              ProbeResult.Classification == TargetClassification.EmptyCatalog ||
                              ProbeResult.Classification == TargetClassification.InstalledCatalog ||
                              ProbeResult.Classification == TargetClassification.PopulatedUnknownCatalog);

    public void OnGet()
    {
        ConnectionString = HttpContext.Session.GetString("Target_ConnectionString") 
                           ?? "Server=.\\SQLEXPRESS;Database=SouthColoursDb;Trusted_Connection=True;TrustServerCertificate=True;";
    }

    public async Task<IActionResult> OnPostTestAsync()
    {
        if (string.IsNullOrWhiteSpace(ConnectionString))
        {
            ErrorMessage = "Connection string is required.";
            return Page();
        }

        ProbeResult = await SqlServerTargetProbe.ProbeTargetAsync(ConnectionString);
        HttpContext.Session.SetString("Target_ConnectionString", ConnectionString);
        HttpContext.Session.SetString("Target_Classification", ProbeResult.Classification.ToString());

        return Page();
    }

    public async Task<IActionResult> OnPostProceedAsync()
    {
        if (string.IsNullOrWhiteSpace(ConnectionString)) return RedirectToPage();

        var probe = await SqlServerTargetProbe.ProbeTargetAsync(ConnectionString);
        if (probe.Classification == TargetClassification.ConnectionFailed)
        {
            ErrorMessage = "Cannot proceed: Target connection failed.";
            ProbeResult = probe;
            return Page();
        }

        HttpContext.Session.SetString("Target_ConnectionString", ConnectionString);
        return RedirectToPage("/Setup/Review");
    }
}

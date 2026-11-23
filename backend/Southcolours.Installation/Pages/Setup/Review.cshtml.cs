using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;

namespace Southcolours.Installation.Pages.Setup;

public class ReviewModel : PageModel
{
    [BindProperty]
    public string AdminEmail { get; set; } = "admin@southcolours.com";

    [BindProperty]
    public string AdminPassword { get; set; } = string.Empty;

    [BindProperty]
    public bool SeedSampleCatalog { get; set; } = true;

    [BindProperty]
    public bool ApprovedReplacement { get; set; }

    public string ServerName { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
    public string Classification { get; set; } = string.Empty;
    public string PlannedAction { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }

    public IActionResult OnGet()
    {
        var connStr = HttpContext.Session.GetString("Target_ConnectionString");
        if (string.IsNullOrEmpty(connStr)) return RedirectToPage("/Setup/Connection");

        var builder = new SqlConnectionStringBuilder(connStr);
        ServerName = builder.DataSource;
        DatabaseName = builder.InitialCatalog;
        Classification = HttpContext.Session.GetString("Target_Classification") ?? "Unknown";

        PlannedAction = Classification switch
        {
            "Absent" => "Create new catalog, apply EF migrations, seed roles, and initialize first admin.",
            "EmptyCatalog" => "Apply EF migrations into pre-provisioned catalog, seed roles, and initialize first admin.",
            "InstalledCatalog" => "Existing installation detected. Requires approved replacement or upgrade.",
            "PopulatedUnknownCatalog" => "Existing database tables detected. Adopt existing database by recording installation tracking marker.",
            _ => "Review required."
        };

        return Page();
    }

    public IActionResult OnPost()
    {
        var connStr = HttpContext.Session.GetString("Target_ConnectionString");
        if (string.IsNullOrEmpty(connStr)) return RedirectToPage("/Setup/Connection");

        var classification = HttpContext.Session.GetString("Target_Classification") ?? "Unknown";
        if (classification == "InstalledCatalog" && !ApprovedReplacement)
        {
            ErrorMessage = "You must explicitly approve replacement to re-initialize an existing installation.";
            OnGet();
            return Page();
        }

        if (string.IsNullOrWhiteSpace(AdminEmail) || !AdminEmail.Contains("@"))
        {
            ErrorMessage = "Valid Administrator email is required.";
            OnGet();
            return Page();
        }

        if (string.IsNullOrWhiteSpace(AdminPassword) || AdminPassword.Length < 6)
        {
            ErrorMessage = "Administrator password must be at least 6 characters.";
            OnGet();
            return Page();
        }

        HttpContext.Session.SetString("Setup_AdminEmail", AdminEmail);
        HttpContext.Session.SetString("Setup_AdminPassword", AdminPassword);
        HttpContext.Session.SetString("Setup_SeedSample", SeedSampleCatalog ? "true" : "false");

        return RedirectToPage("/Setup/Install");
    }
}

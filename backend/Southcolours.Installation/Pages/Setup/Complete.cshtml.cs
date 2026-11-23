using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;

namespace Southcolours.Installation.Pages.Setup;

public class CompleteModel : PageModel
{
    public string InstallationId { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
    public string AdminEmail { get; set; } = string.Empty;
    public string LoginUrl { get; set; } = "/auth/login";

    public void OnGet()
    {
        InstallationId = HttpContext.Session.GetString("Completed_InstallationId") ?? "COMPLETED";
        AdminEmail = HttpContext.Session.GetString("Setup_AdminEmail") ?? "admin@southcolours.com";

        var connStr = HttpContext.Session.GetString("Target_ConnectionString");
        if (!string.IsNullOrEmpty(connStr))
        {
            DatabaseName = new SqlConnectionStringBuilder(connStr).InitialCatalog;
        }

        var frontendBase = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:4200";
        LoginUrl = $"{frontendBase.TrimEnd('/')}/auth/login";

        // Clear wizard session
        HttpContext.Session.Clear();
    }
}

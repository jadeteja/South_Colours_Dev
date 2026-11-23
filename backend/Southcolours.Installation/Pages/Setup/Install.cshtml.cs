using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using Southcolours.Installation.Operations;

namespace Southcolours.Installation.Pages.Setup;

public class InstallModel : PageModel
{
    private readonly InstallationRunner _runner;

    public InstallModel(InstallationRunner runner)
    {
        _runner = runner;
    }

    public string DatabaseName { get; set; } = string.Empty;
    public string AdminEmail { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }

    public IActionResult OnGet()
    {
        var connStr = HttpContext.Session.GetString("Target_ConnectionString");
        AdminEmail = HttpContext.Session.GetString("Setup_AdminEmail") ?? string.Empty;

        if (string.IsNullOrEmpty(connStr) || string.IsNullOrEmpty(AdminEmail))
        {
            return RedirectToPage("/Setup/Review");
        }

        DatabaseName = new SqlConnectionStringBuilder(connStr).InitialCatalog;
        return Page();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        var connStr = HttpContext.Session.GetString("Target_ConnectionString");
        var adminEmail = HttpContext.Session.GetString("Setup_AdminEmail");
        var adminPassword = HttpContext.Session.GetString("Setup_AdminPassword");
        var seedSample = HttpContext.Session.GetString("Setup_SeedSample") == "true";
        var cleanExisting = !seedSample || HttpContext.Session.GetString("Setup_CleanExisting") == "true";

        if (string.IsNullOrEmpty(connStr) || string.IsNullOrEmpty(adminEmail) || string.IsNullOrEmpty(adminPassword))
        {
            return RedirectToPage("/Setup/Review");
        }

        try
        {
            var installationId = await _runner.RunInstallationAsync(
                connStr,
                adminEmail,
                adminPassword,
                seedSampleCatalog: seedSample,
                cleanExistingData: cleanExisting,
                ct: HttpContext.RequestAborted);

            // Automatically persist updated connection string to appsettings.json if different
            try
            {
                var appSettingsPath = Path.Combine(AppContext.BaseDirectory, "appsettings.json");
                if (!System.IO.File.Exists(appSettingsPath))
                {
                    appSettingsPath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../Southcolours.API/appsettings.json"));
                }

                if (System.IO.File.Exists(appSettingsPath))
                {
                    var jsonContent = await System.IO.File.ReadAllTextAsync(appSettingsPath);
                    using var doc = System.Text.Json.JsonDocument.Parse(jsonContent);
                    var dict = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(jsonContent);
                    if (dict != null && dict.ContainsKey("ConnectionStrings"))
                    {
                        var connSection = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(dict["ConnectionStrings"].ToString()!);
                        if (connSection != null)
                        {
                            connSection["DefaultConnection"] = connStr;
                            dict["ConnectionStrings"] = connSection;
                            await System.IO.File.WriteAllTextAsync(appSettingsPath, System.Text.Json.JsonSerializer.Serialize(dict, new System.Text.Json.JsonSerializerOptions { WriteIndented = true }));
                        }
                    }
                }
            }
            catch
            {
                // Non-blocking in production environments where config is env-driven
            }

            // Invalidate sensitive credentials from session
            HttpContext.Session.Remove("Setup_AdminPassword");
            HttpContext.Session.SetString("Completed_InstallationId", installationId);

            return RedirectToPage("/Setup/Complete");
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
            OnGet();
            return Page();
        }
    }
}

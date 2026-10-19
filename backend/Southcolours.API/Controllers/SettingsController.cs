using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Southcolours.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private static readonly string SettingsFilePath = Path.Combine(AppContext.BaseDirectory, "store_settings.json");
    private static readonly object FileLock = new object();

    [HttpGet]
    public IActionResult GetSettings()
    {
        var settings = LoadSettings();
        return Ok(settings);
    }

    [HttpPut]
    public IActionResult UpdateSettings([FromBody] StoreSettings settings)
    {
        lock (FileLock)
        {
            var json = JsonSerializer.Serialize(settings, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(SettingsFilePath, json);
        }
        return Ok(settings);
    }

    private static StoreSettings LoadSettings()
    {
        lock (FileLock)
        {
            if (System.IO.File.Exists(SettingsFilePath))
            {
                try
                {
                    var json = System.IO.File.ReadAllText(SettingsFilePath);
                    var settings = JsonSerializer.Deserialize<StoreSettings>(json);
                    if (settings != null) return settings;
                }
                catch { }
            }

            var defaultSettings = new StoreSettings
            {
                StoreName = "South Colours",
                Tagline = "Little Styles, Big Smiles",
                OperatingCurrency = "INR (₹)",
                DefaultGstRate = "5.0%",
                RazorpayKey = "rzp_test_placeholder_key",
                RazorpaySecret = "rzp_test_placeholder_secret",
                FreeShippingMin = 999,
                StandardDeliveryFee = 99,
                AuditLogging = true,
                RequireLoginForCheckout = false
            };

            var defaultJson = JsonSerializer.Serialize(defaultSettings, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(SettingsFilePath, defaultJson);
            return defaultSettings;
        }
    }
}

public class StoreSettings
{
    public string StoreName { get; set; } = "South Colours";
    public string Tagline { get; set; } = "Little Styles, Big Smiles";
    public string OperatingCurrency { get; set; } = "INR (₹)";
    public string DefaultGstRate { get; set; } = "5.0%";
    public string RazorpayKey { get; set; } = "rzp_test_placeholder_key";
    public string RazorpaySecret { get; set; } = "rzp_test_placeholder_secret";
    public decimal FreeShippingMin { get; set; } = 999;
    public decimal StandardDeliveryFee { get; set; } = 99;
    public bool AuditLogging { get; set; } = true;
    public bool RequireLoginForCheckout { get; set; } = false;
}


using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Southcolours.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private static readonly string SettingsFilePath = Path.Combine(AppContext.BaseDirectory, "store_settings.json");
    private static readonly object FileLock = new object();
    private readonly IConfiguration _config;

    public SettingsController(IConfiguration config)
    {
        _config = config;
    }

    [HttpGet]
    public IActionResult GetSettings()
    {
        var settings = LoadSettings(_config);
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

    public static StoreSettings LoadSettingsDirect(IConfiguration? config = null) => LoadSettings(config);

    private static StoreSettings LoadSettings(IConfiguration? config = null)
    {
        lock (FileLock)
        {
            var configKey = config?["Razorpay:KeyId"];
            var configSecret = config?["Razorpay:KeySecret"];
            var configWebhook = config?["Razorpay:WebhookSecret"];

            if (System.IO.File.Exists(SettingsFilePath))
            {
                try
                {
                    var json = System.IO.File.ReadAllText(SettingsFilePath);
                    var settings = JsonSerializer.Deserialize<StoreSettings>(json);
                    if (settings != null)
                    {
                        // Fallback to appsettings.json if store_settings.json still holds the default placeholder
                        if (!string.IsNullOrWhiteSpace(configKey) && (string.IsNullOrWhiteSpace(settings.RazorpayKey) || settings.RazorpayKey.Contains("placeholder")))
                        {
                            settings.RazorpayKey = configKey;
                        }
                        if (!string.IsNullOrWhiteSpace(configSecret) && (string.IsNullOrWhiteSpace(settings.RazorpaySecret) || settings.RazorpaySecret.Contains("placeholder")))
                        {
                            settings.RazorpaySecret = configSecret;
                        }
                        if (!string.IsNullOrWhiteSpace(configWebhook) && string.IsNullOrWhiteSpace(settings.WebhookSecret))
                        {
                            settings.WebhookSecret = configWebhook;
                        }
                        return settings;
                    }
                }
                catch { }
            }

            var defaultSettings = new StoreSettings
            {
                StoreName = "South Colours",
                Tagline = "Enlights our culture",
                OperatingCurrency = "INR (₹)",
                DefaultGstRate = "5.0%",
                RazorpayKey = !string.IsNullOrWhiteSpace(configKey) ? configKey : "rzp_test_placeholder_key",
                RazorpaySecret = !string.IsNullOrWhiteSpace(configSecret) ? configSecret : "rzp_test_placeholder_secret",
                WebhookSecret = !string.IsNullOrWhiteSpace(configWebhook) ? configWebhook : "",
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
    public string Tagline { get; set; } = "Enlights our culture";
    public string OperatingCurrency { get; set; } = "INR (₹)";
    public string DefaultGstRate { get; set; } = "5.0%";
    public string RazorpayKey { get; set; } = "rzp_test_placeholder_key";
    public string RazorpaySecret { get; set; } = "rzp_test_placeholder_secret";
    public string WebhookSecret { get; set; } = "";
    public decimal FreeShippingMin { get; set; } = 999;
    public decimal StandardDeliveryFee { get; set; } = 99;
    public bool AuditLogging { get; set; } = true;
    public bool RequireLoginForCheckout { get; set; } = false;
}

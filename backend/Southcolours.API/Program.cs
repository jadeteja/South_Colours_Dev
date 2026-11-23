using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Southcolours.API.Health;
using Southcolours.API.Middleware;
using Southcolours.Application.Common.Settings;
using Southcolours.Application.Interfaces;
using Southcolours.Infrastructure.Payments;
using Southcolours.Infrastructure.Services;
using Southcolours.Installation.Operations;
using Southcolours.Persistence.Context;

var builder = WebApplication.CreateBuilder(args);

// Dynamic port binding for Render (reads $PORT, defaults to launchSettings.json when running locally)
var envPort = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(envPort))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{envPort}");
}

// 1. Database Connection (Supports PostgreSQL for Cloud/Render and SQL Server for Local)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    // Auto-detect PostgreSQL (Supabase / Render / Neon connection strings contain Host=, postgresql://, or postgres://)
    if (connectionString.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) ||
        connectionString.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
    {
        // Parse URI format into Npgsql key-value format
        var uri = new Uri(connectionString);
        var userInfo = uri.UserInfo.Split(':', 2);
        var username = userInfo.Length > 0 ? Uri.UnescapeDataString(userInfo[0]) : "postgres";
        var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
        var port = uri.Port > 0 ? uri.Port : 5432;
        var database = uri.AbsolutePath.TrimStart('/');
        if (string.IsNullOrEmpty(database)) database = "postgres";

        var npgsqlConn = $"Host={uri.Host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true;Command Timeout=300;Timeout=60;Keepalive=30;No Reset On Close=true;";
        options.UseNpgsql(npgsqlConn, b => 
        {
            b.MigrationsAssembly("Southcolours.Persistence");
            b.CommandTimeout(300);
        });
    }
    else if (connectionString.Contains("Host=", StringComparison.OrdinalIgnoreCase) ||
             (connectionString.Contains("Server=") && connectionString.Contains("postgres", StringComparison.OrdinalIgnoreCase)))
    {
        var finalConn = connectionString;
        if (!finalConn.Contains("Command Timeout", StringComparison.OrdinalIgnoreCase))
        {
            finalConn = finalConn.TrimEnd(';') + ";Command Timeout=300;Timeout=60;Keepalive=30;";
        }
        if (!finalConn.Contains("No Reset On Close", StringComparison.OrdinalIgnoreCase))
        {
            finalConn = finalConn.TrimEnd(';') + ";No Reset On Close=true;";
        }
        options.UseNpgsql(finalConn, b => 
        {
            b.MigrationsAssembly("Southcolours.Persistence");
            b.CommandTimeout(300);
        });
    }
    else
    {
        options.UseSqlServer(connectionString, b =>
        {
            b.MigrationsAssembly("Southcolours.Persistence");
            b.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null);
        });
    }
});

// 2. Identity Services
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// 3. Razorpay Infrastructure Service
var rzpKey = builder.Configuration["Razorpay:KeyId"] ?? "rzp_test_placeholder_key";
var rzpSecret = builder.Configuration["Razorpay:KeySecret"] ?? "rzp_test_placeholder_secret";
var rzpWebhook = builder.Configuration["Razorpay:WebhookSecret"] ?? "southcolours_webhook_secret_placeholder";
builder.Services.AddSingleton<IRazorpayService>(new RazorpayService(rzpKey, rzpSecret, rzpWebhook));

// 3.1 SMTP Email Service
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
builder.Services.AddScoped<IEmailService, SmtpEmailService>();

// 4. JWT Authentication
var jwtSecret = builder.Configuration["JwtSettings:Secret"] ?? "SouthColours_SuperSecure_SecretKey_2026_KidsFashionApp!";
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "SouthColoursAPI";
var jwtAudience = builder.Configuration["JwtSettings:Audience"] ?? "SouthColoursFrontend";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// 5. CORS Policy for Angular Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.SetIsOriginAllowed(origin => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 6. Controllers & JSON Cycle Management
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Register Database Readiness Services
builder.Services.AddScoped<IDatabaseReadinessCheck, DatabaseReadinessCheck>();

// Register Wizard Razor Pages and Installation Services
builder.Services.AddRazorPages();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(20);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
builder.Services.AddSingleton<IInstallationStateStore, InstallationStateStore>();
builder.Services.AddScoped<InstallationRunner>();
builder.Services.AddScoped<RecoveryRunner>();

var app = builder.Build();

// 7. HTTP Pipeline
app.UseSession();

// Register database readiness gating middleware at the very top so root / is redirected to wizard when uninstalled
app.UseMiddleware<DatabaseReadinessMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

// Map Wizard Razor Pages
app.MapRazorPages();
app.MapGet("/setup", () => Results.Redirect("/Setup/Connection"));

// Map all ASP.NET Core API Controllers
app.MapControllers();

// Health check endpoint (Liveness & Database Readiness)
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "Southcolours API", version = "1.0" }));
app.MapGet("/api/health", () => Results.Ok(new { status = "healthy", service = "Southcolours API", version = "1.0" }));
app.MapGet("/api/health/ready", async (IDatabaseReadinessCheck readinessCheck, CancellationToken ct) =>
{
    var res = await readinessCheck.CheckReadinessAsync(ct);
    return res.IsReady ? Results.Ok(res) : Results.Json(res, statusCode: StatusCodes.Status503ServiceUnavailable);
});

// 7b. Serve Uploaded Static Media Files (/uploads/*)
// Cross-Platform: Reads UPLOADS_PATH env var on Linux VPS or falls back to wwwroot/uploads
var customUploadsPath = Environment.GetEnvironmentVariable("UPLOADS_PATH") 
                        ?? builder.Configuration["Uploads:StoragePath"];

var uploadsPath = !string.IsNullOrWhiteSpace(customUploadsPath)
    ? Path.GetFullPath(customUploadsPath)
    : Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads");

if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

// 7c. Serve Single-Page Application (Angular) Static Files
// Priority 1: Published wwwroot folder (production/VPS)
// Priority 2: Local development build dist folder
var wwwrootPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot");
var devDistPath = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, "../../frontend/southcolours-angular/dist/southcolours-angular/browser"));

string? spaStaticPath = null;
if (Directory.Exists(wwwrootPath) && File.Exists(Path.Combine(wwwrootPath, "index.html")))
{
    spaStaticPath = wwwrootPath;
}
else if (Directory.Exists(devDistPath) && File.Exists(Path.Combine(devDistPath, "index.html")))
{
    spaStaticPath = devDistPath;
}

if (!string.IsNullOrEmpty(spaStaticPath))
{
    var fileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(spaStaticPath);
    app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = fileProvider });
    app.UseStaticFiles(new StaticFileOptions { FileProvider = fileProvider });
    app.MapFallbackToFile("index.html", new StaticFileOptions { FileProvider = fileProvider });
}
else
{
    // Fallback if no frontend build is found
    app.MapGet("/", () => Results.Ok(new { status = "healthy", service = "Southcolours API", version = "1.0", note = "Frontend build not detected. Serve dist or wwwroot." }));
}

app.Run();

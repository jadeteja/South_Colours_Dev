using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Southcolours.Infrastructure.Payments;
using Southcolours.Persistence.Context;
using Southcolours.Persistence.Seed;

var builder = WebApplication.CreateBuilder(args);

// Dynamic port binding for Render (reads $PORT, defaults to 8080 or 5000)
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

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

        var npgsqlConn = $"Host={uri.Host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true;Command Timeout=300;Timeout=60;Keepalive=30;";
        options.UseNpgsql(npgsqlConn, b => 
        {
            b.MigrationsAssembly("Southcolours.Persistence");
            b.CommandTimeout(300);
        });
    }
    else if (connectionString.Contains("Host=", StringComparison.OrdinalIgnoreCase) ||
             connectionString.Contains("Server=") && connectionString.Contains("postgres", StringComparison.OrdinalIgnoreCase))
    {
        var finalConn = connectionString;
        if (!finalConn.Contains("Command Timeout", StringComparison.OrdinalIgnoreCase))
        {
            finalConn = finalConn.TrimEnd(';') + ";Command Timeout=300;Timeout=60;Keepalive=30;";
        }
        options.UseNpgsql(finalConn, b => 
        {
            b.MigrationsAssembly("Southcolours.Persistence");
            b.CommandTimeout(300);
        });
    }
    else
    {
        options.UseSqlServer(connectionString, b => b.MigrationsAssembly("Southcolours.Persistence"));
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
        var frontendUrl = builder.Configuration["FrontendUrl"];
        var origins = new List<string> { "http://localhost:4200", "https://localhost:4200" };
        if (!string.IsNullOrEmpty(frontendUrl))
        {
            origins.Add(frontendUrl.TrimEnd('/'));
        }

        policy.WithOrigins(origins.ToArray())
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

var app = builder.Build();

// 7. HTTP Pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();

// Map all ASP.NET Core API Controllers
app.MapControllers();

// Health check endpoint for Render
app.MapGet("/", () => Results.Ok(new { status = "healthy", service = "Southcolours API", version = "1.0" }));

// 8. Automatic Migration & Seed on Startup (Background task so web server starts immediately without blocking port binding)
_ = Task.Run(async () =>
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        logger.LogInformation("Starting database initialization...");
        await context.Database.EnsureCreatedAsync();
        logger.LogInformation("Database EnsureCreated finished.");

        var userManager = services.GetRequiredService<UserManager<IdentityUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        await DatabaseSeeder.SeedAsync(context, userManager, roleManager);
        logger.LogInformation("Database seeding completed successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred during database migration/seeding.");
    }
});

app.Run();

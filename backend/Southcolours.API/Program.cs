using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Southcolours.Infrastructure.Payments;
using Southcolours.Persistence.Context;
using Southcolours.Persistence.Seed;

var builder = WebApplication.CreateBuilder(args);

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

        var npgsqlConn = $"Host={uri.Host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true;";
        options.UseNpgsql(npgsqlConn, b => b.MigrationsAssembly("Southcolours.Persistence"));
    }
    else if (connectionString.Contains("Host=", StringComparison.OrdinalIgnoreCase) ||
             connectionString.Contains("Server=") && connectionString.Contains("postgres", StringComparison.OrdinalIgnoreCase))
    {
        options.UseNpgsql(connectionString, b => b.MigrationsAssembly("Southcolours.Persistence"));
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

// 7. Automatic Migration & Seed on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        // Ensure database tables are created (works across both SQL Server and PostgreSQL)
        await context.Database.EnsureCreatedAsync();

        var userManager = services.GetRequiredService<UserManager<IdentityUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        await DatabaseSeeder.SeedAsync(context, userManager, roleManager);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during database migration/seeding.");
    }
}

// 8. HTTP Pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();

// Map all ASP.NET Core API Controllers
app.MapControllers();

app.Run();

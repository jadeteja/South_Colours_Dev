using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Southcolours.Installation.Operations;
using Southcolours.Persistence.Context;

namespace Southcolours.Installation;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Loopback binding for private operations host
        builder.WebHost.UseUrls("http://127.0.0.1:5055");

        // Configure services
        builder.Services.AddRazorPages();
        builder.Services.AddDistributedMemoryCache();
        builder.Services.AddSession(options =>
        {
            options.IdleTimeout = TimeSpan.FromMinutes(20);
            options.Cookie.HttpOnly = true;
            options.Cookie.IsEssential = true;
        });

        // Register state store, runners, and Identity
        builder.Services.AddSingleton<IInstallationStateStore, InstallationStateStore>();
        builder.Services.AddScoped<InstallationRunner>();
        builder.Services.AddScoped<RecoveryRunner>();

        builder.Services.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            var httpContext = sp.GetService<IHttpContextAccessor>()?.HttpContext;
            var conn = httpContext?.Session.GetString("Target_ConnectionString") 
                       ?? builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? "Server=.\\SQLEXPRESS;Database=SouthColoursDb;Trusted_Connection=True;TrustServerCertificate=True;";

            options.UseSqlServer(conn, b => b.MigrationsAssembly("Southcolours.Persistence"));
        });

        builder.Services.AddIdentity<IdentityUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        builder.Services.AddHttpContextAccessor();

        var app = builder.Build();

        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Error");
        }

        app.UseStaticFiles();
        app.UseRouting();
        app.UseSession();
        app.UseAntiforgery();

        app.MapRazorPages();
        app.MapGet("/", () => Results.Redirect("/Setup/Connection"));

        if (args.Length > 0 && args[0].Equals("--cli", StringComparison.OrdinalIgnoreCase))
        {
            using var scope = app.Services.CreateScope();
            var runner = scope.ServiceProvider.GetRequiredService<InstallationRunner>();
            var conn = args.Length > 1 ? args[1] : builder.Configuration.GetConnectionString("DefaultConnection")!;
            var email = args.Length > 2 ? args[2] : "admin@southcolours.com";
            var pass = args.Length > 3 ? args[3] : "Admin@South123#";
            
            Console.WriteLine($"[CLI] Running automated installation against {conn}...");
            var installId = await runner.RunInstallationAsync(conn, email, pass, seedSampleCatalog: true);
            Console.WriteLine($"[CLI] Installation succeeded with ID: {installId}");
            return;
        }

        await app.RunAsync();
    }
}

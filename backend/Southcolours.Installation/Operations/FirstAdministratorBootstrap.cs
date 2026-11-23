using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Southcolours.Persistence.Context;
using Southcolours.Persistence.Installation;

namespace Southcolours.Installation.Operations;

public class FirstAdministratorBootstrap
{
    public static async Task BootstrapAdminAsync(
        ApplicationDbContext context, 
        UserManager<IdentityUser> userManager, 
        RoleManager<IdentityRole> roleManager,
        string adminEmail, 
        string password,
        string installationId,
        string? operationId = null)
    {
        if (string.IsNullOrWhiteSpace(adminEmail)) throw new ArgumentException("Admin email is required.", nameof(adminEmail));
        if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Password is required.", nameof(password));

        // 1. Ensure SuperAdmin role exists
        if (!await roleManager.RoleExistsAsync("SuperAdmin"))
        {
            await roleManager.CreateAsync(new IdentityRole("SuperAdmin"));
        }

        // 2. Check if user already exists
        var existingUser = await userManager.FindByEmailAsync(adminEmail);
        if (existingUser != null)
        {
            // Verify if user is part of the current installation
            var isSuperAdmin = await userManager.IsInRoleAsync(existingUser, "SuperAdmin");
            if (!isSuperAdmin)
            {
                await userManager.AddToRoleAsync(existingUser, "SuperAdmin");
            }
        }
        else
        {
            var adminUser = new IdentityUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };

            var createResult = await userManager.CreateAsync(adminUser, password);
            if (!createResult.Succeeded)
            {
                var errors = string.Join("; ", createResult.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to create administrator account: {errors}");
            }

            var roleResult = await userManager.AddToRoleAsync(adminUser, "SuperAdmin");
            if (!roleResult.Succeeded)
            {
                var errors = string.Join("; ", roleResult.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to assign SuperAdmin role: {errors}");
            }
        }

        // 3. Mark bootstrap completion on installation marker
        var marker = await context.InstallationMarkers.FirstOrDefaultAsync(m => m.InstallationId == installationId);
        if (marker != null)
        {
            marker.BootstrapCompleted = true;
            marker.OperationId = operationId;
        }
        else
        {
            context.InstallationMarkers.Add(new InstallationMarker
            {
                InstallationId = installationId,
                BootstrapCompleted = true,
                InstalledVersion = "1.0.0",
                InstalledAtUtc = DateTime.UtcNow,
                OperationId = operationId
            });
        }

        await context.SaveChangesAsync();
    }
}

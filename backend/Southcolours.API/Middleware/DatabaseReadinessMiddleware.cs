using System.Text.Json;
using Southcolours.API.Health;

namespace Southcolours.API.Middleware;

public class DatabaseReadinessMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<DatabaseReadinessMiddleware> _logger;

    // Endpoints that are excluded from database readiness gating (Liveness, Health, Static Assets)
    private static readonly HashSet<string> BypassPaths = new(StringComparer.OrdinalIgnoreCase)
    {
        "/health",
        "/api/health",
        "/health/live"
    };

    public DatabaseReadinessMiddleware(RequestDelegate _next, ILogger<DatabaseReadinessMiddleware> logger)
    {
        this._next = _next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, IDatabaseReadinessCheck readinessCheck)
    {
        var path = context.Request.Path.Value ?? string.Empty;

        // Bypass liveness / static files / swagger docs / wizard setup pages
        if (BypassPaths.Contains(path) || 
            path.StartsWith("/uploads", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/openapi", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/Setup", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/css", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/js", StringComparison.OrdinalIgnoreCase))
        {
            await _next(context);
            return;
        }

        var result = await readinessCheck.CheckReadinessAsync(context.RequestAborted);
        if (!result.IsReady)
        {
            _logger.LogWarning("Rejecting request to {Path} due to database readiness state: {Status}", path, result.Status);
            
            // For API requests, return 503 JSON with the setup URL
            if (path.StartsWith("/api", StringComparison.OrdinalIgnoreCase))
            {
                context.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
                context.Response.ContentType = "application/json";

                var response = new
                {
                    status = 503,
                    title = "Service Unavailable",
                    detail = "The database is not initialized or missing. Redirecting to setup.",
                    statusCategory = result.Status,
                    setupUrl = "/Setup/Connection"
                };

                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                return;
            }

            // For browser navigation (root, SPA fallback, storefront pages), automatically redirect directly to the setup wizard
            context.Response.Redirect("/Setup/Connection");
            return;
        }

        await _next(context);
    }
}

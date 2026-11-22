using Microsoft.AspNetCore.Mvc;

namespace Southcolours.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadsController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _config;

    public UploadsController(IWebHostEnvironment env, IConfiguration config)
    {
        _env = env;
        _config = config;
    }

    private string GetUploadsFolder()
    {
        // 1. Check environment variable UPLOADS_PATH (e.g. /var/southcolours/uploads on Linux VPS)
        // 2. Check appsettings.json "Uploads:StoragePath"
        // 3. Fallback to local wwwroot/uploads (cross-platform compatible)
        var customPath = Environment.GetEnvironmentVariable("UPLOADS_PATH") 
                         ?? _config["Uploads:StoragePath"];

        var folder = !string.IsNullOrWhiteSpace(customPath) 
            ? Path.GetFullPath(customPath) 
            : Path.Combine(_env.ContentRootPath, "wwwroot", "uploads");

        if (!Directory.Exists(folder))
        {
            Directory.CreateDirectory(folder);
        }

        return folder;
    }

    [HttpPost]
    [RequestSizeLimit(15 * 1024 * 1024)] // 15 MB limit
    public async Task<IActionResult> UploadImage([FromForm] IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded or file is empty." });
        }

        // Validate allowed image extensions
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Invalid file type. Only image files (JPG, PNG, WEBP, GIF, SVG) are allowed." });
        }

        var uploadsFolder = GetUploadsFolder();

        // Generate unique filename
        var uniqueFileName = $"{Guid.NewGuid():N}_{DateTime.UtcNow.Ticks}{extension}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Return relative URL that works in both dev & production
        var relativeUrl = $"/uploads/{uniqueFileName}";

        return Ok(new
        {
            url = relativeUrl,
            fileName = uniqueFileName,
            size = file.Length
        });
    }

    [HttpPost("multiple")]
    [RequestSizeLimit(50 * 1024 * 1024)] // 50 MB limit
    public async Task<IActionResult> UploadMultipleImages([FromForm] List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
        {
            return BadRequest(new { message = "No files uploaded." });
        }

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg" };
        var uploadsFolder = GetUploadsFolder();
        var results = new List<string>();

        foreach (var file in files)
        {
            if (file.Length == 0) continue;
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(ext)) continue;

            var uniqueFileName = $"{Guid.NewGuid():N}_{DateTime.UtcNow.Ticks}{ext}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            results.Add($"/uploads/{uniqueFileName}");
        }

        return Ok(new { urls = results });
    }
}

using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Southcolours.Domain.Entities;
using Southcolours.Persistence.Context;

namespace Southcolours.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BannersController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public BannersController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetBanners([FromQuery] bool activeOnly = true)
    {
        var query = _db.Banners.AsQueryable();
        if (activeOnly)
        {
            query = query.Where(b => b.IsActive);
        }

        var banners = await query.OrderBy(b => b.DisplayOrder).ToListAsync();
        return Ok(banners);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetBanner(Guid id)
    {
        var banner = await _db.Banners.FirstOrDefaultAsync(b => b.Id == id);
        if (banner == null) return NotFound(new { Message = "Banner not found." });
        return Ok(banner);
    }

    [HttpPost]
    public async Task<IActionResult> CreateBanner([FromBody] CreateBannerRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { Message = "Banner title is required." });
        if (string.IsNullOrWhiteSpace(request.ImageUrl))
            return BadRequest(new { Message = "Banner image URL is required." });

        var banner = new Banner
        {
            Title = request.Title.Trim(),
            Subtitle = request.Subtitle?.Trim(),
            ImageUrl = request.ImageUrl.Trim(),
            LinkUrl = string.IsNullOrWhiteSpace(request.LinkUrl) ? "/products" : request.LinkUrl.Trim(),
            ButtonText = string.IsNullOrWhiteSpace(request.ButtonText) ? "Shop Now" : request.ButtonText.Trim(),
            DisplayOrder = request.DisplayOrder,
            IsActive = true
        };

        _db.Banners.Add(banner);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBanner), new { id = banner.Id }, banner);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateBanner(Guid id, [FromBody] UpdateBannerRequest request)
    {
        var banner = await _db.Banners.FirstOrDefaultAsync(b => b.Id == id);
        if (banner == null) return NotFound(new { Message = "Banner not found." });

        if (!string.IsNullOrWhiteSpace(request.Title))
            banner.Title = request.Title.Trim();

        if (request.Subtitle != null)
            banner.Subtitle = request.Subtitle.Trim();

        if (!string.IsNullOrWhiteSpace(request.ImageUrl))
            banner.ImageUrl = request.ImageUrl.Trim();

        if (request.LinkUrl != null)
            banner.LinkUrl = request.LinkUrl.Trim();

        if (request.ButtonText != null)
            banner.ButtonText = request.ButtonText.Trim();

        banner.DisplayOrder = request.DisplayOrder;
        banner.IsActive = request.IsActive;
        banner.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(banner);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteBanner(Guid id)
    {
        var banner = await _db.Banners.FirstOrDefaultAsync(b => b.Id == id);
        if (banner == null) return NotFound(new { Message = "Banner not found." });

        banner.IsActive = false;
        banner.IsDeleted = true;
        banner.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { Message = "Banner removed successfully." });
    }
}

public class CreateBannerRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? LinkUrl { get; set; } = "/products";
    public string ButtonText { get; set; } = "Shop Now";
    public int DisplayOrder { get; set; } = 1;
}

public class UpdateBannerRequest
{
    public string? Title { get; set; }
    public string? Subtitle { get; set; }
    public string? ImageUrl { get; set; }
    public string? LinkUrl { get; set; }
    public string? ButtonText { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Southcolours.Domain.Entities;
using Southcolours.Domain.Enums;
using Southcolours.Persistence.Context;

namespace Southcolours.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CouponsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public CouponsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCoupons()
    {
        var coupons = await _db.Coupons
            .Where(c => !c.IsDeleted)
            .OrderByDescending(c => c.CreatedAtUtc)
            .ToListAsync();

        return Ok(coupons);
    }

    [HttpGet("validate/{code}")]
    public async Task<IActionResult> ValidateCoupon(string code, [FromQuery] decimal cartTotal)
    {
        var coupon = await _db.Coupons.FirstOrDefaultAsync(c => c.Code.ToUpper() == code.ToUpper() && c.IsActive && !c.IsDeleted);
        if (coupon == null || DateTime.UtcNow < coupon.ValidFromUtc || DateTime.UtcNow > coupon.ValidToUtc)
        {
            return BadRequest(new { Message = "Invalid or expired coupon code." });
        }

        if (cartTotal < coupon.MinCartAmount)
        {
            return BadRequest(new { Message = $"Minimum cart value of ₹{coupon.MinCartAmount} required for this coupon." });
        }

        decimal discount = coupon.Type == DiscountType.Percentage
            ? (cartTotal * coupon.Value / 100m)
            : coupon.Value;

        if (coupon.MaxDiscountAmount.HasValue && discount > coupon.MaxDiscountAmount.Value)
        {
            discount = coupon.MaxDiscountAmount.Value;
        }

        return Ok(new
        {
            Code = coupon.Code,
            Discount = discount,
            Description = coupon.Description
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateCoupon([FromBody] CreateCouponRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
            return BadRequest(new { Message = "Coupon code is required." });

        var code = request.Code.ToUpper().Trim();
        var existing = await _db.Coupons.FirstOrDefaultAsync(c => c.Code == code && !c.IsDeleted);
        if (existing != null)
            return BadRequest(new { Message = "A coupon with this code already exists." });

        var coupon = new Coupon
        {
            Code = code,
            Description = request.Description?.Trim(),
            Type = request.Type,
            Value = request.Value,
            MinCartAmount = request.MinCartAmount,
            MaxDiscountAmount = request.MaxDiscountAmount,
            ValidFromUtc = request.ValidFromUtc ?? DateTime.UtcNow,
            ValidToUtc = request.ValidToUtc ?? DateTime.UtcNow.AddMonths(3),
            UsageLimit = request.UsageLimit > 0 ? request.UsageLimit : 1000,
            UsedCount = 0,
            IsActive = true
        };

        _db.Coupons.Add(coupon);
        await _db.SaveChangesAsync();

        return Ok(coupon);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCoupon(Guid id, [FromBody] UpdateCouponRequest request)
    {
        var coupon = await _db.Coupons.FirstOrDefaultAsync(c => c.Id == id);
        if (coupon == null) return NotFound(new { Message = "Coupon not found." });

        if (!string.IsNullOrWhiteSpace(request.Description))
            coupon.Description = request.Description.Trim();

        coupon.Type = request.Type;
        coupon.Value = request.Value;
        coupon.MinCartAmount = request.MinCartAmount;
        coupon.MaxDiscountAmount = request.MaxDiscountAmount;
        if (request.ValidToUtc.HasValue)
            coupon.ValidToUtc = request.ValidToUtc.Value;
        coupon.UsageLimit = request.UsageLimit;
        coupon.IsActive = request.IsActive;
        coupon.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(coupon);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCoupon(Guid id)
    {
        var coupon = await _db.Coupons.FirstOrDefaultAsync(c => c.Id == id);
        if (coupon == null) return NotFound(new { Message = "Coupon not found." });

        coupon.IsActive = false;
        coupon.IsDeleted = true;
        coupon.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { Message = "Coupon deleted successfully." });
    }
}

public class CreateCouponRequest
{
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DiscountType Type { get; set; } = DiscountType.Percentage;
    public decimal Value { get; set; }
    public decimal MinCartAmount { get; set; } = 0;
    public decimal? MaxDiscountAmount { get; set; }
    public DateTime? ValidFromUtc { get; set; }
    public DateTime? ValidToUtc { get; set; }
    public int UsageLimit { get; set; } = 1000;
}

public class UpdateCouponRequest
{
    public string? Description { get; set; }
    public DiscountType Type { get; set; }
    public decimal Value { get; set; }
    public decimal MinCartAmount { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public DateTime? ValidToUtc { get; set; }
    public int UsageLimit { get; set; }
    public bool IsActive { get; set; }
}

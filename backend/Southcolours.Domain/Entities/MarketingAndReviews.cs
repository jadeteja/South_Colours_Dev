using System;
using System.Collections.Generic;
using Southcolours.Domain.Common;
using Southcolours.Domain.Enums;

namespace Southcolours.Domain.Entities;

public class Coupon : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DiscountType Type { get; set; } = DiscountType.Percentage;
    public decimal Value { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public decimal MinCartAmount { get; set; } = 0;
    public DateTime ValidFromUtc { get; set; }
    public DateTime ValidToUtc { get; set; }
    public int UsageLimit { get; set; } = 1000;
    public int UsedCount { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}

public class ProductReview : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }

    public string UserId { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public int Rating { get; set; } = 5; // 1 to 5
    public string Title { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public bool IsVerifiedPurchase { get; set; } = true;
    public bool IsApproved { get; set; } = true;
}

public class Banner : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? LinkUrl { get; set; }
    public string ButtonText { get; set; } = "Shop Now";
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}


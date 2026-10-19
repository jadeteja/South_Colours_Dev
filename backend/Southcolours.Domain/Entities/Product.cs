using System;
using System.Collections.Generic;
using Southcolours.Domain.Common;
using Southcolours.Domain.Enums;

namespace Southcolours.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string DetailedDescription { get; set; } = string.Empty;

    public Guid CategoryId { get; set; }
    public Category? Category { get; set; }

    public Guid? SubCategoryId { get; set; }
    public SubCategory? SubCategory { get; set; }

    public string? Brand { get; set; } = "South Colours";
    public string? Material { get; set; }
    public string? FabricType { get; set; }
    public GenderCategory Gender { get; set; } = GenderCategory.Unisex;
    public string? AgeGroup { get; set; }
    public string? CareInstructions { get; set; }
    public string? Occasion { get; set; }

    public decimal OriginalPrice { get; set; }
    public decimal SellingPrice { get; set; }
    public decimal CostPrice { get; set; }
    public decimal GstPercentage { get; set; } = 5.0m;
    public string? HsnCode { get; set; }

    public bool IsFeatured { get; set; } = false;
    public bool IsNewArrival { get; set; } = false;
    public bool IsActive { get; set; } = true;

    public double AverageRating { get; set; } = 5.0;
    public int ReviewCount { get; set; } = 0;

    public string? SeoTitle { get; set; }
    public string? SeoDescription { get; set; }

    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    public ICollection<ProductReview> Reviews { get; set; } = new List<ProductReview>();
}

public class ProductImage : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }

    public string ImageUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? AltText { get; set; }
    public bool IsPrimary { get; set; } = false;
    public int DisplayOrder { get; set; } = 0;
}

public class ProductVariant : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }

    public string SKU { get; set; } = string.Empty;
    public string SizeName { get; set; } = string.Empty; // e.g. "2-3 Years", "3-4 Years"
    public string ColorName { get; set; } = string.Empty; // e.g. "Pink", "Yellow"
    public string? ColorHex { get; set; } // e.g. "#FF4081"

    public decimal? PriceOverride { get; set; }
    public int AvailableStock { get; set; } = 0;
    public int ReservedStock { get; set; } = 0;
    public int LowStockThreshold { get; set; } = 5;

    public byte[]? RowVersion { get; set; } // For optimistic concurrency
}


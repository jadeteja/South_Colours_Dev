using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Southcolours.Domain.Entities;
using Southcolours.Persistence.Context;

namespace Southcolours.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ProductsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts(
        [FromQuery] string? category,
        [FromQuery] string? subcategory,
        [FromQuery] string? gender,
        [FromQuery] string? search,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? sortBy,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        var query = _db.Products
            .AsNoTracking()
            .AsSplitQuery()
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Include(p => p.Category)
            .Include(p => p.SubCategory)
            .Where(p => p.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
        {
            var catLower = category.Trim().ToLower();
            query = query.Where(p => 
                (p.Category != null && p.Category.Slug.ToLower() == catLower) ||
                (p.SubCategory != null && p.SubCategory.Slug.ToLower() == catLower) ||
                (catLower == "girls" && (p.Gender == Southcolours.Domain.Enums.GenderCategory.Girls || (p.Category != null && p.Category.TargetGender == Southcolours.Domain.Enums.GenderCategory.Girls))) ||
                (catLower == "boys" && (p.Gender == Southcolours.Domain.Enums.GenderCategory.Boys || (p.Category != null && p.Category.TargetGender == Southcolours.Domain.Enums.GenderCategory.Boys))) ||
                (catLower == "baby-wear" && (p.Gender == Southcolours.Domain.Enums.GenderCategory.Baby || (p.Category != null && p.Category.TargetGender == Southcolours.Domain.Enums.GenderCategory.Baby))) ||
                (catLower == "dresses" && (p.Category != null && (p.Category.Slug.ToLower() == "dresses" || p.Category.Slug.ToLower() == "ethnic-wear")))
            );
        }

        if (!string.IsNullOrWhiteSpace(subcategory))
        {
            query = query.Where(p => p.SubCategory != null && p.SubCategory.Slug.ToLower() == subcategory.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(gender) && Enum.TryParse<Southcolours.Domain.Enums.GenderCategory>(gender, true, out var g))
        {
            query = query.Where(p => p.Gender == g);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(s) || p.SKU.ToLower().Contains(s) || p.ShortDescription.ToLower().Contains(s));
        }

        if (minPrice.HasValue)
            query = query.Where(p => p.SellingPrice >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(p => p.SellingPrice <= maxPrice.Value);

        query = sortBy?.ToLower() switch
        {
            "price-asc" => query.OrderBy(p => p.SellingPrice),
            "price-desc" => query.OrderByDescending(p => p.SellingPrice),
            "newest" => query.OrderByDescending(p => p.CreatedAtUtc),
            "rating" => query.OrderByDescending(p => p.AverageRating),
            _ => query.OrderByDescending(p => p.IsFeatured).ThenByDescending(p => p.CreatedAtUtc)
        };

        var totalItems = await query.CountAsync();
        var products = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return Ok(new
        {
            TotalItems = totalItems,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
            Items = products
        });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _db.Products
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Include(p => p.Category)
            .Include(p => p.SubCategory)
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

        return product is null ? NotFound(new { Message = "Product not found" }) : Ok(product);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var product = await _db.Products
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Include(p => p.Category)
            .Include(p => p.SubCategory)
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive);

        return product is null ? NotFound(new { Message = "Product not found" }) : Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
    {
        var category = await _db.Categories.FirstOrDefaultAsync(c => c.Slug == dto.CategorySlug);
        var subCategory = dto.SubCategorySlug != null ? await _db.SubCategories.FirstOrDefaultAsync(s => s.Slug == dto.SubCategorySlug) : null;

        var baseSlug = dto.Name.ToLower().Replace(" ", "-").Replace("'", "");
        var slug = baseSlug;
        int count = 1;
        while (await _db.Products.AnyAsync(p => p.Slug == slug))
        {
            slug = $"{baseSlug}-{count++}";
        }

        var product = new Product
        {
            Name = dto.Name,
            Slug = slug,
            SKU = dto.SKU,
            ShortDescription = dto.Description,
            DetailedDescription = dto.Description,
            CategoryId = category?.Id ?? (await _db.Categories.FirstAsync()).Id,
            SubCategoryId = subCategory?.Id,
            SellingPrice = dto.Price,
            OriginalPrice = dto.DiscountPrice > 0 ? dto.DiscountPrice : dto.Price,
            IsActive = true,
            IsFeatured = true,
            IsNewArrival = true
        };

        // Add default images
        if (dto.ImageUrls != null && dto.ImageUrls.Count > 0)
        {
            for (int i = 0; i < dto.ImageUrls.Count; i++)
            {
                product.Images.Add(new ProductImage
                {
                    ImageUrl = dto.ImageUrls[i],
                    IsPrimary = i == 0,
                    DisplayOrder = i + 1
                });
            }
        }
        else
        {
            product.Images.Add(new ProductImage
            {
                ImageUrl = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
                IsPrimary = true,
                DisplayOrder = 1
            });
        }

        // Add variant sizes
        var sizes = dto.Sizes != null && dto.Sizes.Count > 0 ? dto.Sizes : new List<string> { "2-3Y", "3-4Y", "4-5Y" };
        foreach (var size in sizes)
        {
            product.Variants.Add(new ProductVariant
            {
                SKU = $"{dto.SKU}-{size}",
                SizeName = size,
                ColorName = "Pink",
                ColorHex = "#FF4081",
                AvailableStock = dto.StockQuantity > 0 ? dto.StockQuantity : 25
            });
        }

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductDto dto)
    {
        var product = await _db.Products
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        if (product == null) return NotFound(new { Message = "Product not found." });

        product.Name = dto.Name;
        product.ShortDescription = dto.Description;
        product.DetailedDescription = dto.Description;
        product.SellingPrice = dto.DiscountPrice > 0 ? dto.DiscountPrice : dto.Price;
        product.OriginalPrice = dto.Price;
        product.UpdatedAtUtc = DateTime.UtcNow;

        if (dto.ImageUrls != null && dto.ImageUrls.Count > 0)
        {
            _db.ProductImages.RemoveRange(product.Images);
            for (int i = 0; i < dto.ImageUrls.Count; i++)
            {
                product.Images.Add(new ProductImage
                {
                    ImageUrl = dto.ImageUrls[i],
                    IsPrimary = i == 0,
                    DisplayOrder = i + 1
                });
            }
        }

        await _db.SaveChangesAsync();
        return Ok(product);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product == null) return NotFound(new { Message = "Product not found." });

        product.IsActive = false;
        product.IsDeleted = true;
        product.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { Message = "Product removed successfully." });
    }
}

public record CreateProductDto(
    string Name,
    string Description,
    string CategorySlug,
    string? SubCategorySlug,
    decimal Price,
    decimal DiscountPrice,
    string SKU,
    int StockQuantity,
    List<string>? Sizes,
    List<string>? ImageUrls
);

public record UpdateProductDto(
    string Name,
    string Description,
    decimal Price,
    decimal DiscountPrice,
    List<string>? ImageUrls
);


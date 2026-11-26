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
        var products = await query
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Include(p => p.Category)
            .Include(p => p.SubCategory)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

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
            .AsNoTracking()
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
            .AsNoTracking()
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

        // Determine default selling price and MRP from size variants or fallback
        decimal defaultSellingPrice = dto.Price;
        decimal defaultMrp = dto.DiscountPrice > 0 ? dto.DiscountPrice : dto.Price;

        if (dto.SizeVariants != null && dto.SizeVariants.Count > 0)
        {
            var firstValid = dto.SizeVariants.FirstOrDefault(x => x.Price.HasValue && x.Price.Value > 0);
            if (firstValid != null && firstValid.Price.HasValue)
            {
                defaultSellingPrice = firstValid.Price.Value;
                defaultMrp = firstValid.Mrp.HasValue && firstValid.Mrp.Value > 0 ? firstValid.Mrp.Value : defaultSellingPrice;
            }
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
            SellingPrice = defaultSellingPrice,
            OriginalPrice = defaultMrp,
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

        // Add variant sizes (supporting SizeVariantDto with custom price per size or legacy string sizes)
        if (dto.SizeVariants != null && dto.SizeVariants.Count > 0)
        {
            foreach (var sv in dto.SizeVariants.Where(x => !string.IsNullOrWhiteSpace(x.Size)))
            {
                var sellingPrice = sv.Price.HasValue && sv.Price.Value > 0 ? sv.Price.Value : defaultSellingPrice;
                var mrpPrice = sv.Mrp.HasValue && sv.Mrp.Value > 0 ? sv.Mrp.Value : (sv.Price.HasValue && sv.Price.Value > 0 ? sv.Price.Value : defaultMrp);

                product.Variants.Add(new ProductVariant
                {
                    SKU = $"{dto.SKU}-{sv.Size.Trim()}",
                    SizeName = sv.Size.Trim(),
                    ColorName = "Pink",
                    ColorHex = "#FF4081",
                    PriceOverride = sellingPrice,
                    AvailableStock = sv.Stock.HasValue && sv.Stock.Value > 0 ? sv.Stock.Value : (dto.StockQuantity > 0 ? dto.StockQuantity : 25)
                });
            }
        }
        else
        {
            var sizes = dto.Sizes != null && dto.Sizes.Count > 0 ? dto.Sizes : new List<string> { "2-3Y", "3-4Y", "4-5Y" };
            foreach (var size in sizes)
            {
                product.Variants.Add(new ProductVariant
                {
                    SKU = $"{dto.SKU}-{size}",
                    SizeName = size,
                    ColorName = "Pink",
                    ColorHex = "#FF4081",
                    PriceOverride = defaultSellingPrice,
                    AvailableStock = dto.StockQuantity > 0 ? dto.StockQuantity : 25
                });
            }
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
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        if (product == null) return NotFound(new { Message = "Product not found." });

        product.Name = dto.Name;
        product.ShortDescription = dto.Description;
        product.DetailedDescription = dto.Description;
        product.SellingPrice = dto.DiscountPrice > 0 ? dto.DiscountPrice : dto.Price;
        product.OriginalPrice = dto.Price;
        product.UpdatedAtUtc = DateTime.UtcNow;

        if (dto.ImageUrls != null)
        {
            var existingImages = product.Images.ToList();
            var newUrls = dto.ImageUrls;

            // Update existing or add new ones to avoid EF Core navigation tracking conflicts
            for (int i = 0; i < newUrls.Count; i++)
            {
                if (i < existingImages.Count)
                {
                    existingImages[i].ImageUrl = newUrls[i];
                    existingImages[i].IsPrimary = i == 0;
                    existingImages[i].DisplayOrder = i + 1;
                    existingImages[i].UpdatedAtUtc = DateTime.UtcNow;
                }
                else
                {
                    product.Images.Add(new ProductImage
                    {
                        ProductId = product.Id,
                        ImageUrl = newUrls[i],
                        IsPrimary = i == 0,
                        DisplayOrder = i + 1
                    });
                }
            }

            // Remove any excess images if user deleted some
            for (int i = newUrls.Count; i < existingImages.Count; i++)
            {
                _db.ProductImages.Remove(existingImages[i]);
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

public record SizeVariantDto(
    string Size,
    decimal? Price,
    decimal? Mrp,
    int? Stock
);

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
    List<SizeVariantDto>? SizeVariants,
    List<string>? ImageUrls
);

public record UpdateProductDto(
    string Name,
    string Description,
    decimal Price,
    decimal DiscountPrice,
    List<string>? ImageUrls
);


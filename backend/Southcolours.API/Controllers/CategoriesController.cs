using System;
using System.Collections.Generic;
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
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public CategoriesController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _db.Categories
            .Include(c => c.SubCategories.Where(s => s.IsActive))
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCategory(Guid id)
    {
        var category = await _db.Categories
            .Include(c => c.SubCategories.Where(s => s.IsActive))
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

        if (category == null) return NotFound(new { Message = "Category not found." });
        return Ok(category);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { Message = "Category name is required." });

        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? request.Name.ToLower().Replace(" ", "-").Replace("&", "and")
            : request.Slug.ToLower().Trim();

        var existing = await _db.Categories.FirstOrDefaultAsync(c => c.Slug == slug);
        if (existing != null)
            return BadRequest(new { Message = "A category with this slug already exists." });

        var category = new Category
        {
            Name = request.Name.Trim(),
            Slug = slug,
            Description = request.Description,
            ImageUrl = request.ImageUrl ?? "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80",
            TargetGender = request.TargetGender,
            DisplayOrder = request.DisplayOrder,
            IsActive = true
        };

        if (request.SubCategories != null && request.SubCategories.Count > 0)
        {
            foreach (var subName in request.SubCategories)
            {
                if (!string.IsNullOrWhiteSpace(subName))
                {
                    category.SubCategories.Add(new SubCategory
                    {
                        Name = subName.Trim(),
                        Slug = subName.ToLower().Replace(" ", "-").Replace("&", "and"),
                        DisplayOrder = 1,
                        IsActive = true
                    });
                }
            }
        }

        _db.Categories.Add(category);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] UpdateCategoryRequest request)
    {
        var category = await _db.Categories.Include(c => c.SubCategories).FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) return NotFound(new { Message = "Category not found." });

        if (!string.IsNullOrWhiteSpace(request.Name))
            category.Name = request.Name.Trim();

        if (!string.IsNullOrWhiteSpace(request.Slug))
            category.Slug = request.Slug.ToLower().Trim();

        if (request.Description != null)
            category.Description = request.Description;

        if (request.ImageUrl != null)
            category.ImageUrl = request.ImageUrl;

        category.DisplayOrder = request.DisplayOrder;
        category.TargetGender = request.TargetGender;
        category.IsActive = request.IsActive;
        category.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(category);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var category = await _db.Categories.FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) return NotFound(new { Message = "Category not found." });

        category.IsActive = false;
        category.IsDeleted = true;
        category.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { Message = "Category removed successfully." });
    }

    [HttpPost("{id:guid}/subcategories")]
    public async Task<IActionResult> AddSubCategory(Guid id, [FromBody] CreateSubCategoryRequest request)
    {
        var category = await _db.Categories.FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) return NotFound(new { Message = "Category not found." });

        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { Message = "Subcategory name is required." });

        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? request.Name.ToLower().Replace(" ", "-").Replace("&", "and")
            : request.Slug.ToLower().Trim();

        var sub = new SubCategory
        {
            CategoryId = id,
            Name = request.Name.Trim(),
            Slug = slug,
            Description = request.Description,
            DisplayOrder = request.DisplayOrder,
            IsActive = true
        };

        _db.SubCategories.Add(sub);
        await _db.SaveChangesAsync();

        return Ok(sub);
    }
}

public class CreateCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public GenderCategory TargetGender { get; set; } = GenderCategory.Unisex;
    public int DisplayOrder { get; set; } = 1;
    public List<string>? SubCategories { get; set; }
}

public class UpdateCategoryRequest
{
    public string? Name { get; set; }
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public GenderCategory TargetGender { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class CreateSubCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public int DisplayOrder { get; set; } = 1;
}

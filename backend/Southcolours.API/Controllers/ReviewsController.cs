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
public class ReviewsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ReviewsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetReviews([FromQuery] Guid? productId, [FromQuery] bool? approvedOnly)
    {
        var query = _db.ProductReviews
            .Include(r => r.Product)
            .Where(r => !r.IsDeleted)
            .AsQueryable();

        if (productId.HasValue)
        {
            query = query.Where(r => r.ProductId == productId.Value);
        }

        if (approvedOnly.HasValue && approvedOnly.Value)
        {
            query = query.Where(r => r.IsApproved);
        }

        var reviews = await query
            .OrderByDescending(r => r.CreatedAtUtc)
            .Select(r => new
            {
                r.Id,
                r.ProductId,
                ProductName = r.Product != null ? r.Product.Name : "Southcolours Fashion",
                r.CustomerName,
                r.Rating,
                r.Title,
                r.Comment,
                r.IsVerifiedPurchase,
                r.IsApproved,
                Date = r.CreatedAtUtc.ToString("dd MMM yyyy")
            })
            .ToListAsync();

        return Ok(reviews);
    }

    [HttpPost]
    public async Task<IActionResult> SubmitReview([FromBody] CreateReviewRequest request)
    {
        if (request.ProductId == Guid.Empty)
            return BadRequest(new { Message = "ProductId is required." });

        if (string.IsNullOrWhiteSpace(request.CustomerName))
            return BadRequest(new { Message = "Customer name is required." });

        if (request.Rating < 1 || request.Rating > 5)
            return BadRequest(new { Message = "Rating must be between 1 and 5." });

        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId);
        if (product == null)
            return NotFound(new { Message = "Product not found." });

        var review = new ProductReview
        {
            ProductId = request.ProductId,
            CustomerName = request.CustomerName.Trim(),
            UserId = request.UserId ?? "cust-" + Guid.NewGuid().ToString().Substring(0, 8),
            Rating = request.Rating,
            Title = request.Title?.Trim() ?? "Great product!",
            Comment = request.Comment?.Trim() ?? string.Empty,
            IsVerifiedPurchase = true,
            IsApproved = true
        };

        _db.ProductReviews.Add(review);

        // Update product average rating & review count
        var currentReviews = await _db.ProductReviews.Where(r => r.ProductId == request.ProductId && r.IsApproved).ToListAsync();
        var allRatings = currentReviews.Select(r => (double)r.Rating).ToList();
        allRatings.Add(request.Rating);
        product.AverageRating = allRatings.Average();
        product.ReviewCount = allRatings.Count;

        await _db.SaveChangesAsync();

        return Ok(review);
    }

    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> SetReviewStatus(Guid id, [FromBody] SetReviewStatusRequest request)
    {
        var review = await _db.ProductReviews.FirstOrDefaultAsync(r => r.Id == id);
        if (review == null) return NotFound(new { Message = "Review not found." });

        review.IsApproved = request.IsApproved;
        review.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { Message = request.IsApproved ? "Review approved." : "Review hidden." });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteReview(Guid id)
    {
        var review = await _db.ProductReviews.FirstOrDefaultAsync(r => r.Id == id);
        if (review == null) return NotFound(new { Message = "Review not found." });

        review.IsDeleted = true;
        review.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { Message = "Review deleted successfully." });
    }
}

public class CreateReviewRequest
{
    public Guid ProductId { get; set; }
    public string? UserId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int Rating { get; set; } = 5;
    public string? Title { get; set; }
    public string? Comment { get; set; }
}

public class SetReviewStatusRequest
{
    public bool IsApproved { get; set; }
}


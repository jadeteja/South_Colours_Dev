using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Southcolours.Persistence.Context;

namespace Southcolours.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ReportsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var orders = await _db.Orders
            .Include(o => o.Items)
            .Where(o => !o.IsDeleted)
            .ToListAsync();

        var totalOrders = orders.Count;
        var grossSales = orders.Sum(o => o.SubTotal);
        var totalDiscounts = orders.Sum(o => o.DiscountAmount);
        var totalGst = orders.Sum(o => o.TaxAmount);
        var netRevenue = orders.Sum(o => o.TotalAmount);

        // Real aggregates with 0 default when no orders exist yet
        var products = await _db.Products
            .Where(p => !p.IsDeleted)
            .OrderByDescending(p => p.SellingPrice)
            .Take(10)
            .ToListAsync();

        var productSales = products.Select(p =>
        {
            var units = orders.SelectMany(o => o.Items).Where(i => i.ProductId == p.Id).Sum(i => i.Quantity);
            var gross = units * p.SellingPrice;
            var refunds = 0m;
            var net = gross - refunds;
            return new
            {
                p.Name,
                p.SKU,
                Units = units,
                Price = p.SellingPrice,
                Gross = gross,
                Refunds = refunds,
                Net = net
            };
        }).Where(ps => ps.Units > 0).ToList();

        return Ok(new
        {
            GrossSales = grossSales,
            Discounts = totalDiscounts,
            GstCollected = totalGst,
            NetRevenue = netRevenue,
            TotalOrders = totalOrders,
            ProductSales = productSales
        });
    }

    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportCsv()
    {
        var products = await _db.Products.Where(p => !p.IsDeleted).ToListAsync();
        var sb = new StringBuilder();
        sb.AppendLine("Product Name,SKU,Selling Price (INR),Original Price (INR),Rating,Review Count");

        foreach (var p in products)
        {
            sb.AppendLine($"\"{p.Name}\",\"{p.SKU}\",{p.SellingPrice},{p.OriginalPrice},{p.AverageRating},{p.ReviewCount}");
        }

        var bytes = Encoding.UTF8.GetBytes(sb.ToString());
        return File(bytes, "text/csv", $"Southcolours_Report_{DateTime.UtcNow:yyyyMMdd}.csv");
    }
}


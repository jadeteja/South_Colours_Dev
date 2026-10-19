using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Southcolours.Persistence.Context;

namespace Southcolours.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public CustomersController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetCustomers([FromQuery] string? search)
    {
        var query = _db.CustomerProfiles
            .Include(c => c.Addresses)
            .Include(c => c.Orders)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(c => c.FullName.ToLower().Contains(s) || (c.PhoneNumber != null && c.PhoneNumber.Contains(s)));
        }

        var customers = await query.ToListAsync();

        var result = customers.Select(c => new
        {
            c.Id,
            c.FullName,
            c.PhoneNumber,
            c.CreatedAtUtc,
            DefaultCity = c.Addresses.FirstOrDefault(a => a.IsDefault)?.City ?? c.Addresses.FirstOrDefault()?.City ?? "Bangalore",
            DefaultState = c.Addresses.FirstOrDefault(a => a.IsDefault)?.State ?? c.Addresses.FirstOrDefault()?.State ?? "Karnataka",
            TotalOrders = c.Orders.Count,
            TotalSpent = c.Orders.Sum(o => o.TotalAmount)
        });

        return Ok(result);
    }
}


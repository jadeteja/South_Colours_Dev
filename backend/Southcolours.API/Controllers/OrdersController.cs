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
public class OrdersController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public OrdersController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders([FromQuery] string? status, [FromQuery] string? search)
    {
        var query = _db.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAtUtc)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<OrderStatus>(status, true, out var orderStatus))
        {
            query = query.Where(o => o.Status == orderStatus);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(o => o.OrderNumber.Contains(search) || o.ShippingName.Contains(search) || o.ShippingPhone.Contains(search));
        }

        var orders = await query.ToListAsync();
        return Ok(orders);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrderById(Guid id)
    {
        var order = await _db.Orders
            .Include(o => o.Items)
            .Include(o => o.Payments)
            .Include(o => o.StatusHistories)
            .FirstOrDefaultAsync(o => o.Id == id);

        return order == null ? NotFound() : Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto request)
    {
        if (request.Items == null || request.Items.Count == 0)
        {
            return BadRequest(new { Message = "Order must contain at least one item." });
        }

        var random = new Random();
        var orderNumber = $"SC{random.Next(100000, 999999)}";

        var isCod = request.PaymentMethod?.ToLower() == "cod";

        var order = new Order
        {
            OrderNumber = orderNumber,
            UserId = request.UserId ?? "guest",
            Status = isCod ? OrderStatus.Confirmed : OrderStatus.PendingPayment,
            PaymentStatus = PaymentStatus.Pending,
            PaymentMethod = isCod ? PaymentMethodType.CashOnDelivery : PaymentMethodType.Razorpay,
            SubTotal = request.SubTotal,
            DiscountAmount = request.DiscountAmount,
            ShippingFee = request.ShippingFee,
            TaxAmount = request.TaxAmount,
            TotalAmount = request.TotalAmount,
            CouponCode = request.CouponCode,
            ShippingName = request.ShippingName ?? "Customer",
            ShippingPhone = request.ShippingPhone ?? string.Empty,
            ShippingAddressLine1 = request.ShippingAddressLine1 ?? string.Empty,
            ShippingAddressLine2 = request.ShippingAddressLine2,
            ShippingCity = request.ShippingCity ?? string.Empty,
            ShippingState = request.ShippingState ?? string.Empty,
            ShippingPinCode = request.ShippingPinCode ?? string.Empty
        };

        var firstProduct = await _db.Products.FirstOrDefaultAsync();
        var fallbackProductId = firstProduct?.Id ?? Guid.NewGuid();

        foreach (var itm in request.Items)
        {
            Guid prodId = Guid.TryParse(itm.ProductId, out var pId) ? pId : fallbackProductId;
            
            // Check if prodId exists in Products table, otherwise use fallbackProductId
            if (!_db.Products.Any(p => p.Id == prodId))
            {
                prodId = fallbackProductId;
            }

            Guid varId = Guid.TryParse(itm.ProductVariantId, out var vId) ? vId : Guid.NewGuid();

            order.Items.Add(new OrderItem
            {
                ProductId = prodId,
                ProductVariantId = varId,
                ProductName = itm.ProductName ?? "Kids Fashion Wear",
                SKU = itm.SKU ?? "SC-KID",
                SizeName = itm.SizeName ?? "Standard",
                ColorName = itm.ColorName ?? "Pink",
                ImageUrl = itm.ImageUrl,
                UnitPrice = itm.UnitPrice,
                Quantity = itm.Quantity > 0 ? itm.Quantity : 1,
                TotalPrice = itm.UnitPrice * (itm.Quantity > 0 ? itm.Quantity : 1)
            });
        }

        order.StatusHistories.Add(new OrderStatusHistory
        {
            OrderId = order.Id,
            Status = order.Status,
            Comments = isCod ? "Order placed with Cash on Delivery" : "Order initiated via Razorpay"
        });

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
    }

    [HttpPut("{id:guid}/fulfillment")]
    public async Task<IActionResult> UpdateFulfillment(Guid id, [FromBody] UpdateFulfillmentRequest request)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return NotFound();

        order.Status = request.Status;
        if (!string.IsNullOrWhiteSpace(request.CourierName)) order.CourierName = request.CourierName;
        if (!string.IsNullOrWhiteSpace(request.TrackingNumber)) order.TrackingNumber = request.TrackingNumber;

        if (request.Status == OrderStatus.Shipped)
            order.ShippedAtUtc = DateTime.UtcNow;
        else if (request.Status == OrderStatus.Delivered)
            order.DeliveredAtUtc = DateTime.UtcNow;

        _db.OrderStatusHistories.Add(new OrderStatusHistory
        {
            OrderId = order.Id,
            Status = request.Status,
            Comments = request.Comments ?? $"Status changed to {request.Status}"
        });

        await _db.SaveChangesAsync();
        return Ok(order);
    }
}

public class CreateOrderDto
{
    public string? UserId { get; set; }
    public string? PaymentMethod { get; set; } = "Razorpay";
    public decimal SubTotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public string? CouponCode { get; set; }
    public string? ShippingName { get; set; }
    public string? ShippingPhone { get; set; }
    public string? ShippingAddressLine1 { get; set; }
    public string? ShippingAddressLine2 { get; set; }
    public string? ShippingCity { get; set; }
    public string? ShippingState { get; set; }
    public string? ShippingPinCode { get; set; }
    public List<CreateOrderItemDto> Items { get; set; } = new();
}

public class CreateOrderItemDto
{
    public string? ProductId { get; set; }
    public string? ProductVariantId { get; set; }
    public string? ProductName { get; set; }
    public string? SKU { get; set; }
    public string? SizeName { get; set; }
    public string? ColorName { get; set; }
    public string? ImageUrl { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; } = 1;
}

public record UpdateFulfillmentRequest(
    OrderStatus Status,
    string? CourierName,
    string? TrackingNumber,
    string? Comments
);

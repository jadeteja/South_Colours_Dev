using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Southcolours.Application.DTOs;
using Southcolours.Application.Interfaces;
using Southcolours.Domain.Entities;
using Southcolours.Domain.Enums;
using Southcolours.Infrastructure.Payments;
using Southcolours.Persistence.Context;

namespace Southcolours.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IRazorpayService _razorpayService;
    private readonly IEmailService _emailService;
    private readonly UserManager<IdentityUser> _userManager;

    public PaymentsController(
        ApplicationDbContext db,
        IRazorpayService razorpayService,
        IEmailService emailService,
        UserManager<IdentityUser> userManager)
    {
        _db = db;
        _razorpayService = razorpayService;
        _emailService = emailService;
        _userManager = userManager;
    }

    [HttpGet("razorpay/key")]
    public IActionResult GetRazorpayKey()
    {
        var settings = SettingsController.LoadSettingsDirect();
        var key = !string.IsNullOrWhiteSpace(settings.RazorpayKey) && settings.RazorpayKey != "rzp_test_placeholder_key"
            ? settings.RazorpayKey
            : "rzp_test_Tplnc0eTN5xGQt";

        return Ok(new { KeyId = key });
    }

    [HttpPost("razorpay/create-order")]
    public IActionResult CreateRazorpayOrder([FromBody] CreateRazorpayOrderRequest request)
    {
        var receiptId = request.Receipt ?? $"rcpt_{Guid.NewGuid():N}";
        var razorpayOrderId = _razorpayService.CreateOrder(request.Amount, receiptId);

        return Ok(new
        {
            RazorpayOrderId = razorpayOrderId,
            Amount = request.Amount,
            Currency = request.Currency
        });
    }

    [HttpPost("razorpay/verify")]
    public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentRequest request)
    {
        bool isValid = _razorpayService.VerifySignature(
            request.RazorpayOrderId,
            request.RazorpayPaymentId,
            request.RazorpaySignature
        );

        if (!isValid)
        {
            return BadRequest(new { Message = "Invalid payment signature." });
        }

        var order = await _db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == request.InternalOrderId);

        if (order != null)
        {
            order.Status = OrderStatus.Confirmed;
            order.PaymentStatus = PaymentStatus.Captured;
            
            _db.Payments.Add(new Payment
            {
                OrderId = order.Id,
                Method = PaymentMethodType.Razorpay,
                Status = PaymentStatus.Captured,
                Amount = order.TotalAmount,
                RazorpayOrderId = request.RazorpayOrderId,
                RazorpayPaymentId = request.RazorpayPaymentId,
                RazorpaySignature = request.RazorpaySignature,
                PaidAtUtc = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();

            // Send order confirmation email asynchronously
            _ = Task.Run(async () =>
            {
                try
                {
                    string? customerEmail = null;
                    if (!string.IsNullOrEmpty(order.UserId) && order.UserId != "guest")
                    {
                        var user = await _userManager.FindByIdAsync(order.UserId);
                        customerEmail = user?.Email;
                    }

                    var itemsList = order.Items.Select(i => (i.ProductName, i.Quantity, i.UnitPrice)).ToList();

                    if (!string.IsNullOrEmpty(customerEmail))
                    {
                        await _emailService.SendOrderConfirmationAsync(customerEmail, order.OrderNumber, order.TotalAmount, itemsList);
                    }

                    await _emailService.SendAdminNotificationAsync(
                        $"Order #{order.OrderNumber} Paid & Confirmed",
                        $"Payment of INR {order.TotalAmount:F2} verified for Order #{order.OrderNumber} placed by {order.ShippingName}."
                    );
                }
                catch { }
            });
        }

        return Ok(new { Message = "Payment verified successfully", Confirmed = true });
    }

    [HttpPost("razorpay/webhook")]
    public async Task<IActionResult> RazorpayWebhook()
    {
        using var reader = new StreamReader(Request.Body, Encoding.UTF8);
        var jsonPayload = await reader.ReadToEndAsync();

        if (!Request.Headers.TryGetValue("X-Razorpay-Signature", out var signatureHeader))
        {
            return BadRequest(new { Message = "Missing X-Razorpay-Signature header." });
        }

        bool isValid = _razorpayService.VerifyWebhookSignature(jsonPayload, signatureHeader.ToString());
        if (!isValid)
        {
            return BadRequest(new { Message = "Invalid webhook signature." });
        }

        return Ok(new { Status = "Webhook received successfully" });
    }
}


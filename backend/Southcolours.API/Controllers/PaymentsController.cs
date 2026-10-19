using System.Text;
using Microsoft.AspNetCore.Mvc;
using Southcolours.Application.DTOs;
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

    public PaymentsController(ApplicationDbContext db, IRazorpayService razorpayService)
    {
        _db = db;
        _razorpayService = razorpayService;
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

        var order = await _db.Orders.FindAsync(request.InternalOrderId);
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


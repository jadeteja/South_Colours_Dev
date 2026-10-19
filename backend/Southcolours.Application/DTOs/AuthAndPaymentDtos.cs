using System.ComponentModel.DataAnnotations;

namespace Southcolours.Application.DTOs;

public record RegisterRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password,
    [Required] string FullName,
    string? PhoneNumber
);

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password
);

public record GoogleAuthRequest(
    [Required] string IdToken
);

public record AuthResponse(
    string Token,
    string Email,
    string FullName,
    string[] Roles,
    DateTime ExpiresAt
);

public record CreateRazorpayOrderRequest(
    decimal Amount,
    string Currency = "INR",
    string? Receipt = null
);

public record VerifyPaymentRequest(
    string RazorpayOrderId,
    string RazorpayPaymentId,
    string RazorpaySignature,
    Guid InternalOrderId
);


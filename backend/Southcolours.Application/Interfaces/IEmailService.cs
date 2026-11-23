namespace Southcolours.Application.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string htmlBody, CancellationToken cancellationToken = default);
    Task SendWelcomeEmailAsync(string toEmail, string fullName, CancellationToken cancellationToken = default);
    Task SendPasswordResetOtpAsync(string toEmail, string otp, CancellationToken cancellationToken = default);
    Task SendOrderConfirmationAsync(string toEmail, string orderNumber, decimal totalAmount, List<(string Name, int Quantity, decimal Price)> items, CancellationToken cancellationToken = default);
    Task SendOrderStatusUpdateAsync(string toEmail, string orderNumber, string newStatus, string? trackingNumber, string? courierName, CancellationToken cancellationToken = default);
    Task SendAdminNotificationAsync(string subject, string message, CancellationToken cancellationToken = default);
}

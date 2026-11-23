using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using Southcolours.Application.Common.Settings;
using Southcolours.Application.Interfaces;

namespace Southcolours.Infrastructure.Services;

public class SmtpEmailService : IEmailService
{
    private readonly SmtpSettings _settings;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IOptions<SmtpSettings> settings, ILogger<SmtpEmailService> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.Host) || string.IsNullOrWhiteSpace(_settings.SenderEmail))
        {
            _logger.LogWarning("SMTP is not properly configured. Email to {ToEmail} with subject '{Subject}' was not sent.", toEmail, subject);
            return;
        }

        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = htmlBody
            };
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();

            // Support both SSL/TLS (port 465) and STARTTLS (port 587) or plain
            var secureSocketOption = _settings.Port == 465 
                ? SecureSocketOptions.SslOnConnect 
                : (_settings.EnableSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None);

            await client.ConnectAsync(_settings.Host, _settings.Port, secureSocketOption, cancellationToken);

            if (!string.IsNullOrEmpty(_settings.UserName) && !string.IsNullOrEmpty(_settings.Password))
            {
                await client.AuthenticateAsync(_settings.UserName, _settings.Password, cancellationToken);
            }

            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);

            _logger.LogInformation("Email sent successfully to {ToEmail} with subject '{Subject}'.", toEmail, subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {ToEmail} with subject '{Subject}'.", toEmail, subject);
        }
    }

    public async Task SendWelcomeEmailAsync(string toEmail, string fullName, CancellationToken cancellationToken = default)
    {
        var subject = "Welcome to South Colours!";
        var body = $"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #4F46E5; margin: 0;">South Colours</h1>
                <p style="color: #6B7280; margin: 4px 0;">Premium Kids Fashion &amp; Clothing</p>
            </div>
            <h2 style="color: #111827;">Hello {System.Net.WebUtility.HtmlEncode(fullName)},</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                Welcome to the South Colours family! We are thrilled to have you with us. Explore our latest vibrant collection made specially for children's comfort and festive joy.
            </p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="https://southcolours.com" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Shop the Collection</a>
            </p>
            <p style="color: #6B7280; font-size: 14px;">If you ever have any questions, feel free to reply to this email.</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <p style="color: #9CA3AF; font-size: 12px; text-align: center;">&copy; {DateTime.UtcNow.Year} South Colours. All rights reserved.</p>
        </div>
        """;

        await SendEmailAsync(toEmail, subject, body, cancellationToken);
    }

    public async Task SendPasswordResetOtpAsync(string toEmail, string otp, CancellationToken cancellationToken = default)
    {
        var subject = $"{otp} is your verification code - South Colours";
        var body = $"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #4F46E5; margin: 0;">South Colours</h1>
            </div>
            <h2 style="color: #111827;">Password Reset / OTP Verification</h2>
            <p style="color: #374151; font-size: 15px; line-height: 1.5;">
                You recently requested a one-time verification code. Use the code below to proceed:
            </p>
            <div style="text-align: center; margin: 24px 0;">
                <span style="display: inline-block; background-color: #F3F4F6; color: #111827; letter-spacing: 6px; font-size: 28px; font-weight: bold; padding: 12px 28px; border-radius: 8px; border: 1px dashed #4F46E5;">
                    {System.Net.WebUtility.HtmlEncode(otp)}
                </span>
            </div>
            <p style="color: #6B7280; font-size: 13px;">This code will expire shortly. If you did not request this code, please ignore this email or reach out to support.</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <p style="color: #9CA3AF; font-size: 12px; text-align: center;">&copy; {DateTime.UtcNow.Year} South Colours. All rights reserved.</p>
        </div>
        """;

        await SendEmailAsync(toEmail, subject, body, cancellationToken);
    }

    public async Task SendOrderConfirmationAsync(string toEmail, string orderNumber, decimal totalAmount, List<(string Name, int Quantity, decimal Price)> items, CancellationToken cancellationToken = default)
    {
        var subject = $"Order Confirmed - #{orderNumber} | South Colours";

        var itemsTable = string.Join("", items.Select(i => $"""
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #374151;">{System.Net.WebUtility.HtmlEncode(i.Name)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; color: #374151;">{i.Quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; color: #374151;">&#8377;{i.Price:F2}</td>
            </tr>
        """));

        var body = $"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #4F46E5; margin: 0;">South Colours</h1>
                <p style="color: #10B981; font-weight: bold; font-size: 18px; margin: 8px 0;">Thank you for your order!</p>
            </div>
            <p style="color: #374151; font-size: 15px;">We have received your order <strong>#{System.Net.WebUtility.HtmlEncode(orderNumber)}</strong> and are getting it ready for shipment.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
                <thead>
                    <tr style="background-color: #F9FAFB; text-align: left;">
                        <th style="padding: 10px; border-bottom: 2px solid #E5E7EB; color: #4B5563;">Item</th>
                        <th style="padding: 10px; border-bottom: 2px solid #E5E7EB; text-align: center; color: #4B5563;">Qty</th>
                        <th style="padding: 10px; border-bottom: 2px solid #E5E7EB; text-align: right; color: #4B5563;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {itemsTable}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" style="padding: 12px 10px; font-weight: bold; text-align: right; color: #111827;">Total Amount:</td>
                        <td style="padding: 12px 10px; font-weight: bold; text-align: right; color: #4F46E5; font-size: 16px;">&#8377;{totalAmount:F2}</td>
                    </tr>
                </tfoot>
            </table>

            <p style="color: #6B7280; font-size: 13px;">You will receive another update when your order has been dispatched.</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <p style="color: #9CA3AF; font-size: 12px; text-align: center;">&copy; {DateTime.UtcNow.Year} South Colours. All rights reserved.</p>
        </div>
        """;

        await SendEmailAsync(toEmail, subject, body, cancellationToken);
    }

    public async Task SendOrderStatusUpdateAsync(string toEmail, string orderNumber, string newStatus, string? trackingNumber, string? courierName, CancellationToken cancellationToken = default)
    {
        var subject = $"Order #{orderNumber} Status Update: {newStatus} | South Colours";

        var trackingInfo = !string.IsNullOrWhiteSpace(trackingNumber)
            ? $"""
            <div style="background-color: #F3F4F6; padding: 14px; border-radius: 6px; margin: 15px 0;">
                <p style="margin: 0; color: #374151;"><strong>Courier:</strong> {System.Net.WebUtility.HtmlEncode(courierName ?? "Standard Shipping")}</p>
                <p style="margin: 4px 0 0 0; color: #374151;"><strong>Tracking Number:</strong> {System.Net.WebUtility.HtmlEncode(trackingNumber)}</p>
            </div>
            """
            : string.Empty;

        var body = $"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #4F46E5; margin: 0;">South Colours</h1>
            </div>
            <h2 style="color: #111827;">Order Update</h2>
            <p style="color: #374151; font-size: 15px;">Your order <strong>#{System.Net.WebUtility.HtmlEncode(orderNumber)}</strong> status has been updated to:</p>
            <p style="font-size: 18px; font-weight: bold; color: #4F46E5; margin: 10px 0;">{System.Net.WebUtility.HtmlEncode(newStatus)}</p>
            {trackingInfo}
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <p style="color: #9CA3AF; font-size: 12px; text-align: center;">&copy; {DateTime.UtcNow.Year} South Colours. All rights reserved.</p>
        </div>
        """;

        await SendEmailAsync(toEmail, subject, body, cancellationToken);
    }

    public async Task SendAdminNotificationAsync(string subject, string message, CancellationToken cancellationToken = default)
    {
        var adminEmail = _settings.AdminEmail;
        if (string.IsNullOrWhiteSpace(adminEmail))
        {
            _logger.LogInformation("Admin notification skipped because SmtpSettings:AdminEmail is not configured.");
            return;
        }

        var fullSubject = $"[Admin Alert] {subject}";
        var body = $"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h2 style="color: #DC2626;">South Colours Admin Notification</h2>
            <p style="color: #374151; font-size: 15px; line-height: 1.5;">{System.Net.WebUtility.HtmlEncode(message)}</p>
            <p style="color: #9CA3AF; font-size: 12px; margin-top: 20px;">Timestamp: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC</p>
        </div>
        """;

        await SendEmailAsync(adminEmail, fullSubject, body, cancellationToken);
    }
}

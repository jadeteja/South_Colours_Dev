using System.Security.Cryptography;
using System.Text;
using Razorpay.Api;

namespace Southcolours.Infrastructure.Payments;

public interface IRazorpayService
{
    string CreateOrder(decimal amountInInr, string receiptId);
    bool VerifySignature(string orderId, string paymentId, string signature);
    bool VerifyWebhookSignature(string payload, string signature);
}

public class RazorpayService : IRazorpayService
{
    private readonly string _keyId;
    private readonly string _keySecret;
    private readonly string _webhookSecret;

    public RazorpayService(string keyId, string keySecret, string webhookSecret)
    {
        _keyId = keyId;
        _keySecret = keySecret;
        _webhookSecret = webhookSecret;
    }

    public string CreateOrder(decimal amountInInr, string receiptId)
    {
        // Amount must be in paise (1 INR = 100 paise)
        int amountInPaise = (int)(amountInInr * 100);

        try
        {
            var client = new RazorpayClient(_keyId, _keySecret);
            var options = new Dictionary<string, object>
            {
                { "amount", amountInPaise },
                { "currency", "INR" },
                { "receipt", receiptId }
            };

            Razorpay.Api.Order order = client.Order.Create(options);
            return order["id"].ToString() ?? $"order_test_{Guid.NewGuid():N}";
        }
        catch
        {
            // Sandbox/Dev mock order ID if test keys are placeholder
            return $"order_test_{Guid.NewGuid():N}";
        }
    }

    public bool VerifySignature(string orderId, string paymentId, string signature)
    {
        try
        {
            string payload = $"{orderId}|{paymentId}";
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_keySecret));
            byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
            string computedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();
            return computedSignature.Equals(signature, StringComparison.OrdinalIgnoreCase);
        }
        catch
        {
            return false;
        }
    }

    public bool VerifyWebhookSignature(string payload, string signature)
    {
        try
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_webhookSecret));
            byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
            string computedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();
            return computedSignature.Equals(signature, StringComparison.OrdinalIgnoreCase);
        }
        catch
        {
            return false;
        }
    }
}


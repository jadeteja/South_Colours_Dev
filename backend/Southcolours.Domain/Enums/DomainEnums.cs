namespace Southcolours.Domain.Enums;

public enum GenderCategory
{
    Unisex = 0,
    Girls = 1,
    Boys = 2,
    Baby = 3
}

public enum OrderStatus
{
    PendingPayment = 0,
    PaymentFailed = 1,
    Confirmed = 2,
    Processing = 3,
    Packed = 4,
    Shipped = 5,
    OutForDelivery = 6,
    Delivered = 7,
    CancellationRequested = 8,
    Cancelled = 9,
    ReturnRequested = 10,
    ReturnApproved = 11,
    Returned = 12,
    RefundPending = 13,
    Refunded = 14
}

public enum PaymentStatus
{
    Pending = 0,
    Authorized = 1,
    Captured = 2,
    Failed = 3,
    Refunded = 4
}

public enum PaymentMethodType
{
    Razorpay = 0,
    CashOnDelivery = 1
}

public enum DiscountType
{
    Percentage = 0,
    FixedAmount = 1
}


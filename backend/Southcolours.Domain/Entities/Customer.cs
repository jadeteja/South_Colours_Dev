using System;
using System.Collections.Generic;
using Southcolours.Domain.Common;

namespace Southcolours.Domain.Entities;

public class CustomerProfile : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? ProfilePictureUrl { get; set; }

    public ICollection<CustomerAddress> Addresses { get; set; } = new List<CustomerAddress>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}

public class CustomerAddress : BaseEntity
{
    public Guid CustomerProfileId { get; set; }
    public CustomerProfile? CustomerProfile { get; set; }

    public string ContactName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string Landmark { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PinCode { get; set; } = string.Empty;
    public string AddressType { get; set; } = "Home"; // Home, Office, Other
    public bool IsDefault { get; set; } = false;
}


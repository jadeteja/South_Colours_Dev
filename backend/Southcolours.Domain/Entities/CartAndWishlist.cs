using System;
using System.Collections.Generic;
using Southcolours.Domain.Common;

namespace Southcolours.Domain.Entities;

public class ShoppingCart : BaseEntity
{
    public string? UserId { get; set; }
    public string? GuestSessionId { get; set; }
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}

public class CartItem : BaseEntity
{
    public Guid ShoppingCartId { get; set; }
    public ShoppingCart? ShoppingCart { get; set; }

    public Guid ProductId { get; set; }
    public Product? Product { get; set; }

    public Guid ProductVariantId { get; set; }
    public ProductVariant? ProductVariant { get; set; }

    public int Quantity { get; set; } = 1;
}

public class Wishlist : BaseEntity
{
    public string UserId { get; set; } = string.Empty;
    public ICollection<WishlistItem> Items { get; set; } = new List<WishlistItem>();
}

public class WishlistItem : BaseEntity
{
    public Guid WishlistId { get; set; }
    public Wishlist? Wishlist { get; set; }

    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
}


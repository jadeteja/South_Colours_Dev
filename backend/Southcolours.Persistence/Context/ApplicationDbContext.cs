using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Southcolours.Domain.Entities;

namespace Southcolours.Persistence.Context;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<SubCategory> SubCategories => Set<SubCategory>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<CustomerProfile> CustomerProfiles => Set<CustomerProfile>();
    public DbSet<CustomerAddress> CustomerAddresses => Set<CustomerAddress>();
    public DbSet<ShoppingCart> ShoppingCarts => Set<ShoppingCart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Wishlist> Wishlists => Set<Wishlist>();
    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<OrderStatusHistory> OrderStatusHistories => Set<OrderStatusHistory>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<ProductReview> ProductReviews => Set<ProductReview>();
    public DbSet<Banner> Banners => Set<Banner>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Monetary precision
        builder.Entity<Product>(b =>
        {
            b.Property(p => p.OriginalPrice).HasPrecision(18, 2);
            b.Property(p => p.SellingPrice).HasPrecision(18, 2);
            b.Property(p => p.CostPrice).HasPrecision(18, 2);
            b.Property(p => p.GstPercentage).HasPrecision(5, 2);
            b.HasIndex(p => p.Slug).IsUnique();
            b.HasIndex(p => p.SKU).IsUnique();
        });

        builder.Entity<ProductVariant>(b =>
        {
            b.Property(v => v.PriceOverride).HasPrecision(18, 2);
            if (!Database.IsNpgsql())
            {
                b.Property(v => v.RowVersion).IsRowVersion();
            }
            b.HasIndex(v => v.SKU).IsUnique();
        });

        builder.Entity<Order>(b =>
        {
            b.Property(o => o.SubTotal).HasPrecision(18, 2);
            b.Property(o => o.DiscountAmount).HasPrecision(18, 2);
            b.Property(o => o.ShippingFee).HasPrecision(18, 2);
            b.Property(o => o.TaxAmount).HasPrecision(18, 2);
            b.Property(o => o.TotalAmount).HasPrecision(18, 2);
            b.HasIndex(o => o.OrderNumber).IsUnique();
        });

        builder.Entity<OrderItem>(b =>
        {
            b.Property(oi => oi.UnitPrice).HasPrecision(18, 2);
            b.Property(oi => oi.TotalPrice).HasPrecision(18, 2);
        });

        builder.Entity<Payment>(b =>
        {
            b.Property(p => p.Amount).HasPrecision(18, 2);
        });

        builder.Entity<Coupon>(b =>
        {
            b.Property(c => c.Value).HasPrecision(18, 2);
            b.Property(c => c.MaxDiscountAmount).HasPrecision(18, 2);
            b.Property(c => c.MinCartAmount).HasPrecision(18, 2);
            b.HasIndex(c => c.Code).IsUnique();
        });

        // Global query filter for soft delete
        builder.Entity<Category>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<SubCategory>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Product>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<ProductImage>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<ProductVariant>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Order>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<OrderItem>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<OrderStatusHistory>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Payment>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<ShoppingCart>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<CartItem>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Wishlist>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<WishlistItem>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<CustomerProfile>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<CustomerAddress>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Coupon>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<ProductReview>().HasQueryFilter(e => !e.IsDeleted);
        builder.Entity<Banner>().HasQueryFilter(e => !e.IsDeleted);

        // Prevent multiple cascade paths in SQL Server
        builder.Entity<CartItem>()
            .HasOne(ci => ci.Product)
            .WithMany()
            .HasForeignKey(ci => ci.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<CartItem>()
            .HasOne(ci => ci.ProductVariant)
            .WithMany()
            .HasForeignKey(ci => ci.ProductVariantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<OrderItem>()
            .HasOne<Product>()
            .WithMany()
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}


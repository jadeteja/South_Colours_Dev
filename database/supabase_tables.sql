-- ====================================================================
-- SOUTH COLOURS POSTGRESQL SCHEMA FOR SUPABASE
-- Run this script in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ====================================================================

-- 1. DROP ALL EXISTING TABLES & RECREATE CLEAN PUBLIC SCHEMA
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Supabase permissions
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

-- 2. ASP.NET CORE IDENTITY TABLES
CREATE TABLE "AspNetRoles" (
    "Id" text NOT NULL PRIMARY KEY,
    "Name" varchar(256),
    "NormalizedName" varchar(256),
    "ConcurrencyStamp" text
);

CREATE TABLE "AspNetUsers" (
    "Id" text NOT NULL PRIMARY KEY,
    "UserName" varchar(256),
    "NormalizedUserName" varchar(256),
    "Email" varchar(256),
    "NormalizedEmail" varchar(256),
    "EmailConfirmed" boolean NOT NULL DEFAULT false,
    "PasswordHash" text,
    "SecurityStamp" text,
    "ConcurrencyStamp" text,
    "PhoneNumber" text,
    "PhoneNumberConfirmed" boolean NOT NULL DEFAULT false,
    "TwoFactorEnabled" boolean NOT NULL DEFAULT false,
    "LockoutEnd" timestamptz,
    "LockoutEnabled" boolean NOT NULL DEFAULT true,
    "AccessFailedCount" integer NOT NULL DEFAULT 0
);

CREATE TABLE "AspNetRoleClaims" (
    "Id" serial PRIMARY KEY,
    "RoleId" text NOT NULL REFERENCES "AspNetRoles"("Id") ON DELETE CASCADE,
    "ClaimType" text,
    "ClaimValue" text
);

CREATE TABLE "AspNetUserClaims" (
    "Id" serial PRIMARY KEY,
    "UserId" text NOT NULL REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE,
    "ClaimType" text,
    "ClaimValue" text
);

CREATE TABLE "AspNetUserLogins" (
    "LoginProvider" text NOT NULL,
    "ProviderKey" text NOT NULL,
    "ProviderDisplayName" text,
    "UserId" text NOT NULL REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE,
    PRIMARY KEY ("LoginProvider", "ProviderKey")
);

CREATE TABLE "AspNetUserRoles" (
    "UserId" text NOT NULL REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE,
    "RoleId" text NOT NULL REFERENCES "AspNetRoles"("Id") ON DELETE CASCADE,
    PRIMARY KEY ("UserId", "RoleId")
);

CREATE TABLE "AspNetUserTokens" (
    "UserId" text NOT NULL REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE,
    "LoginProvider" text NOT NULL,
    "Name" text NOT NULL,
    "Value" text,
    PRIMARY KEY ("UserId", "LoginProvider", "Name")
);

-- 3. STORE CATEGORIES & SUBCATEGORIES
CREATE TABLE "Categories" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "Name" text NOT NULL,
    "Slug" text NOT NULL UNIQUE,
    "Description" text,
    "ImageUrl" text,
    "TargetGender" integer NOT NULL DEFAULT 0,
    "DisplayOrder" integer NOT NULL DEFAULT 0,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "SubCategories" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "CategoryId" uuid NOT NULL REFERENCES "Categories"("Id") ON DELETE CASCADE,
    "Name" text NOT NULL,
    "Slug" text NOT NULL UNIQUE,
    "Description" text,
    "DisplayOrder" integer NOT NULL DEFAULT 0,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

-- 4. PRODUCTS, IMAGES, VARIANTS
CREATE TABLE "Products" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "CategoryId" uuid NOT NULL REFERENCES "Categories"("Id") ON DELETE CASCADE,
    "SubCategoryId" uuid REFERENCES "SubCategories"("Id") ON DELETE SET NULL,
    "Name" text NOT NULL,
    "Slug" text NOT NULL UNIQUE,
    "SKU" text NOT NULL UNIQUE,
    "ShortDescription" text NOT NULL DEFAULT '',
    "DetailedDescription" text NOT NULL DEFAULT '',
    "Brand" text DEFAULT 'South Colours',
    "Material" text,
    "FabricType" text,
    "Gender" integer NOT NULL DEFAULT 0,
    "AgeGroup" text,
    "CareInstructions" text,
    "Occasion" text,
    "OriginalPrice" numeric(18,2) NOT NULL DEFAULT 0,
    "SellingPrice" numeric(18,2) NOT NULL DEFAULT 0,
    "CostPrice" numeric(18,2) NOT NULL DEFAULT 0,
    "GstPercentage" numeric(5,2) NOT NULL DEFAULT 5.0,
    "HsnCode" text,
    "IsFeatured" boolean NOT NULL DEFAULT false,
    "IsNewArrival" boolean NOT NULL DEFAULT false,
    "IsActive" boolean NOT NULL DEFAULT true,
    "AverageRating" double precision NOT NULL DEFAULT 5.0,
    "ReviewCount" integer NOT NULL DEFAULT 0,
    "SeoTitle" text,
    "SeoDescription" text,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "ProductImages" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "ImageUrl" text NOT NULL,
    "ThumbnailUrl" text,
    "AltText" text,
    "IsPrimary" boolean NOT NULL DEFAULT false,
    "DisplayOrder" integer NOT NULL DEFAULT 0,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "ProductVariants" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "SKU" text NOT NULL UNIQUE,
    "SizeName" text NOT NULL,
    "ColorName" text NOT NULL,
    "ColorHex" text,
    "PriceOverride" numeric(18,2),
    "AvailableStock" integer NOT NULL DEFAULT 0,
    "ReservedStock" integer NOT NULL DEFAULT 0,
    "LowStockThreshold" integer NOT NULL DEFAULT 5,
    "RowVersion" bytea,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

-- 5. CUSTOMER PROFILES & ADDRESSES
CREATE TABLE "CustomerProfiles" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "UserId" text NOT NULL,
    "FullName" text NOT NULL DEFAULT '',
    "PhoneNumber" text,
    "ProfilePictureUrl" text,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "CustomerAddresses" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "CustomerProfileId" uuid NOT NULL REFERENCES "CustomerProfiles"("Id") ON DELETE CASCADE,
    "ContactName" text NOT NULL DEFAULT '',
    "PhoneNumber" text NOT NULL DEFAULT '',
    "AddressLine1" text NOT NULL DEFAULT '',
    "AddressLine2" text,
    "Landmark" text NOT NULL DEFAULT '',
    "City" text NOT NULL DEFAULT '',
    "State" text NOT NULL DEFAULT '',
    "PinCode" text NOT NULL DEFAULT '',
    "AddressType" text NOT NULL DEFAULT 'Home',
    "IsDefault" boolean NOT NULL DEFAULT false,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

-- 6. SHOPPING CART & WISHLIST
CREATE TABLE "ShoppingCarts" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "UserId" text,
    "GuestSessionId" text,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "CartItems" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "ShoppingCartId" uuid NOT NULL REFERENCES "ShoppingCarts"("Id") ON DELETE CASCADE,
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "ProductVariantId" uuid NOT NULL REFERENCES "ProductVariants"("Id") ON DELETE CASCADE,
    "Quantity" integer NOT NULL DEFAULT 1,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "Wishlists" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "UserId" text NOT NULL,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "WishlistItems" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "WishlistId" uuid NOT NULL REFERENCES "Wishlists"("Id") ON DELETE CASCADE,
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

-- 7. ORDERS, ORDER ITEMS, ORDER STATUS & PAYMENTS
CREATE TABLE "Orders" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "OrderNumber" text NOT NULL UNIQUE,
    "UserId" text NOT NULL,
    "CustomerProfileId" uuid REFERENCES "CustomerProfiles"("Id") ON DELETE SET NULL,
    "Status" integer NOT NULL DEFAULT 0,
    "PaymentStatus" integer NOT NULL DEFAULT 0,
    "PaymentMethod" integer NOT NULL DEFAULT 0,
    "SubTotal" numeric(18,2) NOT NULL DEFAULT 0,
    "DiscountAmount" numeric(18,2) NOT NULL DEFAULT 0,
    "ShippingFee" numeric(18,2) NOT NULL DEFAULT 0,
    "TaxAmount" numeric(18,2) NOT NULL DEFAULT 0,
    "TotalAmount" numeric(18,2) NOT NULL DEFAULT 0,
    "CouponCode" text,
    "ShippingName" text NOT NULL DEFAULT '',
    "ShippingPhone" text NOT NULL DEFAULT '',
    "ShippingAddressLine1" text NOT NULL DEFAULT '',
    "ShippingAddressLine2" text,
    "ShippingCity" text NOT NULL DEFAULT '',
    "ShippingState" text NOT NULL DEFAULT '',
    "ShippingPinCode" text NOT NULL DEFAULT '',
    "CourierName" text,
    "TrackingNumber" text,
    "ShippedAtUtc" timestamptz,
    "DeliveredAtUtc" timestamptz,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "OrderItems" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "OrderId" uuid NOT NULL REFERENCES "Orders"("Id") ON DELETE CASCADE,
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "ProductVariantId" uuid NOT NULL REFERENCES "ProductVariants"("Id") ON DELETE CASCADE,
    "ProductName" text NOT NULL DEFAULT '',
    "SKU" text NOT NULL DEFAULT '',
    "SizeName" text NOT NULL DEFAULT '',
    "ColorName" text NOT NULL DEFAULT '',
    "ImageUrl" text,
    "UnitPrice" numeric(18,2) NOT NULL DEFAULT 0,
    "Quantity" integer NOT NULL DEFAULT 1,
    "TotalPrice" numeric(18,2) NOT NULL DEFAULT 0,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "OrderStatusHistories" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "OrderId" uuid NOT NULL REFERENCES "Orders"("Id") ON DELETE CASCADE,
    "Status" integer NOT NULL DEFAULT 0,
    "Comments" text,
    "ChangedByUserId" text,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "Payments" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "OrderId" uuid NOT NULL REFERENCES "Orders"("Id") ON DELETE CASCADE,
    "Method" integer NOT NULL DEFAULT 0,
    "Status" integer NOT NULL DEFAULT 0,
    "Amount" numeric(18,2) NOT NULL DEFAULT 0,
    "Currency" text NOT NULL DEFAULT 'INR',
    "RazorpayOrderId" text,
    "RazorpayPaymentId" text,
    "RazorpaySignature" text,
    "FailureReason" text,
    "PaidAtUtc" timestamptz,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

-- 8. MARKETING: COUPONS, REVIEWS, BANNERS
CREATE TABLE "Coupons" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "Code" text NOT NULL UNIQUE,
    "Description" text,
    "Type" integer NOT NULL DEFAULT 0,
    "Value" numeric(18,2) NOT NULL DEFAULT 0,
    "MaxDiscountAmount" numeric(18,2),
    "MinCartAmount" numeric(18,2) NOT NULL DEFAULT 0,
    "ValidFromUtc" timestamptz NOT NULL DEFAULT now(),
    "ValidToUtc" timestamptz NOT NULL DEFAULT (now() + interval '1 year'),
    "UsageLimit" integer NOT NULL DEFAULT 1000,
    "UsedCount" integer NOT NULL DEFAULT 0,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "ProductReviews" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "UserId" text NOT NULL DEFAULT '',
    "CustomerName" text NOT NULL DEFAULT '',
    "Rating" integer NOT NULL DEFAULT 5,
    "Title" text NOT NULL DEFAULT '',
    "Comment" text NOT NULL DEFAULT '',
    "IsVerifiedPurchase" boolean NOT NULL DEFAULT true,
    "IsApproved" boolean NOT NULL DEFAULT true,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "Banners" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "Title" text NOT NULL DEFAULT '',
    "Subtitle" text,
    "ImageUrl" text NOT NULL DEFAULT '',
    "LinkUrl" text,
    "ButtonText" text NOT NULL DEFAULT 'Shop Now',
    "DisplayOrder" integer NOT NULL DEFAULT 0,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

-- 9. PERFORMANCE INDEXES
CREATE INDEX "IX_Categories_Slug" ON "Categories"("Slug");
CREATE INDEX "IX_SubCategories_CategoryId" ON "SubCategories"("CategoryId");
CREATE INDEX "IX_Products_CategoryId" ON "Products"("CategoryId");
CREATE INDEX "IX_Products_SubCategoryId" ON "Products"("SubCategoryId");
CREATE INDEX "IX_Products_Slug" ON "Products"("Slug");
CREATE INDEX "IX_Products_SKU" ON "Products"("SKU");
CREATE INDEX "IX_ProductImages_ProductId" ON "ProductImages"("ProductId");
CREATE INDEX "IX_ProductVariants_ProductId" ON "ProductVariants"("ProductId");
CREATE INDEX "IX_ProductVariants_SKU" ON "ProductVariants"("SKU");
CREATE INDEX "IX_CartItems_ShoppingCartId" ON "CartItems"("ShoppingCartId");
CREATE INDEX "IX_Orders_UserId" ON "Orders"("UserId");
CREATE INDEX "IX_Orders_OrderNumber" ON "Orders"("OrderNumber");
CREATE INDEX "IX_OrderItems_OrderId" ON "OrderItems"("OrderId");
CREATE INDEX "IX_Payments_OrderId" ON "Payments"("OrderId");
CREATE INDEX "IX_Coupons_Code" ON "Coupons"("Code");

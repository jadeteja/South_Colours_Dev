-- ====================================================================
-- SOUTH COLOURS POSTGRESQL SCHEMA FOR SUPABASE
-- Run this in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Click Run
-- ====================================================================

-- 1. ASP.NET IDENTITY TABLES
CREATE TABLE IF NOT EXISTS "AspNetRoles" (
    "Id" text NOT NULL PRIMARY KEY,
    "Name" varchar(256),
    "NormalizedName" varchar(256),
    "ConcurrencyStamp" text
);

CREATE TABLE IF NOT EXISTS "AspNetUsers" (
    "Id" text NOT NULL PRIMARY KEY,
    "UserName" varchar(256),
    "NormalizedUserName" varchar(256),
    "Email" varchar(256),
    "NormalizedEmail" varchar(256),
    "EmailConfirmed" boolean NOT NULL,
    "PasswordHash" text,
    "SecurityStamp" text,
    "ConcurrencyStamp" text,
    "PhoneNumber" text,
    "PhoneNumberConfirmed" boolean NOT NULL,
    "TwoFactorEnabled" boolean NOT NULL,
    "LockoutEnd" timestamptz,
    "LockoutEnabled" boolean NOT NULL,
    "AccessFailedCount" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "AspNetRoleClaims" (
    "Id" serial PRIMARY KEY,
    "RoleId" text NOT NULL REFERENCES "AspNetRoles"("Id") ON DELETE CASCADE,
    "ClaimType" text,
    "ClaimValue" text
);

CREATE TABLE IF NOT EXISTS "AspNetUserClaims" (
    "Id" serial PRIMARY KEY,
    "UserId" text NOT NULL REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE,
    "ClaimType" text,
    "ClaimValue" text
);

CREATE TABLE IF NOT EXISTS "AspNetUserLogins" (
    "LoginProvider" text NOT NULL,
    "ProviderKey" text NOT NULL,
    "ProviderDisplayName" text,
    "UserId" text NOT NULL REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE,
    PRIMARY KEY ("LoginProvider", "ProviderKey")
);

CREATE TABLE IF NOT EXISTS "AspNetUserRoles" (
    "UserId" text NOT NULL REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE,
    "RoleId" text NOT NULL REFERENCES "AspNetRoles"("Id") ON DELETE CASCADE,
    PRIMARY KEY ("UserId", "RoleId")
);

CREATE TABLE IF NOT EXISTS "AspNetUserTokens" (
    "UserId" text NOT NULL REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE,
    "LoginProvider" text NOT NULL,
    "Name" text NOT NULL,
    "Value" text,
    PRIMARY KEY ("UserId", "LoginProvider", "Name")
);

-- 2. STORE TABLES
CREATE TABLE IF NOT EXISTS "Categories" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "Name" varchar(150) NOT NULL,
    "Slug" varchar(150) NOT NULL UNIQUE,
    "Description" text,
    "ImageUrl" text,
    "DisplayOrder" integer NOT NULL DEFAULT 0,
    "TargetGender" integer NOT NULL DEFAULT 0,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "SubCategories" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "CategoryId" uuid NOT NULL REFERENCES "Categories"("Id") ON DELETE CASCADE,
    "Name" varchar(150) NOT NULL,
    "Slug" varchar(150) NOT NULL UNIQUE,
    "Description" text,
    "DisplayOrder" integer NOT NULL DEFAULT 0,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "Banners" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "Title" text NOT NULL,
    "Subtitle" text,
    "BadgeText" text,
    "ImageUrl" text NOT NULL,
    "TargetUrl" text,
    "DisplayOrder" integer NOT NULL DEFAULT 0,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "Products" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "CategoryId" uuid NOT NULL REFERENCES "Categories"("Id") ON DELETE CASCADE,
    "SubCategoryId" uuid REFERENCES "SubCategories"("Id") ON DELETE SET NULL,
    "Name" varchar(200) NOT NULL,
    "Slug" varchar(200) NOT NULL UNIQUE,
    "SKU" varchar(100) NOT NULL UNIQUE,
    "Description" text NOT NULL,
    "OriginalPrice" numeric(18,2) NOT NULL,
    "SellingPrice" numeric(18,2) NOT NULL,
    "CostPrice" numeric(18,2) NOT NULL,
    "GstPercentage" numeric(5,2) NOT NULL DEFAULT 0,
    "Fabric" text,
    "Pattern" text,
    "Occasion" text,
    "CareInstructions" text,
    "AgeGroup" integer NOT NULL DEFAULT 0,
    "TargetGender" integer NOT NULL DEFAULT 0,
    "Rating" double precision NOT NULL DEFAULT 5.0,
    "ReviewCount" integer NOT NULL DEFAULT 0,
    "TotalSales" integer NOT NULL DEFAULT 0,
    "IsFeatured" boolean NOT NULL DEFAULT false,
    "IsNewArrival" boolean NOT NULL DEFAULT false,
    "IsOffer" boolean NOT NULL DEFAULT false,
    "OfferBadge" text,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "ProductImages" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "ImageUrl" text NOT NULL,
    "IsPrimary" boolean NOT NULL DEFAULT false,
    "DisplayOrder" integer NOT NULL DEFAULT 0,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "ProductVariants" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "SizeName" text NOT NULL,
    "ColorName" text NOT NULL,
    "ColorHex" text NOT NULL,
    "StockQuantity" integer NOT NULL DEFAULT 0,
    "SKU" text NOT NULL,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "ProductReviews" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "CustomerId" text NOT NULL,
    "CustomerName" text NOT NULL,
    "Rating" integer NOT NULL DEFAULT 5,
    "Comment" text NOT NULL,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "ShoppingCarts" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "UserId" text NOT NULL UNIQUE,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "CartItems" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "ShoppingCartId" uuid NOT NULL REFERENCES "ShoppingCarts"("Id") ON DELETE CASCADE,
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "ProductVariantId" uuid REFERENCES "ProductVariants"("Id") ON DELETE SET NULL,
    "Quantity" integer NOT NULL DEFAULT 1,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "Wishlists" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "UserId" text NOT NULL UNIQUE,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "WishlistItems" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "WishlistId" uuid NOT NULL REFERENCES "Wishlists"("Id") ON DELETE CASCADE,
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "CustomerProfiles" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "UserId" text NOT NULL UNIQUE,
    "FullName" text NOT NULL,
    "PhoneNumber" text,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "CustomerAddresses" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "CustomerProfileId" uuid NOT NULL REFERENCES "CustomerProfiles"("Id") ON DELETE CASCADE,
    "FullName" text NOT NULL,
    "PhoneNumber" text NOT NULL,
    "StreetAddress" text NOT NULL,
    "City" text NOT NULL,
    "State" text NOT NULL,
    "PostalCode" text NOT NULL,
    "Country" text NOT NULL DEFAULT 'India',
    "IsDefault" boolean NOT NULL DEFAULT false,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "Coupons" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "Code" varchar(50) NOT NULL UNIQUE,
    "DiscountAmount" numeric(18,2) NOT NULL,
    "MinimumOrderAmount" numeric(18,2) NOT NULL DEFAULT 0,
    "ExpiryDate" timestamptz NOT NULL,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "Orders" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "OrderNumber" varchar(50) NOT NULL UNIQUE,
    "UserId" text NOT NULL,
    "CustomerEmail" text NOT NULL,
    "CustomerName" text NOT NULL,
    "CustomerPhone" text NOT NULL,
    "ShippingStreet" text NOT NULL,
    "ShippingCity" text NOT NULL,
    "ShippingState" text NOT NULL,
    "ShippingPostalCode" text NOT NULL,
    "ShippingCountry" text NOT NULL DEFAULT 'India',
    "SubTotal" numeric(18,2) NOT NULL,
    "DiscountAmount" numeric(18,2) NOT NULL DEFAULT 0,
    "ShippingFee" numeric(18,2) NOT NULL DEFAULT 0,
    "TotalAmount" numeric(18,2) NOT NULL,
    "Status" integer NOT NULL DEFAULT 0,
    "PaymentMethod" integer NOT NULL DEFAULT 0,
    "PaymentStatus" integer NOT NULL DEFAULT 0,
    "RazorpayOrderId" text,
    "RazorpayPaymentId" text,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "OrderItems" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "OrderId" uuid NOT NULL REFERENCES "Orders"("Id") ON DELETE CASCADE,
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "ProductName" text NOT NULL,
    "SizeName" text NOT NULL,
    "ColorName" text NOT NULL,
    "UnitPrice" numeric(18,2) NOT NULL,
    "Quantity" integer NOT NULL DEFAULT 1,
    "TotalPrice" numeric(18,2) NOT NULL,
    "ImageUrl" text,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

CREATE TABLE IF NOT EXISTS "OrderStatusHistories" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "OrderId" uuid NOT NULL REFERENCES "Orders"("Id") ON DELETE CASCADE,
    "Status" integer NOT NULL,
    "Notes" text,
    "CreatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Payments" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "OrderId" uuid NOT NULL REFERENCES "Orders"("Id") ON DELETE CASCADE,
    "PaymentProvider" text NOT NULL,
    "ProviderPaymentId" text,
    "ProviderOrderId" text,
    "Amount" numeric(18,2) NOT NULL,
    "Status" text NOT NULL,
    "CreatedAt" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAt" timestamptz
);

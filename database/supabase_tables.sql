-- ====================================================================
-- SOUTH COLOURS EXACT EF CORE POSTGRESQL SCHEMA FOR SUPABASE
-- Run this in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Click Run
-- ====================================================================

-- 1. DROP EXISTING TABLES TO ENSURE CLEAN SCHEMA
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

-- 2. ASP.NET IDENTITY TABLES
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

-- 3. STORE TABLES (With exact BaseEntity columns: CreatedAtUtc, UpdatedAtUtc, IsDeleted)
CREATE TABLE "Categories" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "Name" varchar(150) NOT NULL,
    "Slug" varchar(150) NOT NULL UNIQUE,
    "Description" text,
    "ImageUrl" text,
    "DisplayOrder" integer NOT NULL DEFAULT 0,
    "TargetGender" integer NOT NULL DEFAULT 0,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "SubCategories" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "CategoryId" uuid NOT NULL REFERENCES "Categories"("Id") ON DELETE CASCADE,
    "Name" varchar(150) NOT NULL,
    "Slug" varchar(150) NOT NULL UNIQUE,
    "Description" text,
    "DisplayOrder" integer NOT NULL DEFAULT 0,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "Banners" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "Title" text NOT NULL,
    "Subtitle" text,
    "BadgeText" text,
    "ImageUrl" text NOT NULL,
    "TargetUrl" text,
    "DisplayOrder" integer NOT NULL DEFAULT 0,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "Products" (
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
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "ProductImages" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "ImageUrl" text NOT NULL,
    "IsPrimary" boolean NOT NULL DEFAULT false,
    "DisplayOrder" integer NOT NULL DEFAULT 0,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "ProductVariants" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "SizeName" text NOT NULL,
    "ColorName" text NOT NULL,
    "ColorHex" text NOT NULL,
    "StockQuantity" integer NOT NULL DEFAULT 0,
    "SKU" text NOT NULL,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "ProductReviews" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "CustomerId" text NOT NULL,
    "CustomerName" text NOT NULL,
    "Rating" integer NOT NULL DEFAULT 5,
    "Comment" text NOT NULL,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "ShoppingCarts" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "UserId" text NOT NULL UNIQUE,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "CartItems" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "ShoppingCartId" uuid NOT NULL REFERENCES "ShoppingCarts"("Id") ON DELETE CASCADE,
    "ProductId" uuid NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "ProductVariantId" uuid REFERENCES "ProductVariants"("Id") ON DELETE SET NULL,
    "Quantity" integer NOT NULL DEFAULT 1,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "Wishlists" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "UserId" text NOT NULL UNIQUE,
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

CREATE TABLE "CustomerProfiles" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "UserId" text NOT NULL UNIQUE,
    "FullName" text NOT NULL,
    "PhoneNumber" text,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "CustomerAddresses" (
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
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "Coupons" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "Code" varchar(50) NOT NULL UNIQUE,
    "DiscountAmount" numeric(18,2) NOT NULL,
    "MinimumOrderAmount" numeric(18,2) NOT NULL DEFAULT 0,
    "ExpiryDate" timestamptz NOT NULL,
    "IsActive" boolean NOT NULL DEFAULT true,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "Orders" (
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
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "OrderItems" (
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
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

CREATE TABLE "OrderStatusHistories" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "OrderId" uuid NOT NULL REFERENCES "Orders"("Id") ON DELETE CASCADE,
    "Status" integer NOT NULL,
    "Notes" text,
    "CreatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "Payments" (
    "Id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "OrderId" uuid NOT NULL REFERENCES "Orders"("Id") ON DELETE CASCADE,
    "PaymentProvider" text NOT NULL,
    "ProviderPaymentId" text,
    "ProviderOrderId" text,
    "Amount" numeric(18,2) NOT NULL,
    "Status" text NOT NULL,
    "CreatedAtUtc" timestamptz NOT NULL DEFAULT now(),
    "UpdatedAtUtc" timestamptz,
    "IsDeleted" boolean NOT NULL DEFAULT false
);

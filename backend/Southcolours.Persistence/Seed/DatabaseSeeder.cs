using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Southcolours.Domain.Entities;
using Southcolours.Domain.Enums;
using Southcolours.Persistence.Context;

namespace Southcolours.Persistence.Seed;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        // 1. Roles
        string[] roles = ["SuperAdmin", "ProductManager", "OrderManager", "Customer"];
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // 2. Default Admin
        var adminEmail = "admin@southcolours.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new IdentityUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };
            var createRes = await userManager.CreateAsync(adminUser, "Admin@South123#");
            if (createRes.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "SuperAdmin");
            }
        }

        // 3. Categories & Subcategories matching Southcolours reference image
        if (!await context.Categories.AnyAsync())
        {
            var girlsCategory = new Category
            {
                Name = "Girls",
                Slug = "girls",
                Description = "Trendy & traditional dresses, frocks, and ethnic sets for girls",
                TargetGender = GenderCategory.Girls,
                DisplayOrder = 1,
                ImageUrl = "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80"
            };

            var boysCategory = new Category
            {
                Name = "Boys",
                Slug = "boys",
                Description = "Comfortable kurtas, ethnic sets, and casuals for boys",
                TargetGender = GenderCategory.Boys,
                DisplayOrder = 2,
                ImageUrl = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80"
            };

            var babyWearCategory = new Category
            {
                Name = "Baby Wear",
                Slug = "baby-wear",
                Description = "Ultra soft rompers and onesies for tiny tots",
                TargetGender = GenderCategory.Baby,
                DisplayOrder = 3,
                ImageUrl = "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
            };

            var ethnicWearCategory = new Category
            {
                Name = "Ethnic Wear",
                Slug = "ethnic-wear",
                Description = "Festive Lehengas, Pavadai Sattai, Anarkalis & Kurta Sets",
                TargetGender = GenderCategory.Unisex,
                DisplayOrder = 4,
                ImageUrl = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
            };

            var dressesCategory = new Category
            {
                Name = "Dresses",
                Slug = "dresses",
                Description = "Party wear and cotton frocks",
                TargetGender = GenderCategory.Girls,
                DisplayOrder = 5,
                ImageUrl = "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80"
            };

            var topsCategory = new Category
            {
                Name = "Tops",
                Slug = "tops",
                Description = "Everyday cute tops and shirts",
                TargetGender = GenderCategory.Unisex,
                DisplayOrder = 6,
                ImageUrl = "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80"
            };

            var bottomsCategory = new Category
            {
                Name = "Bottoms",
                Slug = "bottoms",
                Description = "Leggings, skirts, trousers and shorts",
                TargetGender = GenderCategory.Unisex,
                DisplayOrder = 7,
                ImageUrl = "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80"
            };

            var newArrivalsCategory = new Category
            {
                Name = "New Arrivals",
                Slug = "new-arrivals",
                Description = "Fresh designer styles just landed for the season",
                TargetGender = GenderCategory.Unisex,
                DisplayOrder = 8,
                ImageUrl = "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80"
            };

            context.Categories.AddRange(girlsCategory, boysCategory, babyWearCategory, ethnicWearCategory, dressesCategory, topsCategory, bottomsCategory, newArrivalsCategory);
            await context.SaveChangesAsync();

            // Subcategories under Ethnic Wear
            var lehengaCholiSub = new SubCategory { CategoryId = ethnicWearCategory.Id, Name = "Lehenga Choli", Slug = "lehenga-choli", DisplayOrder = 1 };
            var pavadaiSattaiSub = new SubCategory { CategoryId = ethnicWearCategory.Id, Name = "Pavadai Sattai", Slug = "pavadai-sattai", DisplayOrder = 2 };
            var anarkaliSub = new SubCategory { CategoryId = ethnicWearCategory.Id, Name = "Anarkali", Slug = "anarkali", DisplayOrder = 3 };
            var gownSub = new SubCategory { CategoryId = ethnicWearCategory.Id, Name = "Gown", Slug = "gown", DisplayOrder = 4 };
            var kurtaSetsSub = new SubCategory { CategoryId = ethnicWearCategory.Id, Name = "Kurta Sets", Slug = "kurta-sets", DisplayOrder = 5 };

            context.SubCategories.AddRange(lehengaCholiSub, pavadaiSattaiSub, anarkaliSub, gownSub, kurtaSetsSub);
            await context.SaveChangesAsync();
        }

        // 4. Products matching the exact cards from the Reference Image
        if (!await context.Products.AnyAsync())
        {
            var ethnicWearCategory = await context.Categories.FirstOrDefaultAsync(c => c.Slug == "ethnic-wear")
                ?? await context.Categories.FirstAsync();
            var boysCategory = await context.Categories.FirstOrDefaultAsync(c => c.Slug == "boys")
                ?? ethnicWearCategory;

            var lehengaCholiSub = await context.SubCategories.FirstOrDefaultAsync(s => s.Slug == "lehenga-choli")
                ?? await context.SubCategories.FirstOrDefaultAsync();
            var pavadaiSattaiSub = await context.SubCategories.FirstOrDefaultAsync(s => s.Slug == "pavadai-sattai")
                ?? lehengaCholiSub;
            var anarkaliSub = await context.SubCategories.FirstOrDefaultAsync(s => s.Slug == "anarkali")
                ?? lehengaCholiSub;
            var gownSub = await context.SubCategories.FirstOrDefaultAsync(s => s.Slug == "gown")
                ?? lehengaCholiSub;
            var kurtaSetsSub = await context.SubCategories.FirstOrDefaultAsync(s => s.Slug == "kurta-sets")
                ?? lehengaCholiSub;

            var productsToSeed = new List<Product>
            {
                new()
                {
                    Name = "Pink Lehenga Set",
                    Slug = "pink-lehenga-set",
                    SKU = "SC00123",
                    ShortDescription = "Beautiful pink lehenga set with intricate floral embroidery, perfect for weddings and festive occasions.",
                    DetailedDescription = "Make your little princess sparkle in this handcrafted soft net lehenga with pure cotton breathable lining. Featuring delicate gold zardozi motifs and a matching dupatta.",
                    CategoryId = ethnicWearCategory.Id,
                    SubCategoryId = lehengaCholiSub.Id,
                    Brand = "South Colours",
                    Material = "Soft Net with Cotton Lining",
                    FabricType = "Net / Silk Blend",
                    Gender = GenderCategory.Girls,
                    AgeGroup = "2-8 Years",
                    CareInstructions = "Hand Wash Recommended or Gentle Dry Clean",
                    Occasion = "Weddings, Festivals, Birthdays, Special Occasions",
                    OriginalPrice = 3499.00m,
                    SellingPrice = 2499.00m,
                    CostPrice = 1200.00m,
                    IsFeatured = true,
                    IsNewArrival = true,
                    AverageRating = 4.8,
                    ReviewCount = 24,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 },
                        new() { ImageUrl = "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80", IsPrimary = false, DisplayOrder = 2 },
                        new() { ImageUrl = "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80", IsPrimary = false, DisplayOrder = 3 }
                    },
                    Variants = new List<ProductVariant>
                    {
                        new() { SKU = "SC00123-1Y-PNK", SizeName = "1-2Y", ColorName = "Pink", ColorHex = "#FF4081", AvailableStock = 25 },
                        new() { SKU = "SC00123-2Y-PNK", SizeName = "2-3Y", ColorName = "Pink", ColorHex = "#FF4081", AvailableStock = 30 },
                        new() { SKU = "SC00123-3Y-PNK", SizeName = "3-4Y", ColorName = "Pink", ColorHex = "#FF4081", AvailableStock = 18 },
                        new() { SKU = "SC00123-4Y-PNK", SizeName = "4-5Y", ColorName = "Pink", ColorHex = "#FF4081", AvailableStock = 12 },
                        new() { SKU = "SC00123-5Y-PNK", SizeName = "5-6Y", ColorName = "Pink", ColorHex = "#FF4081", AvailableStock = 8 },
                        new() { SKU = "SC00123-6Y-PNK", SizeName = "6-8Y", ColorName = "Pink", ColorHex = "#FF4081", AvailableStock = 15 }
                    }
                },
                new()
                {
                    Name = "Yellow Anarkali",
                    Slug = "yellow-anarkali",
                    SKU = "SC00124",
                    ShortDescription = "Bright festive yellow anarkali suit with golden thread borders and contrast dupatta.",
                    DetailedDescription = "Vibrant sunshine yellow chanderi silk anarkali tailored to give an airy flared silhouette with soft inner cotton comfort.",
                    CategoryId = ethnicWearCategory.Id,
                    SubCategoryId = anarkaliSub.Id,
                    Brand = "South Colours",
                    Material = "Chanderi Silk with Cotton Lining",
                    FabricType = "Silk Blend",
                    Gender = GenderCategory.Girls,
                    AgeGroup = "1-6 Years",
                    CareInstructions = "Dry Clean Only",
                    Occasion = "Haldi, Festivals, Celebrations",
                    OriginalPrice = 2599.00m,
                    SellingPrice = 1899.00m,
                    CostPrice = 900.00m,
                    IsFeatured = true,
                    IsNewArrival = false,
                    AverageRating = 4.9,
                    ReviewCount = 36,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 }
                    },
                    Variants = new List<ProductVariant>
                    {
                        new() { SKU = "SC00124-2Y-YLW", SizeName = "2-3Y", ColorName = "Yellow", ColorHex = "#FDD835", AvailableStock = 20 },
                        new() { SKU = "SC00124-3Y-YLW", SizeName = "3-4Y", ColorName = "Yellow", ColorHex = "#FDD835", AvailableStock = 14 }
                    }
                },
                new()
                {
                    Name = "Purple Lehenga",
                    Slug = "purple-lehenga",
                    SKU = "SC00125",
                    ShortDescription = "Royal purple traditional lehenga choli embellished with zari border work.",
                    DetailedDescription = "Rich mulberry purple silk lehenga adorned with mirror embroidery and flared pleated skirt.",
                    CategoryId = ethnicWearCategory.Id,
                    SubCategoryId = lehengaCholiSub.Id,
                    Brand = "South Colours",
                    Material = "Art Silk with Butter Crepe Lining",
                    FabricType = "Art Silk",
                    Gender = GenderCategory.Girls,
                    AgeGroup = "3-8 Years",
                    CareInstructions = "Dry clean recommended",
                    Occasion = "Diwali, Reception, Family Function",
                    OriginalPrice = 3199.00m,
                    SellingPrice = 2299.00m,
                    CostPrice = 1100.00m,
                    IsFeatured = true,
                    IsNewArrival = true,
                    AverageRating = 4.7,
                    ReviewCount = 18,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 }
                    },
                    Variants = new List<ProductVariant>
                    {
                        new() { SKU = "SC00125-3Y-PRP", SizeName = "3-4Y", ColorName = "Purple", ColorHex = "#7B1FA2", AvailableStock = 15 },
                        new() { SKU = "SC00125-4Y-PRP", SizeName = "4-5Y", ColorName = "Purple", ColorHex = "#7B1FA2", AvailableStock = 10 }
                    }
                },
                new()
                {
                    Name = "Boy's Kurta Set",
                    Slug = "boys-kurta-set",
                    SKU = "SC00126",
                    ShortDescription = "Classic royal blue kurta pyjama set with jacket for young boys.",
                    DetailedDescription = "Smart jacquard silk waist-coat paired with comfortable cotton silk kurta and churidar pyjama.",
                    CategoryId = boysCategory.Id,
                    SubCategoryId = kurtaSetsSub.Id,
                    Brand = "South Colours",
                    Material = "Cotton Silk",
                    FabricType = "Cotton Silk Blend",
                    Gender = GenderCategory.Boys,
                    AgeGroup = "2-8 Years",
                    CareInstructions = "Machine Wash Gentle",
                    Occasion = "Festivals, Family Weddings, Pujas",
                    OriginalPrice = 2299.00m,
                    SellingPrice = 1599.00m,
                    CostPrice = 750.00m,
                    IsFeatured = true,
                    IsNewArrival = true,
                    AverageRating = 4.8,
                    ReviewCount = 42,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 }
                    },
                    Variants = new List<ProductVariant>
                    {
                        new() { SKU = "SC00126-4Y-BLU", SizeName = "4-5Y", ColorName = "Navy Blue", ColorHex = "#18263B", AvailableStock = 22 },
                        new() { SKU = "SC00126-5Y-BLU", SizeName = "5-6Y", ColorName = "Navy Blue", ColorHex = "#18263B", AvailableStock = 17 }
                    }
                },
                new()
                {
                    Name = "Pavadai Sattai Set",
                    Slug = "pavadai-sattai-set",
                    SKU = "SC00127",
                    ShortDescription = "Traditional South Indian magenta & gold pattu pavadai for kids.",
                    DetailedDescription = "Authentic traditional attire crafted from South Indian jacquard pattu with golden zari woven motifs.",
                    CategoryId = ethnicWearCategory.Id,
                    SubCategoryId = pavadaiSattaiSub.Id,
                    Brand = "South Colours",
                    Material = "Pure Kanchipuram Style Jacquard",
                    FabricType = "Silk Blend",
                    Gender = GenderCategory.Girls,
                    AgeGroup = "1-5 Years",
                    CareInstructions = "Gentle Hand Wash",
                    Occasion = "Temple Visits, Onam, Pongal, Naming Ceremony",
                    OriginalPrice = 2199.00m,
                    SellingPrice = 1599.00m,
                    CostPrice = 780.00m,
                    IsFeatured = false,
                    IsNewArrival = false,
                    AverageRating = 4.9,
                    ReviewCount = 28,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 }
                    },
                    Variants = new List<ProductVariant>
                    {
                        new() { SKU = "SC00127-2Y-MGN", SizeName = "2-3Y", ColorName = "Magenta Pink", ColorHex = "#E91E63", AvailableStock = 18 }
                    }
                },
                new()
                {
                    Name = "Embroidered Kurta Set",
                    Slug = "embroidered-kurta-set",
                    SKU = "SC00128",
                    ShortDescription = "Beige & gold thread worked bandhgala kurta pyjama set.",
                    DetailedDescription = "Sophisticated traditional bandhgala collar styling with rich embroidery buttons and matching dhoti pants.",
                    CategoryId = boysCategory.Id,
                    SubCategoryId = kurtaSetsSub.Id,
                    Brand = "South Colours",
                    Material = "Linen Silk",
                    FabricType = "Linen Silk Blend",
                    Gender = GenderCategory.Boys,
                    AgeGroup = "3-7 Years",
                    CareInstructions = "Dry Clean Only",
                    Occasion = "Reception, Sangeet, Festive Gathering",
                    OriginalPrice = 2499.00m,
                    SellingPrice = 1799.00m,
                    CostPrice = 850.00m,
                    IsFeatured = true,
                    IsNewArrival = false,
                    AverageRating = 4.7,
                    ReviewCount = 42,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 }
                    },
                    Variants = new List<ProductVariant>
                    {
                        new() { SKU = "SC00128-3Y-BGE", SizeName = "3-4Y", ColorName = "Beige Gold", ColorHex = "#D7CCC8", AvailableStock = 14 }
                    }
                },
                new()
                {
                    Name = "Traditional Pattu Dress",
                    Slug = "traditional-pattu-dress",
                    SKU = "SC00129",
                    ShortDescription = "Rich crimson red and copper temple border pattu frock.",
                    DetailedDescription = "Vibrant traditional crimson red pattu dress with ornate peacock and temple border patterns.",
                    CategoryId = ethnicWearCategory.Id,
                    SubCategoryId = gownSub.Id,
                    Brand = "South Colours",
                    Material = "Art Silk Jacquard",
                    FabricType = "Art Silk",
                    Gender = GenderCategory.Girls,
                    AgeGroup = "1-4 Years",
                    CareInstructions = "Dry Clean Only",
                    Occasion = "Grand Celebrations, Weddings",
                    OriginalPrice = 3599.00m,
                    SellingPrice = 2699.00m,
                    CostPrice = 1300.00m,
                    IsFeatured = true,
                    IsNewArrival = true,
                    AverageRating = 4.9,
                    ReviewCount = 31,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 }
                    },
                    Variants = new List<ProductVariant>
                    {
                        new() { SKU = "SC00129-2Y-RED", SizeName = "2-3Y", ColorName = "Crimson Red", ColorHex = "#D32F2F", AvailableStock = 16 }
                    }
                },
                new()
                {
                    Name = "Floral Lehenga",
                    Slug = "floral-lehenga",
                    SKU = "SC00130",
                    ShortDescription = "Pastel blush pink printed organza lehenga with crop top.",
                    DetailedDescription = "Dreamy floral printed organza skirt with lightweight ruffled border and soft satin crop choli.",
                    CategoryId = ethnicWearCategory.Id,
                    SubCategoryId = lehengaCholiSub.Id,
                    Brand = "South Colours",
                    Material = "Organza with Cotton Linings",
                    FabricType = "Organza",
                    Gender = GenderCategory.Girls,
                    AgeGroup = "2-6 Years",
                    CareInstructions = "Hand wash",
                    Occasion = "Daytime parties, Outdoor weddings",
                    OriginalPrice = 2799.00m,
                    SellingPrice = 1999.00m,
                    CostPrice = 950.00m,
                    IsFeatured = false,
                    IsNewArrival = true,
                    AverageRating = 4.6,
                    ReviewCount = 27,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 }
                    },
                    Variants = new List<ProductVariant>
                    {
                        new() { SKU = "SC00130-3Y-FLR", SizeName = "3-4Y", ColorName = "Blush Pink", ColorHex = "#FFD6E7", AvailableStock = 20 }
                    }
                },
                new()
                {
                    Name = "Green Anarkali",
                    Slug = "green-anarkali",
                    SKU = "SC00131",
                    ShortDescription = "Forest emerald green gota patti floor-length anarkali suit.",
                    DetailedDescription = "Festive emerald green flare with shimmering gota lace accents and matching light dupatta.",
                    CategoryId = ethnicWearCategory.Id,
                    SubCategoryId = anarkaliSub.Id,
                    Brand = "South Colours",
                    Material = "Georgette with Silk Lining",
                    FabricType = "Georgette",
                    Gender = GenderCategory.Girls,
                    AgeGroup = "4-8 Years",
                    CareInstructions = "Dry Clean Only",
                    Occasion = "Mehendi, Sangeet, Eid, Diwali",
                    OriginalPrice = 2999.00m,
                    SellingPrice = 2199.00m,
                    CostPrice = 1050.00m,
                    IsFeatured = false,
                    IsNewArrival = false,
                    AverageRating = 4.8,
                    ReviewCount = 19,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 }
                    },
                    Variants = new List<ProductVariant>
                    {
                        new() { SKU = "SC00131-4Y-GRN", SizeName = "4-5Y", ColorName = "Emerald Green", ColorHex = "#00796B", AvailableStock = 11 }
                    }
                },
                new()
                {
                    Name = "Festive Gown",
                    Slug = "festive-gown",
                    SKU = "SC00132",
                    ShortDescription = "Sky blue layered ball gown with sequin bodice.",
                    DetailedDescription = "Fairytale sky blue layered net gown with hand-sewn shimmer sequins and back satin bow tie.",
                    CategoryId = ethnicWearCategory.Id,
                    SubCategoryId = gownSub.Id,
                    Brand = "South Colours",
                    Material = "Tulle Net & Satin",
                    FabricType = "Net",
                    Gender = GenderCategory.Girls,
                    AgeGroup = "2-7 Years",
                    CareInstructions = "Delicate dry clean only",
                    Occasion = "Birthday, Evening Parties, Pageant",
                    OriginalPrice = 3399.00m,
                    SellingPrice = 2499.00m,
                    CostPrice = 1150.00m,
                    IsFeatured = true,
                    IsNewArrival = true,
                    AverageRating = 4.9,
                    ReviewCount = 33,
                    Images = new List<ProductImage>
                    {
                        new() { ImageUrl = "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80", IsPrimary = true, DisplayOrder = 1 }
                    },
                    Variants = new List<ProductVariant>
                    {
                        new() { SKU = "SC00132-3Y-BLU", SizeName = "3-4Y", ColorName = "Sky Blue", ColorHex = "#81D4FA", AvailableStock = 14 }
                    }
                }
            };

            context.Products.AddRange(productsToSeed);
            await context.SaveChangesAsync();
        }

        // 5. Promotional Coupons
        if (!await context.Coupons.AnyAsync())
        {
            var welcomeCoupon = new Coupon
            {
                Code = "WELCOME300",
                Description = "Flat ₹300 off on first order above ₹2,000",
                Type = DiscountType.FixedAmount,
                Value = 300.00m,
                MinCartAmount = 2000.00m,
                ValidFromUtc = DateTime.UtcNow.AddDays(-30),
                ValidToUtc = DateTime.UtcNow.AddYears(1),
                UsageLimit = 5000,
                IsActive = true
            };

            var festiveCoupon = new Coupon
            {
                Code = "FESTIVE15",
                Description = "15% off on kids ethnic wear",
                Type = DiscountType.Percentage,
                Value = 15.00m,
                MaxDiscountAmount = 750.00m,
                MinCartAmount = 1500.00m,
                ValidFromUtc = DateTime.UtcNow.AddDays(-30),
                ValidToUtc = DateTime.UtcNow.AddYears(1),
                UsageLimit = 2000,
                IsActive = true
            };

            context.Coupons.AddRange(welcomeCoupon, festiveCoupon);
            await context.SaveChangesAsync();
        }

        // 6. Marketing Banners
        if (!await context.Banners.AnyAsync())
        {
            var heroBanner = new Banner
            {
                Title = "Trendy & Comfortable Kids Clothing",
                Subtitle = "Dresses, Ethnic Wear, Everyday Outfits and More for Your Little Ones.",
                ImageUrl = "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=80",
                ButtonText = "Shop Now",
                LinkUrl = "/products?category=ethnic-wear",
                DisplayOrder = 1,
                IsActive = true
            };

            var ethnicBanner = new Banner
            {
                Title = "Beautiful Ethnic Wear for Little Ones",
                Subtitle = "Traditional styles crafted with utmost care & soft cotton linings.",
                ImageUrl = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
                ButtonText = "Explore Ethnic Wear",
                LinkUrl = "/products?category=ethnic-wear",
                DisplayOrder = 2,
                IsActive = true
            };

            var boysBanner = new Banner
            {
                Title = "Trendy Boys Collection",
                Subtitle = "Comfort Meets Style",
                ImageUrl = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80",
                ButtonText = "Shop Boys",
                LinkUrl = "/products?category=boys",
                DisplayOrder = 3,
                IsActive = true
            };

            context.Banners.AddRange(heroBanner, ethnicBanner, boysBanner);
            await context.SaveChangesAsync();
        }
    }
}


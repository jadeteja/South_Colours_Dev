# South Colours Kids E-Commerce Platform — Architecture & Blueprint

## 1. Visual Reference Analysis (From Attached Design)

Based on the 8 core screens in the design reference:
1. **Header & Navigation**: Sticky clean white header with logo (hot pink typography + flower petal motif), search bar with rounded pill inputs, top nav (`Girls`, `Boys`, `Baby Wear`, `Ethnic Wear`, `New Arrivals`, `Offers`), action icons (`Search`, `Profile`, `Wishlist`, `Cart` with badge count).
2. **Branding & Palette**:
   - **Primary Pink**: `#FF4081` / `#E91E63`
   - **Soft Pink / Background**: `#FFF0F5` / `#FFF5F8`
   - **Blush / Accent Pink**: `#FFD6E7`
   - **Dark Navy**: `#18263B` (Admin sidebar, text emphasis)
   - **Text Gray**: `#666666`
   - **Border Pink**: `#F3DCE5`
   - **Success Green**: `#28A745` / `#10B981`
3. **Typography & Card System**: Rounded pill tags, circular category avatars with pastel backgrounds, card drop-shadows with subtle pink borders, star rating stars in gold/amber.
4. **8 Key Customer & Admin Views**:
   - **1. Homepage**: Hero banner with baby model, playful pink floral background, category circles, festive ethnic banner, boys collection banner, featured grids.
   - **2. Category / Product Listing**: Left sidebar filters (Category tree, Age Group checkboxes, Price Range slider, Color swatches), Sort dropdown, 3-column product cards with wishlist heart button, title, price, discount pill, star ratings.
   - **3. Product Details**: Thumbnails strip + large image preview, zoom, title, rating summary, price comparison (₹ selling vs ₹ original with % off), size selector pills, color circle swatches, quantity stepper, "Add to Cart" and "Buy Now" CTA buttons, Trust Badges (Easy Returns, Secure Payment, Quality Assurance, Fast Delivery), accordion tabs (Product Details, Specifications, Size Chart, Reviews).
   - **4. Cart Page**: Order summary slide/page with items list (image, title, size, qty stepper, remove), Coupon code input with "Apply", Price breakdown (Subtotal, Shipping free/calculated, Discount, Total), "Proceed to Checkout" button.
   - **5. Checkout Page**: Stepper layout with Delivery Address selection / "Add New Address", Payment Method options (Cards, UPI / GPay / PhonePe / Paytm, Net Banking, Cash on Delivery), sticky Order Summary.
   - **6. Order Confirmation Page**: Celebration illustration / baby icon, green checkmark, Order Number `#SC123456`, Date, Total Amount, "Continue Shopping" and "View My Orders".
   - **7. User Order History**: Left sidebar customer navigation (My Orders, My Profile, Addresses, Wishlist, Payments, Logout), Order cards with status pills (Delivered, Shipped, Processing), item thumbnails, order totals, "View Details" button.
   - **8. Admin Panel (Add Product)**: Dark navy sidebar (`#18263B`) with South Colours logo, rich form with Product Name, Rich Description, Category, Sub Category, Price, Discount Price, SKU, Stock Quantity, Size Options checkboxes, multi-image upload grid with preview thumbnails and "+ Add Images" button.

---

## 2. Solution Architecture

```
Southcolours/
├── backend/
│   ├── Southcolours.Domain/           # Entities, Enums, Value Objects, Domain Events
│   ├── Southcolours.Application/      # DTOs, Interfaces, CQRS / Service Handlers, Validators
│   ├── Southcolours.Infrastructure/   # Razorpay, Email, Local Image Storage, Google Auth Client
│   ├── Southcolours.Persistence/      # EF Core DbContext, Migrations, Entity Configurations, Seed Data
│   ├── Southcolours.API/              # Controllers, Middlewares, Program.cs, Swagger, JWT Auth
│   └── Southcolours.Tests/            # Unit & Integration Tests (xUnit, Moq, FluentAssertions)
├── frontend/
│   └── southcolours-angular/          # Angular 19+ Standalone, Tailwind CSS / SCSS, Signals, Routing
├── database/
│   └── scripts/                       # Migration SQL, Seeding Scripts
├── documentation/                     # Technical, API, and Deployment Guides
└── docker-compose.yml
```

---

## 3. Database Architecture (SQL Server)

- **SQL Server Instance Identified**: `.\SQLEXPRESS` (Microsoft SQL Server 2025 RTM)
- **Database Name**: `SouthColoursDb`
- **Core Entities & Tables**:
  - `AspNetUsers`, `AspNetRoles`, `AspNetUserRoles` (ASP.NET Core Identity)
  - `CustomerProfiles`, `CustomerAddresses`
  - `Categories`, `SubCategories`
  - `Products`, `ProductImages`, `Sizes`, `Colors`, `ProductVariants`
  - `Inventories`, `InventoryReservations`, `StockMovements`
  - `ShoppingCarts`, `CartItems`, `Wishlists`, `WishlistItems`
  - `Orders`, `OrderItems`, `OrderStatusHistories`
  - `Payments`, `PaymentEvents`, `PaymentRefunds`
  - `Shipments`, `ShipmentTrackingEvents`
  - `Coupons`, `CouponRedemptions`
  - `ProductReviews`, `ReviewImages`
  - `Banners`, `AuditLogs`, `ApplicationSettings`

---

## 4. Phased Implementation Roadmap

- [x] **Discovery & Environment Inspection**: .NET 10 SDK, Node 24, npm 11, SQL Server 2025 Express confirmed.
- [ ] **Phase 1: Project Foundation & Solution Scaffolding**
  - Create .NET Clean Architecture solution & projects.
  - Setup Angular Standalone frontend with Tailwind CSS & Pink/Navy Theme tokens.
  - Configure EF Core DbContext with `.\SQLEXPRESS` connection string and base entities.
- [ ] **Phase 2: Product Catalog & Visual Customer Experience**
  - Seed rich realistic kids clothing products (Girls Ethnic Wear, Boys Kurtas, Baby Wear, Lehengas).
  - Implement Customer Layout, Sticky Navigation, Flower petal brand styling.
  - Build Homepage matching Screen 1.
  - Build Category / Product Listing with filters matching Screen 2.
  - Build Product Details with variant selection matching Screen 3.
- [ ] **Phase 3: Authentication & Customer Profile**
  - ASP.NET Core Identity with JWT Access & Refresh Tokens.
  - Google Sign-In backend verification & token flow.
  - Customer Profile, Addresses management, Wishlist.
- [ ] **Phase 4: Cart, Checkout & Razorpay Payment Gateway**
  - Server-side shopping cart revalidation & guest/auth merging.
  - Address selection & coupon redemption logic.
  - Razorpay order creation, frontend checkout SDK modal, HMAC-SHA256 signature verification & Webhook endpoint.
  - Order Confirmation screen matching Screen 6.
- [ ] **Phase 5: Order Lifecycle, Shipping & Fulfillment**
  - Customer order history matching Screen 7.
  - Shipment tracking & courier assignment.
  - Cancellations, returns, and inventory restoration.
- [ ] **Phase 6: Admin Dashboard & Product Management**
  - Admin layout (Dark Navy sidebar `#18263B` + Pink accents).
  - Add / Edit Product screen with multi-image upload & variants matching Screen 8.
  - Orders fulfillment, inventory stock adjustments, reviews moderation.
- [ ] **Phase 7: Analytics, Reports & Exports**
  - KPI cards & interactive charts (Sales, Revenue, Category distribution).
  - Excel (.xlsx) / CSV / PDF export services.
- [ ] **Phase 8: Tests, Production Hardening & Documentation**
  - Unit & Integration tests.
  - Complete documentation markdown suite.


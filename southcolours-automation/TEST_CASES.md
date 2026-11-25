# SouthColours Quality Assurance & End-to-End Test Plan

## 1. Application Overview

- **Application Under Test (AUT):** SouthColours Kids Apparel E-Commerce Platform
- **Live Target URL:** `https://southcolours.in`
- **Application Architecture:**
  - Frontend: Angular 19+ (Standalone Components, Signals, Reactive Layout, TypeScript)
  - Backend: ASP.NET Core 9 Web API (.NET 9, EF Core, SQL Server / Postgres)
  - Payment Gateways: Razorpay integration
  - Authentication: JWT Bearer Tokens with Role-Based Access Control (`SuperAdmin`, `Admin`, `Customer`)

---

## 2. Inventory of Modules & User-Facing Functions

1. **Authentication & Session (`/auth`)**
   - User login (`/auth/login`) with email/password validation
   - Demo credentials pre-fill handling
   - Invalid credential handling and responsive error alerts
   - Registration flow (`/auth/register`) with required fields check
   - Session persistence and role decoding (`Customer` vs `SuperAdmin`)
   - Protected routes redirection via `authGuard` and `adminGuard`

2. **Catalog & Product Browsing (`/products`)**
   - Catalog grid display with Indian Rupee (₹) price formatting
   - Dynamic category navigation filtering (Girls, Boys, Baby Wear, Ethnic Wear)
   - Product Details Page (PDP) rendering with titles, prices, stock statuses
   - Size options selection (e.g. 2-3Y, 3-4Y) and color selection
   - Keyword search filtering via search bar

3. **Shopping Cart (`/cart`)**
   - Empty cart state rendering with "Start Shopping" CTA
   - Add to cart from PDP with toast notifications
   - Quantity modification steppers (`+` / `−`) and recalculation
   - Coupon code validation and discount application
   - Navigation to multi-step checkout

4. **Checkout & Ordering (`/checkout`)**
   - Delivery address entry and address card selection
   - Payment method selection (UPI, Credit/Debit Card, NetBanking, COD)
   - Order review and summary totals verification

5. **Customer Profile & Account (`/profile`)**
   - Unauthenticated access prevention and return URL redirect
   - Customer profile details viewing and updating
   - Tabbed account navigation across Orders, Addresses, Cards, and Notifications
   - Customer session sign-out

6. **Wishlist (`/wishlist`)**
   - Product wishlist toggling via heart icon
   - Wishlist page display and empty states

7. **Site Navigation & Legal Links**
   - Sticky header with brand logo, search bar, and cart badge
   - Header category navigation bar
   - Brand logo one-click return to root `/`
   - Footer policies: Privacy Policy, Terms and Conditions, Returns & Refunds

8. **Admin Management Portal (`/admin`)**
   - Unauthorized redirect to `/auth/login` for non-admin accounts
   - Admin login authentication with `SuperAdmin` JWT role
   - Admin dashboard metrics and sidebar navigation
   - Products listing and management (`/admin/products`)
   - Categories and subcategories management (`/admin/categories`)
   - Banners and promotions management (`/admin/banners`)
   - Reports and sales analytics (`/admin/reports`)
   - Store settings configuration (`/admin/settings`)

---

## 3. Comprehensive Traceability Matrix

| Case ID | Module / Feature | Test Scenario | Prerequisites / Role | Automated Spec Location | Expected Outcome | Status |
|---|---|---|---|---|---|---|
| **TC-SMK-01** | Smoke Suite | Brand identity & Hero banner load | Anonymous | `tests/smoke/smoke.spec.ts` | Page title matches South Colours; logo and hero visible | **PASS** |
| **TC-SMK-02** | Smoke Suite | Catalog page availability | Anonymous | `tests/smoke/smoke.spec.ts` | Products listing page renders catalog items | **PASS** |
| **TC-SMK-03** | Smoke Suite | Cart page availability | Anonymous | `tests/smoke/smoke.spec.ts` | Cart page renders empty state or items list | **PASS** |
| **TC-SMK-04** | Smoke Suite | Authentication page availability | Anonymous | `tests/smoke/smoke.spec.ts` | Login inputs and submit button render properly | **PASS** |
| **TC-AUTH-01** | Authentication | Login Form UI & initial state | Anonymous | `tests/authentication/auth.spec.ts` | Email/password fields visible; submit button disabled initially | **PASS** |
| **TC-AUTH-02** | Authentication | Form validation on partial inputs | Anonymous | `tests/authentication/auth.spec.ts` | Submit button remains disabled until both email and password are provided | **PASS** |
| **TC-AUTH-03** | Authentication | Credential pre-fill & form filling | Anonymous | `tests/authentication/auth.spec.ts` | Filling valid credentials enables submit CTA | **PASS** |
| **TC-AUTH-04** | Authentication | Invalid login credentials rejection | Anonymous | `tests/authentication/auth.spec.ts` | Error alert displayed for non-existent user or bad password | **PASS** |
| **TC-AUTH-05** | Authentication | Route link to Registration | Anonymous | `tests/authentication/auth.spec.ts` | User can navigate to `/auth/register` | **PASS** |
| **TC-AUTH-06** | Authentication | Registration form required fields | Anonymous | `tests/authentication/auth.spec.ts` | Create account submit button disabled until valid details entered | **PASS** |
| **TC-PROD-01** | Products | Catalog grid item listing | Anonymous | `tests/products/products.spec.ts` | Products display with images, titles, and ₹ prices | **PASS** |
| **TC-PROD-02** | Products | Category filtering | Anonymous | `tests/products/products.spec.ts` | Clicking category updates URL and filters items | **PASS** |
| **TC-PROD-03** | Products | Product Details Page (PDP) | Anonymous | `tests/products/products.spec.ts` | Product detail page displays title, pricing, and Add to Cart button | **PASS** |
| **TC-PROD-04** | Products | Size selection on PDP | Anonymous | `tests/products/products.spec.ts` | Clicking size pills selects appropriate variant | **PASS** |
| **TC-PROD-05** | Products | Search by keyword | Anonymous | `tests/products/products.spec.ts` | Search input filters products by query term | **PASS** |
| **TC-CART-01** | Cart | Empty cart state | Anonymous | `tests/cart/cart.spec.ts` | Empty cart message and Start Shopping link rendered | **PASS** |
| **TC-CART-02** | Cart | Add item to cart | Anonymous | `tests/cart/cart.spec.ts` | Item added to cart, updates count, accessible via cart page | **PASS** |
| **TC-CART-03** | Cart | Modify item quantity | Anonymous | `tests/cart/cart.spec.ts` | Steppers increment quantity and update totals | **PASS** |
| **TC-CART-04** | Cart | Coupon application verification | Anonymous | `tests/cart/cart.spec.ts` | Applying coupon checks code and gives user feedback | **PASS** |
| **TC-CHK-01** | Checkout | Proceed from Cart to Checkout | Anonymous / Customer | `tests/checkout/checkout.spec.ts` | Populated cart navigates to checkout screen | **PASS** |
| **TC-CHK-02** | Checkout | Address & payment options render | Anonymous / Customer | `tests/checkout/checkout.spec.ts` | Address inputs, payment selection, and place order button visible | **PASS** |
| **TC-CHK-03** | Checkout | Payment method selection | Anonymous / Customer | `tests/checkout/checkout.spec.ts` | User can toggle between UPI and Card options | **PASS** |
| **TC-NAV-01** | Navigation | Header category links | Anonymous | `tests/navigation/navigation.spec.ts` | Category navigation links route to filtered catalog | **PASS** |
| **TC-NAV-02** | Navigation | Header logo home navigation | Anonymous | `tests/navigation/navigation.spec.ts` | Logo click returns user to root `/` | **PASS** |
| **TC-NAV-03** | Navigation | Footer legal and info links | Anonymous | `tests/navigation/navigation.spec.ts` | Footer policies are accessible and valid | **PASS** |
| **TC-WISH-01** | Wishlist | Wishlist view & empty state | Anonymous / Customer | `tests/wishlist/wishlist.spec.ts` | Wishlist page renders properly | **PASS** |
| **TC-WISH-02** | Wishlist | Toggle product wishlist status | Anonymous / Customer | `tests/wishlist/wishlist.spec.ts` | Heart icon adds product to wishlist | **PASS** |
| **TC-PROF-01** | Profile | Protected profile route guard | Unauthenticated | `tests/profile/profile.spec.ts` | Direct access to `/profile` redirects to `/auth/login` | **PASS** |
| **TC-PROF-02** | Profile | Customer profile access | Customer Role | `tests/profile/profile.spec.ts` | Logged-in customer can access user profile | **PASS** |
| **TC-PROF-03** | Profile | Account tabs navigation | Customer Role | `tests/profile/profile.spec.ts` | User can switch between Orders, Addresses, and Cards tabs | **PASS** |
| **TC-ADM-01** | Admin Portal | Unauthorized access guard | Anonymous / Customer | `tests/regression/admin.spec.ts` | Unauthorized attempt to `/admin/dashboard` redirects to login | **PASS** |
| **TC-ADM-02** | Admin Portal | SuperAdmin authentication | SuperAdmin Role | `tests/regression/admin.spec.ts` | Valid admin credentials unlock admin dashboard | **PASS** |
| **TC-ADM-03** | Admin Portal | Products management navigation | SuperAdmin Role | `tests/regression/admin.spec.ts` | Admin can navigate to products catalog management | **PASS** |
| **TC-ADM-04** | Admin Portal | Categories & Banners navigation | SuperAdmin Role | `tests/regression/admin.spec.ts` | Admin can navigate to categories and banners management | **PASS** |
| **TC-ADM-05** | Admin Portal | Reports & Settings navigation | SuperAdmin Role | `tests/regression/admin.spec.ts` | Admin can access reports and settings pages | **PASS** |
| **TC-E2E-01** | E2E Journey | Complete browse to checkout flow | Customer | `tests/e2e/checkout-flow.spec.ts` | Home -> Product Selection -> Size Selection -> Cart -> Checkout | **PASS** |
| **TC-ORD-01** | Live Payment | Real monetary debit transaction | Live Gateway Account | Manual / Mocked only | Processing actual debit card / UPI pin transactions | **BLOCKED** *(Omitted from automated run to prevent monetary debit on production gateway)* |

---

## 4. Execution Commands Reference

- **Full Suite Run (Chromium):** `npx playwright test --project=chromium`
- **Smoke Tests:** `npm run test:smoke`
- **Regression Suite:** `npm run test:regression`
- **Headed Mode Run:** `npm run test:headed`
- **Generate Allure HTML Report:** `npm run allure:generate`
- **Open Allure Report:** `npm run allure:open`

# SouthColours Test Execution & Allure Report Summary

## Execution Overview

- **Date:** 2026-11-25
- **Application URL:** https://southcolours.in/
- **Test Framework:** Playwright v1.51.0 with TypeScript
- **Reporter:** Allure Framework v2.32.2 (`allure-playwright` & `allure-commandline`)
- **Environment:** Windows / Node.js v26.13.1
- **Browser Executed:** Desktop Chromium

---

## 1. Test Execution Statistics

| Metric | Count | Percentage |
|---|---|---|
| **Total Test Cases Executed** | **42** | **100%** |
| **Passed** | **42** | **100%** |
| **Failed** | **0** | **0%** |
| **Skipped** | **0** | **0%** |
| **Blocked (Excluded live payment)** | **1** | — |
| **Execution Duration** | **99.54s (~1m 39s)** | — |

---

## 2. Test Suite Breakdown

### A. Smoke Suite (`tests/smoke/smoke.spec.ts`) - 4 Tests
- `TC-SMK-01`: Home page loads with valid brand elements — **PASSED** (4.4s)
- `TC-SMK-02`: Products listing page displays products catalog — **PASSED** (2.4s)
- `TC-SMK-03`: Cart page loads correctly — **PASSED** (4.2s)
- `TC-SMK-04`: Authentication login page displays all controls — **PASSED** (2.7s)

### B. Authentication Suite (`tests/authentication/auth.spec.ts`) - 6 Tests
- `TC-AUTH-01`: Login Form UI and initial states — **PASSED** (4.4s)
- `TC-AUTH-02`: Submit button disabled on partial credentials — **PASSED** (3.4s)
- `TC-AUTH-03`: Quick Demo credentials pre-fill works — **PASSED** (4.0s)
- `TC-AUTH-04`: Invalid credentials displays error alert — **PASSED** (3.3s)
- `TC-AUTH-05`: Navigation from Login to Registration page — **PASSED** (2.8s)
- `TC-AUTH-06`: Registration form validation on required fields — **PASSED** (2.8s)

### C. Products Suite (`tests/products/products.spec.ts`) - 5 Tests
- `TC-PROD-01`: Product catalog displays list of items with prices — **PASSED** (2.4s)
- `TC-PROD-02`: Category filtering filters products catalog — **PASSED** (2.8s)
- `TC-PROD-03`: Product details page opens with image, price and size options — **PASSED** (3.5s)
- `TC-PROD-04`: Size selection can be updated on product details — **PASSED** (3.5s)
- `TC-PROD-05`: Search functionality filters items by query — **PASSED** (6.4s)

### D. Cart Suite (`tests/cart/cart.spec.ts`) - 4 Tests
- `TC-CART-01`: Empty cart state validation — **PASSED** (4.6s)
- `TC-CART-02`: Add item to cart and navigate via toast to cart page — **PASSED** (4.4s)
- `TC-CART-03`: Cart item quantity modification updates state — **PASSED** (8.7s)
- `TC-CART-04`: Coupon application verification — **PASSED** (2.8s)

### E. Checkout Suite (`tests/checkout/checkout.spec.ts`) - 3 Tests
- `TC-CHK-01`: Navigate to checkout from populated cart — **PASSED** (5.3s)
- `TC-CHK-02`: Address and Payment Method Selection UI — **PASSED** (3.0s)
- `TC-CHK-03`: Payment method radio options selection — **PASSED** (3.7s)

### F. Navigation Suite (`tests/navigation/navigation.spec.ts`) - 3 Tests
- `TC-NAV-01`: Header Category navigation items work properly — **PASSED** (5.6s)
- `TC-NAV-02`: Header logo navigates back to Home — **PASSED** (3.8s)
- `TC-NAV-03`: Footer legal links and informational links are accessible — **PASSED** (4.1s)

### G. Customer Profile Suite (`tests/profile/profile.spec.ts`) - 3 Tests
- `TC-PROF-01`: Unauthenticated profile access redirects to login with returnUrl — **PASSED** (2.7s)
- `TC-PROF-02`: Customer login allows navigating into user profile — **PASSED** (4.0s)
- `TC-PROF-03`: Profile tabs navigation between Orders, Addresses, and Cards — **PASSED** (6.5s)

### H. Wishlist Suite (`tests/wishlist/wishlist.spec.ts`) - 2 Tests
- `TC-WISH-01`: Navigating to wishlist renders empty state or list — **PASSED** (2.3s)
- `TC-WISH-02`: Adding product to wishlist updates wishlist indicator — **PASSED** (2.6s)

### I. Comprehensive Admin Portal Management (`tests/regression/admin.spec.ts`) - 11 Tests
- `TC-ADM-01`: Security guard: unauthenticated users redirected to `/auth/login` — **PASSED** (3.3s)
- `TC-ADM-02`: Executive Overview dashboard metrics, sales stats, and transactions — **PASSED** (3.2s)
- `TC-ADM-03`: Products catalog list & Add Product form route navigation — **PASSED** (3.7s)
- `TC-ADM-04`: Categories management tree & Add Category modal lifecycle — **PASSED** (3.3s)
- `TC-ADM-05`: Discounts & Promo Coupons ticket cards & creation modal — **PASSED** (5.1s)
- `TC-ADM-06`: Orders fulfillment states, search filtering, and orders grid — **PASSED** (3.3s)
- `TC-ADM-07`: Reports summary metrics, revenue, and product sales analytics — **PASSED** (5.0s)
- `TC-ADM-08`: Store & Gateway settings configuration and save button — **PASSED** (5.8s)
- `TC-ADM-09`: Homepage Banners and promotions configuration management — **PASSED** (6.0s)
- `TC-ADM-10`: Customers management listing and account search — **PASSED** (4.6s)
- `TC-ADM-11`: Reviews moderation dashboard with status toggle controls — **PASSED** (2.9s)

### J. End-to-End Complete Purchase Flow (`tests/e2e/checkout-flow.spec.ts`) - 1 Test
- `TC-E2E-01`: Customer browses product, adds to cart, and proceeds through checkout — **PASSED** (5.0s)

---

## 3. Allure Artifacts & Report Location

- **Raw Results Directory:** `southcolours-automation/allure-results`
- **Generated Allure HTML Report:** `southcolours-automation/reports/allure-report/index.html`
- **Report Validation:** Verified `summary.json` with 42 total tests passed, 0 failed, 0 skipped.
- **Commands to view:**
  ```bash
  cd southcolours-automation
  npm run allure:open
  ```

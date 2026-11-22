# SouthColours Test Execution Report

## Execution Summary

- **Execution Date:** 2026-11-22
- **Application URL:** https://southcolours.in/
- **Test Runner:** Playwright Test v1.51.0
- **Language / Environment:** TypeScript / Node.js v26.13.1 (Windows)
- **Reporter:** Allure Playwright & Allure CLI

---

## 1. Test Execution Statistics

| Project / Browser | Tests Executed | Passed | Failed | Skipped | Pass Rate | Execution Time |
|---|---|---|---|---|---|---|
| **Chromium (Desktop)** | 26 | 26 | 0 | 0 | **100%** | ~53s |
| **Firefox (Desktop)** | 4 (Smoke) | 4 | 0 | 0 | **100%** | ~22s |
| **Total Automated** | **30** | **30** | **0** | **0** | **100%** | **~1m 15s** |

---

## 2. Test Suite Breakdown

### A. Smoke Test Suite (`tests/smoke/`)
- `TC-SMK-01`: Home page loads with valid brand elements — **PASSED**
- `TC-SMK-02`: Products listing page displays products catalog — **PASSED**
- `TC-SMK-03`: Cart page loads correctly — **PASSED**
- `TC-SMK-04`: Authentication login page displays all controls — **PASSED**

### B. Authentication Suite (`tests/authentication/`)
- `TC-AUTH-01`: Login Form UI and initial states — **PASSED**
- `TC-AUTH-02`: Submit button disabled on partial credentials — **PASSED**
- `TC-AUTH-03`: Quick Demo credentials pre-fill works — **PASSED**
- `TC-AUTH-04`: Invalid credentials displays error alert — **PASSED**
- `TC-AUTH-05`: Navigation from Login to Registration page — **PASSED**
- `TC-AUTH-06`: Registration form validation on required fields — **PASSED**

### C. Products Suite (`tests/products/`)
- `TC-PROD-01`: Product catalog displays list of items with prices — **PASSED**
- `TC-PROD-02`: Category filtering filters products catalog — **PASSED**
- `TC-PROD-03`: Product details page opens with image, price and size options — **PASSED**
- `TC-PROD-04`: Size selection can be updated on product details — **PASSED**
- `TC-PROD-05`: Search functionality filters items by query — **PASSED**

### D. Cart Suite (`tests/cart/`)
- `TC-CART-01`: Empty cart state validation — **PASSED**
- `TC-CART-02`: Add item to cart and navigate via toast to cart page — **PASSED**
- `TC-CART-03`: Cart item quantity modification updates state — **PASSED**
- `TC-CART-04`: Coupon application verification — **PASSED**

### E. Checkout Suite (`tests/checkout/`)
- `TC-CHK-01`: Navigate to checkout from populated cart — **PASSED**
- `TC-CHK-02`: Address and Payment Method Selection UI — **PASSED**
- `TC-CHK-03`: Payment method radio options selection — **PASSED**

### F. Navigation Suite (`tests/navigation/`)
- `TC-NAV-01`: Header Category navigation items work properly — **PASSED**
- `TC-NAV-02`: Header logo navigates back to Home — **PASSED**
- `TC-NAV-03`: Footer legal links and informational links are accessible — **PASSED**

### G. E2E Purchase Journey (`tests/e2e/`)
- `TC-E2E-01`: Customer browses product, adds to cart, and proceeds through checkout — **PASSED**

---

## 3. Allure Reporting Artifacts

- Allure Results directory: `reports/allure-results`
- Generated HTML Report directory: `reports/allure-report`
- Report entry point: `reports/allure-report/index.html`

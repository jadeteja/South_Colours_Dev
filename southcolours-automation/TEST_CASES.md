# SouthColours Test Case Documentation

## Test Suite Summary

- **Application Under Test:** https://southcolours.in/
- **Target Audience:** Kids apparel and ethnic wear e-commerce customers & administrators.
- **Automation Framework:** Playwright TypeScript with POM & Allure Reporter.

---

| Test Case ID | Test Scenario | Description | Priority | Automated | Status |
|---|---|---|---|---|---|
| **TC-SMK-01** | Home Page Verification | Verify home page loads with valid brand logo, title, and hero section | High | Yes | **PASS** |
| **TC-SMK-02** | Catalog Listing Load | Verify products listing page loads and renders product cards | High | Yes | **PASS** |
| **TC-SMK-03** | Cart Page Load | Verify cart page loads with items list or empty cart placeholder | High | Yes | **PASS** |
| **TC-SMK-04** | Authentication UI Load | Verify login page renders inputs, submit button, and quick-fill chips | High | Yes | **PASS** |
| **TC-AUTH-01**| Login Form UI & States | Verify email/password input fields and disabled submit button on empty form | Medium | Yes | **PASS** |
| **TC-AUTH-02**| Login Form Field Validation | Verify submit button remains disabled when only partial credentials are provided | Medium | Yes | **PASS** |
| **TC-AUTH-03**| Quick Demo Pre-fill | Verify clicking "Admin Login" or "Customer Login" demo chips populates valid credentials | Medium | Yes | **PASS** |
| **TC-AUTH-04**| Invalid Login Validation | Verify error alert appears when submitting invalid credentials | High | Yes | **PASS** |
| **TC-AUTH-05**| Login to Registration Route | Verify user can navigate from Login to Create Account page | Medium | Yes | **PASS** |
| **TC-AUTH-06**| Registration Mandatory Fields | Verify registration submit button enables only when mandatory fields are populated | Medium | Yes | **PASS** |
| **TC-PROD-01**| Product Catalog Grid | Verify product items display with titles, images, and prices in Indian Rupees | High | Yes | **PASS** |
| **TC-PROD-02**| Category Navigation Filter | Verify clicking category ("Boys", "Girls", "Ethnic Wear") filters catalog appropriately | High | Yes | **PASS** |
| **TC-PROD-03**| Product Details Page (PDP) | Verify PDP displays product title, original/discounted prices, and Add to Cart CTA | High | Yes | **PASS** |
| **TC-PROD-04**| Size & Color Selection | Verify selecting sizes and colors updates selection state on PDP | Medium | Yes | **PASS** |
| **TC-PROD-05**| Product Search | Verify search bar submits queries and filters products by keyword | Medium | Yes | **PASS** |
| **TC-CART-01**| Empty Cart State | Verify clearing cart shows "Your Cart is Empty" message and "Start Shopping" button | Medium | Yes | **PASS** |
| **TC-CART-02**| Add Product to Cart | Verify adding item from PDP updates cart item count and reflects item in Cart | High | Yes | **PASS** |
| **TC-CART-03**| Modify Item Quantity | Verify clicking '+' stepper increases item quantity and recalculates totals | High | Yes | **PASS** |
| **TC-CART-04**| Apply Coupon Code | Verify applying invalid coupon shows validation feedback message | Medium | Yes | **PASS** |
| **TC-CHK-01** | Proceed to Checkout | Verify navigating from populated cart to checkout loads step-by-step checkout UI | High | Yes | **PASS** |
| **TC-CHK-02** | Checkout Step Verification | Verify delivery address and payment methods section are rendered | High | Yes | **PASS** |
| **TC-CHK-03** | Payment Method Selection | Verify switching between UPI, Credit/Debit Card, and NetBanking radio selections | High | Yes | **PASS** |
| **TC-NAV-01** | Header Navigation Bar | Verify header links route to respective category catalog pages | Medium | Yes | **PASS** |
| **TC-NAV-02** | Brand Logo Navigation | Verify clicking SouthColours logo returns user to root `/` home page | Medium | Yes | **PASS** |
| **TC-NAV-03** | Footer Policy Links | Verify footer renders Terms of Service and Privacy Policy links | Low | Yes | **PASS** |
| **TC-E2E-01**  | Complete Purchase Flow | Verify customer browses from Home -> selects PDP -> adds size to Cart -> navigates to Checkout | Critical | Yes | **PASS** |
| **TC-ORD-01**  | Live Payment Processing | Authorizing live credit card / UPI gateway debit | Critical | No | **BLOCKED** *(Payment gateway requires live banking credentials; avoided to protect production transactions)* |

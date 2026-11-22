# SouthColours Bug & Observations Report

## Summary

During comprehensive manual exploration and end-to-end automated testing of https://southcolours.in/, the following functional and UI/UX observations were identified.

---

### BUG-01: In-Memory Cart State Cleared on Hard Page Refresh

- **Severity:** Medium
- **Component:** Shopping Cart (`ShopService` / Angular Signals)
- **Preconditions:** Customer navigates to https://southcolours.in/products and adds an item to cart.
- **Steps to Reproduce:**
  1. Open https://southcolours.in/products/festive-gown
  2. Select size (e.g. `2-3Y`) and click **Add to Cart**.
  3. Notice cart badge updates to `1`.
  4. Perform a browser hard refresh (`F5` or `Ctrl+R`) on `/cart`.
- **Expected Result:** Cart items should persist across sessions using `localStorage` or backend cart synchronisation.
- **Actual Result:** Cart items reset to `0` and empty cart state is displayed because cart state is stored only in memory (`signal<CartItemModel[]>([])`).
- **Remediation Suggestion:** Synchronize the `cartItems` Angular signal with `localStorage` or sync with the backend customer session.

---

### BUG-02: Missing Client-Side Form Validation Feedback on Auth Login

- **Severity:** Low
- **Component:** Authentication (`/auth/login`)
- **Preconditions:** Customer navigates to `/auth/login`.
- **Steps to Reproduce:**
  1. Enter an invalid email format (e.g. `abc` without `@domain`).
  2. Enter a password.
- **Expected Result:** Inline validation message prompting the user for a valid email format.
- **Actual Result:** The submit button remains enabled or silent without user-friendly field-level error messages until submitted.
- **Remediation Suggestion:** Add explicit Angular form control error messages (`email.invalid && email.touched`) below the input fields.

---

### OBS-01: Payment Gateway Sandboxing Requirement

- **Category:** Environment / Security
- **Observation:** Live payment options (Razorpay/UPI) are wired to production endpoints. Automated tests intentionally halt at the Checkout confirmation stage to avoid placing non-sandbox real monetary transactions against live payment providers.

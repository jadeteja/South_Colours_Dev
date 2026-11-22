import { test, expect } from '../../fixtures/testFixtures';

test.describe('Cart Suite - Add, Quantity Update & Persistence', () => {
  test('TC-CART-01: Empty cart state validation', async ({ cartPage, page }) => {
    await cartPage.openCartPage();
    await cartPage.clearCart();
    await expect(cartPage.emptyCartState).toBeVisible();
    await expect(cartPage.startShoppingBtn).toBeVisible();
  });

  test('TC-CART-02: Add item to cart and navigate via toast to cart page', async ({ productPage, cartPage, page }) => {
    await productPage.openListingPage();
    await productPage.selectFirstProduct();
    await productPage.selectSize();
    await productPage.addToCart();

    // Click 'View Cart' toast action or direct header navigation to ensure SPA routing context
    await productPage.clickToastViewCart();
    await expect(page).toHaveURL(/.*cart/);

    const count = await cartPage.cartItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
    await expect(cartPage.checkoutBtn).toBeVisible();
  });

  test('TC-CART-03: Cart item quantity modification updates state', async ({ productPage, cartPage }) => {
    await productPage.openListingPage();
    await productPage.selectFirstProduct();
    await productPage.selectSize();
    await productPage.addToCart();
    await productPage.clickToastViewCart();

    const itemCount = await cartPage.cartItems.count();
    if (itemCount > 0) {
      const initialQty = await cartPage.page.locator('.stepper .qty-num').first().textContent();
      await cartPage.stepPlusButtons.first().click();
      await cartPage.page.waitForTimeout(500);
      const updatedQty = await cartPage.page.locator('.stepper .qty-num').first().textContent();
      expect(Number(updatedQty)).toBeGreaterThan(Number(initialQty));
    }
  });

  test('TC-CART-04: Coupon application verification', async ({ cartPage }) => {
    await cartPage.openCartPage();
    await cartPage.applyCoupon('INVALIDCOUPON999');
    await expect(cartPage.couponMessage).toBeVisible();
  });
});

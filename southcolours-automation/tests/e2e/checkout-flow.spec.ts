import { test, expect } from '../../fixtures/testFixtures';

test.describe('E2E Complete Purchase Flow', () => {
  test('TC-E2E-01: Customer browses product, adds to cart, and proceeds through checkout', async ({
    homePage,
    productPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    // 1. Visit Home
    await homePage.openHomePage();
    await expect(homePage.headerLogo).toBeVisible();

    // 2. Click Shop Now or Browse Products
    await homePage.clickHeroShopNow();
    await expect(page).toHaveURL(/.*products/);

    // 3. Select first product
    await productPage.selectFirstProduct();
    await expect(page).toHaveURL(/.*products\/.+/);

    // 4. Select size and add to cart
    await productPage.selectSize();
    await productPage.addToCart();

    // 5. Open Cart via Toast / Header navigation
    await productPage.clickToastViewCart();
    await expect(page).toHaveURL(/.*cart/);
    await expect(cartPage.cartItems.first()).toBeVisible();

    // 6. Proceed to Checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout/);
    await expect(checkoutPage.placeOrderBtn).toBeVisible();
  });
});

import { test, expect } from '../../fixtures/testFixtures';

test.describe('Checkout Suite - Flow, Delivery Details & Payment', () => {
  test('TC-CHK-01: Navigate to checkout from populated cart', async ({ productPage, cartPage, checkoutPage, page }) => {
    await productPage.openListingPage();
    await productPage.selectFirstProduct();
    await productPage.selectSize();
    await productPage.addToCart();

    await productPage.clickToastViewCart();
    await expect(page).toHaveURL(/.*cart/);
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout/);
    await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
  });

  test('TC-CHK-02: Address and Payment Method Selection UI', async ({ checkoutPage, page }) => {
    await checkoutPage.openCheckoutPage();
    await expect(checkoutPage.addNewAddressBtn).toBeVisible();
    await expect(page.locator('text=Payment Method')).toBeVisible();
    await expect(checkoutPage.placeOrderBtn).toBeVisible();
  });

  test('TC-CHK-03: Payment method radio options selection', async ({ checkoutPage }) => {
    await checkoutPage.openCheckoutPage();
    await checkoutPage.selectPayment('upi');
    await checkoutPage.page.waitForTimeout(300);
    await checkoutPage.selectPayment('card');
    await checkoutPage.page.waitForTimeout(300);
  });
});

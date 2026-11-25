import { test, expect } from '../../fixtures/testFixtures';

test.describe('Smoke Suite - Core Site Availability & Health', () => {
  test('TC-SMK-01: Home page loads with valid brand elements', async ({ homePage, page }) => {
    await homePage.openHomePage();
    await expect(page).toHaveTitle(/South\s*Colours/i);
    await expect(homePage.headerLogo).toBeVisible();
    await expect(homePage.heroSection).toBeVisible();
  });

  test('TC-SMK-02: Products listing page displays products catalog', async ({ productPage, page }) => {
    await productPage.openListingPage();
    await expect(page).toHaveURL(/.*products/);
    await expect(productPage.productHeadingLinks.first()).toBeVisible({ timeout: 15000 });
  });

  test('TC-SMK-03: Cart page loads correctly', async ({ cartPage, page }) => {
    await cartPage.openCartPage();
    await expect(page).toHaveURL(/.*cart/);
    // Either clear button (if items exist) or empty cart message should be in the DOM
    const isEmpty = await cartPage.emptyCartState.first().isVisible().catch(() => false);
    const hasClear = await cartPage.clearCartBtn.isVisible().catch(() => false);
    expect(isEmpty || hasClear).toBeTruthy();
  });

  test('TC-SMK-04: Authentication login page displays all controls', async ({ loginPage, page }) => {
    await loginPage.openLoginPage();
    await expect(page).toHaveURL(/.*auth\/login/);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitBtn).toBeVisible();
  });
});

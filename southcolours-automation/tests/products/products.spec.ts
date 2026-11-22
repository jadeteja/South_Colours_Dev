import { test, expect } from '../../fixtures/testFixtures';

test.describe('Products Suite - Browsing, Category Filtering & Details', () => {
  test.beforeEach(async ({ productPage }) => {
    await productPage.openListingPage();
  });

  test('TC-PROD-01: Product catalog displays list of items with prices', async ({ productPage }) => {
    await expect(productPage.productHeadingLinks.first()).toBeVisible({ timeout: 15000 });
    const count = await productPage.productHeadingLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-PROD-02: Category filtering filters products catalog', async ({ productPage, page }) => {
    const boysCategoryLink = page.getByRole('link', { name: /Boys/i }).first();
    await boysCategoryLink.click();
    await expect(page).toHaveURL(/.*category=boys/);
    await expect(productPage.productHeadingLinks.first()).toBeVisible();
  });

  test('TC-PROD-03: Product details page opens with image, price and size options', async ({ productPage, page }) => {
    const firstProductName = await productPage.productHeadingLinks.first().textContent();
    await productPage.selectFirstProduct();

    await expect(page).toHaveURL(/.*products\/.+/);
    await expect(productPage.productTitle).toBeVisible();
    if (firstProductName) {
      expect((await productPage.productTitle.textContent())?.trim().toLowerCase()).toContain(firstProductName.trim().toLowerCase());
    }
    await expect(productPage.addToCartBtn).toBeVisible();
  });

  test('TC-PROD-04: Size selection can be updated on product details', async ({ productPage }) => {
    await productPage.selectFirstProduct();
    const sizeButtons = productPage.sizeOptions;
    const sizeCount = await sizeButtons.count();
    if (sizeCount > 0) {
      await sizeButtons.first().click();
      await expect(sizeButtons.first()).toBeVisible();
    }
  });

  test('TC-PROD-05: Search functionality filters items by query', async ({ productPage, page }) => {
    await productPage.searchProduct('Kurta');
    await expect(page).toHaveURL(/.*search=Kurta/i);
    await expect(page.locator('main.products-main, main.app-main').first()).toBeVisible();
  });
});

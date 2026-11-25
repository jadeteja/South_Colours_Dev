import { test, expect } from '../../fixtures/testFixtures';

test.describe('Navigation Suite - Header, Footer & Category Links', () => {
  test('TC-NAV-01: Header Category navigation items work properly', async ({ homePage, page }) => {
    await homePage.openHomePage();
    const girlsLink = page.locator('header nav a[href*="category="], header nav a[href*="girls"]').first();
    await girlsLink.click();
    await expect(page).toHaveURL(/.*category=/);
  });

  test('TC-NAV-02: Header logo navigates back to Home', async ({ productPage, homePage, page }) => {
    await productPage.openListingPage();
    await homePage.clickLogo();
    await expect(page).toHaveURL(/.*southcolours\.in\/?$/);
  });

  test('TC-NAV-03: Footer legal links and informational links are accessible', async ({ homePage, page }) => {
    await homePage.openHomePage();
    await homePage.scrollToFooter();
    await expect(homePage.footer).toBeVisible();
    await expect(page.locator('footer a[href*="/privacy"], contentinfo a[href*="/privacy"]').first()).toBeVisible();
    await expect(page.locator('footer a[href*="/terms"], contentinfo a[href*="/terms"]').first()).toBeVisible();
  });
});

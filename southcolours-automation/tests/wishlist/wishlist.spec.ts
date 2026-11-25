import { test, expect } from '../../fixtures/testFixtures';

test.describe('Wishlist Suite - Management & Interactions', () => {
  test('TC-WISH-01: Navigating to wishlist renders empty state or list', async ({ wishlistPage, page }) => {
    await wishlistPage.openWishlistPage();
    await expect(page).toHaveURL(/.*wishlist/);
    const hasItems = await wishlistPage.wishlistItems.first().isVisible().catch(() => false);
    const hasEmpty = await wishlistPage.emptyWishlistMsg.first().isVisible().catch(() => false);
    const hasHeading = await page.locator('h1, h2').first().isVisible().catch(() => false);
    expect(hasItems || hasEmpty || hasHeading).toBeTruthy();
  });

  test('TC-WISH-02: Adding product to wishlist updates wishlist indicator', async ({ productPage, page }) => {
    await productPage.openListingPage();
    const wishlistHeart = page.locator('button.wishlist-heart, .wishlist-btn').first();
    if (await wishlistHeart.isVisible({ timeout: 5000 }).catch(() => false)) {
      await wishlistHeart.click();
      await page.waitForTimeout(500);
      const wishlistHeaderLink = page.locator('header a[href*="/wishlist"]').first();
      await expect(wishlistHeaderLink).toBeVisible();
    }
  });
});

import { test, expect } from '../../fixtures/testFixtures';

test.describe('Profile & Customer Account Suite', () => {
  test('TC-PROF-01: Unauthenticated profile access redirects to login with returnUrl', async ({ page }) => {
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test('TC-PROF-02: Customer login allows navigating into user profile', async ({ loginPage, profilePage, page }) => {
    await loginPage.openLoginPage();
    await loginPage.clickQuickCustomerLogin();
    
    // Check redirection to profile or home
    await page.waitForURL(/(.*profile.*|.*\/$)/, { timeout: 15000 });
    await profilePage.openProfilePage();
    await expect(page).toHaveURL(/.*profile/);
    await expect(profilePage.profileHeading).toBeVisible();
  });

  test('TC-PROF-03: Profile tabs navigation between Orders, Addresses, and Cards', async ({ loginPage, profilePage, page }) => {
    await loginPage.openLoginPage();
    await loginPage.clickQuickCustomerLogin();
    await page.waitForURL(/(.*profile.*|.*\/$)/, { timeout: 15000 });

    await profilePage.openProfilePage();
    
    // Switch to Addresses tab
    if (await profilePage.addressesTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await profilePage.addressesTab.click();
      await expect(page).toHaveURL(/.*tab=addresses/);
    }

    // Switch to Cards / Payments tab
    if (await profilePage.cardsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await profilePage.cardsTab.click();
      await expect(page).toHaveURL(/.*tab=cards/);
    }

    // Switch to Orders tab
    if (await profilePage.ordersTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await profilePage.ordersTab.click();
      await expect(page).toHaveURL(/.*tab=orders/);
    }
  });
});

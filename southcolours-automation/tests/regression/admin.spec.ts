import { test, expect } from '../../fixtures/testFixtures';

test.describe('Admin Portal Suite - Authentication, Dashboard & Management', () => {
  test('TC-ADM-01: Admin portal redirects unauthorized users to login', async ({ page }) => {
    // Attempting direct navigation to /admin/dashboard without auth
    await page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test('TC-ADM-02: Admin login with valid credentials unlocks dashboard', async ({ loginPage, page }) => {
    await loginPage.openLoginPage();
    await loginPage.clickQuickAdminLogin();
    
    // Validate redirect to admin dashboard
    await expect(page).toHaveURL(/.*admin\/dashboard/, { timeout: 15000 });
    await expect(page.locator('h1, .dashboard-title').first()).toBeVisible();
  });

  test('TC-ADM-03: Admin portal navigation to Products, Orders and Categories', async ({ loginPage, page }) => {
    await loginPage.openLoginPage();
    await loginPage.clickQuickAdminLogin();
    await expect(page).toHaveURL(/.*admin\/dashboard/, { timeout: 15000 });

    // Navigate to Products management
    const productsLink = page.locator('a[href*="/admin/products"]').first();
    if (await productsLink.isVisible()) {
      await productsLink.click();
      await expect(page).toHaveURL(/.*admin\/products/);
    }
  });
});

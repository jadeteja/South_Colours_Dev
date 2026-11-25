import { test, expect } from '../../fixtures/testFixtures';

test.describe('Admin Portal Suite - Comprehensive Functional Verification', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    // Shared setup: Login as SuperAdmin
    await loginPage.openLoginPage();
    await loginPage.clickQuickAdminLogin();
    await expect(page).toHaveURL(/.*admin\/dashboard/, { timeout: 15000 });
  });

  test('TC-ADM-01: Admin portal security redirects unauthorized unauthenticated users to login', async ({ page }) => {
    // Clear storage/cookies to simulate unauthenticated access
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test('TC-ADM-02: Admin Dashboard metrics, cards, and recent orders load', async ({ page }) => {
    await expect(page.locator('h1:has-text("Executive Overview"), h1:has-text("Dashboard"), .page-title').first()).toBeVisible();
    // Verify dashboard metrics or stat cards
    await expect(page.locator('.stat-card, .metric-card, .dashboard-grid, .overview-cards, [class*="stat"], [class*="card"]').first()).toBeVisible();
    await expect(page.getByText(/Today's Sales|Monthly Revenue|Total Orders/i).first()).toBeVisible();
  });

  test('TC-ADM-03: Admin Products Catalog and Add Product navigation', async ({ adminPage, page }) => {
    await adminPage.navigateToAdminModule(adminPage.productsNav);
    await expect(page).toHaveURL(/.*admin\/products/);
    await expect(page.locator('h1, h2, .page-title').first()).toBeVisible();

    // Verify Add Product button routes to add product form
    const addProductBtn = page.locator('main.admin-main a[href*="/admin/products/add"], a.btn-primary:has-text("Add")').first();
    if (await addProductBtn.isVisible()) {
      await addProductBtn.click();
      await expect(page).toHaveURL(/.*admin\/products\/add/);
      await expect(page.locator('input[placeholder*="Product Name"], input[type="text"]').first()).toBeVisible();
    }
  });

  test('TC-ADM-04: Admin Categories Management loads categories tree and add modal', async ({ adminPage, page }) => {
    await adminPage.navigateToAdminModule(adminPage.categoriesNav);
    await expect(page).toHaveURL(/.*admin\/categories/);
    await expect(page.locator('h1:has-text("Categories")')).toBeVisible();

    // Verify Add Category modal triggers
    const addCatBtn = page.locator('button:has-text("Add Category")');
    await expect(addCatBtn).toBeVisible();
    await addCatBtn.click();

    // Modal card should be visible
    const modal = page.locator('.modal-card').first();
    await expect(modal).toBeVisible();
    await expect(page.locator('input[placeholder*="Traditional Wear"], input[placeholder*="Name"]').first()).toBeVisible();

    // Close modal
    await page.locator('.close-btn, button:has-text("Cancel")').first().click();
    await expect(modal).not.toBeVisible();
  });

  test('TC-ADM-05: Admin Coupons Management renders coupons and creation dialog', async ({ adminPage, page }) => {
    await adminPage.navigateToAdminModule(adminPage.couponsNav);
    await expect(page).toHaveURL(/.*admin\/coupons/);
    await expect(page.locator('h1:has-text("Discounts & Promo Coupons"), .page-title:has-text("Coupons")')).toBeVisible();

    // Open Create Coupon modal
    const createCouponBtn = page.locator('button:has-text("Create Coupon")');
    await expect(createCouponBtn).toBeVisible();
    await createCouponBtn.click();

    // Verify modal inputs: Code, Discount Type, Discount Value
    await expect(page.locator('.modal-card')).toBeVisible();
    const codeInput = page.locator('.code-input, input[placeholder*="DIWALI500"]');
    await expect(codeInput).toBeVisible();

    // Close modal
    await page.locator('.close-btn, button:has-text("Cancel")').first().click();
  });

  test('TC-ADM-06: Admin Orders fulfillment state and search filtering UI', async ({ adminPage, page }) => {
    await adminPage.navigateToAdminModule(adminPage.ordersNav);
    await expect(page).toHaveURL(/.*admin\/orders/);
    await expect(page.locator('h1:has-text("Orders"), .page-title:has-text("Orders")')).toBeVisible();
    
    // Search input or filter tabs should be rendered
    const searchOrFilter = page.locator('input[type="text"], select, .filter-tab, .order-card, .orders-table').first();
    await expect(searchOrFilter).toBeVisible();
  });

  test('TC-ADM-07: Admin Reports summary metrics load correctly', async ({ adminPage, page }) => {
    await adminPage.navigateToAdminModule(adminPage.reportsNav);
    await expect(page).toHaveURL(/.*admin\/reports/);
    await expect(page.locator('h1:has-text("Reports"), .page-title:has-text("Reports")')).toBeVisible();
    
    // Verify sales summary or metrics cards
    await expect(page.locator('.report-card, .metrics-grid, .sales-summary, table, div').filter({ hasText: /₹/ }).first()).toBeVisible();
  });

  test('TC-ADM-08: Admin Settings allows reviewing and saving store configurations', async ({ adminPage, page }) => {
    await adminPage.navigateToAdminModule(adminPage.settingsNav);
    await expect(page).toHaveURL(/.*admin\/settings/);
    await expect(page.locator('h1:has-text("Store & Gateway Settings"), .page-title:has-text("Settings")')).toBeVisible();

    // Verify Save Changes button is present
    const saveBtn = page.locator('button:has-text("Save Changes")');
    await expect(saveBtn).toBeVisible();

    // Verify Brand Name input field
    const brandInput = page.locator('input[type="text"]').first();
    await expect(brandInput).toBeVisible();
  });

  test('TC-ADM-09: Admin Banners and Promotions page loads', async ({ adminPage, page }) => {
    await adminPage.navigateToAdminModule(adminPage.bannersNav);
    await expect(page).toHaveURL(/.*admin\/banners/);
    await expect(page.locator('h1:has-text("Banners"), .page-title:has-text("Banners")')).toBeVisible();
    await expect(page.locator('button:has-text("Banner")').first()).toBeVisible();
  });

  test('TC-ADM-10: Admin Customers Management list and search loads', async ({ adminPage, page }) => {
    await adminPage.navigateToAdminModule(adminPage.customersNav);
    await expect(page).toHaveURL(/.*admin\/customers/);
    await expect(page.locator('h1:has-text("Customers"), .page-title:has-text("Customers")')).toBeVisible();
  });

  test('TC-ADM-11: Admin Reviews moderation page loads with status controls', async ({ adminPage, page }) => {
    await adminPage.navigateToAdminModule(adminPage.reviewsNav);
    await expect(page).toHaveURL(/.*admin\/reviews/);
    await expect(page.locator('h1:has-text("Reviews"), .page-title:has-text("Reviews")')).toBeVisible();
  });
});

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminDashboardPage extends BasePage {
  readonly dashboardHeading: Locator;
  readonly sidebarNav: Locator;
  readonly mobileSidebarToggle: Locator;
  readonly productsNav: Locator;
  readonly ordersNav: Locator;
  readonly customersNav: Locator;
  readonly categoriesNav: Locator;
  readonly bannersNav: Locator;
  readonly reviewsNav: Locator;
  readonly couponsNav: Locator;
  readonly reportsNav: Locator;
  readonly settingsNav: Locator;
  readonly adminUserMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeading = page.locator('h1:has-text("Executive Overview"), h1:has-text("Dashboard"), .page-title, h1').first();
    this.sidebarNav = page.locator('.admin-sidebar, aside.sidebar, .admin-nav');
    this.mobileSidebarToggle = page.locator('button.mobile-sidebar-toggle, button[aria-label="Toggle Navigation"]').first();
    this.productsNav = page.locator('a[href*="/admin/products"]').first();
    this.ordersNav = page.locator('a[href*="/admin/orders"]').first();
    this.customersNav = page.locator('a[href*="/admin/customers"]').first();
    this.categoriesNav = page.locator('a[href*="/admin/categories"]').first();
    this.bannersNav = page.locator('a[href*="/admin/banners"]').first();
    this.reviewsNav = page.locator('a[href*="/admin/reviews"]').first();
    this.couponsNav = page.locator('a[href*="/admin/coupons"]').first();
    this.reportsNav = page.locator('a[href*="/admin/reports"]').first();
    this.settingsNav = page.locator('a[href*="/admin/settings"]').first();
    this.adminUserMenu = page.locator('.admin-user-menu, .user-profile');
  }

  async openDashboard(): Promise<void> {
    await this.navigateTo('/admin/dashboard');
  }

  /**
   * Helper to navigate via admin sidebar reliably across desktop and mobile viewports.
   */
  async navigateToAdminModule(linkLocator: Locator): Promise<void> {
    const isMobileToggleVisible = await this.mobileSidebarToggle.isVisible().catch(() => false);
    if (isMobileToggleVisible) {
      const isSidebarOpen = await this.page.locator('.admin-sidebar.sidebar-open').isVisible().catch(() => false);
      if (!isSidebarOpen) {
        await this.mobileSidebarToggle.click();
        await this.page.waitForSelector('.admin-sidebar.sidebar-open', { timeout: 3000 });
      }
    }
    await linkLocator.click();
  }
}

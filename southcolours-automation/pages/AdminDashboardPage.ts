import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminDashboardPage extends BasePage {
  readonly dashboardHeading: Locator;
  readonly sidebarNav: Locator;
  readonly productsNav: Locator;
  readonly ordersNav: Locator;
  readonly customersNav: Locator;
  readonly categoriesNav: Locator;
  readonly couponsNav: Locator;
  readonly reportsNav: Locator;
  readonly settingsNav: Locator;
  readonly adminUserMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeading = page.locator('h1:has-text("Dashboard"), .dashboard-title, h1').first();
    this.sidebarNav = page.locator('.admin-sidebar, aside.sidebar, .admin-nav');
    this.productsNav = page.locator('a[href*="/admin/products"], a:has-text("Products")').first();
    this.ordersNav = page.locator('a[href*="/admin/orders"], a:has-text("Orders")').first();
    this.customersNav = page.locator('a[href*="/admin/customers"], a:has-text("Customers")').first();
    this.categoriesNav = page.locator('a[href*="/admin/categories"], a:has-text("Categories")').first();
    this.couponsNav = page.locator('a[href*="/admin/coupons"], a:has-text("Coupons")').first();
    this.reportsNav = page.locator('a[href*="/admin/reports"], a:has-text("Reports")').first();
    this.settingsNav = page.locator('a[href*="/admin/settings"], a:has-text("Settings")').first();
    this.adminUserMenu = page.locator('.admin-user-menu, .user-profile');
  }

  async openDashboard(): Promise<void> {
    await this.navigateTo('/admin/dashboard');
  }
}

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
  readonly pageHeading: Locator;
  readonly ordersList: Locator;
  readonly profileSection: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.locator('h1, .page-title');
    this.ordersList = page.locator('.order-card, .orders-table, .order-item');
    this.profileSection = page.locator('.profile-info, .user-details');
    this.logoutButton = page.locator('button:has-text("Sign Out"), button:has-text("Logout"), a:has-text("Logout")');
  }

  async openOrdersPage(): Promise<void> {
    await this.navigateTo('/orders');
  }

  async logout(): Promise<void> {
    if (await this.logoutButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.logoutButton.click();
    }
  }
}

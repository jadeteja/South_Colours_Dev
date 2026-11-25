import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  readonly profileHeading: Locator;
  readonly profileTab: Locator;
  readonly ordersTab: Locator;
  readonly addressesTab: Locator;
  readonly cardsTab: Locator;
  readonly reviewsTab: Locator;
  readonly notificationsTab: Locator;
  readonly logoutBtn: Locator;

  // Profile Form fields
  readonly fullNameInput: Locator;
  readonly phoneInput: Locator;
  readonly saveProfileBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.profileHeading = page.locator('h1, h2, .profile-header').first();
    this.profileTab = page.locator('button:has-text("Profile"), a:has-text("Profile"), [data-tab="profile"]').first();
    this.ordersTab = page.locator('button:has-text("Orders"), a:has-text("Orders"), [data-tab="orders"]').first();
    this.addressesTab = page.locator('button:has-text("Addresses"), a:has-text("Addresses"), [data-tab="addresses"]').first();
    this.cardsTab = page.locator('button:has-text("Cards"), a:has-text("Cards"), [data-tab="cards"]').first();
    this.reviewsTab = page.locator('button:has-text("Reviews"), a:has-text("Reviews"), [data-tab="reviews"]').first();
    this.notificationsTab = page.locator('button:has-text("Notifications"), a:has-text("Notifications"), [data-tab="notifications"]').first();
    this.logoutBtn = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Sign Out")').first();

    this.fullNameInput = page.locator('input[name="fullName"], input[name="name"]').first();
    this.phoneInput = page.locator('input[name="phoneNumber"], input[name="phone"]').first();
    this.saveProfileBtn = page.locator('button:has-text("Save"), button:has-text("Update")').first();
  }

  async openProfilePage(): Promise<void> {
    await this.navigateTo('/profile');
  }
}

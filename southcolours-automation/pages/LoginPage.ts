import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitBtn: Locator;
  readonly errorMessage: Locator;
  readonly createAccountLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly quickAdminChip: Locator;
  readonly quickCustomerChip: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[type="email"], input[name="email"]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"]');
    this.submitBtn = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.alert-danger, .error-message');
    this.createAccountLink = page.locator('a[routerlink*="register"], a[href*="register"]');
    this.forgotPasswordLink = page.locator('.forgot-link, a:has-text("Forgot")');
    this.quickAdminChip = page.locator('button:has-text("Admin Login"), .quick-chip:has-text("Admin")');
    this.quickCustomerChip = page.locator('button:has-text("Customer Login"), .quick-chip:has-text("Customer")');
  }

  async openLoginPage(): Promise<void> {
    await this.navigateTo('/auth/login');
  }

  async login(email: string, pass: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitBtn.click();
  }

  async clickQuickAdminLogin(): Promise<void> {
    await this.quickAdminChip.click();
    await this.submitBtn.click();
  }

  async clickQuickCustomerLogin(): Promise<void> {
    await this.quickCustomerChip.click();
    await this.submitBtn.click();
  }

  async goToRegister(): Promise<void> {
    await this.createAccountLink.click();
    await this.page.waitForURL(/.*auth\/register/, { timeout: 10000 });
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return (await this.errorMessage.textContent())?.trim() || '';
  }
}

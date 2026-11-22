import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly submitBtn: Locator;
  readonly errorMessage: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.fullNameInput = page.locator('input[name="fullName"], input[placeholder*="Name"]');
    this.emailInput = page.locator('input[name="email"], input[type="email"]');
    this.phoneInput = page.locator('input[name="phoneNumber"], input[type="tel"]');
    this.passwordInput = page.locator('input[name="password"], input[type="password"]');
    this.submitBtn = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.alert-danger, .error-message');
    this.loginLink = page.locator('a[routerlink*="login"], a[href*="login"]');
  }

  async openRegisterPage(): Promise<void> {
    await this.navigateTo('/auth/register');
  }

  async registerUser(name: string, email: string, phone: string, pass: string): Promise<void> {
    await this.fullNameInput.fill(name);
    await this.emailInput.fill(email);
    if (phone) await this.phoneInput.fill(phone);
    await this.passwordInput.fill(pass);
    await this.submitBtn.click();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return (await this.errorMessage.textContent())?.trim() || '';
  }
}

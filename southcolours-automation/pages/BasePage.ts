import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

export class BasePage {
  readonly page: Page;
  readonly headerLogo: Locator;
  readonly cartIcon: Locator;
  readonly cartCountBadge: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly userAccountIcon: Locator;
  readonly navLinks: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerLogo = page.getByRole('link', { name: /Southcolours/i }).first();
    this.cartIcon = page.locator('header a[href*="/cart"], header a[routerlink="/cart"], a[href="/cart"]').first();
    this.cartCountBadge = page.locator('header a[href*="/cart"] text, a[href="/cart"]').first();
    this.searchInput = page.getByPlaceholder(/Search for dresses/i).first();
    this.searchButton = page.locator('header button:has(img), .search-btn').first();
    this.userAccountIcon = page.getByRole('link', { name: /My Account|Sign In|Account/i }).first();
    this.navLinks = page.locator('header nav a, header navigation a');
    this.footer = page.locator('contentinfo, footer');
  }

  async navigateTo(path: string = '/'): Promise<void> {
    Logger.info(`Navigating to ${path}`);
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async clickLogo(): Promise<void> {
    await this.headerLogo.click();
  }

  async openCart(): Promise<void> {
    await this.cartIcon.click();
    await this.page.waitForURL(/.*cart/, { timeout: 10000 });
  }

  async openLogin(): Promise<void> {
    await this.userAccountIcon.click();
    await this.page.waitForURL(/.*auth\/login/, { timeout: 10000 });
  }

  async searchProduct(keyword: string): Promise<void> {
    Logger.info(`Searching for keyword: ${keyword}`);
    if (await this.searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.searchInput.fill(keyword);
      await this.searchInput.press('Enter');
    } else {
      await this.navigateTo(`/products?search=${encodeURIComponent(keyword)}`);
    }
  }

  async scrollToFooter(): Promise<void> {
    await this.footer.scrollIntoViewIfNeeded();
  }
}

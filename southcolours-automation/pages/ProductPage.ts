import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productItems: Locator;
  readonly productHeadingLinks: Locator;
  readonly categoryFilterLinks: Locator;
  readonly ageFilterCheckboxes: Locator;
  readonly sortDropdown: Locator;
  readonly breadcrumb: Locator;
  
  // Product Details locators
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly originalPrice: Locator;
  readonly discountBadge: Locator;
  readonly sizeOptions: Locator;
  readonly quantityInput: Locator;
  readonly addToCartBtn: Locator;
  readonly buyNowBtn: Locator;
  readonly toastSuccessNotification: Locator;

  constructor(page: Page) {
    super(page);
    this.productItems = page.locator('main a[href^="/products/"]');
    this.productHeadingLinks = page.locator('main h3 a[href^="/products/"]');
    this.categoryFilterLinks = page.locator('complementary a[href*="category="], .category-tree a');
    this.ageFilterCheckboxes = page.locator('input[type="checkbox"]');
    this.sortDropdown = page.locator('combobox, select');
    this.breadcrumb = page.locator('navigation:has-text("Home")');

    this.productTitle = page.locator('h1.product-title, h1').first();
    this.productPrice = page.locator('.selling-price, .price, text=/₹/').first();
    this.originalPrice = page.locator('.original-price');
    this.discountBadge = page.locator('.badge-discount, .discount-tag, .discount-badge');
    this.sizeOptions = page.locator('.size-pills button, .size-pill');
    this.quantityInput = page.locator('.qty-stepper input, .quantity-input');
    this.addToCartBtn = page.locator('button.add-cart-btn, button:has-text("Add to Cart")');
    this.buyNowBtn = page.locator('button.buy-now-btn, button:has-text("Buy Now")');
    this.toastSuccessNotification = page.locator('.toast, .toast-success, .notification, text=added to Cart');
  }

  async openListingPage(): Promise<void> {
    await this.navigateTo('/products');
  }

  async selectFirstProduct(): Promise<void> {
    await this.productHeadingLinks.first().click();
    await this.page.waitForURL(/.*products\/.+/, { timeout: 10000 });
  }

  async selectSize(size?: string): Promise<void> {
    const sizeButtons = this.sizeOptions;
    const count = await sizeButtons.count();
    if (count > 0) {
      if (size) {
        await sizeButtons.filter({ hasText: size }).first().click();
      } else {
        await sizeButtons.first().click();
      }
    }
  }

  async addToCart(): Promise<void> {
    await this.addToCartBtn.click();
    await this.page.waitForTimeout(1000);
  }

  async clickToastViewCart(): Promise<void> {
    const viewCartBtn = this.page.locator('button:has-text("View Cart"), a:has-text("View Cart")');
    if (await viewCartBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await viewCartBtn.click();
    } else {
      await this.openCart();
    }
  }
}

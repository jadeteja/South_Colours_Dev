import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heroSection: Locator;
  readonly heroShopNowBtn: Locator;
  readonly heroTitle: Locator;
  readonly shippingRibbon: Locator;
  readonly categoryCards: Locator;
  readonly featuredProductsSection: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.locator('section.hero-section').first();
    this.heroShopNowBtn = page.getByRole('link', { name: /Shop Now/i }).first();
    this.heroTitle = page.locator('h1.hero-title, h1').first();
    this.shippingRibbon = page.locator('.shipping-ribbon-badge, .shipping-badge-container').first();
    this.categoryCards = page.locator('.category-card, .categories-section a');
    this.featuredProductsSection = page.locator('.featured-products, .product-grid, .products-section').first();
    this.productCards = page.locator('a[href^="/products/"]');
  }

  async openHomePage(): Promise<void> {
    await this.navigateTo('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickHeroShopNow(): Promise<void> {
    await this.heroShopNowBtn.click();
    await this.page.waitForURL(/.*products/, { timeout: 10000 });
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  async clickFirstProduct(): Promise<void> {
    await this.productCards.first().click();
    await this.page.waitForURL(/.*products\/.+/, { timeout: 10000 });
  }
}

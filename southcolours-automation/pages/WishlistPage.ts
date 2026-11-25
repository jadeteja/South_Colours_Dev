import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WishlistPage extends BasePage {
  readonly wishlistTitle: Locator;
  readonly wishlistItems: Locator;
  readonly emptyWishlistMsg: Locator;
  readonly exploreBtn: Locator;
  readonly removeButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.wishlistTitle = page.locator('h1:has-text("Wishlist"), h2:has-text("Wishlist"), .wishlist-title').first();
    this.wishlistItems = page.locator('.product-card, .wishlist-card, a[href^="/products/"]');
    this.emptyWishlistMsg = page.locator('.empty-wishlist, text=wishlist is empty, text=No items in wishlist');
    this.exploreBtn = page.getByRole('link', { name: /Start Shopping|Explore Collection|Explore/i }).first();
    this.removeButtons = page.locator('.remove-btn, .wishlist-remove, button:has(.trash-icon)');
  }

  async openWishlistPage(): Promise<void> {
    await this.navigateTo('/wishlist');
  }
}

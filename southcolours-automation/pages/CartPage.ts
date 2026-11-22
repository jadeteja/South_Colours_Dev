import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartItemTitles: Locator;
  readonly clearCartBtn: Locator;
  readonly emptyCartState: Locator;
  readonly startShoppingBtn: Locator;
  readonly couponInput: Locator;
  readonly applyCouponBtn: Locator;
  readonly couponMessage: Locator;
  readonly subtotalText: Locator;
  readonly totalText: Locator;
  readonly checkoutBtn: Locator;
  readonly removeButtons: Locator;
  readonly stepPlusButtons: Locator;
  readonly stepMinusButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart-card, .items-list .cart-card');
    this.cartItemTitles = page.locator('.cart-card .item-name');
    this.clearCartBtn = page.getByRole('button', { name: 'Clear Cart' });
    this.emptyCartState = page.locator('.empty-cart');
    this.startShoppingBtn = page.getByRole('link', { name: 'Start Shopping' });
    this.couponInput = page.getByPlaceholder(/coupon code/i);
    this.applyCouponBtn = page.getByRole('button', { name: 'Apply' });
    this.couponMessage = page.locator('.coupon-msg');
    this.subtotalText = page.locator('.price-line:has-text("Subtotal") span:last-child');
    this.totalText = page.locator('.total-line span:last-child, .total-val');
    this.checkoutBtn = page.getByRole('link', { name: /Proceed to Checkout/i });
    this.removeButtons = page.locator('.remove-btn');
    this.stepPlusButtons = page.locator('.stepper .step-btn:has-text("+")');
    this.stepMinusButtons = page.locator('.stepper .step-btn:has-text("−"), .stepper .step-btn:has-text("-")');
  }

  async openCartPage(): Promise<void> {
    await this.navigateTo('/cart');
  }

  async clearCart(): Promise<void> {
    if (await this.clearCartBtn.isVisible()) {
      await this.clearCartBtn.click();
    }
  }

  async applyCoupon(code: string): Promise<void> {
    await this.couponInput.fill(code);
    await this.applyCouponBtn.click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutBtn.click();
    await this.page.waitForURL(/.*checkout/, { timeout: 10000 });
  }
}

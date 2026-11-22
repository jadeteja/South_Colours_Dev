import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly addNewAddressBtn: Locator;
  readonly addressOptions: Locator;
  readonly paymentMethodRadios: Locator;
  readonly placeOrderBtn: Locator;
  
  // Modal / Add Address fields
  readonly modalNameInput: Locator;
  readonly modalPhoneInput: Locator;
  readonly modalLine1Input: Locator;
  readonly modalCityInput: Locator;
  readonly modalStateInput: Locator;
  readonly modalPinCodeInput: Locator;
  readonly modalSaveBtn: Locator;
  readonly modalCancelBtn: Locator;

  // Order Confirmation
  readonly confirmationHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.addNewAddressBtn = page.locator('.add-addr-btn, button:has-text("Add New Address")');
    this.addressOptions = page.locator('.address-option');
    this.paymentMethodRadios = page.locator('input[name="payment"], .pay-method-option');
    this.placeOrderBtn = page.locator('button:has-text("Place Order"), button:has-text("Confirm Order"), .place-order-btn');

    this.modalNameInput = page.locator('.modal input[name="name"], input[placeholder*="Full Name"]');
    this.modalPhoneInput = page.locator('.modal input[name="phone"], input[placeholder*="10-digit"]');
    this.modalLine1Input = page.locator('.modal input[name="line1"], input[placeholder*="Street address"]');
    this.modalCityInput = page.locator('.modal input[name="city"], input[placeholder*="City"]');
    this.modalStateInput = page.locator('.modal input[name="state"], input[placeholder*="State"]');
    this.modalPinCodeInput = page.locator('.modal input[name="pinCode"], input[placeholder*="6-digit PIN"]');
    this.modalSaveBtn = page.locator('.modal button:has-text("Save"), button:has-text("Add Address")');
    this.modalCancelBtn = page.locator('.modal button:has-text("Cancel")');

    this.confirmationHeading = page.locator('h1:has-text("Order Placed"), .order-confirmed, h2:has-text("Thank You")');
  }

  async openCheckoutPage(): Promise<void> {
    await this.navigateTo('/checkout');
  }

  async selectPayment(method: 'card' | 'upi' | 'netbanking' | 'cod'): Promise<void> {
    const radio = this.page.locator(`input[value="${method}"]`);
    if (await radio.isVisible()) {
      await radio.check();
    } else {
      await this.page.locator(`.pay-method-option:has-text("${method}")`).click();
    }
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderBtn.click();
  }
}

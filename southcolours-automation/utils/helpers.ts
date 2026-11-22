import { Page, Locator, expect } from '@playwright/test';

export class Helpers {
  /**
   * Safely click an element with scroll into view and timeout handling
   */
  static async safeClick(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  /**
   * Safe text retrieval
   */
  static async safeGetText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent())?.trim() || '';
  }

  /**
   * Format currency into integer
   */
  static extractPrice(priceText: string): number {
    const cleaned = priceText.replace(/[^0-9]/g, '');
    return parseInt(cleaned, 10) || 0;
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../core/services/shop.service';

interface CouponItem {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container cart-page">
      <div class="cart-layout">
        <!-- Cart Items List Matching Reference Screen 4 -->
        <div class="cart-items-column">
          <div class="cart-header">
            <h1 class="cart-title">My Cart <span class="item-count">({{ shopService.cartCount() }} items)</span></h1>
            <button class="clear-btn" (click)="shopService.clearCart()">Clear Cart</button>
          </div>

          <div class="items-list">
            @for (item of shopService.cartItems(); track item.productId + item.size) {
              <div class="cart-card">
                <img [src]="item.imageUrl" [alt]="item.name" class="cart-thumb" />
                <div class="item-details">
                  <h3 class="item-name">{{ item.name }}</h3>
                  <p class="item-meta">Size: {{ item.size }}</p>
                  <p class="item-price">₹ {{ item.price | number }}</p>
                </div>
                <div class="stepper-wrap">
                  <div class="stepper">
                    <button class="step-btn" (click)="shopService.updateQuantity(item.productId, item.size, item.quantity - 1)">−</button>
                    <span class="qty-num">{{ item.quantity }}</span>
                    <button class="step-btn" (click)="shopService.updateQuantity(item.productId, item.size, item.quantity + 1)">+</button>
                  </div>
                  <button class="remove-btn" (click)="shopService.removeFromCart(item.productId, item.size)" title="Remove">✕</button>
                </div>
              </div>
            } @empty {
              <div class="empty-cart">
                <span class="empty-icon">🛍️</span>
                <h3>Your Cart is Empty</h3>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <a routerLink="/products" class="btn-primary">Start Shopping</a>
              </div>
            }
          </div>
        </div>

        <!-- Order Summary & Coupon Matching Screen 4 -->
        <div class="cart-summary-column">
          <!-- Coupon Box -->
          <div class="summary-card coupon-box">
            <div class="coupon-header">
              <h3 class="box-title">Apply Coupon</h3>
              @if (shopService.appliedCouponCode()) {
                <button class="remove-coupon-btn" (click)="removeCoupon()">Remove</button>
              }
            </div>

            <div class="coupon-input-group">
              <input
                type="text"
                placeholder="Enter coupon code"
                [(ngModel)]="couponCode"
                (keyup.enter)="applyCoupon()"
                [disabled]="!!shopService.appliedCouponCode()"
              />
              @if (shopService.appliedCouponCode()) {
                <button class="applied-badge-btn" disabled>Applied ✓</button>
              } @else {
                <button class="apply-btn" (click)="applyCoupon()" [disabled]="!couponCode.trim()">Apply</button>
              }
            </div>

            @if (couponMessage) {
              <p class="coupon-msg" [class.success]="couponSuccess">{{ couponMessage }}</p>
            }

            <!-- Available Coupons List (from Admin Panel) -->
            @if (availableCoupons.length > 0) {
              <div class="available-coupons-wrap">
                <h4 class="available-title">
                  <span class="tag-icon">🏷️</span> Available Coupons
                </h4>
                <div class="coupons-grid">
                  @for (c of availableCoupons; track c.code) {
                    <div
                      class="coupon-card"
                      [class.is-applied]="shopService.appliedCouponCode() === c.code"
                      [class.is-disabled]="c.minOrderAmount && shopService.cartSubtotal() < c.minOrderAmount"
                    >
                      <div class="coupon-card-main">
                        <div class="coupon-pill-row">
                          <span class="coupon-badge">{{ c.code }}</span>
                          @if (c.minOrderAmount && shopService.cartSubtotal() < c.minOrderAmount) {
                            <span class="coupon-req">Min ₹{{ c.minOrderAmount }}</span>
                          }
                        </div>
                        <p class="coupon-desc">{{ c.description }}</p>
                      </div>

                      <div class="coupon-card-action">
                        @if (shopService.appliedCouponCode() === c.code) {
                          <button class="action-btn applied-action" (click)="removeCoupon()">Remove</button>
                        } @else {
                          <button
                            class="action-btn apply-action"
                            [disabled]="(c.minOrderAmount && shopService.cartSubtotal() < c.minOrderAmount) || shopService.cartSubtotal() === 0"
                            (click)="selectAndApplyCoupon(c)"
                          >
                            Apply
                          </button>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Price Details Box Matching Screen 4 -->
          <div class="summary-card price-details-box">
            <h3 class="box-title">Price Details</h3>
            
            <div class="price-line">
              <span>Subtotal</span>
              <span>₹ {{ shopService.cartSubtotal() | number }}</span>
            </div>

            <div class="price-line">
              <span>Shipping</span>
              <span class="free-text">{{ shopService.shippingFee() === 0 ? '₹ 0' : '₹ ' + shopService.shippingFee() }}</span>
            </div>

            <div class="price-line discount-line">
              <span>Discount</span>
              <span class="discount-val">− ₹ {{ shopService.cartDiscount() | number }}</span>
            </div>

            <div class="divider"></div>

            <div class="price-line total-line">
              <span>Total</span>
              <span class="total-val">₹ {{ shopService.cartTotal() | number }}</span>
            </div>

            <a routerLink="/checkout" class="btn-primary checkout-cta-btn" [class.disabled]="shopService.cartItems().length === 0">
              Proceed to Checkout
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-page {
      padding: 30px 20px 60px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .cart-layout {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 36px;
      align-items: start;
    }
    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 20px;
      .cart-title {
        font-size: 24px;
        color: var(--dark-navy);
        .item-count {
          font-size: 16px;
          color: var(--text-muted);
          font-weight: 600;
        }
      }
      .clear-btn {
        background: transparent;
        color: var(--primary-pink);
        font-size: 13px;
        font-weight: 700;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .items-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .cart-card {
      background: #FFFFFF;
      border: 1px solid var(--border-pink);
      border-radius: var(--radius-md);
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .cart-thumb {
      width: 80px;
      height: 95px;
      object-fit: cover;
      border-radius: 10px;
      background: #FFF5F8;
    }
    .item-details {
      flex: 1;
      .item-name {
        font-size: 15px;
        font-weight: 700;
        color: var(--dark-navy);
        margin-bottom: 4px;
      }
      .item-meta {
        font-size: 13px;
        color: var(--text-muted);
        margin-bottom: 6px;
      }
      .item-price {
        font-size: 16px;
        font-weight: 800;
        color: var(--dark-navy);
      }
    }
    .stepper-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .stepper {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--border-pink);
      border-radius: 9999px;
      overflow: hidden;
      .step-btn {
        width: 30px;
        height: 30px;
        background: transparent;
        font-weight: 700;
        &:hover {
          background: var(--primary-pink-light);
        }
      }
      .qty-num {
        padding: 0 10px;
        font-size: 13px;
        font-weight: 700;
      }
    }
    .remove-btn {
      background: transparent;
      color: var(--text-light);
      font-size: 14px;
      padding: 4px;
      &:hover {
        color: #D32F2F;
      }
    }
    .empty-cart {
      text-align: center;
      padding: 60px 20px;
      background: #FFFFFF;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-pink);
      .empty-icon {
        font-size: 48px;
        display: block;
        margin-bottom: 12px;
      }
      h3 {
        margin-bottom: 6px;
        color: var(--dark-navy);
      }
      p {
        color: var(--text-muted);
        margin-bottom: 20px;
        font-size: 14px;
      }
    }
    .summary-card {
      background: #FFFFFF;
      border: 1px solid var(--border-pink);
      border-radius: var(--radius-md);
      padding: 22px;
      margin-bottom: 20px;
    }
    .coupon-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      .box-title {
        margin-bottom: 0;
      }
      .remove-coupon-btn {
        background: transparent;
        color: #E53935;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 4px;
        &:hover {
          background: #FFEBEE;
        }
      }
    }
    .box-title {
      font-size: 16px;
      font-weight: 800;
      color: var(--dark-navy);
      margin-bottom: 16px;
    }
    .coupon-input-group {
      display: flex;
      gap: 10px;
      input {
        flex: 1;
        padding: 10px 14px;
        border-radius: 8px;
        border: 1px solid var(--border-pink);
        font-size: 13px;
        outline: none;
        background: #FFF5F8;
        font-weight: 600;
        letter-spacing: 0.5px;
        &:disabled {
          background: #F5F5F5;
          color: #888;
        }
      }
      .apply-btn {
        background-color: var(--primary-pink);
        color: white;
        padding: 0 18px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
        transition: opacity 0.2s;
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        &:hover:not(:disabled) {
          filter: brightness(0.95);
        }
      }
      .applied-badge-btn {
        background-color: #E8F5E9;
        color: #2E7D32;
        border: 1px solid #A5D6A7;
        padding: 0 14px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 13px;
      }
    }
    .coupon-msg {
      font-size: 12px;
      margin-top: 8px;
      color: #D32F2F;
      font-weight: 600;
      &.success {
        color: #2E7D32;
      }
    }
    .available-coupons-wrap {
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px dashed var(--border-pink);
      .available-title {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        font-weight: 700;
        color: var(--text-muted);
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .coupons-grid {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .coupon-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        border: 1px dashed #FFB6C1;
        background: #FFF9FA;
        border-radius: 8px;
        transition: all 0.2s ease;
        &.is-applied {
          border: 1.5px solid #4CAF50;
          background: #F1F8E9;
        }
        &.is-disabled {
          opacity: 0.65;
          background: #FAFAFA;
          border-color: #E0E0E0;
        }
        .coupon-card-main {
          flex: 1;
          .coupon-pill-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 3px;
          }
          .coupon-badge {
            background: #FFE4EC;
            color: var(--primary-pink);
            font-weight: 800;
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 4px;
            letter-spacing: 0.5px;
          }
          .coupon-req {
            font-size: 11px;
            color: #E53935;
            font-weight: 600;
          }
          .coupon-desc {
            font-size: 12px;
            color: var(--text-muted);
            margin: 0;
            line-height: 1.3;
          }
        }
        .action-btn {
          font-size: 12px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          &.apply-action {
            background: #FFFFFF;
            color: var(--primary-pink);
            border: 1px solid var(--primary-pink);
            &:hover:not(:disabled) {
              background: var(--primary-pink);
              color: white;
            }
            &:disabled {
              border-color: #CCC;
              color: #999;
              cursor: not-allowed;
            }
          }
          &.applied-action {
            background: #FFEBEE;
            color: #C62828;
            border: 1px solid #EF9A9A;
            &:hover {
              background: #FFCDD2;
            }
          }
        }
      }
    }
    .price-line {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 12px;
      .free-text {
        color: var(--success-green);
        font-weight: 700;
      }
      &.discount-line {
        color: var(--success-green);
        .discount-val {
          font-weight: 700;
        }
      }
      &.total-line {
        font-size: 18px;
        font-weight: 800;
        color: var(--dark-navy);
        margin-bottom: 24px;
        .total-val {
          color: var(--dark-navy);
        }
      }
    }
    .divider {
      height: 1px;
      background: var(--border-pink);
      margin: 14px 0 16px;
    }
    .checkout-cta-btn {
      width: 100%;
      padding: 14px 0;
      font-size: 16px;
      &.disabled {
        opacity: 0.5;
        pointer-events: none;
      }
    }

    @media (max-width: 900px) {
      .cart-page {
        padding: 16px 16px 40px;
      }
      .cart-layout {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }

    @media (max-width: 540px) {
      .cart-page {
        padding: 8px 12px 30px;
      }
      .cart-heading {
        font-size: 20px;
        margin-bottom: 12px;
      }
      .items-header {
        padding-bottom: 10px;
        margin-bottom: 12px;
      }
      .items-list {
        gap: 12px;
      }
      .cart-card {
        padding: 12px;
        gap: 12px;
        align-items: flex-start;
      }
      .cart-thumb {
        width: 72px;
        height: 86px;
        flex-shrink: 0;
        border-radius: 8px;
      }
      .item-details {
        .item-name {
          font-size: 14px;
        }
        .item-meta {
          font-size: 12px;
          margin-bottom: 4px;
        }
        .item-price {
          font-size: 15px;
        }
      }
      .stepper-wrap {
        gap: 10px;
      }
      .coupon-input-group {
        gap: 8px;
        input {
          padding: 8px 12px;
          font-size: 12px;
        }
        .apply-btn {
          padding: 0 14px;
          font-size: 12px;
        }
      }
      .summary-card {
        padding: 16px;
        margin-bottom: 14px;
      }
      .box-title {
        font-size: 15px;
        margin-bottom: 12px;
      }
      .checkout-cta-btn {
        padding: 12px 0;
        font-size: 15px;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  shopService = inject(ShopService);

  couponCode = '';
  couponMessage = '';
  couponSuccess = false;

  availableCoupons: CouponItem[] = [];

  ngOnInit() {
    // If a coupon was already applied in shopService, reflect its code
    if (this.shopService.appliedCouponCode()) {
      this.couponCode = this.shopService.appliedCouponCode();
      this.couponMessage = `Coupon ${this.couponCode} applied (₹${this.shopService.cartDiscount()} savings)`;
      this.couponSuccess = true;
    }

    // Load active coupons exclusively from admin panel backend API
    this.shopService.getCoupons().subscribe({
      next: (coupons: any[]) => {
        if (coupons && coupons.length > 0) {
          this.availableCoupons = coupons
            .filter(c => c.isActive ?? c.IsActive ?? true)
            .map(c => ({
              code: c.code || c.Code,
              description: c.description || c.Description || `${c.discountValue || c.DiscountValue}${c.discountType === 1 ? ' fixed' : '%'} off`,
              discountType: (c.discountType === 1 || c.DiscountType === 1) ? 'fixed' : 'percentage',
              discountValue: c.discountValue ?? c.DiscountValue ?? 0,
              minOrderAmount: c.minimumOrderAmount ?? c.MinimumOrderAmount ?? 0
            }));
        } else {
          this.availableCoupons = [];
        }
      },
      error: () => {
        this.availableCoupons = [];
      }
    });
  }

  selectAndApplyCoupon(coupon: CouponItem) {
    this.couponCode = coupon.code;
    this.executeApplyCoupon(coupon);
  }

  applyCoupon() {
    const code = this.couponCode.trim().toUpperCase();
    if (!code) {
      this.couponMessage = 'Please enter a coupon code';
      this.couponSuccess = false;
      return;
    }

    const matched = this.availableCoupons.find(c => c.code.toUpperCase() === code);
    if (matched) {
      this.executeApplyCoupon(matched);
      return;
    }

    // Attempt backend validation if not in local list
    const subtotal = this.shopService.cartSubtotal();
    this.shopService.validateCoupon(code, subtotal).subscribe({
      next: (res: any) => {
        if (res && res.valid) {
          const discount = res.discountAmount || 0;
          this.shopService.applyCoupon(code, discount);
          this.couponMessage = `Coupon ${code} applied (₹${discount} savings)`;
          this.couponSuccess = true;
        } else {
          this.couponMessage = res?.message || 'Invalid coupon code';
          this.couponSuccess = false;
        }
      },
      error: (err: any) => {
        this.couponMessage = err.error?.message || 'Invalid or expired coupon code';
        this.couponSuccess = false;
      }
    });
  }

  private executeApplyCoupon(coupon: CouponItem) {
    const subtotal = this.shopService.cartSubtotal();
    if (subtotal === 0) {
      this.couponMessage = 'Your cart is empty';
      this.couponSuccess = false;
      return;
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      this.couponMessage = `Minimum order of ₹${coupon.minOrderAmount} required for coupon ${coupon.code}`;
      this.couponSuccess = false;
      return;
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    this.couponCode = coupon.code;
    this.shopService.applyCoupon(coupon.code, discount);
    this.couponMessage = `Coupon ${coupon.code} applied (₹${discount} savings)`;
    this.couponSuccess = true;
  }

  removeCoupon() {
    this.shopService.removeCoupon();
    this.couponCode = '';
    this.couponMessage = 'Coupon removed';
    this.couponSuccess = false;
  }
}


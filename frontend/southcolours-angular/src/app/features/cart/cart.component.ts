import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../core/services/shop.service';

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
            <h3 class="box-title">Apply Coupon</h3>
            <div class="coupon-input-group">
              <input type="text" placeholder="Enter coupon code" [(ngModel)]="couponCode" />
              <button class="apply-btn" (click)="applyCoupon()">Apply</button>
            </div>
            @if (couponMessage) {
              <p class="coupon-msg" [class.success]="couponSuccess">{{ couponMessage }}</p>
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
      }
      .apply-btn {
        background-color: var(--primary-pink);
        color: white;
        padding: 0 18px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 13px;
      }
    }
    .coupon-msg {
      font-size: 12px;
      margin-top: 8px;
      color: #D32F2F;
      &.success {
        color: var(--success-green);
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
  `]
})
export class CartComponent {
  shopService = inject(ShopService);

  couponCode = 'WELCOME300';
  couponMessage = 'Coupon WELCOME300 applied (₹300 savings)';
  couponSuccess = true;

  applyCoupon() {
    if (this.couponCode.toUpperCase() === 'WELCOME300') {
      this.shopService.cartDiscount.set(300);
      this.couponMessage = 'Coupon WELCOME300 applied (₹300 savings)';
      this.couponSuccess = true;
    } else if (this.couponCode.toUpperCase() === 'FESTIVE15') {
      const discount = Math.round(this.shopService.cartSubtotal() * 0.15);
      this.shopService.cartDiscount.set(discount);
      this.couponMessage = `Coupon FESTIVE15 applied (₹${discount} savings)`;
      this.couponSuccess = true;
    } else {
      this.couponMessage = 'Invalid coupon code';
      this.couponSuccess = false;
    }
  }
}


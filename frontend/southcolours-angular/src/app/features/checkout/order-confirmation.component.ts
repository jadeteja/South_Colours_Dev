import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container confirmation-page">
      <div class="confirmation-card">
        <!-- Playful Illustration / Check Icon Matching Reference Screen 6 -->
        <div class="illustration-box">
          <div class="bunny-circle">
            <span class="bunny-emoji">🐰👧</span>
          </div>
          <div class="check-badge">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>

        <h1 class="congrats-title">Order Placed Successfully!</h1>
        <p class="thank-you-sub">
          Thank you for shopping with Southcolours.<br>
          Your order has been placed and will be processed soon.
        </p>

        <!-- Order Metadata Details Box Matching Screen 6 -->
        <div class="order-details-table">
          <div class="detail-row">
            <span class="detail-key">Order Number</span>
            <span class="detail-val order-num">#{{ orderNumber }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Order Date</span>
            <span class="detail-val">{{ orderDate }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Total Amount</span>
            <span class="detail-val total-amt">₹ {{ totalAmount | number }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="actions-group">
          <a routerLink="/" class="btn-primary continue-btn">Continue Shopping</a>
          <a routerLink="/orders" class="view-orders-link">View My Orders</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-page {
      padding: 60px 20px 80px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .confirmation-card {
      background: #FFFFFF;
      border: 1px solid var(--border-pink);
      border-radius: 28px;
      padding: 50px 60px;
      text-align: center;
      max-width: 580px;
      width: 100%;
      box-shadow: 0 10px 35px rgba(255, 64, 129, 0.08);
    }
    .illustration-box {
      position: relative;
      display: inline-block;
      margin-bottom: 24px;
      .bunny-circle {
        width: 120px;
        height: 120px;
        background: #FFF0F5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #FFD6E7;
        .bunny-emoji {
          font-size: 52px;
        }
      }
      .check-badge {
        position: absolute;
        bottom: 0;
        right: -8px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #FF4081;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #FFFFFF;
        box-shadow: 0 4px 10px rgba(255, 64, 129, 0.4);
      }
    }
    .congrats-title {
      font-size: 28px;
      color: var(--dark-navy);
      margin-bottom: 10px;
    }
    .thank-you-sub {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 30px;
    }
    .order-details-table {
      background: #FFF9FB;
      border: 1px solid var(--border-pink);
      border-radius: 14px;
      padding: 16px 24px;
      margin-bottom: 30px;
      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #F6E2EB;
        &:last-child {
          border-bottom: none;
        }
        .detail-key {
          font-size: 14px;
          color: var(--text-muted);
        }
        .detail-val {
          font-size: 14px;
          font-weight: 700;
          color: var(--dark-navy);
          &.order-num {
            color: var(--dark-navy);
            letter-spacing: 0.5px;
          }
          &.total-amt {
            font-size: 16px;
            color: var(--dark-navy);
          }
        }
      }
    }
    .actions-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      .continue-btn {
        width: 100%;
        padding: 14px 0;
        font-size: 15px;
      }
      .view-orders-link {
        font-size: 14px;
        font-weight: 700;
        color: var(--primary-pink);
        &:hover {
          text-decoration: underline;
        }
      }
    }

    @media (max-width: 600px) {
      .confirmation-page {
        padding: 16px 12px 32px;
      }
      .confirmation-card {
        padding: 30px 18px;
        border-radius: 20px;
      }
      .congrats-title {
        font-size: 22px;
      }
      .order-details-table {
        padding: 12px 14px;
        .detail-row {
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
          .detail-val {
            align-self: flex-end;
          }
        }
      }
    }
  `]
})
export class OrderConfirmationComponent {
  route = inject(ActivatedRoute);

  orderNumber = 'SC123456';
  orderDate = '12 May 2026';
  totalAmount = 5697;

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['orderId']) this.orderNumber = params['orderId'];
      if (params['date']) this.orderDate = params['date'];
      if (params['amount']) this.totalAmount = Number(params['amount']);
    });
  }
}


import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { InvoiceModalComponent } from '../../shared/components/invoice-modal.component';
import { ReviewModalComponent, ReviewTargetItem } from '../../shared/components/review-modal.component';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule, InvoiceModalComponent, ReviewModalComponent],
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

        <!-- Purchased Items & Review CTA Banner -->
        @if (orderDetails?.items && orderDetails.items.length > 0) {
          <div class="purchased-items-review-box">
            <div class="section-badge">⭐ Share Your Thoughts</div>
            <h3 class="box-title">Review Your Purchased Items</h3>
            <p class="box-subtitle">How did your items fit? Leave a review to help others!</p>
            <div class="items-list">
              @for (item of orderDetails.items; track item.id || item.productName) {
                <div class="purchased-item-row">
                  <img
                    [src]="item.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'"
                    [alt]="item.productName"
                    class="item-img"
                  />
                  <div class="item-meta">
                    <span class="item-name">{{ item.productName }}</span>
                    @if (item.sizeName) {
                      <span class="item-size">Size: {{ item.sizeName }}</span>
                    }
                  </div>
                  <button
                    type="button"
                    class="btn-item-review"
                    (click)="openReviewModal(item)"
                    title="Write a review"
                  >
                    ⭐ Write Review
                  </button>
                </div>
              }
            </div>
          </div>
        } @else {
          <!-- Fallback Review Prompt for the Order -->
          <div class="review-prompt-card">
            <div class="prompt-icon">⭐</div>
            <div class="prompt-text">
              <h4>Enjoying your Southcolours shopping?</h4>
              <p>We'd love to hear your feedback on your latest order experience.</p>
            </div>
            <button
              type="button"
              class="btn-item-review"
              (click)="openReviewModalForOrder()"
            >
              Review Experience
            </button>
          </div>
        }

        <!-- Action Buttons -->
        <div class="actions-group">
          <button class="btn-invoice" (click)="openInvoice()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Download / View Tax Invoice
          </button>
          <a routerLink="/" class="btn-primary continue-btn">Continue Shopping</a>
          <a routerLink="/orders" class="view-orders-link">View My Orders</a>
        </div>
      </div>
    </div>

    @if (showInvoiceModal) {
      <app-invoice-modal [order]="orderDetails" (close)="showInvoiceModal = false"></app-invoice-modal>
    }

    @if (selectedReviewItem) {
      <app-review-modal [item]="selectedReviewItem" (close)="selectedReviewItem = null"></app-review-modal>
    }
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
      margin-bottom: 24px;
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
    .purchased-items-review-box {
      background: linear-gradient(135deg, #FFF9FB 0%, #FFFFFF 100%);
      border: 1.5px solid var(--border-pink, #FFD6E7);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
      text-align: left;

      .section-badge {
        display: inline-block;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        color: var(--primary-pink, #FF4081);
        background: #FFF0F5;
        padding: 2px 8px;
        border-radius: 6px;
        margin-bottom: 6px;
      }
      .box-title {
        font-size: 17px;
        font-weight: 800;
        color: var(--dark-navy);
        margin: 0 0 4px;
      }
      .box-subtitle {
        font-size: 13px;
        color: var(--text-muted);
        margin: 0 0 16px;
      }
      .items-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .purchased-item-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        background: #FFFFFF;
        border: 1px solid #F1F5F9;
        border-radius: 10px;

        .item-img {
          width: 44px;
          height: 52px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
        }
        .item-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          .item-name {
            font-size: 13px;
            font-weight: 700;
            color: var(--dark-navy);
          }
          .item-size {
            font-size: 12px;
            color: #64748B;
          }
        }
        .btn-item-review {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #FFF0F5;
          color: var(--primary-pink, #FF4081);
          border: 1.5px solid #FFD6E7;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;

          &:hover {
            background: var(--primary-pink, #FF4081);
            color: #FFFFFF;
            border-color: var(--primary-pink, #FF4081);
            box-shadow: 0 2px 8px rgba(255, 64, 129, 0.3);
          }
        }
      }
    }
    .review-prompt-card {
      display: flex;
      align-items: center;
      gap: 14px;
      background: #FFF9FB;
      border: 1px dashed var(--border-pink, #FFD6E7);
      border-radius: 14px;
      padding: 16px 20px;
      margin-bottom: 24px;
      text-align: left;

      .prompt-icon {
        font-size: 26px;
      }
      .prompt-text {
        flex: 1;
        h4 {
          font-size: 14px;
          font-weight: 700;
          color: var(--dark-navy);
          margin: 0 0 2px;
        }
        p {
          font-size: 12px;
          color: var(--text-muted);
          margin: 0;
        }
      }
      .btn-item-review {
        background: #FFF0F5;
        color: var(--primary-pink, #FF4081);
        border: 1.5px solid #FFD6E7;
        padding: 8px 14px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;

        &:hover {
          background: var(--primary-pink, #FF4081);
          color: #FFFFFF;
          border-color: var(--primary-pink, #FF4081);
        }
      }
    }
    .actions-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      .btn-invoice {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: #F1F5F9;
        color: #0F172A;
        border: 1.5px solid #CBD5E1;
        padding: 12px 0;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
        &:hover {
          background: #E2E8F0;
          border-color: #94A3B8;
        }
      }
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
export class OrderConfirmationComponent implements OnInit {
  route = inject(ActivatedRoute);
  shopService = inject(ShopService);

  orderNumber = 'SC123456';
  orderDate = '12 May 2026';
  totalAmount = 5697;
  orderDetails: any = null;
  showInvoiceModal = false;
  selectedReviewItem: ReviewTargetItem | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['orderId']) {
        this.orderNumber = params['orderId'];
        this.fetchOrderDetails(this.orderNumber);
      }
      if (params['date']) this.orderDate = params['date'];
      if (params['amount']) this.totalAmount = Number(params['amount']);
    });
  }

  fetchOrderDetails(orderNum: string) {
    this.shopService.getOrderByNumber(orderNum).subscribe({
      next: (order) => {
        this.orderDetails = order;
      },
      error: () => {
        // Fallback default structure
        this.orderDetails = {
          orderNumber: this.orderNumber,
          createdAtUtc: new Date(),
          totalAmount: this.totalAmount,
          subTotal: this.totalAmount,
          shippingFee: 0,
          discountAmount: 0,
          shippingName: 'Customer',
          items: []
        };
      }
    });
  }

  openInvoice() {
    if (!this.orderDetails) {
      this.orderDetails = {
        orderNumber: this.orderNumber,
        createdAtUtc: new Date(),
        totalAmount: this.totalAmount,
        subTotal: this.totalAmount,
        shippingFee: 0,
        discountAmount: 0,
        shippingName: 'Customer',
        items: []
      };
    }
    this.showInvoiceModal = true;
  }

  openReviewModal(item: any) {
    this.selectedReviewItem = {
      productId: item.productId || 'p-dummy',
      productName: item.productName || 'Southcolours Fashion Apparel',
      sizeName: item.sizeName,
      colorName: item.colorName,
      imageUrl: item.imageUrl,
      orderNumber: this.orderNumber
    };
  }

  openReviewModalForOrder() {
    this.selectedReviewItem = {
      productId: 'p-order-' + this.orderNumber,
      productName: `Order #${this.orderNumber} Products`,
      orderNumber: this.orderNumber
    };
  }
}


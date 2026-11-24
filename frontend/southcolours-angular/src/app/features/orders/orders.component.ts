import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { InvoiceModalComponent } from '../../shared/components/invoice-modal.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, InvoiceModalComponent],
  template: `
    <div class="container account-page">
      <div class="account-layout">
        <!-- Left Sidebar Navigation Matching Reference Screen 7 -->
        <aside class="account-sidebar">
          <div class="account-card">
            <h3 class="sidebar-heading">My Account</h3>
            <ul class="nav-list">
              <li>
                <a routerLink="/orders" class="active">
                  <span class="icon">📦</span> My Orders
                </a>
              </li>
              <li>
                <a routerLink="/profile">
                  <span class="icon">👤</span> My Profile
                </a>
              </li>
              <li>
                <a routerLink="/addresses">
                  <span class="icon">📍</span> Addresses
                </a>
              </li>
              <li>
                <a routerLink="/wishlist">
                  <span class="icon">♡</span> Wishlist
                </a>
              </li>
              <li>
                <a routerLink="/payments">
                  <span class="icon">💳</span> Payments
                </a>
              </li>
              <li class="logout-item">
                <a routerLink="/auth/login">
                  <span class="icon">🚪</span> Logout
                </a>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Right Orders List Matching Screen 7 -->
        <main class="orders-main">
          <div class="orders-header">
            <h1 class="page-title">My Orders</h1>
            <!-- Status Tabs -->
            <div class="status-tabs">
              <button class="status-tab" [class.active]="selectedTab === 'All'" (click)="selectedTab = 'All'">All Orders</button>
              <button class="status-tab" [class.active]="selectedTab === 'Processing'" (click)="selectedTab = 'Processing'">Processing</button>
              <button class="status-tab" [class.active]="selectedTab === 'Shipped'" (click)="selectedTab = 'Shipped'">Shipped</button>
              <button class="status-tab" [class.active]="selectedTab === 'Delivered'" (click)="selectedTab = 'Delivered'">Delivered</button>
            </div>
          </div>

          <div class="orders-cards-list">
            @for (order of filteredOrders(); track order.id || order.orderNumber) {
              <div class="order-card">
                <div class="order-topbar">
                  <div class="meta-group">
                    <span class="order-id">Order #{{ order.orderNumber }}</span>
                    <span class="order-date">{{ formatDate(order.createdAtUtc) }}</span>
                  </div>
                  <span class="badge-status" [ngClass]="getStatusClass(order.status)">
                    {{ getStatusText(order.status) }}
                  </span>
                </div>

                <div class="order-items-sublist">
                  @for (item of order.items; track item.id || item.productName) {
                    <div class="order-item-row">
                      <img [src]="item.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'" [alt]="item.productName" class="item-thumb" />
                      <div class="item-info">
                        <h4 class="item-title">{{ item.productName }} (Size: {{ item.sizeName || 'Standard' }})</h4>
                        <div class="item-subinfo">Qty: {{ item.quantity }} × ₹ {{ item.unitPrice | number }}</div>
                      </div>
                      <span class="item-amt">₹ {{ (item.unitPrice * item.quantity) | number }}</span>
                    </div>
                  } @empty {
                    <div class="order-item-row">
                      <div class="item-info">
                        <h4 class="item-title">Fashion Apparel Order</h4>
                      </div>
                      <span class="item-amt">₹ {{ order.totalAmount | number }}</span>
                    </div>
                  }
                </div>

                <div class="order-footer">
                  <div class="total-group">
                    <span class="label">Total</span>
                    <span class="value">₹ {{ order.totalAmount | number }}</span>
                  </div>
                  <div class="footer-actions">
                    <button class="btn-invoice-outline" (click)="viewInvoice(order)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                      </svg>
                      Invoice
                    </button>
                    <button class="btn-secondary view-details-btn" (click)="viewInvoice(order)">View Details</button>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="empty-orders-card">
                <span class="empty-icon">📦</span>
                <h3>No orders found</h3>
                <p>Looks like you haven't placed any orders in this category yet.</p>
                <a routerLink="/products" class="btn-primary start-shopping-btn">Explore Collections</a>
              </div>
            }
          </div>
        </main>
      </div>
    </div>

    @if (selectedInvoiceOrder) {
      <app-invoice-modal [order]="selectedInvoiceOrder" (close)="selectedInvoiceOrder = null"></app-invoice-modal>
    }
  `,
  styles: [`
    .account-page {
      padding: 30px 20px 60px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .account-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 36px;
      align-items: start;
    }
    .account-card {
      background: #FFFFFF;
      border: 1px solid var(--border-pink);
      border-radius: var(--radius-md);
      padding: 20px 16px;
    }
    .sidebar-heading {
      font-size: 16px;
      color: var(--dark-navy);
      margin-bottom: 16px;
      padding-left: 10px;
    }
    .nav-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
      li a {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-dark);
        &:hover {
          background-color: var(--primary-pink-light);
          color: var(--primary-pink);
        }
        &.active {
          background-color: var(--primary-pink-light);
          color: var(--primary-pink);
          font-weight: 700;
        }
      }
      .logout-item {
        border-top: 1px solid var(--border-pink);
        margin-top: 10px;
        padding-top: 10px;
      }
    }
    .page-title {
      font-size: 24px;
      color: var(--dark-navy);
      margin-bottom: 18px;
    }
    .status-tabs {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border-pink);
      padding-bottom: 10px;
      .status-tab {
        background: transparent;
        font-size: 13px;
        font-weight: 700;
        color: var(--text-muted);
        padding: 6px 12px;
        border-radius: 9999px;
        &.active {
          background-color: var(--primary-pink-light);
          color: var(--primary-pink);
        }
      }
    }
    .orders-cards-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .order-card {
      background: #FFFFFF;
      border: 1px solid var(--border-pink);
      border-radius: var(--radius-md);
      padding: 20px;
    }
    .order-topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 14px;
      border-bottom: 1px solid #FFF0F5;
      .meta-group {
        display: flex;
        gap: 16px;
        align-items: center;
        .order-id {
          font-size: 14px;
          font-weight: 800;
          color: var(--dark-navy);
        }
        .order-date {
          font-size: 13px;
          color: var(--text-muted);
        }
      }
      .badge-status {
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 700;
        &.delivered {
          background-color: #E8F5E9;
          color: #2E7D32;
        }
        &.shipped {
          background-color: #E3F2FD;
          color: #1565C0;
        }
      }
    }
    .order-items-sublist {
      padding: 14px 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .order-item-row {
      display: flex;
      align-items: center;
      gap: 14px;
      .item-thumb {
        width: 48px;
        height: 56px;
        object-fit: cover;
        border-radius: 6px;
      }
      .item-info {
        flex: 1;
        .item-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--dark-navy);
        }
      }
      .item-amt {
        font-size: 14px;
        font-weight: 700;
        color: var(--dark-navy);
      }
    }
    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      border-top: 1px solid #FFF0F5;
      .total-group {
        display: flex;
        align-items: baseline;
        gap: 10px;
        .label {
          font-size: 13px;
          color: var(--text-muted);
        }
        .value {
          font-size: 18px;
          font-weight: 800;
          color: var(--dark-navy);
        }
      }
      .footer-actions {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .btn-invoice-outline {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: transparent;
        border: 1px solid #CBD5E1;
        color: #334155;
        padding: 6px 14px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
        &:hover {
          background: #F1F5F9;
          border-color: #94A3B8;
        }
      }
      .view-details-btn {
        padding: 6px 18px;
        font-size: 13px;
      }
    }

    .empty-orders-card {
      text-align: center;
      padding: 48px 20px;
      background: #FFFFFF;
      border: 1px solid var(--border-pink);
      border-radius: var(--radius-md);
      .empty-icon {
        font-size: 40px;
        display: block;
        margin-bottom: 12px;
      }
      h3 {
        color: var(--dark-navy);
        margin-bottom: 6px;
      }
      p {
        color: var(--text-muted);
        font-size: 14px;
        margin-bottom: 18px;
      }
      .start-shopping-btn {
        display: inline-block;
        padding: 10px 24px;
      }
    }

    @media (max-width: 900px) {
      .account-page {
        padding: 14px 14px 40px;
      }
      .account-layout {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      .nav-list {
        flex-direction: row;
        overflow-x: auto;
        padding-bottom: 4px;
        li a {
          white-space: nowrap;
        }
      }
    }

    @media (max-width: 600px) {
      .account-page {
        padding: 8px 10px 28px;
      }
      .sidebar-heading, .orders-heading {
        font-size: 18px;
        margin-bottom: 12px;
      }
      .account-card, .order-card {
        padding: 14px 12px;
      }
      .status-tabs {
        overflow-x: auto;
        white-space: nowrap;
        gap: 6px;
      }
      .order-topbar {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      .order-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        .view-details-btn {
          width: 100%;
        }
      }
    }
  `]
})
export class OrdersComponent implements OnInit {
  shopService = inject(ShopService);
  selectedTab = 'All';
  orders: any[] = [];
  selectedInvoiceOrder: any = null;

  ngOnInit() {
    this.shopService.getOrders().subscribe({
      next: (data: any[]) => {
        if (data && data.length > 0) {
          this.orders = data;
        } else {
          this.orders = [];
        }
      },
      error: () => {
        this.orders = [];
      }
    });
  }

  formatDate(dateVal: any): string {
    if (!dateVal) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    return new Date(dateVal).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getStatusText(status: any): string {
    if (typeof status === 'number') {
      const map = ['Pending Payment', 'Payment Failed', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancellation Requested', 'Cancelled', 'Return Requested', 'Return Approved', 'Returned', 'Refund Pending', 'Refunded'];
      return map[status] || 'Pending';
    }
    return status || 'Pending';
  }

  getStatusClass(status: any): string {
    const text = this.getStatusText(status).toLowerCase();
    if (text.includes('delivered')) return 'delivered';
    if (text.includes('shipped')) return 'shipped';
    if (text.includes('processing')) return 'processing';
    if (text.includes('cancelled')) return 'cancelled';
    return 'confirmed';
  }

  filteredOrders(): any[] {
    if (this.selectedTab === 'All') return this.orders;
    return this.orders.filter(o => this.getStatusText(o.status).toLowerCase().includes(this.selectedTab.toLowerCase()));
  }

  viewInvoice(order: any) {
    this.selectedInvoiceOrder = order;
  }
}


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
            <!-- Order 1 (#SC123456 - Delivered) -->
            <div class="order-card">
              <div class="order-topbar">
                <div class="meta-group">
                  <span class="order-id">Order #SC123456</span>
                  <span class="order-date">12 May 2026</span>
                </div>
                <span class="badge-status delivered">Delivered</span>
              </div>

              <div class="order-items-sublist">
                <div class="order-item-row">
                  <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80" alt="Pink Lehenga Set" class="item-thumb" />
                  <div class="item-info">
                    <h4 class="item-title">Pink Lehenga Set (Size: 3-4Y)</h4>
                  </div>
                  <span class="item-amt">₹ 2,499</span>
                </div>

                <div class="order-item-row">
                  <img src="https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=400&q=80" alt="Yellow Anarkali" class="item-thumb" />
                  <div class="item-info">
                    <h4 class="item-title">Yellow Anarkali (Size: 2-3Y)</h4>
                  </div>
                  <span class="item-amt">₹ 1,899</span>
                </div>
              </div>

              <div class="order-footer">
                <div class="total-group">
                  <span class="label">Total</span>
                  <span class="value">₹ 4,398</span>
                </div>
                <button class="btn-secondary view-details-btn">View Details</button>
              </div>
            </div>

            <!-- Order 2 (#SC123321 - Shipped) -->
            <div class="order-card">
              <div class="order-topbar">
                <div class="meta-group">
                  <span class="order-id">Order #SC123321</span>
                  <span class="order-date">05 May 2026</span>
                </div>
                <span class="badge-status shipped">Shipped</span>
              </div>

              <div class="order-items-sublist">
                <div class="order-item-row">
                  <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80" alt="Boy's Kurta Set" class="item-thumb" />
                  <div class="item-info">
                    <h4 class="item-title">Boy's Kurta Set (Size: 4-5Y)</h4>
                  </div>
                  <span class="item-amt">₹ 1,599</span>
                </div>
              </div>

              <div class="order-footer">
                <div class="total-group">
                  <span class="label">Total</span>
                  <span class="value">₹ 1,599</span>
                </div>
                <button class="btn-secondary view-details-btn">View Details</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
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
      .view-details-btn {
        padding: 6px 18px;
        font-size: 13px;
      }
    }

    @media (max-width: 900px) {
      .account-layout {
        grid-template-columns: 1fr;
        gap: 24px;
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
export class OrdersComponent {
  selectedTab = 'All';
}


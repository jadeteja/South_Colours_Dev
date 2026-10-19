import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-wrapper">
      <aside class="admin-sidebar">
        <div class="sidebar-brand">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FF4081" stroke-width="2.2">
            <circle cx="12" cy="12" r="3" fill="#FF4081"/>
            <path d="M12 2a4 4 0 0 0-4 4c0 2 2 3 4 3s4-1 4-3a4 4 0 0 0-4-4z" fill="#FFD6E7"/>
            <path d="M12 22a4 4 0 0 0 4-4c0-2-2-3-4-3s-4 1-4 3a4 4 0 0 0 4 4z" fill="#FFD6E7"/>
            <path d="M2 12a4 4 0 0 0 4 4c2 0 3-2 3-4s-1-4-3-4a4 4 0 0 0-4 4z" fill="#FFD6E7"/>
            <path d="M22 12a4 4 0 0 0-4-4c-2 0-3 2-3 4s1 4 3 4a4 4 0 0 0 4-4z" fill="#FFD6E7"/>
          </svg>
          <span class="brand-text">Southcolours</span>
          <span class="panel-tag">| Admin Panel</span>
        </div>

        <nav class="sidebar-menu">
          <a routerLink="/admin/dashboard" class="menu-item active-item">
            <span class="menu-icon">📊</span> Dashboard
          </a>
          <a routerLink="/admin/products" class="menu-item">
            <span class="menu-icon">📦</span> Products
          </a>
          <a routerLink="/admin/products/add" class="sub-item">
            <span class="menu-icon">➕</span> Add Product
          </a>
          <a routerLink="/admin/orders" class="menu-item">
            <span class="menu-icon">🛒</span> Orders
          </a>
          <a routerLink="/admin/customers" class="menu-item">
            <span class="menu-icon">👥</span> Customers
          </a>
          <a routerLink="/admin/categories" class="menu-item">
            <span class="menu-icon">📑</span> Categories
          </a>
          <a routerLink="/admin/banners" class="menu-item">
            <span class="menu-icon">🖼️</span> Banners
          </a>
          <a routerLink="/admin/reviews" class="menu-item">
            <span class="menu-icon">⭐</span> Reviews
          </a>
          <a routerLink="/admin/coupons" class="menu-item">
            <span class="menu-icon">🏷️</span> Coupons
          </a>
          <a routerLink="/admin/reports" class="menu-item">
            <span class="menu-icon">📈</span> Reports
          </a>
          <a routerLink="/admin/settings" class="menu-item">
            <span class="menu-icon">⚙️</span> Settings
          </a>
          <div class="sidebar-footer">
            <a routerLink="/" class="menu-item logout-link">
              <span class="menu-icon">🚪</span> Back to Website
            </a>
          </div>
        </nav>
      </aside>

      <main class="admin-main">
        <header class="admin-header">
          <div class="header-right">
            <button class="icon-btn">🔔</button>
            <div class="admin-profile-pill">
              <span class="avatar">👨‍💼</span>
              <span class="admin-name">Admin</span>
            </div>
          </div>
        </header>

        <div class="dashboard-container">
          <div class="dashboard-header">
            <h1 class="page-title">Executive Overview</h1>
            <p class="page-sub">Real-time revenue, order volume, and catalog inventory metrics.</p>
          </div>

          <!-- KPI Cards Grid Matching Requirements -->
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-label">Today's Sales</span>
                <span class="kpi-icon">💰</span>
              </div>
              <div class="kpi-value">₹ 28,490</div>
              <div class="kpi-trend positive">↑ 14% vs yesterday</div>
            </div>

            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-label">Monthly Revenue</span>
                <span class="kpi-icon">📈</span>
              </div>
              <div class="kpi-value">₹ 4,82,650</div>
              <div class="kpi-trend positive">↑ 22% vs last month</div>
            </div>

            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-label">Total Orders</span>
                <span class="kpi-icon">🛒</span>
              </div>
              <div class="kpi-value">184</div>
              <div class="kpi-trend">8 pending fulfillment</div>
            </div>

            <div class="kpi-card">
              <div class="kpi-header">
                <span class="kpi-label">Total Products</span>
                <span class="kpi-icon">👗</span>
              </div>
              <div class="kpi-value">10 Active</div>
              <div class="kpi-trend">6 size variants / item</div>
            </div>
          </div>

          <!-- Visual Analytics & Recent Orders -->
          <div class="dashboard-grid-2">
            <!-- Category Performance -->
            <div class="card-chart">
              <h3 class="chart-title">Best-Selling Categories</h3>
              <div class="category-bars">
                <div class="bar-row">
                  <div class="bar-labels"><span>Girls Ethnic Wear</span> <span>62%</span></div>
                  <div class="bar-track"><div class="bar-fill" style="width: 62%; background: #FF4081;"></div></div>
                </div>
                <div class="bar-row">
                  <div class="bar-labels"><span>Boys Kurtas & Sets</span> <span>24%</span></div>
                  <div class="bar-track"><div class="bar-fill" style="width: 24%; background: #1976D2;"></div></div>
                </div>
                <div class="bar-row">
                  <div class="bar-labels"><span>Baby Wear Rompers</span> <span>14%</span></div>
                  <div class="bar-track"><div class="bar-fill" style="width: 14%; background: #FFA000;"></div></div>
                </div>
              </div>
            </div>

            <!-- Recent Orders Snippet -->
            <div class="card-chart">
              <div class="chart-header-row">
                <h3 class="chart-title">Recent Transactions</h3>
                <a routerLink="/admin/orders" class="view-link">View All →</a>
              </div>
              <div class="recent-list">
                <div class="recent-item">
                  <div class="item-left">
                    <strong>#SC123456</strong>
                    <span>Priya Sharma • Bangalore</span>
                  </div>
                  <div class="item-right">
                    <span class="amt">₹ 4,398</span>
                    <span class="badge delivered">Delivered</span>
                  </div>
                </div>
                <div class="recent-item">
                  <div class="item-left">
                    <strong>#SC123321</strong>
                    <span>Ananya Rao • Hyderabad</span>
                  </div>
                  <div class="item-right">
                    <span class="amt">₹ 1,599</span>
                    <span class="badge shipped">Shipped</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-wrapper {
      display: flex;
      min-height: 100vh;
      background: #F8FAFC;
    }
    .admin-sidebar {
      width: 250px;
      background-color: var(--dark-navy);
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
    }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 22px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      .brand-text {
        font-size: 18px;
        font-weight: 800;
        color: var(--primary-pink);
      }
      .panel-tag {
        font-size: 12px;
        color: #94A3B8;
      }
    }
    .sidebar-menu {
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      .menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #CBD5E1;
        &:hover, &.active-item {
          background-color: rgba(255, 64, 129, 0.15);
          color: #FFFFFF;
        }
        &.active-item {
          color: var(--primary-pink);
        }
      }
      .sub-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 14px 8px 36px;
        font-size: 13px;
        color: #94A3B8;
      }
      .sidebar-footer {
        margin-top: auto;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
    }
    .admin-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .admin-header {
      background: #FFFFFF;
      padding: 14px 32px;
      display: flex;
      justify-content: flex-end;
      border-bottom: 1px solid #E2E8F0;
      .header-right {
        display: flex;
        align-items: center;
        gap: 20px;
        .icon-btn {
          background: transparent;
          font-size: 18px;
        }
        .admin-profile-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F1F5F9;
          padding: 6px 14px;
          border-radius: 9999px;
          .admin-name {
            font-size: 13px;
            font-weight: 700;
            color: var(--dark-navy);
          }
        }
      }
    }
    .dashboard-container {
      padding: 32px;
    }
    .dashboard-header {
      margin-bottom: 24px;
      .page-title {
        font-size: 24px;
        color: var(--dark-navy);
      }
      .page-sub {
        font-size: 14px;
        color: var(--text-muted);
        margin-top: 4px;
      }
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 28px;
    }
    .kpi-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 20px;
      .kpi-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        .kpi-label {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 600;
        }
      }
      .kpi-value {
        font-size: 24px;
        font-weight: 800;
        color: var(--dark-navy);
        margin-bottom: 6px;
      }
      .kpi-trend {
        font-size: 12px;
        color: var(--text-muted);
        &.positive {
          color: #16A34A;
          font-weight: 700;
        }
      }
    }
    .dashboard-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .card-chart {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 24px;
      .chart-title {
        font-size: 16px;
        color: var(--dark-navy);
        margin-bottom: 18px;
      }
      .chart-header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 18px;
        .view-link {
          font-size: 13px;
          font-weight: 700;
          color: var(--primary-pink);
        }
      }
    }
    .category-bars {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .bar-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      .bar-labels {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        font-weight: 600;
        color: var(--dark-navy);
      }
      .bar-track {
        height: 8px;
        background: #F1F5F9;
        border-radius: 9999px;
        overflow: hidden;
        .bar-fill {
          height: 100%;
          border-radius: 9999px;
        }
      }
    }
    .recent-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .recent-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 14px;
      background: #F8FAFC;
      border-radius: 8px;
      .item-left {
        display: flex;
        flex-direction: column;
        strong {
          font-size: 13px;
          color: var(--dark-navy);
        }
        span {
          font-size: 12px;
          color: var(--text-muted);
        }
      }
      .item-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
        .amt {
          font-size: 14px;
          font-weight: 800;
          color: var(--dark-navy);
        }
        .badge {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 9999px;
          font-weight: 700;
          &.delivered { background: #DCFCE7; color: #166534; }
          &.shipped { background: #DBEAFE; color: #1E40AF; }
        }
      }
    }
  `]
})
export class AdminDashboardComponent {}


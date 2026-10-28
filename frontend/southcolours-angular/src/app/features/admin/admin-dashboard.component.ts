import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from '../../shared/components/admin-layout.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
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
    </app-admin-layout>
  `,
  styles: [`
    .dashboard-header {
      margin-bottom: 28px;
      .page-title {
        font-size: 26px;
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
      margin-bottom: 30px;
    }
    .kpi-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
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
        .kpi-icon {
          font-size: 18px;
        }
      }
      .kpi-value {
        font-size: 24px;
        font-weight: 800;
        color: var(--dark-navy);
        margin-bottom: 8px;
      }
      .kpi-trend {
        font-size: 12px;
        color: var(--text-muted);
        &.positive {
          color: #10B981;
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
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
      .chart-title {
        font-size: 16px;
        color: var(--dark-navy);
        margin-bottom: 20px;
      }
      .chart-header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        .chart-title {
          margin-bottom: 0;
        }
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

    @media (max-width: 1024px) {
      .kpi-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .dashboard-grid-2 {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }

    @media (max-width: 600px) {
      .kpi-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .dashboard-header .page-title {
        font-size: 22px;
      }
    }
  `]
})
export class AdminDashboardComponent {}

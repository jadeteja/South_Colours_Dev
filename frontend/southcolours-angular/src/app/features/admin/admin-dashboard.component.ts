import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from '../../shared/components/admin-layout.component';
import { ShopService } from '../../core/services/shop.service';

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
            <div class="kpi-value">₹ {{ stats.todaySales | number }}</div>
            <div class="kpi-trend" [class.positive]="stats.todaySales > 0">Live from verified orders</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-label">Monthly Revenue</span>
              <span class="kpi-icon">📈</span>
            </div>
            <div class="kpi-value">₹ {{ stats.monthlyRevenue | number }}</div>
            <div class="kpi-trend" [class.positive]="stats.monthlyRevenue > 0">Current month total</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-label">Total Orders</span>
              <span class="kpi-icon">🛒</span>
            </div>
            <div class="kpi-value">{{ stats.totalOrders }}</div>
            <div class="kpi-trend">{{ stats.pendingOrders }} pending fulfillment</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-label">Total Products</span>
              <span class="kpi-icon">👗</span>
            </div>
            <div class="kpi-value">{{ stats.totalProducts }} Active</div>
            <div class="kpi-trend">In database catalog</div>
          </div>
        </div>

        <!-- Visual Analytics & Recent Orders -->
        <div class="dashboard-grid-2">
          <!-- Category Performance -->
          <div class="card-chart">
            <h3 class="chart-title">Best-Selling Categories</h3>
            <div class="category-bars">
              @for (cat of topCategories; track cat.name) {
                <div class="bar-row">
                  <div class="bar-labels"><span>{{ cat.name }}</span> <span>{{ cat.percentage }}%</span></div>
                  <div class="bar-track"><div class="bar-fill" [style.width.%]="cat.percentage" [style.background]="cat.color"></div></div>
                </div>
              } @empty {
                <div style="color: #94A3B8; font-size: 13px; text-align: center; padding: 24px;">No order data available yet.</div>
              }
            </div>
          </div>

          <!-- Recent Orders Snippet -->
          <div class="card-chart">
            <div class="chart-header-row">
              <h3 class="chart-title">Recent Transactions</h3>
              <a routerLink="/admin/orders" class="view-link">View All →</a>
            </div>
            <div class="recent-list">
              @for (order of recentOrders; track order.id) {
                <div class="recent-item">
                  <div class="item-left">
                    <strong>#{{ order.orderNumber }}</strong>
                    <span>{{ order.customerName }} • {{ order.city }}</span>
                  </div>
                  <div class="item-right">
                    <span class="amt">₹ {{ order.totalAmount | number }}</span>
                    <span class="badge" [ngClass]="order.status.toLowerCase().replace(' ', '-')">{{ order.status }}</span>
                  </div>
                </div>
              } @empty {
                <div style="color: #94A3B8; font-size: 13px; text-align: center; padding: 24px;">No recent transactions.</div>
              }
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
          background: #F1F5F9;
          color: #475569;
          &.confirmed { background: #DCFCE7; color: #166534; }
          &.delivered { background: #DCFCE7; color: #166534; }
          &.shipped { background: #DBEAFE; color: #1E40AF; }
          &.pending { background: #FEF3C7; color: #92400E; }
          &.pending-payment { background: #FEF3C7; color: #92400E; }
          &.failed { background: #FEE2E2; color: #991B1B; }
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
export class AdminDashboardComponent implements OnInit {
  shopService = inject(ShopService);

  stats = {
    todaySales: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0
  };

  topCategories: { name: string; percentage: number; color: string }[] = [];
  recentOrders: any[] = [];

  ngOnInit() {
    this.loadData();
  }

  private normalizeStatus(status: any): string {
    if (typeof status === 'number') {
      const map = ['Pending Payment', 'Payment Failed', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancellation Requested', 'Cancelled', 'Return Requested', 'Return Approved', 'Returned', 'Refund Pending', 'Refunded'];
      return map[status] || 'Pending';
    }
    return status || 'Pending';
  }

  loadData() {
    this.shopService.getProducts().subscribe({
      next: (res) => {
        this.stats.totalProducts = res.totalItems || res.items?.length || 0;
      },
      error: () => {}
    });

    this.shopService.getOrders().subscribe({
      next: (orders: any[]) => {
        if (orders && orders.length > 0) {
          // Normalize status
          const parsedOrders = orders.map(o => ({
            ...o,
            normalizedStatus: this.normalizeStatus(o.status),
            isPaidOrConfirmed: (typeof o.status === 'number' ? o.status >= 2 && o.status <= 7 : (o.status !== 'PendingPayment' && o.status !== 'Pending Payment' && o.status !== 'PaymentFailed' && o.status !== 'Cancelled'))
          }));

          // Total verified/paid/COD orders only
          const paidOrders = parsedOrders.filter(o => o.isPaidOrConfirmed);

          this.stats.totalOrders = paidOrders.length;
          this.stats.pendingOrders = paidOrders.filter(o => o.normalizedStatus === 'Confirmed' || o.normalizedStatus === 'Processing' || o.normalizedStatus === 'Packed').length;
          this.stats.monthlyRevenue = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
          
          const today = new Date().toDateString();
          this.stats.todaySales = paidOrders
            .filter(o => new Date(o.createdAtUtc || o.createdAt).toDateString() === today)
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

          this.recentOrders = parsedOrders.slice(0, 5).map(o => ({
            id: o.id,
            orderNumber: o.orderNumber,
            customerName: o.shippingName || o.shippingAddress?.fullName || 'Customer',
            city: o.shippingCity || o.shippingAddress?.city || 'India',
            totalAmount: o.totalAmount,
            status: o.normalizedStatus
          }));
        } else {
          this.stats.totalOrders = 0;
          this.stats.pendingOrders = 0;
          this.stats.monthlyRevenue = 0;
          this.stats.todaySales = 0;
          this.recentOrders = [];
        }
      },
      error: () => {}
    });
  }
}

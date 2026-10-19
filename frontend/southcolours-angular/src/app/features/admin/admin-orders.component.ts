import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../core/services/shop.service';

interface OrderRow {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  phone: string;
  city: string;
  itemsCount: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
}

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-wrapper">
      <!-- Dark Navy Sidebar Matching Design System -->
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
          <a routerLink="/admin/dashboard" class="menu-item">
            <span class="menu-icon">📊</span> Dashboard
          </a>
          <a routerLink="/admin/products" class="menu-item">
            <span class="menu-icon">📦</span> Products
          </a>
          <a routerLink="/admin/products/add" class="sub-item">
            <span class="menu-icon">➕</span> Add Product
          </a>
          <a routerLink="/admin/orders" class="menu-item active-item">
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

      <!-- Main Admin Content Area -->
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

        <div class="orders-management-container">
          <div class="page-top-row">
            <div>
              <h1 class="page-title">Orders Management</h1>
              <p class="page-sub">Track customer purchases, assign shipments, and fulfill orders.</p>
            </div>
            <div class="quick-stats">
              <div class="stat-pill"><span class="pill-label">Total:</span> <strong>{{ orders.length }} Orders</strong></div>
              <div class="stat-pill"><span class="pill-label">Revenue:</span> <strong class="pink-text">₹ 14,394</strong></div>
            </div>
          </div>

          <!-- Filter & Search Bar -->
          <div class="table-controls-card">
            <div class="search-input-wrap">
              <input type="text" placeholder="Search by Order #, Customer, Phone..." [(ngModel)]="searchTerm" class="search-field" />
            </div>

            <div class="filter-tabs">
              <button class="filter-tab" [class.active]="selectedStatus === 'All'" (click)="selectedStatus = 'All'">All</button>
              <button class="filter-tab" [class.active]="selectedStatus === 'Processing'" (click)="selectedStatus = 'Processing'">Processing</button>
              <button class="filter-tab" [class.active]="selectedStatus === 'Shipped'" (click)="selectedStatus = 'Shipped'">Shipped</button>
              <button class="filter-tab" [class.active]="selectedStatus === 'Delivered'" (click)="selectedStatus = 'Delivered'">Delivered</button>
            </div>
          </div>

          <!-- Data Table -->
          <div class="table-card">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>City</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (o of filteredOrders; track o.id) {
                  <tr>
                    <td class="order-id-cell">#{{ o.orderNumber }}</td>
                    <td>{{ o.date }}</td>
                    <td>
                      <div class="cust-info">
                        <strong>{{ o.customerName }}</strong>
                        <span class="phone-sub">{{ o.phone }}</span>
                      </div>
                    </td>
                    <td>{{ o.city }}</td>
                    <td>{{ o.itemsCount }} item(s)</td>
                    <td class="amt-cell">₹ {{ o.totalAmount | number }}</td>
                    <td>
                      <span class="pay-badge">{{ o.paymentMethod }}</span>
                    </td>
                    <td>
                      <span class="status-badge" [ngClass]="o.status.toLowerCase()">{{ o.status }}</span>
                    </td>
                    <td>
                      <div class="actions-cell">
                        <select [ngModel]="o.status" (ngModelChange)="updateStatus(o, $event)" class="status-select">
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
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
    .orders-management-container {
      padding: 32px;
    }
    .page-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      .quick-stats {
        display: flex;
        gap: 12px;
        .stat-pill {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          .pill-label {
            color: var(--text-muted);
            margin-right: 4px;
          }
          .pink-text {
            color: var(--primary-pink);
          }
        }
      }
    }
    .table-controls-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .search-field {
        width: 340px;
        padding: 8px 14px;
        border-radius: 8px;
        border: 1px solid #CBD5E1;
        font-size: 13px;
        outline: none;
        &:focus {
          border-color: var(--primary-pink);
        }
      }
      .filter-tabs {
        display: flex;
        gap: 8px;
        .filter-tab {
          background: #F1F5F9;
          border-radius: 6px;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 600;
          color: var(--dark-navy);
          &.active {
            background: var(--primary-pink);
            color: #FFFFFF;
          }
        }
      }
    }
    .table-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      overflow: hidden;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      th {
        background: #F8FAFC;
        padding: 12px 16px;
        text-align: left;
        font-weight: 700;
        color: #475569;
        border-bottom: 1px solid #E2E8F0;
      }
      td {
        padding: 14px 16px;
        border-bottom: 1px solid #F1F5F9;
        color: #1E293B;
      }
      .order-id-cell {
        font-weight: 800;
        color: var(--primary-pink);
      }
      .cust-info {
        display: flex;
        flex-direction: column;
        .phone-sub {
          font-size: 11px;
          color: #64748B;
        }
      }
      .amt-cell {
        font-weight: 700;
      }
      .pay-badge {
        background: #EFF6FF;
        color: #1E40AF;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
      }
      .status-badge {
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 700;
        &.delivered { background: #DCFCE7; color: #166534; }
        &.shipped { background: #DBEAFE; color: #1E40AF; }
        &.processing { background: #FEF3C7; color: #92400E; }
        &.confirmed { background: #F3E8FF; color: #6B21A8; }
        &.cancelled { background: #FEE2E2; color: #991B1B; }
      }
      .status-select {
        padding: 6px 10px;
        border-radius: 6px;
        border: 1px solid #CBD5E1;
        font-size: 12px;
        outline: none;
      }
    }
  `]
})
export class AdminOrdersComponent implements OnInit {
  shopService = inject(ShopService);
  selectedStatus = 'All';
  searchTerm = '';

  orders: OrderRow[] = [
    {
      id: '1',
      orderNumber: 'SC123456',
      date: '12 May 2026',
      customerName: 'Priya Sharma',
      phone: '9876543210',
      city: 'Bangalore',
      itemsCount: 2,
      totalAmount: 4398,
      paymentMethod: 'Razorpay (Card)',
      status: 'Delivered'
    },
    {
      id: '2',
      orderNumber: 'SC123321',
      date: '05 May 2026',
      customerName: 'Ananya Rao',
      phone: '9811223344',
      city: 'Hyderabad',
      itemsCount: 1,
      totalAmount: 1599,
      paymentMethod: 'UPI (GPay)',
      status: 'Shipped'
    },
    {
      id: '3',
      orderNumber: 'SC123789',
      date: '16 May 2026',
      customerName: 'Deepak Verma',
      phone: '9988776655',
      city: 'Chennai',
      itemsCount: 3,
      totalAmount: 5697,
      paymentMethod: 'Razorpay',
      status: 'Processing'
    },
    {
      id: '4',
      orderNumber: 'SC123999',
      date: '18 May 2026',
      customerName: 'Meera Patel',
      phone: '9123456789',
      city: 'Mumbai',
      itemsCount: 1,
      totalAmount: 2699,
      paymentMethod: 'Cash on Delivery',
      status: 'Confirmed'
    }
  ];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.shopService.getOrders().subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.orders = res.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            date: new Date(o.createdAtUtc).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            customerName: o.shippingName || 'Shopper',
            phone: o.shippingPhone || '—',
            city: o.shippingCity || 'India',
            itemsCount: o.items ? o.items.length : 1,
            totalAmount: o.totalAmount,
            paymentMethod: o.paymentMethod || 'Razorpay',
            status: o.status === 0 ? 'Confirmed' : o.status === 1 ? 'Processing' : o.status === 2 ? 'Shipped' : o.status === 3 ? 'Delivered' : 'Cancelled'
          }));
        }
      },
      error: () => {}
    });
  }

  get filteredOrders(): OrderRow[] {
    return this.orders.filter(o => {
      const matchStatus = this.selectedStatus === 'All' || o.status.toLowerCase() === this.selectedStatus.toLowerCase();
      const matchSearch = !this.searchTerm ||
        o.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        o.phone.includes(this.searchTerm);
      return matchStatus && matchSearch;
    });
  }

  updateStatus(order: OrderRow, newStatus: string) {
    order.status = newStatus;
    const statusEnum = newStatus === 'Confirmed' ? 0 : newStatus === 'Processing' ? 1 : newStatus === 'Shipped' ? 2 : newStatus === 'Delivered' ? 3 : 4;
    this.shopService.updateOrderFulfillment(order.id, { status: statusEnum }).subscribe({
      next: () => {},
      error: () => {}
    });
  }
}


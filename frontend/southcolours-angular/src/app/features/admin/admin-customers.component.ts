import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface CustomerRow {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
}

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-wrapper">
      <!-- Dark Navy Sidebar -->
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
          <a routerLink="/admin/orders" class="menu-item">
            <span class="menu-icon">🛒</span> Orders
          </a>
          <a routerLink="/admin/customers" class="menu-item active-item">
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

        <div class="customers-container">
          <div class="page-top-row">
            <div>
              <h1 class="page-title">Customers Directory</h1>
              <p class="page-sub">View registered accounts, customer lifetime values, and shopping behavior.</p>
            </div>
            <div class="quick-stats">
              <div class="stat-pill"><span class="pill-label">Total Registered:</span> <strong>{{ customers.length }}</strong></div>
              <div class="stat-pill"><span class="pill-label">Active Buyers:</span> <strong class="pink-text">100%</strong></div>
            </div>
          </div>

          <!-- Search & Filter Bar -->
          <div class="table-controls-card">
            <div class="search-input-wrap">
              <input type="text" placeholder="Search by name, email, phone or city..." [(ngModel)]="searchTerm" class="search-field" />
            </div>
            <div class="filter-count">
              <span>Showing <strong>{{ filteredCustomers.length }}</strong> customer(s)</span>
            </div>
          </div>

          <!-- Customers Table -->
          <div class="table-card">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Joined Date</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (c of filteredCustomers; track c.id) {
                  <tr>
                    <td>
                      <div class="cust-cell">
                        <div class="avatar-circle">{{ getInitials(c.fullName) }}</div>
                        <div class="name-block">
                          <strong>{{ c.fullName }}</strong>
                          <span class="email-sub">{{ c.email }}</span>
                        </div>
                      </div>
                    </td>
                    <td>{{ c.phoneNumber }}</td>
                    <td>{{ c.city }}, {{ c.state }}</td>
                    <td>{{ c.joinedDate }}</td>
                    <td><span class="badge-orders">{{ c.totalOrders }} orders</span></td>
                    <td class="spent-cell">₹ {{ c.totalSpent | number }}</td>
                    <td><span class="status-active">Active</span></td>
                    <td>
                      <button class="view-btn" (click)="viewCustomer(c)">View Profile</button>
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
    .admin-wrapper { display: flex; min-height: 100vh; background: #F8FAFC; }
    .admin-sidebar { width: 250px; background-color: var(--dark-navy); color: #FFFFFF; display: flex; flex-direction: column; }
    .sidebar-brand { display: flex; align-items: center; gap: 8px; padding: 22px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      .brand-text { font-size: 18px; font-weight: 800; color: var(--primary-pink); }
      .panel-tag { font-size: 12px; color: #94A3B8; }
    }
    .sidebar-menu { padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; flex: 1;
      .menu-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 8px; font-size: 14px; font-weight: 600; color: #CBD5E1;
        &:hover, &.active-item { background-color: rgba(255, 64, 129, 0.15); color: #FFFFFF; }
        &.active-item { color: var(--primary-pink); }
      }
      .sub-item { display: flex; align-items: center; gap: 10px; padding: 8px 14px 8px 36px; font-size: 13px; color: #94A3B8; }
      .sidebar-footer { margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
    }
    .admin-main { flex: 1; display: flex; flex-direction: column; }
    .admin-header { background: #FFFFFF; padding: 14px 32px; display: flex; justify-content: flex-end; border-bottom: 1px solid #E2E8F0;
      .header-right { display: flex; align-items: center; gap: 20px;
        .icon-btn { background: transparent; font-size: 18px; }
        .admin-profile-pill { display: flex; align-items: center; gap: 8px; background: #F1F5F9; padding: 6px 14px; border-radius: 9999px;
          .admin-name { font-size: 13px; font-weight: 700; color: var(--dark-navy); }
        }
      }
    }
    .customers-container { padding: 32px; }
    .page-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
      .page-title { font-size: 24px; color: var(--dark-navy); }
      .page-sub { font-size: 14px; color: var(--text-muted); margin-top: 4px; }
      .quick-stats { display: flex; gap: 12px;
        .stat-pill { background: #FFFFFF; border: 1px solid #E2E8F0; padding: 8px 16px; border-radius: 8px; font-size: 13px;
          .pill-label { color: var(--text-muted); margin-right: 4px; }
          .pink-text { color: var(--primary-pink); }
        }
      }
    }
    .table-controls-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
      .search-field { width: 360px; padding: 8px 14px; border-radius: 8px; border: 1px solid #CBD5E1; font-size: 13px; outline: none;
        &:focus { border-color: var(--primary-pink); }
      }
      .filter-count { font-size: 13px; color: var(--text-muted); }
    }
    .table-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 13px;
      th { background: #F8FAFC; padding: 12px 16px; text-align: left; font-weight: 700; color: #475569; border-bottom: 1px solid #E2E8F0; }
      td { padding: 14px 16px; border-bottom: 1px solid #F1F5F9; color: #1E293B; }
      .cust-cell { display: flex; align-items: center; gap: 12px;
        .avatar-circle { width: 36px; height: 36px; border-radius: 50%; background: #FFF0F5; color: var(--primary-pink); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; }
        .name-block { display: flex; flex-direction: column;
          .email-sub { font-size: 11px; color: #64748B; }
        }
      }
      .badge-orders { background: #F1F5F9; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; color: #475569; }
      .spent-cell { font-weight: 800; color: var(--dark-navy); }
      .status-active { background: #DCFCE7; color: #166534; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; }
      .view-btn { background: transparent; color: var(--primary-pink); font-weight: 700; font-size: 12px; border: 1px solid var(--border-pink); padding: 4px 10px; border-radius: 6px;
        &:hover { background: var(--primary-pink-light); }
      }
    }
  `]
})
export class AdminCustomersComponent implements OnInit {
  searchTerm = '';

  customers: CustomerRow[] = [
    {
      id: '1',
      fullName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phoneNumber: '9876543210',
      city: 'Bangalore',
      state: 'Karnataka',
      joinedDate: '10 Jan 2026',
      totalOrders: 3,
      totalSpent: 9896,
      status: 'Active'
    },
    {
      id: '2',
      fullName: 'Ananya Rao',
      email: 'ananya.rao@example.com',
      phoneNumber: '9811223344',
      city: 'Hyderabad',
      state: 'Telangana',
      joinedDate: '14 Feb 2026',
      totalOrders: 2,
      totalSpent: 4298,
      status: 'Active'
    },
    {
      id: '3',
      fullName: 'Deepak Verma',
      email: 'deepak.v@example.com',
      phoneNumber: '9988776655',
      city: 'Chennai',
      state: 'Tamil Nadu',
      joinedDate: '01 Mar 2026',
      totalOrders: 4,
      totalSpent: 12450,
      status: 'Active'
    },
    {
      id: '4',
      fullName: 'Meera Patel',
      email: 'meera.p@example.com',
      phoneNumber: '9123456789',
      city: 'Mumbai',
      state: 'Maharashtra',
      joinedDate: '12 Apr 2026',
      totalOrders: 1,
      totalSpent: 2699,
      status: 'Active'
    }
  ];

  ngOnInit() {}

  get filteredCustomers(): CustomerRow[] {
    if (!this.searchTerm) return this.customers;
    const term = this.searchTerm.toLowerCase();
    return this.customers.filter(c =>
      c.fullName.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phoneNumber.includes(term) ||
      c.city.toLowerCase().includes(term)
    );
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  viewCustomer(c: CustomerRow) {
    alert(`Customer: ${c.fullName}\nEmail: ${c.email}\nPhone: ${c.phoneNumber}\nTotal Spent: ₹${c.totalSpent}`);
  }
}


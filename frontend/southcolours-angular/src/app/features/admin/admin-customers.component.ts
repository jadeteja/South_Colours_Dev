import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../shared/components/admin-layout.component';

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
  imports: [CommonModule, RouterModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
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
    </app-admin-layout>
  `,
  styles: [`
    .customers-container { padding: 0; }
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
      .search-field { width: 360px; max-width: 100%; padding: 8px 14px; border-radius: 8px; border: 1px solid #CBD5E1; font-size: 13px; outline: none;
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
      .view-btn { background: transparent; color: var(--primary-pink); font-weight: 700; font-size: 12px; border: 1px solid var(--border-pink); padding: 4px 10px; border-radius: 6px; cursor: pointer;
        &:hover { background: var(--primary-pink-light); }
      }
    }

    @media (max-width: 768px) {
      .page-top-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 14px;
        .quick-stats {
          width: 100%;
          justify-content: space-between;
        }
      }
      .table-controls-card {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
        .search-field { width: 100%; }
      }
      .table-card {
        overflow-x: auto;
      }
      .data-table {
        min-width: 750px;
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
      fullName: 'Meenakshi Sundaram',
      email: 'meenakshi.s@example.com',
      phoneNumber: '9765432109',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      joinedDate: '22 Mar 2026',
      totalOrders: 1,
      totalSpent: 2499,
      status: 'Active'
    }
  ];

  ngOnInit() {}

  get filteredCustomers(): CustomerRow[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.customers;
    return this.customers.filter(c =>
      c.fullName.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phoneNumber.includes(term) ||
      c.city.toLowerCase().includes(term)
    );
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  viewCustomer(customer: CustomerRow) {
    alert(`Customer details for ${customer.fullName}\nTotal Spent: ₹${customer.totalSpent}\nOrders: ${customer.totalOrders}`);
  }
}

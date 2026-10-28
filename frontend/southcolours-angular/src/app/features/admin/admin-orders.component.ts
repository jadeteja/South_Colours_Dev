import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../shared/components/admin-layout.component';
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
  imports: [CommonModule, RouterModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              @for (order of filteredOrders(); track order.id) {
                <tr>
                  <td class="order-id-cell">{{ order.orderNumber }}</td>
                  <td>{{ order.date }}</td>
                  <td>
                    <div class="cust-info">
                      <strong>{{ order.customerName }}</strong>
                      <span class="phone-sub">{{ order.phone }}</span>
                    </div>
                  </td>
                  <td>{{ order.city }}</td>
                  <td>{{ order.itemsCount }} item(s)</td>
                  <td class="amt-cell">₹ {{ order.totalAmount | number }}</td>
                  <td><span class="pay-badge">{{ order.paymentMethod }}</span></td>
                  <td>
                    <span class="status-badge" [ngClass]="order.status.toLowerCase()">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>
                    <select [(ngModel)]="order.status" class="status-select">
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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
    .orders-management-container {
      padding: 0;
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
      gap: 16px;
      .search-input-wrap {
        flex: 1;
        max-width: 340px;
      }
      .search-field {
        width: 100%;
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
          border: none;
          cursor: pointer;
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

    @media (max-width: 900px) {
      .table-controls-card {
        flex-direction: column;
        align-items: stretch;
        .search-input-wrap {
          max-width: 100%;
        }
        .filter-tabs {
          overflow-x: auto;
          white-space: nowrap;
          padding-bottom: 4px;
        }
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
      .table-card {
        overflow-x: auto;
      }
      .data-table {
        min-width: 780px;
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
      totalAmount: 5897,
      paymentMethod: 'Cash on Delivery',
      status: 'Processing'
    },
    {
      id: '4',
      orderNumber: 'SC123890',
      date: '18 May 2026',
      customerName: 'Meenakshi Sundaram',
      phone: '9765432109',
      city: 'Coimbatore',
      itemsCount: 1,
      totalAmount: 2499,
      paymentMethod: 'Razorpay (NetBanking)',
      status: 'Confirmed'
    }
  ];

  ngOnInit() {
    this.shopService.getOrders().subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.orders = res.map(o => ({
            id: o.id,
            orderNumber: o.orderNumber,
            date: new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            customerName: o.shippingAddress?.fullName || 'Customer',
            phone: o.shippingAddress?.phoneNumber || '-',
            city: o.shippingAddress?.city || 'Bangalore',
            itemsCount: o.items?.length || 1,
            totalAmount: o.totalAmount,
            paymentMethod: o.paymentMethod || 'Razorpay',
            status: o.status || 'Confirmed'
          }));
        }
      },
      error: () => {}
    });
  }

  filteredOrders(): OrderRow[] {
    return this.orders.filter(o => {
      const matchesStatus = this.selectedStatus === 'All' || o.status.toLowerCase() === this.selectedStatus.toLowerCase();
      const term = this.searchTerm.toLowerCase().trim();
      const matchesSearch = !term ||
        o.orderNumber.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term) ||
        o.phone.includes(term) ||
        o.city.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }
}

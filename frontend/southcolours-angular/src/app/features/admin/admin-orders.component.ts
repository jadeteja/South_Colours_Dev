import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../shared/components/admin-layout.component';
import { ShopService } from '../../core/services/shop.service';
import { ToastService } from '../../core/services/toast.service';

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
  trackingNumber?: string;
  courierName?: string;
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
            <div class="stat-pill"><span class="pill-label">Revenue:</span> <strong class="pink-text">₹ {{ totalRevenue() | number }}</strong></div>
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
                    <div class="action-cell">
                      <select [ngModel]="order.status" (ngModelChange)="onStatusChange(order, $event)" class="status-select">
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <a 
                        [href]="getWhatsAppUrl(order)" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="wa-btn" 
                        [class.disabled]="!hasValidPhone(order.phone)"
                        [title]="hasValidPhone(order.phone) ? 'Send WhatsApp Update to ' + order.customerName : 'No phone number available'">
                        <svg class="wa-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 7.44C8.95 7.44 8.68 7.5 8.46 7.74C8.23 7.97 7.61 8.56 7.61 9.76C7.61 10.96 8.49 12.12 8.61 12.28C8.73 12.44 10.32 14.91 12.79 15.97C14.84 16.85 15.26 16.67 15.71 16.63C16.15 16.59 17.14 16.04 17.35 15.46C17.55 14.87 17.55 14.37 17.49 14.27C17.43 14.16 17.27 14.1 17.03 13.98C16.8 13.86 15.65 13.3 15.43 13.22C15.22 13.14 15.07 13.1 14.92 13.33C14.77 13.56 14.34 14.07 14.21 14.22C14.08 14.37 13.95 14.39 13.72 14.27C13.49 14.16 12.74 13.91 11.85 13.12C11.16 12.5 10.69 11.74 10.56 11.52C10.43 11.29 10.55 11.17 10.66 11.05C10.77 10.94 10.91 10.76 11.03 10.62C11.15 10.47 11.19 10.37 11.27 10.21C11.35 10.06 11.31 9.92 11.25 9.8C11.19 9.69 10.69 8.46 10.48 7.96C10.28 7.47 10.07 7.54 9.92 7.53C9.77 7.52 9.61 7.52 9.44 7.52L9.11 7.44Z"/>
                        </svg>
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="9" style="text-align: center; padding: 32px; color: #94A3B8;">No orders found.</td>
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
      .action-cell {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .status-select {
        padding: 6px 10px;
        border-radius: 6px;
        border: 1px solid #CBD5E1;
        font-size: 12px;
        outline: none;
      }
      .wa-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 6px 10px;
        background: #25D366;
        color: #FFFFFF;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        text-decoration: none;
        transition: background 0.15s ease, transform 0.1s ease;
        white-space: nowrap;
        &:hover {
          background: #1EBE5D;
          transform: translateY(-1px);
        }
        &.disabled {
          background: #CBD5E1;
          color: #64748B;
          pointer-events: none;
          cursor: not-allowed;
        }
        .wa-icon {
          flex-shrink: 0;
        }
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
  toastService = inject(ToastService);
  selectedStatus = 'All';
  searchTerm = '';

  orders: OrderRow[] = [];

  private formatStatus(status: any): string {
    if (typeof status === 'number') {
      const map = ['Pending Payment', 'Payment Failed', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancellation Requested', 'Cancelled', 'Return Requested', 'Return Approved', 'Returned', 'Refund Pending', 'Refunded'];
      return map[status] || 'Pending';
    }
    return status || 'Pending';
  }

  private formatPaymentMethod(method: any): string {
    if (method === 1 || method === 'CashOnDelivery') return 'COD';
    return 'Razorpay';
  }

  ngOnInit() {
    this.shopService.getOrders().subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.orders = res.map(o => ({
            id: o.id,
            orderNumber: o.orderNumber,
            date: new Date(o.createdAtUtc || o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            customerName: o.shippingName || o.shippingAddress?.fullName || 'Customer',
            phone: o.shippingPhone || o.shippingAddress?.phoneNumber || '-',
            city: o.shippingCity || o.shippingAddress?.city || 'Bangalore',
            itemsCount: o.items?.length || 1,
            totalAmount: o.totalAmount,
            paymentMethod: this.formatPaymentMethod(o.paymentMethod),
            status: this.formatStatus(o.status),
            trackingNumber: o.trackingNumber,
            courierName: o.courierName
          }));
        } else {
          this.orders = [];
        }
      },
      error: () => {
        this.orders = [];
      }
    });
  }

  totalRevenue(): number {
    return this.orders
      .filter(o => o.status !== 'Pending Payment' && o.status !== 'Payment Failed' && o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
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

  onStatusChange(order: OrderRow, newStatus: string) {
    if (!order || order.status === newStatus) return;

    const previousStatus = order.status;
    order.status = newStatus;

    this.shopService.updateOrderFulfillment(order.id, {
      status: newStatus,
      courierName: order.courierName || '',
      trackingNumber: order.trackingNumber || '',
      comments: `Status updated to ${newStatus} by Admin`
    }).subscribe({
      next: () => {
        this.toastService.success(
          `Order #${order.orderNumber} status successfully updated to ${newStatus}.`,
          { title: 'Status Updated' }
        );
      },
      error: (err) => {
        // Revert on failure
        order.status = previousStatus;
        const msg = err?.error?.message || err?.message || 'Failed to update order status';
        this.toastService.error(msg, { title: 'Update Error' });
      }
    });
  }

  hasValidPhone(phone: string): boolean {
    if (!phone) return false;
    const clean = phone.replace(/\D/g, '');
    return clean.length >= 10;
  }

  getWhatsAppUrl(order: OrderRow): string {
    if (!this.hasValidPhone(order.phone)) {
      return '#';
    }

    let digits = order.phone.replace(/\D/g, '');
    if (digits.length === 10) {
      digits = '91' + digits;
    } else if (digits.length === 11 && digits.startsWith('0')) {
      digits = '91' + digits.substring(1);
    }

    let message = '';
    const custName = order.customerName && order.customerName !== 'Customer' ? order.customerName : 'Valued Customer';

    if (order.status.toLowerCase() === 'shipped') {
      const trackingId = order.trackingNumber || '[AWB]';
      const courier = order.courierName || '[Courier Name]';
      message = `Hello ${custName}, great news! Your order #${order.orderNumber} from South Colours has been dispatched.\nTracking ID: ${trackingId}\nCourier: ${courier}\nThank you for choosing South Colours! 🎨`;
    } else {
      message = `Hello ${custName}, thank you for placing an order with South Colours! 🎨\nYour Order #${order.orderNumber} is confirmed and we will shortly send the tracking link and ID once dispatched.`;
    }

    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  }
}

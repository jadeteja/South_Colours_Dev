import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../shared/components/admin-layout.component';
import { ShopService } from '../../core/services/shop.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="page-top-row">
        <div>
          <h1 class="page-title">Sales, Inventory & Financial Reports</h1>
          <p class="page-sub">Export transactions, tax classifications, and product metrics to CSV and PDF.</p>
        </div>
        <div class="export-actions">
          <a [href]="exportCsvUrl" target="_blank" class="btn-export">📄 Export CSV</a>
          <button class="btn-export pdf" (click)="printReport()">📑 Print / Export PDF</button>
        </div>
      </div>

      <!-- Financial Snapshot Grid -->
      <div class="reports-kpi-grid">
        <div class="report-box">
          <span class="lbl">Gross Sales</span>
          <span class="val">₹ {{ summary.grossSales | number }}</span>
          <span class="sub">Total order volume</span>
        </div>
        <div class="report-box">
          <span class="lbl">Discounts Applied</span>
          <span class="val pink">− ₹ {{ summary.discounts | number }}</span>
          <span class="sub">Coupons & festival promos</span>
        </div>
        <div class="report-box">
          <span class="lbl">GST Collected (5%)</span>
          <span class="val">₹ {{ summary.gstCollected | number }}</span>
          <span class="sub">Taxes due to state</span>
        </div>
        <div class="report-box">
          <span class="lbl">Net Revenue</span>
          <span class="val green">₹ {{ summary.netRevenue | number }}</span>
          <span class="sub">After refunds & discounts</span>
        </div>
      </div>

      <!-- Product Sales Performance Table -->
      <div class="table-card">
        <div class="table-header-bar">
          <h3 class="table-title">Product Sales Performance (Real-time DB Analysis)</h3>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Units Sold</th>
              <th>Unit Price</th>
              <th>Total Gross</th>
              <th>Refunds</th>
              <th>Net Sales</th>
            </tr>
          </thead>
          <tbody>
            @for (row of summary.productSales; track row.sku) {
              <tr>
                <td><strong>{{ row.name }}</strong></td>
                <td><code>{{ row.sku }}</code></td>
                <td>{{ row.units }} units</td>
                <td>₹ {{ row.price | number }}</td>
                <td>₹ {{ row.gross | number }}</td>
                <td><span class="refund-val">{{ row.refunds === 0 ? '₹ 0' : '− ₹ ' + (row.refunds | number) }}</span></td>
                <td class="net-cell">₹ {{ row.net | number }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7" class="empty-cell">Loading reports data...</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </app-admin-layout>
  `,
  styles: [`
    .page-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
      .page-title { font-size: 24px; color: var(--dark-navy); }
      .page-sub { font-size: 14px; color: var(--text-muted); margin-top: 4px; }
      .export-actions { display: flex; gap: 8px;
        .btn-export { background: #FFFFFF; border: 1px solid #CBD5E1; padding: 8px 14px; border-radius: 6px; font-size: 13px; font-weight: 700; color: var(--dark-navy); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center;
          &:hover { background: #F1F5F9; border-color: var(--primary-pink); }
          &.pdf { background: #FFF0F5; border-color: var(--border-pink); color: var(--primary-pink); }
        }
      }
    }
    .reports-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 28px;
      .report-box { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px;
        .lbl { font-size: 13px; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 6px; }
        .val { font-size: 22px; font-weight: 800; color: var(--dark-navy); display: block; margin-bottom: 4px;
          &.pink { color: var(--primary-pink); }
          &.green { color: #16A34A; }
        }
        .sub { font-size: 11px; color: #94A3B8; }
      }
    }
    .table-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; }
    .table-header-bar { padding: 18px 20px; border-bottom: 1px solid #F1F5F9;
      .table-title { font-size: 16px; color: var(--dark-navy); }
    }
    .data-table { width: 100%; border-collapse: collapse; font-size: 13px;
      th { background: #F8FAFC; padding: 12px 16px; text-align: left; font-weight: 700; color: #475569; border-bottom: 1px solid #E2E8F0; }
      td { padding: 14px 16px; border-bottom: 1px solid #F1F5F9; color: #1E293B; }
      .refund-val { color: #EF4444; }
      .net-cell { font-weight: 700; color: #16A34A; }
      .empty-cell { text-align: center; padding: 32px; color: #94A3B8; }
    }
    @media print {
      .page-top-row .export-actions { display: none; }
    }
  `]
})
export class AdminReportsComponent implements OnInit {
  shopService = inject(ShopService);
  exportCsvUrl = '';
  summary: any = {
    grossSales: 584320,
    discounts: 42600,
    gstCollected: 27086,
    netRevenue: 514634,
    productSales: []
  };

  ngOnInit() {
    this.exportCsvUrl = this.shopService.getExportCsvUrl();
    this.shopService.getReportsSummary().subscribe({
      next: (res) => {
        if (res) this.summary = res;
      },
      error: () => {}
    });
  }

  printReport() {
    window.print();
  }
}

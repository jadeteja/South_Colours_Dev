import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../shared/components/admin-layout.component';
import { ShopService } from '../../core/services/shop.service';

@Component({
  selector: 'app-admin-coupons',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="page-top-row">
        <div>
          <h1 class="page-title">Discounts & Promo Coupons</h1>
          <p class="page-sub">Manage cart discount rules, festive promo codes, and usage limits.</p>
        </div>
        <button class="btn-primary" (click)="showModal = true">+ Create Coupon</button>
      </div>

      <!-- Add Coupon Modal -->
      @if (showModal) {
        <div class="modal-overlay" (click)="showModal = false">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Create Promotional Coupon</h2>
              <button class="close-btn" (click)="showModal = false">✕</button>
            </div>
            <div class="modal-body">
              <div class="form-row">
                <div class="form-group col">
                  <label>Coupon Code *</label>
                  <input type="text" [(ngModel)]="newCoupon.code" placeholder="e.g. DIWALI500" class="form-control code-input" />
                </div>
                <div class="form-group col">
                  <label>Discount Type</label>
                  <select [(ngModel)]="newCoupon.type" class="form-control">
                    <option [value]="0">Percentage (%)</option>
                    <option [value]="1">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col">
                  <label>Discount Value *</label>
                  <input type="number" [(ngModel)]="newCoupon.value" placeholder="e.g. 15 or 300" class="form-control" />
                </div>
                <div class="form-group col">
                  <label>Min Cart Order (₹)</label>
                  <input type="number" [(ngModel)]="newCoupon.minCartAmount" placeholder="999" class="form-control" />
                </div>
              </div>
              <div class="form-group">
                <label>Description / Marketing Subtitle</label>
                <input type="text" [(ngModel)]="newCoupon.description" placeholder="e.g. Flat ₹300 off on first purchase above ₹1,499" class="form-control" />
              </div>
              <div class="form-row">
                <div class="form-group col">
                  <label>Max Discount Cap (₹ optional)</label>
                  <input type="number" [(ngModel)]="newCoupon.maxDiscountAmount" placeholder="e.g. 1000" class="form-control" />
                </div>
                <div class="form-group col">
                  <label>Max Usage Limit</label>
                  <input type="number" [(ngModel)]="newCoupon.usageLimit" placeholder="1000" class="form-control" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" (click)="showModal = false">Cancel</button>
              <button class="btn-primary" [disabled]="!newCoupon.code || !newCoupon.value || isSaving" (click)="saveCoupon()">
                {{ isSaving ? 'Saving...' : 'Save Coupon' }}
              </button>
            </div>
          </div>
        </div>
      }

      <div class="coupons-grid">
        @for (c of coupons; track c.id) {
          <div class="coupon-ticket-card">
            <div class="ticket-left">
              <span class="disc-type">{{ c.type === 0 ? 'PERCENTAGE OFF' : 'FLAT DISCOUNT' }}</span>
              <span class="disc-val">{{ c.type === 0 ? c.value + '%' : '₹' + c.value }}</span>
              <span class="disc-sub">Min order ₹{{ c.minCartAmount | number }}</span>
            </div>
            <div class="ticket-right">
              <div class="code-box">
                <span class="c-code">{{ c.code }}</span>
              </div>
              <p class="c-desc">{{ c.description || 'Valid for all shoppers during checkout.' }}</p>
              <div class="c-meta">
                <span>Usage: <strong>{{ c.usedCount || 0 }} / {{ c.usageLimit || 1000 }}</strong></span>
                <span class="validity">Status: <strong>{{ c.isActive ? 'Active' : 'Inactive' }}</strong></span>
              </div>
              <div class="card-footer-action">
                <button class="delete-btn" (click)="deleteCoupon(c.id)">Delete Coupon</button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <p>No coupons found. Click "+ Create Coupon" above to set up promotional discounts.</p>
          </div>
        }
      </div>
    </app-admin-layout>
  `,
  styles: [`
    .page-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
      .page-title { font-size: 24px; color: var(--dark-navy); }
      .page-sub { font-size: 14px; color: var(--text-muted); margin-top: 4px; }
    }
    .coupons-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .coupon-ticket-card { background: #FFFFFF; border: 1px dashed #CBD5E1; border-radius: 14px; display: flex; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
    .ticket-left { background: #FFF0F5; width: 140px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px; border-right: 2px dashed #FF4081; text-align: center;
      .disc-type { font-size: 10px; font-weight: 800; color: var(--primary-pink); letter-spacing: 0.5px; }
      .disc-val { font-size: 26px; font-weight: 800; color: var(--primary-pink); margin: 6px 0; }
      .disc-sub { font-size: 10px; color: #64748B; }
    }
    .ticket-right { flex: 1; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;
      .code-box { display: inline-block; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 6px 14px; border-radius: 6px; width: fit-content;
        .c-code { font-family: monospace; font-weight: 800; font-size: 16px; color: var(--dark-navy); letter-spacing: 1px; }
      }
      .c-desc { font-size: 12px; color: var(--text-muted); margin: 10px 0; line-height: 1.4; }
      .c-meta { display: flex; justify-content: space-between; font-size: 11px; color: #64748B; border-top: 1px solid #F1F5F9; padding-top: 10px; margin-bottom: 8px; }
      .card-footer-action { display: flex; justify-content: flex-end;
        .delete-btn { background: transparent; color: #EF4444; font-weight: 700; border: none; font-size: 11px; cursor: pointer;
          &:hover { text-decoration: underline; }
        }
      }
    }
    .empty-state { grid-column: 1 / -1; background: #FFFFFF; border-radius: 14px; border: 1px dashed #CBD5E1; padding: 48px; text-align: center; color: #94A3B8; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-card { background: #FFFFFF; width: 520px; max-width: 90vw; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #F1F5F9;
      h2 { font-size: 18px; color: var(--dark-navy); margin: 0; }
      .close-btn { background: none; border: none; font-size: 18px; cursor: pointer; color: #64748B; }
    }
    .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px;
      label { font-size: 12px; font-weight: 700; color: #475569; }
    }
    .form-row { display: flex; gap: 12px; .col { flex: 1; } }
    .form-control { border: 1px solid #CBD5E1; border-radius: 8px; padding: 10px 12px; font-size: 13px; outline: none;
      &:focus { border-color: var(--primary-pink); }
      &.code-input { text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
    }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #F1F5F9; background: #F8FAFC;
      .btn-cancel { background: transparent; border: 1px solid #CBD5E1; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; }
    }

    @media (max-width: 768px) {
      .page-top-row { flex-direction: column; align-items: flex-start; gap: 14px;
        .btn-primary { width: 100%; }
      }
      .coupons-grid { grid-template-columns: 1fr; gap: 16px; }
      .form-row { flex-direction: column; gap: 16px; }
    }

    @media (max-width: 480px) {
      .coupon-ticket-card { flex-direction: column; }
      .ticket-left { width: 100%; border-right: none; border-bottom: 2px dashed #FF4081; padding: 12px; }
    }
  `]
})
export class AdminCouponsComponent implements OnInit {
  shopService = inject(ShopService);
  coupons: any[] = [];

  showModal = false;
  isSaving = false;
  newCoupon = {
    code: '',
    description: '',
    type: 0,
    value: 15,
    minCartAmount: 999,
    maxDiscountAmount: null as number | null,
    usageLimit: 1000
  };

  ngOnInit() {
    this.loadCoupons();
  }

  loadCoupons() {
    this.shopService.getAllCoupons().subscribe({
      next: (res) => this.coupons = res,
      error: () => {}
    });
  }

  saveCoupon() {
    this.isSaving = true;
    const payload = {
      code: this.newCoupon.code.toUpperCase(),
      description: this.newCoupon.description,
      type: Number(this.newCoupon.type),
      value: Number(this.newCoupon.value),
      minCartAmount: Number(this.newCoupon.minCartAmount),
      maxDiscountAmount: this.newCoupon.maxDiscountAmount ? Number(this.newCoupon.maxDiscountAmount) : null,
      usageLimit: Number(this.newCoupon.usageLimit)
    };

    this.shopService.createCoupon(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.showModal = false;
        this.newCoupon = {
          code: '',
          description: '',
          type: 0,
          value: 15,
          minCartAmount: 999,
          maxDiscountAmount: null,
          usageLimit: 1000
        };
        this.loadCoupons();
      },
      error: (err) => {
        this.isSaving = false;
        alert(err.error?.message || 'Error saving coupon');
      }
    });
  }

  deleteCoupon(id: string) {
    if (confirm('Are you sure you want to deactivate this coupon?')) {
      this.shopService.deleteCoupon(id).subscribe({
        next: () => this.loadCoupons(),
        error: (err) => alert(err.error?.message || 'Error deleting coupon')
      });
    }
  }
}

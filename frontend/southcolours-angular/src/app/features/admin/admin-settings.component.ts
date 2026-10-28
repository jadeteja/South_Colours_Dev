import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../shared/components/admin-layout.component';
import { ShopService } from '../../core/services/shop.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="page-top-row">
        <div>
          <h1 class="page-title">Store & Gateway Settings</h1>
          <p class="page-sub">Configure currency, Razorpay test/live credentials, shipping thresholds, and tax classifications.</p>
        </div>
        <button class="btn-primary" [disabled]="isSaving" (click)="saveSettings()">
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>

      @if (saveSuccess) {
        <div class="alert-success">
          ✓ Store settings updated and persisted successfully!
        </div>
      }

      <div class="settings-grid">
        <!-- General Store Settings -->
        <div class="settings-card">
          <h3 class="card-heading">Store Configuration</h3>
          <div class="form-group">
            <label>Store Brand Name</label>
            <input type="text" [(ngModel)]="settings.storeName" class="form-control" />
          </div>
          <div class="form-group">
            <label>Tagline</label>
            <input type="text" [(ngModel)]="settings.tagline" class="form-control" />
          </div>
          <div class="form-row">
            <div class="form-group col">
              <label>Operating Currency</label>
              <input type="text" [value]="settings.operatingCurrency" disabled class="form-control disabled" />
            </div>
            <div class="form-group col">
              <label>Default GST Rate</label>
              <input type="text" [(ngModel)]="settings.defaultGstRate" class="form-control" />
            </div>
          </div>
        </div>

        <!-- Razorpay Gateway Settings -->
        <div class="settings-card">
          <h3 class="card-heading">Razorpay Payment Integration</h3>
          <div class="form-group">
            <label>Razorpay Key ID</label>
            <input type="text" [(ngModel)]="settings.razorpayKey" class="form-control" />
          </div>
          <div class="form-group">
            <label>Razorpay Key Secret</label>
            <div class="input-with-toggle">
              <input [type]="showSecret ? 'text' : 'password'" [(ngModel)]="settings.razorpaySecret" class="form-control" />
              <button type="button" class="btn-toggle-eye" (click)="showSecret = !showSecret" [title]="showSecret ? 'Hide secret' : 'Show secret'">
                @if (showSecret) {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                } @else {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                }
              </button>
            </div>
          </div>
          <div class="form-group">
            <label>Webhook Secret</label>
            <div class="input-with-toggle">
              <input [type]="showWebhookSecret ? 'text' : 'password'" [(ngModel)]="settings.webhookSecret" placeholder="Enter your Razorpay webhook secret" class="form-control" />
              <button type="button" class="btn-toggle-eye" (click)="showWebhookSecret = !showWebhookSecret" [title]="showWebhookSecret ? 'Hide secret' : 'Show secret'">
                @if (showWebhookSecret) {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                } @else {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                }
              </button>
            </div>
          </div>
          <div class="gateway-badge">
            <span>Mode: <strong>Sandbox / Test Mode Active</strong></span>
          </div>
        </div>

        <!-- Shipping & Delivery Rules -->
        <div class="settings-card">
          <h3 class="card-heading">Shipping Rules</h3>
          <div class="form-row">
            <div class="form-group col">
              <label>Free Shipping Min Order (₹)</label>
              <input type="number" [(ngModel)]="settings.freeShippingMin" class="form-control" />
            </div>
            <div class="form-group col">
              <label>Standard Delivery Fee (₹)</label>
              <input type="number" [(ngModel)]="settings.standardDeliveryFee" class="form-control" />
            </div>
          </div>
          <div class="form-group">
            <label>Courier Service Integration</label>
            <select class="form-control">
              <option>Manual Courier Entry (Default)</option>
              <option>Shiprocket Integration (Ready)</option>
              <option>Delhivery (Ready)</option>
            </select>
          </div>
        </div>

        <!-- Admin Access & Security -->
        <div class="settings-card">
          <h3 class="card-heading">Security & Auditing</h3>
          <div class="toggle-row">
            <div>
              <strong>Audit Logging</strong>
              <p>Log all inventory adjustments and price changes in SQL Server.</p>
            </div>
            <input type="checkbox" [(ngModel)]="settings.auditLogging" class="toggle-check" />
          </div>
          <div class="toggle-row">
            <div>
              <strong>Require Login for Checkout</strong>
              <p>Prompt guest shoppers to register or login before payment.</p>
            </div>
            <input type="checkbox" [(ngModel)]="settings.requireLoginForCheckout" class="toggle-check" />
          </div>
        </div>
      </div>
    </app-admin-layout>
  `,
  styles: [`
    .page-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
      .page-title { font-size: 24px; color: var(--dark-navy); }
      .page-sub { font-size: 14px; color: var(--text-muted); margin-top: 4px; }
    }
    .alert-success { background: #DCFCE7; border: 1px solid #86EFAC; color: #166534; padding: 12px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; margin-bottom: 20px; }
    .settings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .settings-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; padding: 24px;
      .card-heading { font-size: 16px; color: var(--dark-navy); margin-bottom: 18px; border-bottom: 1px solid #F1F5F9; padding-bottom: 10px; }
    }
    .form-group { margin-bottom: 16px; display: flex; flex-direction: column; gap: 6px;
      label { font-size: 12px; font-weight: 700; color: #475569; }
    }
    .form-row { display: flex; gap: 12px; .col { flex: 1; } }
    .form-control { border: 1px solid #CBD5E1; border-radius: 8px; padding: 10px 12px; font-size: 13px; outline: none;
      &:focus { border-color: var(--primary-pink); }
      &.disabled { background: #F8FAFC; color: #94A3B8; }
    }
    .gateway-badge { background: #FFF0F5; border: 1px solid var(--border-pink); color: var(--primary-pink); padding: 8px 12px; border-radius: 6px; font-size: 12px; margin-top: 8px; }
    .input-with-toggle {
      display: flex;
      position: relative;
      align-items: center;
      .form-control { width: 100%; padding-right: 40px; }
      .btn-toggle-eye {
        position: absolute;
        right: 10px;
        background: transparent;
        border: none;
        cursor: pointer;
        color: #64748B;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        &:hover { color: var(--primary-pink); }
      }
    }
    .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F8FAFC;
      strong { font-size: 13px; color: var(--dark-navy); display: block; }
      p { font-size: 11px; color: var(--text-muted); margin: 2px 0 0 0; }
      .toggle-check { width: 18px; height: 18px; accent-color: var(--primary-pink); cursor: pointer; }
    }

    @media (max-width: 900px) {
      .settings-grid { grid-template-columns: 1fr; gap: 16px; }
      .page-top-row { flex-direction: column; align-items: flex-start; gap: 14px;
        .btn-primary { width: 100%; }
      }
      .form-row { flex-direction: column; gap: 16px; }
    }
  `]
})
export class AdminSettingsComponent implements OnInit {
  shopService = inject(ShopService);
  isSaving = false;
  saveSuccess = false;
  showSecret = false;
  showWebhookSecret = false;

  settings: any = {
    storeName: 'South Colours',
    tagline: 'Little Styles, Big Smiles',
    operatingCurrency: 'INR (₹)',
    defaultGstRate: '5.0%',
    razorpayKey: 'rzp_test_placeholder_key',
    razorpaySecret: 'rzp_test_placeholder_secret',
    webhookSecret: 'southcolours_webhook_secret_placeholder',
    freeShippingMin: 999,
    standardDeliveryFee: 99,
    auditLogging: true,
    requireLoginForCheckout: false
  };

  ngOnInit() {
    this.shopService.getSettings().subscribe({
      next: (res) => {
        if (res) this.settings = res;
      },
      error: () => {}
    });
  }

  saveSettings() {
    this.isSaving = true;
    this.saveSuccess = false;
    this.shopService.updateSettings(this.settings).subscribe({
      next: () => {
        this.isSaving = false;
        this.saveSuccess = true;
        setTimeout(() => this.saveSuccess = false, 4000);
      },
      error: (err) => {
        this.isSaving = false;
        alert(err.error?.message || 'Error updating settings');
      }
    });
  }
}

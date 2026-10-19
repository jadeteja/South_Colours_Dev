import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../shared/components/admin-layout.component';
import { ShopService } from '../../core/services/shop.service';
import { Banner } from '../../core/models/ecommerce.models';

@Component({
  selector: 'app-admin-banners',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="page-top-row">
        <div>
          <h1 class="page-title">Homepage Banners</h1>
          <p class="page-sub">Configure promotional campaigns, hero slides, and CTA buttons on the customer storefront.</p>
        </div>
        <button class="btn-primary" (click)="showModal = true">+ Create New Banner</button>
      </div>

      <!-- Add Banner Modal -->
      @if (showModal) {
        <div class="modal-overlay" (click)="showModal = false">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Create Promotional Banner</h2>
              <button class="close-btn" (click)="showModal = false">✕</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Banner Title *</label>
                <input type="text" [(ngModel)]="newBanner.title" placeholder="e.g. Festive Collection" class="form-control" />
              </div>
              <div class="form-group">
                <label>Subtitle / Offer Text</label>
                <input type="text" [(ngModel)]="newBanner.subtitle" placeholder="e.g. Up to 40% Off on Ethnic Sets" class="form-control" />
              </div>
              <div class="form-group">
                <label>Image URL *</label>
                <input type="text" [(ngModel)]="newBanner.imageUrl" placeholder="https://..." class="form-control" />
              </div>
              <div class="form-row">
                <div class="form-group col">
                  <label>CTA Button Text</label>
                  <input type="text" [(ngModel)]="newBanner.buttonText" placeholder="Shop Now" class="form-control" />
                </div>
                <div class="form-group col">
                  <label>Target Link</label>
                  <input type="text" [(ngModel)]="newBanner.linkUrl" placeholder="/products?category=ethnic" class="form-control" />
                </div>
              </div>
              <div class="form-group">
                <label>Display Position Order</label>
                <input type="number" [(ngModel)]="newBanner.displayOrder" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" (click)="showModal = false">Cancel</button>
              <button class="btn-primary" [disabled]="!newBanner.title || !newBanner.imageUrl || isSaving" (click)="saveBanner()">
                {{ isSaving ? 'Saving...' : 'Save Banner' }}
              </button>
            </div>
          </div>
        </div>
      }

      <div class="banners-grid">
        @for (b of banners; track b.id) {
          <div class="banner-card">
            <div class="banner-image-preview">
              <img [src]="b.imageUrl" [alt]="b.title" />
              <span class="order-badge">Position #{{ b.displayOrder || 1 }}</span>
            </div>
            <div class="banner-info">
              <h3 class="banner-title">{{ b.title }}</h3>
              <p class="banner-sub">{{ b.subtitle }}</p>
              <div class="banner-meta">
                <span class="btn-label">CTA: <strong>{{ b.buttonText }}</strong></span>
                <span class="link-target">Target: <code>{{ b.linkUrl }}</code></span>
              </div>
              <div class="card-actions">
                <button class="delete-btn" (click)="deleteBanner(b.id)">Delete</button>
                <span class="status-live">Live</span>
              </div>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <p>No banners configured. Click "+ Create New Banner" above.</p>
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
    .banners-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .banner-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
    .banner-image-preview { position: relative; height: 180px;
      img { width: 100%; height: 100%; object-fit: cover; }
      .order-badge { position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.7); color: white; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; }
    }
    .banner-info { padding: 18px;
      .banner-title { font-size: 16px; color: var(--dark-navy); margin-bottom: 4px; }
      .banner-sub { font-size: 12px; color: var(--text-muted); margin-bottom: 12px; line-height: 1.4; }
      .banner-meta { font-size: 12px; color: #64748B; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; }
      .card-actions { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #F1F5F9; padding-top: 12px;
        .delete-btn { background: transparent; color: #EF4444; font-weight: 700; border: none; cursor: pointer;
          &:hover { text-decoration: underline; }
        }
        .status-live { background: #DCFCE7; color: #166534; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; }
      }
    }
    .empty-state { grid-column: 1 / -1; background: #FFFFFF; border-radius: 14px; border: 1px dashed #CBD5E1; padding: 48px; text-align: center; color: #94A3B8; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-card { background: #FFFFFF; width: 500px; max-width: 90vw; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); }
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
    }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #F1F5F9; background: #F8FAFC;
      .btn-cancel { background: transparent; border: 1px solid #CBD5E1; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; }
    }
  `]
})
export class AdminBannersComponent implements OnInit {
  shopService = inject(ShopService);
  banners: any[] = [];

  showModal = false;
  isSaving = false;
  newBanner = {
    title: '',
    subtitle: '',
    imageUrl: '',
    buttonText: 'Shop Now',
    linkUrl: '/products',
    displayOrder: 1
  };

  ngOnInit() {
    this.loadBanners();
  }

  loadBanners() {
    this.shopService.getBanners().subscribe({
      next: (res) => this.banners = res,
      error: () => {}
    });
  }

  saveBanner() {
    this.isSaving = true;
    this.shopService.createBanner(this.newBanner).subscribe({
      next: () => {
        this.isSaving = false;
        this.showModal = false;
        this.newBanner = {
          title: '',
          subtitle: '',
          imageUrl: '',
          buttonText: 'Shop Now',
          linkUrl: '/products',
          displayOrder: 1
        };
        this.loadBanners();
      },
      error: (err) => {
        this.isSaving = false;
        alert(err.error?.message || 'Error saving banner');
      }
    });
  }

  deleteBanner(id: string) {
    if (confirm('Are you sure you want to delete this banner?')) {
      this.shopService.deleteBanner(id).subscribe({
        next: () => this.loadBanners(),
        error: (err) => alert(err.error?.message || 'Error deleting banner')
      });
    }
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../shared/components/admin-layout.component';
import { ShopService } from '../../core/services/shop.service';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="page-top-row">
        <div>
          <h1 class="page-title">Product Reviews & Ratings</h1>
          <p class="page-sub">Moderate verified customer reviews, ratings, and customer feedback.</p>
        </div>
        <div class="rating-summary-pill">
          <span>Overall Store Rating:</span> <strong>★ {{ avgRating }} / 5.0</strong> ({{ reviews.length }} reviews)
        </div>
      </div>

      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Customer</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
              <th>Status</th>
              <th>Moderation</th>
            </tr>
          </thead>
          <tbody>
            @for (r of reviews; track r.id) {
              <tr>
                <td><strong>{{ r.productName }}</strong></td>
                <td>
                  <div class="cust-meta">
                    <span>{{ r.customerName }}</span>
                    @if (r.isVerifiedPurchase) { <span class="verified-tag">✓ Verified Buyer</span> }
                  </div>
                </td>
                <td><span class="stars-gold">{{ getStars(r.rating) }}</span></td>
                <td>
                  <div class="review-body">
                    <strong>{{ r.title }}</strong>
                    <p>{{ r.comment }}</p>
                  </div>
                </td>
                <td>{{ r.date }}</td>
                <td>
                  <span class="status-badge" [ngClass]="r.isApproved ? 'approved' : 'hidden'">
                    {{ r.isApproved ? 'Approved' : 'Hidden' }}
                  </span>
                </td>
                <td>
                  <div class="actions-group">
                    <button class="btn-approve" [disabled]="r.isApproved" (click)="toggleReview(r, true)">Approve</button>
                    <button class="btn-hide" [disabled]="!r.isApproved" (click)="toggleReview(r, false)">Hide</button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7" class="empty-cell">No reviews submitted yet.</td>
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
      .rating-summary-pill { background: #FFFFFF; border: 1px solid #E2E8F0; padding: 8px 16px; border-radius: 8px; font-size: 13px;
        strong { color: #D97706; margin-left: 4px; }
      }
    }
    .table-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 13px;
      th { background: #F8FAFC; padding: 12px 16px; text-align: left; font-weight: 700; color: #475569; border-bottom: 1px solid #E2E8F0; }
      td { padding: 14px 16px; border-bottom: 1px solid #F1F5F9; color: #1E293B; }
      .cust-meta { display: flex; flex-direction: column; gap: 2px;
        .verified-tag { font-size: 10px; color: #16A34A; font-weight: 700; }
      }
      .stars-gold { color: #F59E0B; letter-spacing: 1px; font-size: 14px; }
      .review-body { max-width: 320px;
        strong { display: block; font-size: 13px; color: var(--dark-navy); }
        p { font-size: 12px; color: var(--text-muted); line-height: 1.4; margin-top: 2px; }
      }
      .status-badge { padding: 3px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700;
        &.approved { background: #DCFCE7; color: #166534; }
        &.hidden { background: #F1F5F9; color: #64748B; }
      }
      .actions-group { display: flex; gap: 6px;
        button { border: none; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;
          &:disabled { opacity: 0.4; cursor: not-allowed; }
        }
        .btn-approve { background: #DCFCE7; color: #166534; }
        .btn-hide { background: #FEE2E2; color: #991B1B; }
      }
      .empty-cell { text-align: center; padding: 32px; color: #94A3B8; }
    }
  `]
})
export class AdminReviewsComponent implements OnInit {
  shopService = inject(ShopService);
  reviews: any[] = [];
  avgRating = '4.9';

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.shopService.getReviews().subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.reviews = res;
          const total = this.reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
          this.avgRating = (total / this.reviews.length).toFixed(1);
        } else {
          // Default initial set for moderation demonstration
          this.reviews = [
            {
              id: 'rev-1',
              productName: 'Pink Lehenga Set',
              customerName: 'Priya Sharma',
              rating: 5,
              title: 'Superb quality and stitch!',
              comment: 'The embroidery is stunning and the pure cotton lining kept my 4yo daughter comfortable all evening.',
              date: '18 Oct 2026',
              isVerifiedPurchase: true,
              isApproved: true
            },
            {
              id: 'rev-2',
              productName: 'Yellow Anarkali',
              customerName: 'Ananya Rao',
              rating: 5,
              title: 'Vibrant festival outfit',
              comment: 'Color is even better than in the photo. Quick delivery within 3 days to Hyderabad.',
              date: '16 Oct 2026',
              isVerifiedPurchase: true,
              isApproved: true
            },
            {
              id: 'rev-3',
              productName: "Boy's Kurta Set",
              customerName: 'Karthik V.',
              rating: 4,
              title: 'Great fitting kurta',
              comment: 'Good fabric quality, slightly loose at sleeves but easily altered. Overall very pleased.',
              date: '14 Oct 2026',
              isVerifiedPurchase: true,
              isApproved: false
            }
          ];
        }
      },
      error: () => {}
    });
  }

  getStars(rating: number): string {
    return '★'.repeat(Math.max(1, Math.min(5, rating)));
  }

  toggleReview(review: any, approve: boolean) {
    review.isApproved = approve;
    this.shopService.setReviewStatus(review.id, approve).subscribe({
      next: () => {},
      error: () => {}
    });
  }
}

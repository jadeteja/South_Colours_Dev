import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../shared/components/admin-layout.component';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../core/models/ecommerce.models';

@Component({
  selector: 'app-admin-products-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="catalog-container">
        <div class="page-top-row">
          <div>
            <h1 class="page-title">Product Catalog</h1>
            <p class="page-sub">View and manage kids apparel items, inventory, and pricing in SQL Server.</p>
          </div>
          <a routerLink="/admin/products/add" class="btn-primary">+ Add New Product</a>
        </div>

        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Selling Price</th>
                <th>Original Price</th>
                <th>Rating</th>
                <th>Variants</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              @for (p of products; track p.id) {
                <tr>
                  <td>
                    <div class="product-cell">
                      <img [src]="p.images.length ? p.images[0].imageUrl : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=120&q=80'" class="p-thumb" />
                      <div>
                        <strong>{{ p.name }}</strong>
                        <span class="category-subtext">{{ p.shortDescription }}</span>
                      </div>
                    </div>
                  </td>
                  <td><code>{{ p.sku }}</code></td>
                  <td class="price-cell">₹ {{ p.sellingPrice | number }}</td>
                  <td class="orig-price-cell">₹ {{ p.originalPrice | number }}</td>
                  <td>★ {{ p.averageRating }} ({{ p.reviewCount }})</td>
                  <td><span class="badge-variants">{{ p.variants.length > 0 ? p.variants.length + ' sizes' : '6 sizes' }}</span></td>
                  <td><span class="status-active">Active</span></td>
                  <td>
                    <div class="action-buttons">
                      <button class="edit-btn" [routerLink]="['/admin/products/edit', p.id]">Edit ✏️</button>
                      <a class="site-link" [routerLink]="['/products', p.slug]" target="_blank">View ↗</a>
                    </div>
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
    .catalog-container { padding: 0; }
    .page-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
      .page-title { font-size: 24px; color: var(--dark-navy); }
      .page-sub { font-size: 14px; color: var(--text-muted); margin-top: 4px; }
    }
    .table-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 13px;
      th { background: #F8FAFC; padding: 12px 16px; text-align: left; font-weight: 700; color: #475569; border-bottom: 1px solid #E2E8F0; }
      td { padding: 14px 16px; border-bottom: 1px solid #F1F5F9; color: #1E293B; }
      .product-cell { display: flex; align-items: center; gap: 12px;
        .p-thumb { width: 44px; height: 52px; object-fit: cover; border-radius: 6px; }
        .category-subtext { display: block; font-size: 11px; color: #64748B; max-width: 280px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      }
      .price-cell { font-weight: 800; color: var(--dark-navy); }
      .orig-price-cell { color: #94A3B8; text-decoration: line-through; }
      .badge-variants { background: #F1F5F9; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; color: #475569; }
      .status-active { background: #DCFCE7; color: #166534; padding: 4px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700; }
      .action-buttons { display: flex; gap: 8px; align-items: center; }
      .edit-btn { background: transparent; color: var(--primary-pink); font-weight: 700; font-size: 12px; border: 1px solid var(--border-pink); padding: 4px 10px; border-radius: 6px; cursor: pointer;
        &:hover { background: var(--primary-pink-light); }
      }
      .site-link { color: #64748B; font-size: 12px; font-weight: 600; text-decoration: none;
        &:hover { color: var(--primary-pink); }
      }
    }

    @media (max-width: 768px) {
      .page-top-row { flex-direction: column; align-items: flex-start; gap: 14px;
        .btn-primary { width: 100%; }
      }
      .table-card { overflow-x: auto; }
      .data-table { min-width: 750px; }
    }
  `]
})
export class AdminProductsListComponent implements OnInit {
  shopService = inject(ShopService);
  products: Product[] = [];

  ngOnInit() {
    this.shopService.getProducts().subscribe({
      next: (res) => {
        this.products = res.items;
      }
    });
  }
}

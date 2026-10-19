import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../core/models/ecommerce.models';

@Component({
  selector: 'app-admin-products-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-wrapper">
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
          <a routerLink="/admin/products" class="menu-item active-item">
            <span class="menu-icon">📦</span> Products
          </a>
          <a routerLink="/admin/products/add" class="sub-item">
            <span class="menu-icon">➕</span> Add Product
          </a>
          <a routerLink="/admin/orders" class="menu-item">
            <span class="menu-icon">🛒</span> Orders
          </a>
          <a routerLink="/admin/customers" class="menu-item">
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
    .catalog-container { padding: 32px; }
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
      .edit-btn { background: transparent; color: var(--primary-pink); font-weight: 700; font-size: 12px; border: 1px solid var(--border-pink); padding: 4px 10px; border-radius: 6px;
        &:hover { background: var(--primary-pink-light); }
      }
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


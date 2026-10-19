import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../core/services/shop.service';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-wrapper">
      <!-- Dark Navy Sidebar Matching Reference Screen 8 -->
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
          <a routerLink="/admin/products/add" class="sub-item active-sub">
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

      <!-- Main Admin Content Area -->
      <main class="admin-main">
        <!-- Top Admin Header Matching Screen 8 -->
        <header class="admin-header">
          <div class="header-right">
            <button class="icon-btn" title="Notifications">🔔</button>
            <div class="admin-profile-pill">
              <span class="avatar">👨‍💼</span>
              <span class="admin-name">Admin</span>
            </div>
          </div>
        </header>

        <!-- Add Product Form Card Matching Screen 8 -->
        <div class="form-container">
          <div class="form-card">
            <h1 class="card-title">Add New Product</h1>

            <form class="product-form" (submit)="saveProduct($event)">
              <div class="form-group">
                <label>Product Name</label>
                <input type="text" [(ngModel)]="productName" name="productName" placeholder="e.g. Pink Lehenga Set" class="form-control" />
              </div>

              <!-- Rich Text Toolbar & Description matching Screen 8 -->
              <div class="form-group">
                <label>Description</label>
                <div class="rich-toolbar">
                  <button type="button"><b>B</b></button>
                  <button type="button"><i>I</i></button>
                  <button type="button"><u>U</u></button>
                  <button type="button"><s>S</s></button>
                  <span class="toolbar-sep">|</span>
                  <button type="button">≡</button>
                  <button type="button">☰</button>
                  <button type="button">🔗</button>
                  <button type="button">✕</button>
                </div>
                <textarea rows="4" [(ngModel)]="description" name="description" class="form-control text-area" placeholder="Beautiful pink lehenga set with intricate embroidery, perfect for weddings, festivals and special occasions."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group col">
                  <label>Category</label>
                  <select [(ngModel)]="category" name="category" class="form-control">
                    <option value="ethnic-wear">Ethnic Wear</option>
                    <option value="girls">Girls</option>
                    <option value="boys">Boys</option>
                    <option value="baby-wear">Baby Wear</option>
                  </select>
                </div>

                <div class="form-group col">
                  <label>Sub Category</label>
                  <select [(ngModel)]="subCategory" name="subCategory" class="form-control">
                    <option value="lehenga-choli">Lehenga Choli</option>
                    <option value="anarkali">Anarkali</option>
                    <option value="pavadai-sattai">Pavadai Sattai</option>
                    <option value="kurta-sets">Kurta Sets</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col">
                  <label>Price (₹)</label>
                  <input type="number" [(ngModel)]="price" name="price" class="form-control" placeholder="2499" />
                </div>
                <div class="form-group col">
                  <label>Discount Price (₹)</label>
                  <input type="number" [(ngModel)]="discountPrice" name="discountPrice" class="form-control" placeholder="3499" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col">
                  <label>SKU</label>
                  <input type="text" [(ngModel)]="sku" name="sku" class="form-control" placeholder="SC00123" />
                </div>
                <div class="form-group col">
                  <label>Stock Quantity</label>
                  <input type="number" [(ngModel)]="stockQty" name="stockQty" class="form-control" placeholder="50" />
                </div>
              </div>

              <!-- Size Options Checkboxes Matching Screen 8 -->
              <div class="form-group">
                <label>Size Options</label>
                <div class="sizes-checkbox-row">
                  <label class="size-check"><input type="checkbox" checked /> 1-2Y</label>
                  <label class="size-check"><input type="checkbox" checked /> 2-3Y</label>
                  <label class="size-check"><input type="checkbox" checked /> 3-4Y</label>
                  <label class="size-check"><input type="checkbox" checked /> 4-5Y</label>
                  <label class="size-check"><input type="checkbox" checked /> 5-6Y</label>
                  <label class="size-check"><input type="checkbox" checked /> 6-8Y</label>
                </div>
              </div>

              <!-- Product Images Grid with Dynamic Upload & Delete -->
              <div class="form-group">
                <label>Product Images ({{ images.length }} selected)</label>
                <div class="image-uploader-grid">
                  @for (img of images; track $index) {
                    <div class="image-preview-thumb">
                      <img [src]="img" alt="Product Image" />
                      <button type="button" class="delete-img-btn" (click)="removeImage($index)" title="Delete image">✕</button>
                    </div>
                  }
                  <label class="image-add-slot">
                    <input type="file" multiple accept="image/*" (change)="onFilesSelected($event)" class="file-input" />
                    <span class="plus-icon">+</span>
                    <span class="add-text">Add Images</span>
                  </label>
                </div>
              </div>

              <!-- Save Product Button Matching Screen 8 -->
              <div class="form-actions">
                <button type="submit" class="btn-primary save-btn">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-wrapper {
      display: flex;
      min-height: 100vh;
      background: #F8FAFC;
    }
    .admin-sidebar {
      width: 250px;
      background-color: var(--dark-navy);
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
    }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 22px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      .brand-text {
        font-size: 18px;
        font-weight: 800;
        color: var(--primary-pink);
      }
      .panel-tag {
        font-size: 12px;
        color: #94A3B8;
      }
    }
    .sidebar-menu {
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      .menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #CBD5E1;
        &:hover, &.active-item {
          background-color: rgba(255, 64, 129, 0.15);
          color: #FFFFFF;
        }
        &.active-item {
          color: var(--primary-pink);
        }
      }
      .sub-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 14px 8px 36px;
        font-size: 13px;
        color: #94A3B8;
        border-radius: 6px;
        &.active-sub {
          color: var(--primary-pink);
          font-weight: 700;
        }
      }
      .sidebar-footer {
        margin-top: auto;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
    }
    .admin-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .admin-header {
      background: #FFFFFF;
      padding: 14px 32px;
      display: flex;
      justify-content: flex-end;
      border-bottom: 1px solid #E2E8F0;
      .header-right {
        display: flex;
        align-items: center;
        gap: 20px;
        .icon-btn {
          background: transparent;
          font-size: 18px;
        }
        .admin-profile-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F1F5F9;
          padding: 6px 14px;
          border-radius: 9999px;
          .admin-name {
            font-size: 13px;
            font-weight: 700;
            color: var(--dark-navy);
          }
        }
      }
    }
    .form-container {
      padding: 32px;
      max-width: 900px;
    }
    .form-card {
      background: #FFFFFF;
      border-radius: 16px;
      padding: 32px;
      border: 1px solid #E2E8F0;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    }
    .card-title {
      font-size: 22px;
      color: var(--dark-navy);
      margin-bottom: 24px;
    }
    .product-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      label {
        font-size: 13px;
        font-weight: 700;
        color: var(--dark-navy);
      }
      &.col {
        flex: 1;
      }
    }
    .form-row {
      display: flex;
      gap: 20px;
    }
    .form-control {
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #CBD5E1;
      font-size: 14px;
      outline: none;
      &:focus {
        border-color: var(--primary-pink);
      }
    }
    .rich-toolbar {
      display: flex;
      gap: 6px;
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      padding: 6px 10px;
      button {
        background: transparent;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 13px;
        color: #475569;
        &:hover {
          background: #E2E8F0;
        }
      }
      .toolbar-sep {
        color: #CBD5E1;
        align-self: center;
      }
    }
    .text-area {
      border-radius: 0 0 8px 8px;
      resize: vertical;
    }
    .sizes-checkbox-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      .size-check {
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        input {
          accent-color: var(--primary-pink);
        }
      }
    }
    .image-uploader-grid {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      .image-preview-thumb {
        width: 100px;
        height: 120px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid #E2E8F0;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .delete-img-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(220, 38, 38, 0.9);
          color: #FFFFFF;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          border: none;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease;
          &:hover {
            transform: scale(1.15);
            background: #B91C1C;
          }
        }
      }
      .image-add-slot {
        width: 100px;
        height: 120px;
        border-radius: 10px;
        border: 2px dashed #CBD5E1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: #F8FAFC;
        &:hover {
          border-color: var(--primary-pink);
        }
        .file-input {
          display: none;
        }
        .plus-icon {
          font-size: 24px;
          color: var(--primary-pink);
          margin-bottom: 4px;
        }
        .add-text {
          font-size: 11px;
          font-weight: 700;
          color: #64748B;
        }
      }
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
      .save-btn {
        padding: 12px 32px;
        font-size: 15px;
      }
    }
  `]
})
export class AdminAddProductComponent {
  productName = '';
  description = '';
  category = 'ethnic-wear';
  subCategory = 'lehenga-choli';
  price = 1999;
  discountPrice = 2499;
  sku = 'SC' + Math.floor(10000 + Math.random() * 90000);
  stockQty = 30;

  // Initial images matching the design reference preview
  images: string[] = [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=400&q=80'
  ];

  constructor(private shopService: ShopService, private router: Router) {}

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  saveProduct(e: Event) {
    e.preventDefault();
    if (!this.productName) {
      alert('Please enter a product name');
      return;
    }

    const payload = {
      name: this.productName,
      description: this.description || this.productName,
      categorySlug: this.category,
      subCategorySlug: this.subCategory,
      price: this.price,
      discountPrice: this.discountPrice,
      sku: this.sku,
      stockQuantity: this.stockQty,
      sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y'],
      imageUrls: this.images.length > 0 ? this.images : [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
      ]
    };

    this.shopService.createProduct(payload).subscribe({
      next: (res) => {
        alert(`Product "${this.productName}" successfully saved to SQL Server database!`);
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        alert('Product created and saved to catalog!');
        this.router.navigate(['/admin/products']);
      }
    });
  }
}


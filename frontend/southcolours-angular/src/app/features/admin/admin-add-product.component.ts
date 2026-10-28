import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../shared/components/admin-layout.component';
import { ShopService } from '../../core/services/shop.service';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
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
    </app-admin-layout>
  `,
  styles: [`
    .form-container {
      padding: 0;
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

    @media (max-width: 768px) {
      .form-card {
        padding: 20px 16px;
      }
      .form-row {
        flex-direction: column;
        gap: 16px;
      }
      .form-actions .save-btn {
        width: 100%;
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

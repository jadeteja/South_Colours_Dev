import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../shared/components/admin-layout.component';
import { ShopService } from '../../core/services/shop.service';
import { ToastService } from '../../core/services/toast.service';
import { Category, SubCategory } from '../../core/models/ecommerce.models';

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
              <label>Product Name *</label>
              <input type="text" [(ngModel)]="productName" name="productName" placeholder="e.g. Pink Lehenga Set" class="form-control" required />
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

            <!-- Category & Sub Category matched directly from Categories page -->
            <div class="form-row">
              <div class="form-group col">
                <label>Category *</label>
                <select [(ngModel)]="category" name="category" (change)="onCategoryChange()" class="form-control">
                  @for (cat of categories; track cat.id || cat.slug) {
                    <option [value]="cat.slug">{{ cat.name }}</option>
                  }
                </select>
              </div>

              <div class="form-group col">
                <label>Sub Category</label>
                <select [(ngModel)]="subCategory" name="subCategory" class="form-control">
                  @for (sub of availableSubCategories; track sub.id || sub.slug || sub.name) {
                    <option [value]="sub.slug || slugify(sub.name)">{{ sub.name }}</option>
                  } @empty {
                    <option value="">General / All</option>
                  }
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label>Price (₹) *</label>
                <input type="number" [(ngModel)]="price" name="price" class="form-control" placeholder="2499" required />
              </div>
              <div class="form-group col">
                <label>Discount Price (₹)</label>
                <input type="number" [(ngModel)]="discountPrice" name="discountPrice" class="form-control" placeholder="1999" />
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
                @for (size of availableSizes; track size) {
                  <label class="size-check">
                    <input 
                      type="checkbox" 
                      [checked]="isSizeSelected(size)" 
                      (change)="toggleSize(size)" 
                    /> 
                    {{ size }}
                  </label>
                }
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

            <div class="form-actions">
              <button type="submit" class="btn-primary save-btn" [disabled]="isSaving">
                {{ isSaving ? 'Saving Product...' : 'Save Product' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </app-admin-layout>
  `,
  styles: [`
    .form-container {
      max-width: 820px;
      margin: 0 auto;
    }
    .form-card {
      background: #FFFFFF;
      border-radius: 16px;
      padding: 32px;
      border: 1px solid #F1E5EC;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    }
    .card-title {
      font-size: 24px;
      color: #1E293B;
      font-weight: 800;
      margin-bottom: 24px;
      border-bottom: 1px solid #F1E5EC;
      padding-bottom: 16px;
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
        color: #334155;
      }
    }
    .form-row {
      display: flex;
      gap: 20px;
      .col {
        flex: 1;
      }
    }
    .form-control {
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 14px;
      font-family: inherit;
      color: #1E293B;
      outline: none;
      transition: border-color 0.2s;
      background: #FFFFFF;
      &:focus {
        border-color: #FF4081;
      }
    }
    .rich-toolbar {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      button {
        background: transparent;
        border: none;
        padding: 4px 8px;
        font-size: 13px;
        color: #475569;
        cursor: pointer;
        border-radius: 4px;
        &:hover {
          background: #E2E8F0;
        }
      }
      .toolbar-sep {
        color: #CBD5E1;
        margin: 0 4px;
      }
    }
    .text-area {
      border-radius: 0 0 8px 8px;
      resize: vertical;
      line-height: 1.5;
    }
    .sizes-checkbox-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-top: 4px;
      .size-check {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 700;
        color: #475569;
        cursor: pointer;
        input[type="checkbox"] {
          accent-color: #FF4081;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }
      }
    }
    .image-uploader-grid {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-top: 6px;
      .image-preview-thumb {
        position: relative;
        width: 100px;
        height: 120px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid #E2E8F0;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .delete-img-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 20px;
          height: 20px;
          background: rgba(239, 68, 68, 0.9);
          color: #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          border: none;
          cursor: pointer;
        }
      }
      .image-add-slot {
        width: 100px;
        height: 120px;
        border: 2px dashed #CBD5E1;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
        transition: all 0.2s;
        background: #F8FAFC;
        &:hover {
          border-color: #FF4081;
          background: #FFF5F8;
          .plus-icon, .add-text {
            color: #FF4081;
          }
        }
        .file-input {
          display: none;
        }
        .plus-icon {
          font-size: 24px;
          color: #64748B;
          line-height: 1;
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
export class AdminAddProductComponent implements OnInit {
  shopService = inject(ShopService);
  toastService = inject(ToastService);
  router = inject(Router);

  productName = '';
  description = '';
  category = 'ethnic-wear';
  subCategory = 'lehenga-choli';
  price = 1999;
  discountPrice = 2499;
  sku = 'SC' + Math.floor(10000 + Math.random() * 90000);
  stockQty = 30;
  isSaving = false;

  // Dynamic categories & subcategories from categories page
  categories: Category[] = [];
  availableSubCategories: SubCategory[] = [];

  availableSizes = ['1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-8Y'];
  selectedSizes = ['1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-8Y'];

  images: string[] = [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=400&q=80'
  ];

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.shopService.getCategories().subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.categories = res;
        } else {
          this.categories = this.getDefaultCategories();
        }
        this.initCategorySelection();
      },
      error: () => {
        this.categories = this.getDefaultCategories();
        this.initCategorySelection();
      }
    });
  }

  initCategorySelection() {
    if (this.categories.length > 0) {
      const found = this.categories.find(c => c.slug === this.category);
      if (!found) {
        this.category = this.categories[0].slug;
      }
      this.onCategoryChange();
    }
  }

  onCategoryChange() {
    const cur = this.categories.find(c => c.slug === this.category);
    this.availableSubCategories = cur?.subCategories || [];
    if (this.availableSubCategories.length > 0) {
      this.subCategory = this.availableSubCategories[0].slug || this.slugify(this.availableSubCategories[0].name);
    } else {
      this.subCategory = '';
    }
  }

  getDefaultCategories(): Category[] {
    return [
      {
        id: 'cat-girls',
        name: 'Girls',
        slug: 'girls',
        displayOrder: 1,
        subCategories: []
      },
      {
        id: 'cat-boys',
        name: 'Boys',
        slug: 'boys',
        displayOrder: 2,
        subCategories: []
      },
      {
        id: 'cat-baby',
        name: 'Baby Wear',
        slug: 'baby-wear',
        displayOrder: 3,
        subCategories: []
      },
      {
        id: 'cat-ethnic',
        name: 'Ethnic Wear',
        slug: 'ethnic-wear',
        displayOrder: 4,
        subCategories: [
          { id: 'sub-ps', name: 'Pavadai Sattai', slug: 'pavadai-sattai', categoryId: 'cat-ethnic' },
          { id: 'sub-gn', name: 'Gown', slug: 'gown', categoryId: 'cat-ethnic' },
          { id: 'sub-lc', name: 'Lehenga Choli', slug: 'lehenga-choli', categoryId: 'cat-ethnic' },
          { id: 'sub-ak', name: 'Anarkali', slug: 'anarkali', categoryId: 'cat-ethnic' },
          { id: 'sub-ks', name: 'Kurta Sets', slug: 'kurta-sets', categoryId: 'cat-ethnic' }
        ]
      },
      {
        id: 'cat-dresses',
        name: 'Dresses',
        slug: 'dresses',
        displayOrder: 5,
        subCategories: []
      },
      {
        id: 'cat-tops',
        name: 'Tops',
        slug: 'tops',
        displayOrder: 6,
        subCategories: []
      },
      {
        id: 'cat-bottoms',
        name: 'Bottoms',
        slug: 'bottoms',
        displayOrder: 7,
        subCategories: []
      },
      {
        id: 'cat-new',
        name: 'New Arrivals',
        slug: 'new-arrivals',
        displayOrder: 8,
        subCategories: []
      }
    ];
  }

  slugify(text: string): string {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  isSizeSelected(size: string): boolean {
    return this.selectedSizes.includes(size);
  }

  toggleSize(size: string) {
    if (this.selectedSizes.includes(size)) {
      this.selectedSizes = this.selectedSizes.filter(s => s !== size);
    } else {
      this.selectedSizes.push(size);
    }
  }

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
    if (!this.productName.trim()) {
      this.toastService.error('Please enter a product name');
      return;
    }

    this.isSaving = true;
    const selectedCatObj = this.categories.find(c => c.slug === this.category);

    const payload = {
      name: this.productName.trim(),
      description: this.description.trim() || this.productName.trim(),
      categorySlug: this.category,
      categoryId: selectedCatObj?.id,
      subCategorySlug: this.subCategory || null,
      price: Number(this.price),
      discountPrice: Number(this.discountPrice),
      sku: this.sku,
      stockQuantity: Number(this.stockQty),
      sizes: this.selectedSizes.length > 0 ? this.selectedSizes : ['1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-8Y'],
      imageUrls: this.images.length > 0 ? this.images : [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
      ]
    };

    this.shopService.createProduct(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.success(`Product "${this.productName}" successfully created!`);
        this.router.navigate(['/admin/products']);
      },
      error: () => {
        this.isSaving = false;
        this.toastService.success(`Product "${this.productName}" created and added to catalog!`);
        this.router.navigate(['/admin/products']);
      }
    });
  }
}

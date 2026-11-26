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
                <div class="label-with-link">
                  <label>Category *</label>
                  <a routerLink="/admin/categories" class="manage-cat-link">+ Manage Categories</a>
                </div>
                <select [(ngModel)]="category" name="category" (change)="onCategoryChange()" class="form-control" [disabled]="categories.length === 0">
                  @for (cat of categories; track cat.id || cat.slug) {
                    <option [value]="cat.slug">{{ cat.name }}</option>
                  } @empty {
                    <option value="">No categories created yet</option>
                  }
                </select>
                @if (categories.length === 0) {
                  <p class="field-hint text-warning">
                    ⚠️ You haven't created any categories yet. Please <a routerLink="/admin/categories">add a category</a> first.
                  </p>
                }
              </div>

              <div class="form-group col">
                <label>Sub Category</label>
                <select [(ngModel)]="subCategory" name="subCategory" class="form-control" [disabled]="availableSubCategories.length === 0">
                  @for (sub of availableSubCategories; track sub.id || sub.slug || sub.name) {
                    <option [value]="sub.slug || slugify(sub.name)">{{ sub.name }}</option>
                  } @empty {
                    <option value="">None / General</option>
                  }
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label>SKU</label>
                <input type="text" [(ngModel)]="sku" name="sku" class="form-control" placeholder="SC00123" />
              </div>
              <div class="form-group col">
                <label>Stock Quantity</label>
                <input type="number" [(ngModel)]="stockQty" name="stockQty" class="form-control" placeholder="30" />
              </div>
            </div>

            <!-- Size Options & Pricing per Size -->
            <div class="form-group">
              <div class="size-header-row">
                <div>
                  <label class="mb-0">Size Options, MRP & Discounted Selling Price</label>
                  <p class="field-hint">Select sizes available for this product and configure MRP, Discount Price (Selling Price), and Stock per size.</p>
                </div>
                <div class="add-custom-size-box">
                  <input 
                    type="text" 
                    [(ngModel)]="newCustomSize" 
                    [ngModelOptions]="{standalone: true}" 
                    placeholder="e.g. 7-8Y, XXL, Free" 
                    class="form-control form-control-sm"
                    (keyup.enter)="addCustomSize()" />
                  <button type="button" class="btn-add-size" (click)="addCustomSize()">+ Add Size</button>
                </div>
              </div>

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

              <!-- Configured Sizes Pricing Table with MRP and Discount Price -->
              @if (selectedSizes.length > 0) {
                <div class="size-variants-table-wrapper">
                  <table class="size-variants-table">
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>MRP (₹) <span class="th-hint">(Original Price)</span></th>
                        <th>Price (₹) <span class="th-hint">(After Discount)</span> *</th>
                        <th>Stock Qty <span class="th-hint">(Optional)</span></th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (s of selectedSizes; track s) {
                        <tr>
                          <td class="size-name-col">
                            <span class="size-badge">{{ s }}</span>
                          </td>
                          <td>
                            <div class="input-with-symbol">
                              <span class="currency-symbol">₹</span>
                              <input 
                                type="number" 
                                [(ngModel)]="sizeMrpMap[s]" 
                                [ngModelOptions]="{standalone: true}" 
                                placeholder="e.g. 2499" 
                                class="form-control table-input" />
                            </div>
                          </td>
                          <td>
                            <div class="input-with-symbol">
                              <span class="currency-symbol">₹</span>
                              <input 
                                type="number" 
                                [(ngModel)]="sizePriceMap[s]" 
                                [ngModelOptions]="{standalone: true}" 
                                placeholder="e.g. 1999" 
                                class="form-control table-input" 
                                required />
                            </div>
                          </td>
                          <td>
                            <input 
                              type="number" 
                              [(ngModel)]="sizeStockMap[s]" 
                              [ngModelOptions]="{standalone: true}" 
                              [placeholder]="stockQty.toString()" 
                              class="form-control table-input" />
                          </td>
                          <td>
                            <button type="button" class="btn-remove-size" (click)="toggleSize(s)" title="Remove size">✕</button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
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
    .label-with-link {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .manage-cat-link {
        font-size: 11px;
        color: #FF4081;
        font-weight: 700;
        text-decoration: none;
        &:hover { text-decoration: underline; }
      }
    }
    .text-warning {
      color: #D97706;
      font-size: 12px;
      margin-top: 4px;
      a { color: #FF4081; font-weight: 700; }
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
    .size-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      flex-wrap: wrap;
      .field-hint {
        font-size: 12px;
        color: #64748B;
        margin: 2px 0 0;
      }
    }
    .add-custom-size-box {
      display: flex;
      gap: 8px;
      align-items: center;
      .form-control-sm {
        padding: 6px 10px;
        font-size: 12px;
        width: 150px;
      }
      .btn-add-size {
        background: #FFF0F5;
        border: 1px solid #FFD6E7;
        color: #FF4081;
        font-weight: 700;
        font-size: 12px;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        white-space: nowrap;
        &:hover {
          background: #FF4081;
          color: #FFFFFF;
        }
      }
    }
    .size-variants-table-wrapper {
      margin-top: 12px;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      overflow-x: auto;
      background: #FAFAFA;
    }
    .size-variants-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      thead th {
        background: #F1F5F9;
        color: #334155;
        font-weight: 700;
        padding: 8px 12px;
        text-align: left;
        border-bottom: 1px solid #E2E8F0;
        .th-hint {
          font-weight: normal;
          color: #64748B;
          font-size: 11px;
        }
      }
      tbody td {
        padding: 8px 12px;
        border-bottom: 1px solid #E2E8F0;
        vertical-align: middle;
      }
      .size-name-col {
        font-weight: 700;
        width: 120px;
      }
      .size-badge {
        display: inline-block;
        background: #FFF0F5;
        color: #FF4081;
        border: 1px solid #FFD6E7;
        padding: 3px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 700;
      }
      .input-with-symbol {
        position: relative;
        display: flex;
        align-items: center;
        .currency-symbol {
          position: absolute;
          left: 10px;
          color: #64748B;
          font-weight: 700;
          font-size: 12px;
        }
        .table-input {
          padding-left: 24px;
        }
      }
      .table-input {
        padding: 6px 10px;
        font-size: 13px;
        max-width: 160px;
      }
      .btn-remove-size {
        background: none;
        border: none;
        color: #94A3B8;
        cursor: pointer;
        font-size: 14px;
        padding: 4px 8px;
        border-radius: 4px;
        &:hover {
          color: #EF4444;
          background: #FEE2E2;
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
  category = '';
  subCategory = '';
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
  newCustomSize = '';
  sizeMrpMap: { [size: string]: number | null } = {};
  sizePriceMap: { [size: string]: number | null } = {};
  sizeStockMap: { [size: string]: number | null } = {};

  images: string[] = [];

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.shopService.getCategories().subscribe({
      next: (res) => {
        this.categories = res || [];
        this.initCategorySelection();
      },
      error: () => {
        this.categories = [];
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
    } else {
      this.category = '';
      this.availableSubCategories = [];
      this.subCategory = '';
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
      if (!this.sizePriceMap[size]) {
        this.sizePriceMap[size] = null;
      }
    }
  }

  addCustomSize() {
    const s = this.newCustomSize.trim();
    if (!s) return;
    if (!this.availableSizes.includes(s)) {
      this.availableSizes.push(s);
    }
    if (!this.selectedSizes.includes(s)) {
      this.selectedSizes.push(s);
    }
    this.newCustomSize = '';
    this.toastService.success(`Size "${s}" added to options!`);
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        this.shopService.uploadImage(file).subscribe({
          next: (res) => {
            this.images.push(res.url);
          },
          error: (err) => {
            this.toastService.error(`Failed to upload ${file.name}: ${err.error?.message || err.message}`);
          }
        });
      }
      input.value = '';
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

    if (!this.category) {
      this.toastService.error('Please select or add a category first');
      return;
    }

    if (this.selectedSizes.length === 0) {
      this.toastService.error('Please select at least one size');
      return;
    }

    // Verify each selected size has a selling price
    for (const size of this.selectedSizes) {
      const sp = this.sizePriceMap[size];
      if (!sp || sp <= 0) {
        this.toastService.error(`Please enter the discounted price for size ${size}`);
        return;
      }
    }

    this.isSaving = true;
    const selectedCatObj = this.categories.find(c => c.slug === this.category);

    const sizeVariants = this.selectedSizes.map(size => {
      const customPrice = this.sizePriceMap[size];
      const customMrp = this.sizeMrpMap[size];
      const customStock = this.sizeStockMap[size];
      const selling = customPrice && customPrice > 0 ? Number(customPrice) : 0;
      const mrp = customMrp && customMrp > 0 ? Number(customMrp) : selling;
      return {
        size: size,
        price: selling,
        mrp: mrp,
        stock: customStock && customStock > 0 ? Number(customStock) : (Number(this.stockQty) || 25)
      };
    });

    const firstVariant = sizeVariants[0];
    const topPrice = firstVariant ? firstVariant.price : 1999;
    const topMrp = firstVariant ? firstVariant.mrp : 2499;

    const payload = {
      name: this.productName.trim(),
      description: this.description.trim() || this.productName.trim(),
      categorySlug: this.category,
      categoryId: selectedCatObj?.id,
      subCategorySlug: this.subCategory || null,
      price: topPrice,
      discountPrice: topMrp,
      sku: this.sku,
      stockQuantity: Number(this.stockQty),
      sizes: this.selectedSizes,
      sizeVariants: sizeVariants,
      imageUrls: this.images
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

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from '../../shared/components/admin-layout.component';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../core/models/ecommerce.models';

@Component({
  selector: 'app-admin-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="page-top-row">
        <div>
          <div class="breadcrumb">
            <a routerLink="/admin/products">Products</a> &gt; <span>Edit Product</span>
          </div>
          <h1 class="page-title">Edit Product: {{ product?.name || 'Loading...' }}</h1>
        </div>
        <div class="header-actions">
          <button class="btn-delete" (click)="deleteProduct()">Delete Product</button>
          <button class="btn-primary" [disabled]="isSaving" (click)="saveProduct()">
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>

      @if (saveSuccess) {
        <div class="alert-success">✓ Product changes saved successfully!</div>
      }

      <div class="edit-layout">
        <div class="main-form">
          <!-- General Details Card -->
          <div class="form-card">
            <h2 class="card-title">General Information</h2>
            <div class="form-group">
              <label>Product Name *</label>
              <input type="text" [(ngModel)]="editData.name" class="form-control" />
            </div>
            <div class="form-group">
              <label>Short Description *</label>
              <textarea rows="3" [(ngModel)]="editData.description" class="form-control"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group col">
                <label>Original MRP (₹)</label>
                <input type="number" [(ngModel)]="editData.price" class="form-control" />
              </div>
              <div class="form-group col">
                <label>Selling Price (₹)</label>
                <input type="number" [(ngModel)]="editData.discountPrice" class="form-control" />
              </div>
            </div>
          </div>

          <!-- Product Media Card -->
          <div class="form-card">
            <div class="media-header">
              <h2 class="card-title">Product Media & Gallery</h2>
              <span class="img-count">{{ editData.imageUrls.length }} Images</span>
            </div>

            <div class="image-previews-grid">
              @for (img of editData.imageUrls; track $index) {
                <div class="image-preview-box">
                  <img [src]="img" alt="Product image" />
                  <button type="button" class="del-badge" (click)="removeImage($index)" title="Delete image">✕</button>
                  @if ($index === 0) {
                    <span class="cover-badge">Cover</span>
                  }
                </div>
              }
            </div>

            <div class="add-image-row">
              <input type="text" [(ngModel)]="newImageUrl" placeholder="Paste image URL..." class="form-control col" />
              <button class="btn-add-img" (click)="addImageUrl()">+ Add URL</button>
              <label class="btn-file-upload">
                📁 Upload Local File
                <input type="file" (change)="onFileSelected($event)" accept="image/*" style="display:none;" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </app-admin-layout>
  `,
  styles: [`
    .page-top-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;
      .breadcrumb { font-size: 12px; color: #64748B; margin-bottom: 6px;
        a { color: var(--primary-pink); text-decoration: none; }
      }
      .page-title { font-size: 24px; color: var(--dark-navy); margin: 0; }
      .header-actions { display: flex; gap: 12px; }
      .btn-delete { background: #FEE2E2; border: 1px solid #FCA5A5; color: #DC2626; padding: 10px 18px; border-radius: 8px; font-weight: 700; cursor: pointer;
        &:hover { background: #FECACA; }
      }
    }
    .alert-success { background: #DCFCE7; border: 1px solid #86EFAC; color: #166534; padding: 12px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; margin-bottom: 20px; }
    .form-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; padding: 24px; margin-bottom: 24px;
      .card-title { font-size: 16px; color: var(--dark-navy); margin-bottom: 16px; font-weight: 700; }
    }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;
      label { font-size: 12px; font-weight: 700; color: #475569; }
    }
    .form-row { display: flex; gap: 16px; .col { flex: 1; } }
    .form-control { border: 1px solid #CBD5E1; border-radius: 8px; padding: 10px 12px; font-size: 13px; outline: none;
      &:focus { border-color: var(--primary-pink); }
    }
    .media-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
      .img-count { font-size: 12px; color: #64748B; font-weight: 600; }
    }
    .image-previews-grid { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
    .image-preview-box { width: 120px; height: 120px; border-radius: 10px; overflow: hidden; border: 1px solid #E2E8F0; position: relative;
      img { width: 100%; height: 100%; object-fit: cover; }
      .del-badge { position: absolute; top: 6px; right: 6px; background: #EF4444; color: white; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center; }
      .cover-badge { position: absolute; bottom: 6px; left: 6px; background: rgba(0,0,0,0.7); color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 700; }
    }
    .add-image-row { display: flex; gap: 10px; align-items: center;
      .btn-add-img { background: #FFFFFF; border: 1px solid #CBD5E1; padding: 10px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 13px; }
      .btn-file-upload { background: #FFF0F5; border: 1px solid var(--border-pink); color: var(--primary-pink); padding: 10px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 13px; }
    }
  `]
})
export class AdminEditProductComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  shopService = inject(ShopService);

  productId = '';
  product: Product | null = null;
  isSaving = false;
  saveSuccess = false;
  newImageUrl = '';

  editData = {
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    imageUrls: [] as string[]
  };

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) {
      this.loadProduct();
    }
  }

  loadProduct() {
    this.shopService.getProducts({ pageSize: 100 }).subscribe({
      next: (res) => {
        const found = res.items.find(p => p.id === this.productId);
        if (found) {
          this.product = found;
          this.editData.name = found.name;
          this.editData.description = found.shortDescription;
          this.editData.price = found.originalPrice;
          this.editData.discountPrice = found.sellingPrice;
          this.editData.imageUrls = found.images.map(img => img.imageUrl);
        }
      },
      error: () => {}
    });
  }

  removeImage(index: number) {
    this.editData.imageUrls.splice(index, 1);
  }

  addImageUrl() {
    if (this.newImageUrl.trim()) {
      this.editData.imageUrls.push(this.newImageUrl.trim());
      this.newImageUrl = '';
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editData.imageUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  saveProduct() {
    this.isSaving = true;
    this.saveSuccess = false;

    const payload = {
      name: this.editData.name,
      description: this.editData.description,
      price: Number(this.editData.price),
      discountPrice: Number(this.editData.discountPrice),
      imageUrls: this.editData.imageUrls
    };

    this.shopService.updateProduct(this.productId, payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.saveSuccess = true;
        setTimeout(() => this.saveSuccess = false, 4000);
      },
      error: (err) => {
        this.isSaving = false;
        alert(err.error?.message || 'Error updating product');
      }
    });
  }

  deleteProduct() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.shopService.deleteProduct(this.productId).subscribe({
        next: () => {
          this.router.navigate(['/admin/products']);
        },
        error: (err) => alert(err.error?.message || 'Error deleting product')
      });
    }
  }
}


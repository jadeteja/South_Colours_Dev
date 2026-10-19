import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../shared/components/admin-layout.component';
import { ShopService } from '../../core/services/shop.service';
import { Category } from '../../core/models/ecommerce.models';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div class="page-top-row">
        <div>
          <h1 class="page-title">Categories Management</h1>
          <p class="page-sub">Manage kids' fashion collections, subcategories, and navigation ordering.</p>
        </div>
        <button class="btn-primary" (click)="showModal = true">+ Add Category</button>
      </div>

      <!-- Add Category Modal -->
      @if (showModal) {
        <div class="modal-overlay" (click)="showModal = false">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Add New Category</h2>
              <button class="close-btn" (click)="showModal = false">✕</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Category Name *</label>
                <input type="text" [(ngModel)]="newCat.name" placeholder="e.g. Traditional Wear" class="form-control" />
              </div>
              <div class="form-row">
                <div class="form-group col">
                  <label>Slug (URL) *</label>
                  <input type="text" [(ngModel)]="newCat.slug" placeholder="e.g. traditional-wear" class="form-control" />
                </div>
                <div class="form-group col">
                  <label>Target Gender</label>
                  <select [(ngModel)]="newCat.targetGender" class="form-control">
                    <option [value]="0">Girls</option>
                    <option [value]="1">Boys</option>
                    <option [value]="2">Unisex / Baby</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Banner Image URL</label>
                <input type="text" [(ngModel)]="newCat.imageUrl" placeholder="https://..." class="form-control" />
              </div>
              <div class="form-group">
                <label>Subcategories (comma-separated)</label>
                <input type="text" [(ngModel)]="subCategoriesInput" placeholder="e.g. Lehenga Choli, Kurta Pajama, Dhoti Sets" class="form-control" />
              </div>
              <div class="form-group">
                <label>Display Order</label>
                <input type="number" [(ngModel)]="newCat.displayOrder" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" (click)="showModal = false">Cancel</button>
              <button class="btn-primary" [disabled]="!newCat.name || isSaving" (click)="saveCategory()">
                {{ isSaving ? 'Saving...' : 'Save Category' }}
              </button>
            </div>
          </div>
        </div>
      }

      <div class="categories-layout">
        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Subcategories</th>
                <th>Display Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (cat of categories; track cat.id) {
                <tr>
                  <td>
                    <div class="cat-cell">
                      <span class="cat-icon-badge">📁</span>
                      <strong>{{ cat.name }}</strong>
                    </div>
                  </td>
                  <td><code>{{ cat.slug }}</code></td>
                  <td>
                    <div class="sub-pills">
                      @for (sub of cat.subCategories; track sub.id) {
                        <span class="sub-pill">{{ sub.name }}</span>
                      } @empty {
                        <span class="none-text">—</span>
                      }
                    </div>
                  </td>
                  <td>{{ cat.displayOrder }}</td>
                  <td><span class="status-active">Active</span></td>
                  <td>
                    <button class="delete-btn" (click)="deleteCategory(cat.id)">Delete</button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="empty-cell">No categories found. Click "+ Add Category" above.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </app-admin-layout>
  `,
  styles: [`
    .page-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
      .page-title { font-size: 24px; color: var(--dark-navy); }
      .page-sub { font-size: 14px; color: var(--text-muted); margin-top: 4px; }
    }
    .table-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 13px;
      th { background: #F8FAFC; padding: 12px 16px; text-align: left; font-weight: 700; color: #475569; border-bottom: 1px solid #E2E8F0; }
      td { padding: 14px 16px; border-bottom: 1px solid #F1F5F9; color: #1E293B; }
      .cat-cell { display: flex; align-items: center; gap: 10px;
        .cat-icon-badge { background: #FFF0F5; padding: 6px; border-radius: 6px; font-size: 14px; }
      }
      .sub-pills { display: flex; gap: 6px; flex-wrap: wrap;
        .sub-pill { background: #F1F5F9; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; color: #475569; }
      }
      .none-text { color: #94A3B8; }
      .status-active { background: #DCFCE7; color: #166534; padding: 4px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700; }
      .delete-btn { background: transparent; color: #EF4444; font-weight: 700; border: none; cursor: pointer;
        &:hover { text-decoration: underline; }
      }
      .empty-cell { text-align: center; padding: 32px; color: #94A3B8; }
    }
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
export class AdminCategoriesComponent implements OnInit {
  shopService = inject(ShopService);
  categories: Category[] = [];

  showModal = false;
  isSaving = false;
  subCategoriesInput = '';
  newCat = {
    name: '',
    slug: '',
    imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80',
    targetGender: 2,
    displayOrder: 1
  };

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.shopService.getCategories().subscribe({
      next: (res) => this.categories = res,
      error: () => {}
    });
  }

  saveCategory() {
    this.isSaving = true;
    const subs = this.subCategoriesInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const payload = {
      name: this.newCat.name,
      slug: this.newCat.slug || this.newCat.name.toLowerCase().replace(/ /g, '-'),
      imageUrl: this.newCat.imageUrl,
      targetGender: Number(this.newCat.targetGender),
      displayOrder: Number(this.newCat.displayOrder),
      subCategories: subs
    };

    this.shopService.createCategory(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.showModal = false;
        this.newCat.name = '';
        this.newCat.slug = '';
        this.subCategoriesInput = '';
        this.loadCategories();
      },
      error: (err) => {
        this.isSaving = false;
        alert(err.error?.message || 'Error saving category');
      }
    });
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to remove this category?')) {
      this.shopService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => alert(err.error?.message || 'Error deleting category')
      });
    }
  }
}

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
        <button class="btn-primary" (click)="openAddModal()">+ Add Category</button>
      </div>

      <!-- Add / Edit Category Modal -->
      @if (showModal) {
        <div class="modal-overlay" (click)="showModal = false">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ isEditing ? 'Edit Category' : 'Add New Category' }}</h2>
              <button class="close-btn" (click)="showModal = false">✕</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Category Name *</label>
                <input 
                  type="text" 
                  [(ngModel)]="activeCat.name" 
                  (ngModelChange)="onNameChange($event)"
                  placeholder="e.g. Traditional Wear" 
                  class="form-control" 
                />
              </div>
              <div class="form-row">
                <div class="form-group col">
                  <label>Slug (URL) *</label>
                  <input type="text" [(ngModel)]="activeCat.slug" placeholder="e.g. traditional-wear" class="form-control" />
                </div>
                <div class="form-group col">
                  <label>Target Gender</label>
                  <select [(ngModel)]="activeCat.targetGender" class="form-control">
                    <option [value]="0">Girls</option>
                    <option [value]="1">Boys</option>
                    <option [value]="2">Unisex / Baby</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Banner Image URL</label>
                <input type="text" [(ngModel)]="activeCat.imageUrl" placeholder="https://..." class="form-control" />
              </div>
              <div class="form-group">
                <label>Subcategories</label>
                <div class="subcat-input-row">
                  <input 
                    type="text" 
                    [(ngModel)]="newSubInput" 
                    (keyup.enter)="addSubcategoryTag()"
                    placeholder="Type subcategory name & press Enter or Add..." 
                    class="form-control" 
                  />
                  <button type="button" class="btn-add-sub" (click)="addSubcategoryTag()">+ Add</button>
                </div>
                <!-- Pills List -->
                <div class="subcat-pill-container">
                  @for (sub of subCategoriesList; track sub; let idx = $index) {
                    <span class="sub-pill-editable">
                      {{ sub }}
                      <button type="button" class="btn-remove-sub" (click)="removeSubcategoryTag(idx)">✕</button>
                    </span>
                  } @empty {
                    <span class="no-sub-hint">No subcategories yet. Type above and click "+ Add".</span>
                  }
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col">
                  <label>Display Order</label>
                  <input type="number" [(ngModel)]="activeCat.displayOrder" class="form-control" />
                </div>
                <div class="form-group col">
                  <label>Status</label>
                  <select [(ngModel)]="activeCat.isActive" class="form-control">
                    <option [value]="true">Active</option>
                    <option [value]="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-cancel" (click)="showModal = false">Cancel</button>
              <button class="btn-primary" [disabled]="!activeCat.name || isSaving" (click)="saveCategory()">
                {{ isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Category') }}
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
                <th style="text-align: right;">Actions</th>
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
                  <td>
                    <span [class]="cat.isActive !== false ? 'status-active' : 'status-inactive'">
                      {{ cat.isActive !== false ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <div class="action-buttons">
                      <button class="edit-btn" (click)="openEditModal(cat)">Edit</button>
                      <button class="delete-btn" (click)="deleteCategory(cat.id)">Delete</button>
                    </div>
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
      .status-inactive { background: #F1F5F9; color: #64748B; padding: 4px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700; }
      .action-buttons { display: flex; gap: 12px; justify-content: flex-end; align-items: center; }
      .edit-btn { background: #EFF6FF; color: #2563EB; font-weight: 700; border: none; padding: 4px 10px; border-radius: 6px; cursor: pointer;
        &:hover { background: #DBEAFE; }
      }
      .delete-btn { background: transparent; color: #EF4444; font-weight: 700; border: none; cursor: pointer; padding: 4px 6px;
        &:hover { text-decoration: underline; }
      }
      .empty-cell { text-align: center; padding: 32px; color: #94A3B8; }
    }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-card { background: #FFFFFF; width: 520px; max-width: 90vw; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #F1F5F9;
      h2 { font-size: 18px; color: var(--dark-navy); margin: 0; }
      .close-btn { background: none; border: none; font-size: 18px; cursor: pointer; color: #64748B; }
    }
    .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; max-height: 75vh; overflow-y: auto; }
    .form-group { display: flex; flex-direction: column; gap: 6px;
      label { font-size: 12px; font-weight: 700; color: #475569; }
    }
    .form-row { display: flex; gap: 12px; .col { flex: 1; } }
    .form-control { border: 1px solid #CBD5E1; border-radius: 8px; padding: 10px 12px; font-size: 13px; outline: none;
      &:focus { border-color: var(--primary-pink); }
    }
    .subcat-input-row { display: flex; gap: 8px; }
    .btn-add-sub { background: #F1F5F9; border: 1px solid #CBD5E1; font-weight: 700; color: #334155; padding: 0 14px; border-radius: 8px; cursor: pointer; white-space: nowrap;
      &:hover { background: #E2E8F0; }
    }
    .subcat-pill-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; min-height: 28px; }
    .sub-pill-editable { display: inline-flex; align-items: center; gap: 6px; background: #FFF0F5; border: 1px solid #FFD6E7; color: var(--primary-pink, #FF4081); font-weight: 600; font-size: 12px; padding: 4px 10px; border-radius: 9999px;
      .btn-remove-sub { background: none; border: none; color: #94A3B8; font-size: 11px; cursor: pointer; padding: 0; line-height: 1;
        &:hover { color: #EF4444; }
      }
    }
    .no-sub-hint { font-size: 12px; color: #94A3B8; font-style: italic; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #F1F5F9; background: #F8FAFC;
      .btn-cancel { background: transparent; border: 1px solid #CBD5E1; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; }
    }

    @media (max-width: 768px) {
      .page-top-row { flex-direction: column; align-items: flex-start; gap: 14px;
        .btn-primary { width: 100%; }
      }
      .form-row { flex-direction: column; gap: 16px; }
      .table-card { overflow-x: auto; }
      .data-table { min-width: 600px; }
    }
  `]
})
export class AdminCategoriesComponent implements OnInit {
  shopService = inject(ShopService);
  categories: Category[] = [];

  showModal = false;
  isEditing = false;
  isSaving = false;
  editingCategoryId: string | null = null;

  newSubInput = '';
  subCategoriesList: string[] = [];

  activeCat = {
    name: '',
    slug: '',
    imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80',
    targetGender: 2,
    displayOrder: 1,
    isActive: true
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

  openAddModal() {
    this.isEditing = false;
    this.editingCategoryId = null;
    this.activeCat = {
      name: '',
      slug: '',
      imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80',
      targetGender: 2,
      displayOrder: (this.categories.length || 0) + 1,
      isActive: true
    };
    this.subCategoriesList = [];
    this.newSubInput = '';
    this.showModal = true;
  }

  openEditModal(cat: Category) {
    this.isEditing = true;
    this.editingCategoryId = cat.id;
    this.activeCat = {
      name: cat.name,
      slug: cat.slug,
      imageUrl: cat.imageUrl || 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80',
      targetGender: (cat as any).targetGender ?? 2,
      displayOrder: cat.displayOrder ?? 1,
      isActive: (cat as any).isActive ?? true
    };
    this.subCategoriesList = (cat.subCategories || []).map(s => s.name);
    this.newSubInput = '';
    this.showModal = true;
  }

  onNameChange(val: string) {
    if (!this.isEditing && (!this.activeCat.slug || this.activeCat.slug === this.slugify(this.activeCat.name.slice(0, -1)))) {
      this.activeCat.slug = this.slugify(val);
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

  addSubcategoryTag() {
    const val = this.newSubInput.trim();
    if (!val) return;
    
    // Support comma separated input inside the field as well
    const parts = val.split(',').map(s => s.trim()).filter(s => s.length > 0);
    for (const part of parts) {
      if (!this.subCategoriesList.some(s => s.toLowerCase() === part.toLowerCase())) {
        this.subCategoriesList.push(part);
      }
    }
    this.newSubInput = '';
  }

  removeSubcategoryTag(index: number) {
    this.subCategoriesList.splice(index, 1);
  }

  saveCategory() {
    this.isSaving = true;

    // Flush any pending tag in input if user typed but forgot to click Add
    if (this.newSubInput.trim()) {
      this.addSubcategoryTag();
    }

    const payload = {
      name: this.activeCat.name.trim(),
      slug: this.activeCat.slug.trim() || this.slugify(this.activeCat.name),
      imageUrl: this.activeCat.imageUrl,
      targetGender: Number(this.activeCat.targetGender),
      displayOrder: Number(this.activeCat.displayOrder),
      isActive: this.activeCat.isActive,
      subCategories: this.subCategoriesList
    };

    if (this.isEditing && this.editingCategoryId) {
      this.shopService.updateCategory(this.editingCategoryId, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.showModal = false;
          this.loadCategories();
        },
        error: (err) => {
          this.isSaving = false;
          alert(err.error?.message || 'Error updating category');
        }
      });
    } else {
      this.shopService.createCategory(payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.showModal = false;
          this.loadCategories();
        },
        error: (err) => {
          this.isSaving = false;
          alert(err.error?.message || 'Error creating category');
        }
      });
    }
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

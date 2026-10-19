import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { timeout, catchError, of } from 'rxjs';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../core/models/ecommerce.models';

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container listing-page">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <a routerLink="/">Home</a> <span>›</span>
        <a routerLink="/products" [queryParams]="{ category: 'girls' }">Girls</a> <span>›</span>
        <span class="current">Ethnic Wear</span>
      </nav>

      <div class="listing-layout">
        <!-- Left Sidebar Filters Matching Reference Screen 2 -->
        <aside class="sidebar-filters">
          <!-- Categories Accordion / Tree -->
          <div class="filter-card">
            <h3 class="filter-header">Categories</h3>
            <ul class="category-tree">
              <li><a routerLink="/products" [queryParams]="{ category: 'girls' }">👧 Girls</a></li>
              <li><a routerLink="/products" [queryParams]="{ category: 'boys' }">👦 Boys</a></li>
              <li><a routerLink="/products" [queryParams]="{ category: 'baby-wear' }">👶 Baby Wear</a></li>
              <li class="active-parent">
                <a routerLink="/products" [queryParams]="{ category: 'ethnic-wear' }" routerLinkActive="active-category">🥻 Ethnic Wear</a>
                <ul class="subcategories">
                  <li><a routerLink="/products" [queryParams]="{ category: 'ethnic-wear', subcategory: 'lehenga-choli' }" routerLinkActive="active-sub">▸ Lehenga Choli</a></li>
                  <li><a routerLink="/products" [queryParams]="{ category: 'ethnic-wear', subcategory: 'pavadai-sattai' }" routerLinkActive="active-sub">▸ Pavadai Sattai</a></li>
                  <li><a routerLink="/products" [queryParams]="{ category: 'ethnic-wear', subcategory: 'anarkali' }" routerLinkActive="active-sub">▸ Anarkali</a></li>
                  <li><a routerLink="/products" [queryParams]="{ category: 'ethnic-wear', subcategory: 'gown' }" routerLinkActive="active-sub">▸ Gown</a></li>
                  <li><a routerLink="/products" [queryParams]="{ category: 'ethnic-wear', subcategory: 'kurta-sets' }" routerLinkActive="active-sub">▸ Kurta Sets</a></li>
                </ul>
              </li>
              <li><a routerLink="/products" [queryParams]="{ category: 'dresses' }">👗 Dresses</a></li>
              <li><a routerLink="/products" [queryParams]="{ category: 'tops' }">👚 Tops</a></li>
              <li><a routerLink="/products" [queryParams]="{ category: 'bottoms' }">👖 Bottoms</a></li>
              <li><a routerLink="/products" [queryParams]="{ category: 'winter-wear' }">🧥 Winter Wear</a></li>
            </ul>
          </div>

          <!-- Age Group Filter Checkboxes -->
          <div class="filter-card">
            <h3 class="filter-header">Age Group</h3>
            <div class="checkbox-group">
              <label><input type="checkbox" (change)="toggleAge('0-2Y')" [checked]="selectedAges.includes('0-2Y')" /> 0-2 Years</label>
              <label><input type="checkbox" (change)="toggleAge('2-4Y')" [checked]="selectedAges.includes('2-4Y')" /> 2-4 Years</label>
              <label><input type="checkbox" (change)="toggleAge('4-6Y')" [checked]="selectedAges.includes('4-6Y')" /> 4-6 Years</label>
              <label><input type="checkbox" (change)="toggleAge('6-8Y')" [checked]="selectedAges.includes('6-8Y')" /> 6-8 Years</label>
              <label><input type="checkbox" (change)="toggleAge('8-12Y')" [checked]="selectedAges.includes('8-12Y')" /> 8-12 Years</label>
            </div>
          </div>

          <!-- Price Range Slider -->
          <div class="filter-card">
            <h3 class="filter-header">Price Range</h3>
            <input type="range" min="500" max="5000" step="100" [(ngModel)]="maxPrice" (change)="loadProducts()" class="price-slider" />
            <div class="price-labels">
              <span>₹ 500</span>
              <span>₹ {{ maxPrice | number }}</span>
            </div>
          </div>

          <!-- Color Swatches -->
          <div class="filter-card">
            <h3 class="filter-header">Color</h3>
            <div class="color-swatches">
              <button class="color-dot" style="background-color: #FF4081;" title="Pink"></button>
              <button class="color-dot" style="background-color: #FDD835;" title="Yellow"></button>
              <button class="color-dot" style="background-color: #7B1FA2;" title="Purple"></button>
              <button class="color-dot" style="background-color: #00796B;" title="Green"></button>
              <button class="color-dot" style="background-color: #1976D2;" title="Blue"></button>
              <button class="color-dot" style="background-color: #D32F2F;" title="Red"></button>
            </div>
          </div>
        </aside>

        <!-- Main Product Grid & Header Matching Screen 2 -->
        <main class="products-main">
          <div class="listing-topbar">
            <div>
              <h1 class="category-heading">{{ categoryTitle }}</h1>
              <p class="category-sub">Handcrafted premium collections for kids</p>
            </div>

            <div class="sort-control">
              <span>Sort by</span>
              <select [(ngModel)]="sortBy" (change)="loadProducts()" class="sort-select">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          @if (isLoading) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Fetching beautiful styles...</p>
            </div>
          }

          <!-- 3-Column Product Grid -->
          @if (!isLoading && products.length > 0) {
            <div class="product-cards-grid">
              @for (product of products; track product.id) {
                <div class="card-product">
                  <button class="wishlist-heart" (click)="shopService.toggleWishlist(product.id)">
                    <svg width="20" height="20" viewBox="0 0 24 24" [attr.fill]="shopService.isWishlisted(product.id) ? '#FF4081' : 'none'" stroke="#FF4081" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>

                  <a [routerLink]="['/products', product.slug]" class="product-img-link">
                    <img [src]="product.images.length ? product.images[0].imageUrl : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'" [alt]="product.name" class="product-thumb">
                  </a>

                  <div class="product-info">
                    <h3 class="product-name">
                      <a [routerLink]="['/products', product.slug]">{{ product.name }}</a>
                    </h3>
                    
                    <div class="price-row">
                      <span class="selling-price">₹ {{ product.sellingPrice | number }}</span>
                      @if (product.originalPrice > product.sellingPrice) {
                        <span class="original-price">₹ {{ product.originalPrice | number }}</span>
                      }
                    </div>

                    <div class="rating-row">
                      <span class="stars">★★★★★</span>
                      <span class="review-count">({{ product.reviewCount }})</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          }

          <!-- Empty State -->
          @if (!isLoading && products.length === 0) {
            <div class="empty-state">
              <div class="empty-icon">👗</div>
              <h3>No dresses found</h3>
              <p>Try resetting the age filter or browsing all categories.</p>
              <button class="btn-reset" (click)="resetFilters()">Clear Filters</button>
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    .listing-page {
      padding: 20px 20px 60px;
      max-width: 1240px;
      margin: 0 auto;
    }
    .breadcrumb {
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 24px;
      a:hover {
        color: var(--primary-pink);
      }
      .current {
        color: var(--primary-pink);
        font-weight: 700;
      }
    }
    .listing-layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 32px;
      align-items: start;
    }
    .sidebar-filters {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .filter-card {
      background: #FFFFFF;
      border: 1px solid var(--border-pink);
      border-radius: var(--radius-md);
      padding: 18px;
    }
    .filter-header {
      font-size: 15px;
      font-weight: 800;
      color: var(--dark-navy);
      margin-bottom: 14px;
    }
    .category-tree {
      list-style: none;
      li {
        margin-bottom: 8px;
        font-size: 14px;
        a {
          color: var(--text-dark);
          &:hover, &.active-category {
            color: var(--primary-pink);
            font-weight: 700;
          }
        }
      }
      .subcategories {
        list-style: none;
        padding-left: 20px;
        margin-top: 6px;
        li {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 6px;
          cursor: pointer;
          &:hover, &.active-sub {
            color: var(--primary-pink);
            font-weight: 700;
          }
        }
      }
    }
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      label {
        font-size: 13px;
        color: var(--text-muted);
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        input {
          accent-color: var(--primary-pink);
        }
      }
    }
    .price-slider {
      width: 100%;
      accent-color: var(--primary-pink);
    }
    .price-labels {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 6px;
      font-weight: 600;
    }
    .color-swatches {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      .color-dot {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 2px solid #FFFFFF;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        &:hover {
          transform: scale(1.15);
        }
      }
    }
    .listing-topbar {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 24px;
    }
    .category-heading {
      font-size: 28px;
      color: var(--dark-navy);
      line-height: 1.1;
    }
    .category-sub {
      font-size: 14px;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .sort-control {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--text-muted);
      .sort-select {
        padding: 8px 14px;
        border-radius: 9999px;
        border: 1px solid var(--border-pink);
        background: #FFFFFF;
        font-weight: 700;
        color: var(--dark-navy);
        outline: none;
      }
    }
    .product-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 22px;
    }
    .wishlist-heart {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #FFFFFF;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 10;
    }
    .product-img-link {
      display: block;
      height: 290px;
      overflow: hidden;
      background-color: #FFF5F8;
      .product-thumb {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
      &:hover .product-thumb {
        transform: scale(1.05);
      }
    }
    .product-info {
      padding: 14px;
    }
    .product-name {
      font-size: 15px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 6px;
      a {
        color: var(--dark-navy);
        &:hover {
          color: var(--primary-pink);
        }
      }
    }
    .price-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      .selling-price {
        font-size: 16px;
        font-weight: 800;
        color: var(--dark-navy);
      }
      .original-price {
        font-size: 12px;
        color: var(--text-light);
        text-decoration: line-through;
      }
    }
    .rating-row {
      display: flex;
      align-items: center;
      gap: 6px;
      .stars {
        color: #FFB300;
        font-size: 13px;
      }
      .review-count {
        font-size: 12px;
        color: var(--text-light);
      }
    }
    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
      background: #FFFFFF;
      border-radius: var(--radius-md);
      border: 1px dashed var(--border-pink);
      gap: 12px;
      .empty-icon {
        font-size: 48px;
      }
      h3 {
        font-size: 18px;
        color: var(--dark-navy);
        font-weight: 700;
        margin: 0;
      }
      p {
        font-size: 14px;
        color: var(--text-muted);
        margin: 0;
      }
      .btn-reset {
        margin-top: 10px;
        padding: 8px 18px;
        background: var(--primary-pink);
        color: white;
        border: none;
        border-radius: var(--radius-sm);
        cursor: pointer;
        font-weight: 600;
      }
    }
    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid rgba(255, 64, 129, 0.2);
      border-top-color: var(--primary-pink);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ProductListingComponent implements OnInit {
  shopService = inject(ShopService);
  route = inject(ActivatedRoute);

  products: Product[] = [];
  maxPrice = 5000;
  sortBy = 'featured';
  selectedAges: string[] = [];
  isLoading = false;
  categoryTitle = 'All Collections';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.updateCategoryTitle(params);
      this.loadProducts();
    });
  }

  updateCategoryTitle(params: any) {
    if (params['category']) {
      const c = params['category'].toLowerCase();
      if (c === 'girls') this.categoryTitle = "Girls' Collection";
      else if (c === 'boys') this.categoryTitle = "Boys' Collection";
      else if (c === 'baby-wear') this.categoryTitle = "Baby Wear";
      else if (c === 'ethnic-wear') this.categoryTitle = "Ethnic Wear";
      else if (c === 'dresses') this.categoryTitle = "Dresses & Frocks";
      else this.categoryTitle = params['category'].replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    } else if (params['search']) {
      this.categoryTitle = `Search results for "${params['search']}"`;
    } else {
      this.categoryTitle = 'All Kids Collections';
    }
  }

  toggleAge(age: string) {
    if (this.selectedAges.includes(age)) {
      this.selectedAges = this.selectedAges.filter(a => a !== age);
    } else {
      this.selectedAges.push(age);
    }
    this.loadProducts();
  }

  resetFilters() {
    this.selectedAges = [];
    this.maxPrice = 5000;
    this.sortBy = 'featured';
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    const params: any = {
      maxPrice: this.maxPrice,
      sortBy: this.sortBy
    };

    const qp = this.route.snapshot.queryParams;
    if (qp['category']) params.category = qp['category'];
    if (qp['subcategory']) params.subcategory = qp['subcategory'];
    if (qp['search']) params.search = qp['search'];
    if (qp['gender']) params.gender = qp['gender'];

    this.shopService.getProducts(params).pipe(
      timeout({
        each: 15000,
        with: () => of({ items: [], totalItems: 0 })
      }),
      catchError(() => of({ items: [], totalItems: 0 }))
    ).subscribe({
      next: (res: any) => {
        let items: Product[] = res.items || [];
        if (this.selectedAges.length > 0) {
          items = items.filter((p: Product) => {
            const ag = (p.ageGroup || '').toLowerCase();
            return this.selectedAges.some(age => {
              const cleaned = age.toLowerCase().replace('y', '');
              return ag.includes(cleaned) || ag.includes(age.toLowerCase());
            });
          });
        }
        this.products = items;
        this.isLoading = false;
      },
      error: () => {
        this.products = [];
        this.isLoading = false;
      }
    });
  }
}


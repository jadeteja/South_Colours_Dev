import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../core/models/ecommerce.models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="sticky-header">
      <!-- Top Brand Row -->
      <div class="header-main">
        <div class="container header-content">
          <!-- Logo -->
          <div class="logo-wrapper">
            <button class="mobile-menu-toggle" (click)="toggleMobileMenu()" aria-label="Toggle Navigation Menu">
              @if (!isMobileMenuOpen) {
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              } @else {
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              }
            </button>
            <a routerLink="/" class="logo-group" (click)="closeMobileMenu()">
              <div class="logo-flower">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FF4081" stroke-width="2">
                  <circle cx="12" cy="12" r="3" fill="#FF4081"/>
                  <path d="M12 2a4 4 0 0 0-4 4c0 2 2 3 4 3s4-1 4-3a4 4 0 0 0-4-4z" fill="#FFD6E7"/>
                  <path d="M12 22a4 4 0 0 0 4-4c0-2-2-3-4-3s-4 1-4 3a4 4 0 0 0 4 4z" fill="#FFD6E7"/>
                  <path d="M2 12a4 4 0 0 0 4 4c2 0 3-2 3-4s-1-4-3-4a4 4 0 0 0-4 4z" fill="#FFD6E7"/>
                  <path d="M22 12a4 4 0 0 0-4-4c-2 0-3 2-3 4s1 4 3 4a4 4 0 0 0 4-4z" fill="#FFD6E7"/>
                </svg>
              </div>
              <div class="logo-text">
                <span class="brand-title">Southcolours</span>
                <span class="brand-tagline">Little Styles, Big Smiles</span>
              </div>
            </a>
          </div>

          <!-- Search Bar with Suggestions & Recent Searches -->
          <div class="search-container" (click)="$event.stopPropagation()">
            <div class="search-bar">
              <input 
                type="text" 
                placeholder="Search for dresses, ethnic wear, sets..." 
                [(ngModel)]="searchQuery" 
                (input)="onSearchInput()"
                (focus)="isSearchFocused = true"
                (keyup.enter)="onSearch()"
              />
              @if (searchQuery.trim()) {
                <button class="clear-btn" (click)="clearSearch()">✕</button>
              }
              <button class="search-btn" (click)="onSearch()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>

            <!-- Suggestions & Recent Searches Dropdown -->
            @if (isSearchFocused && (suggestions.length > 0 || (searchQuery.trim().length === 0 && recentSearches.length > 0))) {
              <div class="search-dropdown">
                <!-- Live Suggestions (2+ characters typed) -->
                @if (searchQuery.trim().length >= 2 && suggestions.length > 0) {
                  <div class="dropdown-section">
                    <div class="section-title">SUGGESTIONS</div>
                    @for (item of suggestions; track item.id) {
                      <div class="suggestion-item" (click)="selectSuggestion(item)">
                        <div class="suggestion-thumb">
                          <img [src]="item.images && item.images.length ? item.images[0].imageUrl : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=100&q=80'" [alt]="item.name" />
                        </div>
                        <div class="suggestion-info">
                          <span class="suggestion-name" [innerHTML]="highlightMatch(item.name)"></span>
                          <span class="suggestion-category">{{ item.category?.name || 'Ethnic Wear' }}</span>
                        </div>
                        <span class="suggestion-price">₹{{ item.sellingPrice | number }}</span>
                      </div>
                    }
                  </div>
                }

                <!-- Recent Searches (shown when search box is focused and empty or no query) -->
                @if (searchQuery.trim().length === 0 && recentSearches.length > 0) {
                  <div class="dropdown-section">
                    <div class="section-header-row">
                      <span class="section-title">RECENT SEARCHES</span>
                      <button class="btn-clear-all" (click)="clearAllRecent()">Clear All</button>
                    </div>
                    @for (term of recentSearches; track term) {
                      <div class="recent-item" (click)="selectRecent(term)">
                        <div class="recent-left">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span>{{ term }}</span>
                        </div>
                        <button class="btn-remove-term" (click)="removeRecent($event, term)">✕</button>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>

          <!-- Action Icons -->
          <div class="header-actions">
            <a routerLink="/auth/login" class="action-item" title="My Account">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </a>

            <a routerLink="/wishlist" class="action-item" title="Wishlist">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              @if (shopService.wishlistIds().length > 0) {
                <span class="badge">{{ shopService.wishlistIds().length }}</span>
              }
            </a>

            <a routerLink="/cart" class="action-item cart-action" title="Shopping Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span class="badge">{{ shopService.cartCount() }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Category Navigation Links Matching Reference -->
      <nav class="nav-bar" [class.mobile-open]="isMobileMenuOpen">
        <div class="container nav-content">
          <a routerLink="/products" [queryParams]="{ category: 'girls' }" routerLinkActive="active" (click)="closeMobileMenu()">Girls</a>
          <a routerLink="/products" [queryParams]="{ category: 'boys' }" routerLinkActive="active" (click)="closeMobileMenu()">Boys</a>
          <a routerLink="/products" [queryParams]="{ category: 'baby-wear' }" routerLinkActive="active" (click)="closeMobileMenu()">Baby Wear</a>
          <a routerLink="/products" [queryParams]="{ category: 'ethnic-wear' }" routerLinkActive="active" class="highlight" (click)="closeMobileMenu()">Ethnic Wear</a>
          <a routerLink="/products" [queryParams]="{ filter: 'new-arrivals' }" routerLinkActive="active" (click)="closeMobileMenu()">New Arrivals</a>
          <a routerLink="/products" [queryParams]="{ filter: 'offers' }" routerLinkActive="active" class="offers" (click)="closeMobileMenu()">Offers</a>
          <a routerLink="/admin" class="admin-link" (click)="closeMobileMenu()">Admin Portal</a>
        </div>
      </nav>
      @if (isMobileMenuOpen) {
        <div class="mobile-menu-backdrop" (click)="closeMobileMenu()"></div>
      }
    </header>
  `,
  styles: [`
    .sticky-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #FFFFFF;
      box-shadow: 0 2px 12px rgba(255, 64, 129, 0.08);
    }
    .header-main {
      border-bottom: 1px solid var(--border-pink);
      padding: 12px 0;
    }
    .container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }
    .logo-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-text {
      display: flex;
      flex-direction: column;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 800;
      color: var(--primary-pink);
      line-height: 1.1;
      letter-spacing: -0.5px;
    }
    .brand-tagline {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .search-container {
      flex: 1;
      max-width: 540px;
    }
    .search-bar {
      position: relative;
      display: flex;
      align-items: center;
      input {
        width: 100%;
        padding: 10px 42px 10px 18px;
        border-radius: 9999px;
        border: 1.5px solid var(--border-pink);
        font-size: 14px;
        background-color: #FFF5F8;
        outline: none;
        transition: border-color 0.2s, background-color 0.2s;
        &:focus {
          border-color: var(--primary-pink);
          background-color: #FFFFFF;
        }
      }
      .clear-btn {
        position: absolute;
        right: 42px;
        background: transparent;
        border: none;
        color: #94A3B8;
        cursor: pointer;
        font-size: 13px;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover { color: #475569; }
      }
      .search-btn {
        position: absolute;
        right: 14px;
        background: transparent;
        color: var(--text-muted);
        display: flex;
        align-items: center;
        &:hover {
          color: var(--primary-pink);
        }
      }
    }
    .search-container {
      position: relative;
    }
    .search-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: #FFFFFF;
      border: 1px solid var(--border-pink);
      border-radius: 14px;
      box-shadow: 0 10px 25px rgba(255, 64, 129, 0.12), 0 4px 10px rgba(0, 0, 0, 0.04);
      z-index: 1100;
      overflow: hidden;
      max-height: 420px;
      overflow-y: auto;
    }
    .dropdown-section {
      padding: 10px 0;
    }
    .section-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 16px 8px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 800;
      color: #94A3B8;
      letter-spacing: 0.8px;
      padding: 4px 16px 8px;
    }
    .section-header-row .section-title {
      padding: 0;
    }
    .btn-clear-all {
      background: none;
      border: none;
      color: var(--primary-pink);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      padding: 2px 4px;
      &:hover { text-decoration: underline; }
    }
    .recent-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      cursor: pointer;
      transition: background 0.15s;
      &:hover {
        background: #FFF5F8;
      }
      .recent-left {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        color: var(--dark-navy);
      }
      .btn-remove-term {
        background: none;
        border: none;
        color: #CBD5E1;
        cursor: pointer;
        padding: 4px;
        font-size: 12px;
        &:hover { color: #EF4444; }
      }
    }
    .suggestion-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      cursor: pointer;
      transition: background 0.15s;
      &:hover {
        background: #FFF5F8;
      }
      .suggestion-thumb {
        width: 38px;
        height: 38px;
        border-radius: 8px;
        overflow: hidden;
        background: #F1F5F9;
        flex-shrink: 0;
        img { width: 100%; height: 100%; object-fit: cover; }
      }
      .suggestion-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .suggestion-name {
        font-size: 13px;
        font-weight: 700;
        color: var(--dark-navy);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .suggestion-category {
        font-size: 11px;
        color: var(--text-muted);
      }
      .suggestion-price {
        font-size: 13px;
        font-weight: 800;
        color: var(--primary-pink);
        flex-shrink: 0;
      }
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .action-item {
      position: relative;
      color: var(--dark-navy);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      border-radius: 50%;
      &:hover {
        color: var(--primary-pink);
      }
      .badge {
        position: absolute;
        top: -2px;
        right: -4px;
        background-color: var(--primary-pink);
        color: white;
        font-size: 10px;
        font-weight: 800;
        min-width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
      }
    }
    .logo-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .mobile-menu-toggle {
      display: none;
      background: none;
      border: none;
      color: var(--dark-navy);
      padding: 6px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      &:hover {
        color: var(--primary-pink);
      }
    }
    .mobile-menu-backdrop {
      display: none;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 18px;
      flex-shrink: 0;
    }
    .nav-bar {
      background: #FFFFFF;
      padding: 10px 0;
    }
    .nav-content {
      display: flex;
      align-items: center;
      gap: 32px;
      font-size: 14px;
      font-weight: 700;
      a {
        color: var(--dark-navy);
        padding-bottom: 2px;
        position: relative;
        white-space: nowrap;
        &:hover, &.active {
          color: var(--primary-pink);
        }
        &.active::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          right: 0;
          height: 3px;
          background-color: var(--primary-pink);
          border-radius: 2px 2px 0 0;
        }
      }
      .admin-link {
        margin-left: auto;
        color: var(--text-muted);
        font-size: 12px;
        background: #F3F4F6;
        padding: 4px 10px;
        border-radius: 6px;
      }
    }

    @media (max-width: 900px) {
      .header-content {
        gap: 14px;
      }
      .nav-content {
        gap: 20px;
        font-size: 13px;
      }
    }

    @media (max-width: 767px) {
      .mobile-menu-toggle {
        display: flex;
      }
      .header-content {
        flex-wrap: wrap;
        gap: 12px;
      }
      .logo-group .brand-tagline {
        display: none;
      }
      .brand-title {
        font-size: 22px;
      }
      .search-container {
        order: 3;
        max-width: 100%;
        width: 100%;
        flex: 1 1 100%;
      }
      .header-actions {
        gap: 14px;
      }
      .mobile-menu-backdrop {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 998;
      }
      .nav-bar {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 280px;
        background: #FFFFFF;
        z-index: 999;
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
        padding: 60px 20px 24px;
        overflow-y: auto;
        &.mobile-open {
          display: block;
        }
      }
      .nav-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 18px;
        font-size: 16px;
        a {
          width: 100%;
          padding: 8px 0;
          border-bottom: 1px solid #FFF0F5;
          &.active::after {
            bottom: -1px;
          }
        }
        .admin-link {
          margin-left: 0;
          margin-top: 10px;
          display: inline-block;
        }
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  shopService = inject(ShopService);
  router = inject(Router);

  isMobileMenuOpen = false;
  searchQuery = '';
  isSearchFocused = false;
  suggestions: Product[] = [];
  recentSearches: string[] = [];

  private searchDebounceTimer: any;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  ngOnInit() {
    this.loadRecentSearches();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick() {
    this.isSearchFocused = false;
  }

  loadRecentSearches() {
    try {
      const stored = localStorage.getItem('southcolours_recent_searches');
      if (stored) {
        this.recentSearches = JSON.parse(stored);
      } else {
        this.recentSearches = ['Lehenga', 'Anarkali', 'Kurta Set', 'Pattu Dress'];
      }
    } catch {
      this.recentSearches = ['Lehenga', 'Anarkali', 'Kurta Set'];
    }
  }

  saveRecentSearch(term: string) {
    const clean = term.trim();
    if (!clean) return;
    this.recentSearches = [clean, ...this.recentSearches.filter(t => t.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
    try {
      localStorage.setItem('southcolours_recent_searches', JSON.stringify(this.recentSearches));
    } catch {}
  }

  removeRecent(event: MouseEvent, term: string) {
    event.stopPropagation();
    this.recentSearches = this.recentSearches.filter(t => t !== term);
    try {
      localStorage.setItem('southcolours_recent_searches', JSON.stringify(this.recentSearches));
    } catch {}
  }

  clearAllRecent() {
    this.recentSearches = [];
    try {
      localStorage.removeItem('southcolours_recent_searches');
    } catch {}
  }

  onSearchInput() {
    clearTimeout(this.searchDebounceTimer);
    const query = this.searchQuery.trim();

    if (query.length < 2) {
      this.suggestions = [];
      return;
    }

    this.searchDebounceTimer = setTimeout(() => {
      this.shopService.getProducts({ search: query, pageSize: 6 }).subscribe({
        next: (res) => {
          this.suggestions = res.items || [];
        },
        error: () => {
          this.suggestions = [];
        }
      });
    }, 200);
  }

  clearSearch() {
    this.searchQuery = '';
    this.suggestions = [];
  }

  selectSuggestion(product: Product) {
    this.saveRecentSearch(product.name);
    this.isSearchFocused = false;
    this.router.navigate(['/products', product.slug]);
  }

  selectRecent(term: string) {
    this.searchQuery = term;
    this.onSearch();
  }

  onSearch() {
    const q = this.searchQuery.trim();
    if (q) {
      this.saveRecentSearch(q);
      this.isSearchFocused = false;
      this.router.navigate(['/products'], { queryParams: { search: q } });
    }
  }

  highlightMatch(text: string): string {
    if (!this.searchQuery.trim()) return text;
    const regex = new RegExp(`(${this.escapeRegex(this.searchQuery.trim())})`, 'gi');
    return text.replace(regex, '<strong style="color: var(--primary-pink);">$1</strong>');
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}


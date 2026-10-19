import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../core/services/shop.service';

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
          <a routerLink="/" class="logo-group">
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

          <!-- Search Bar -->
          <div class="search-container">
            <div class="search-bar">
              <input 
                type="text" 
                placeholder="Search for dresses, ethnic wear, sets..." 
                [(ngModel)]="searchQuery" 
                (keyup.enter)="onSearch()"
              />
              <button class="search-btn" (click)="onSearch()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
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
      <nav class="nav-bar">
        <div class="container nav-content">
          <a routerLink="/products" [queryParams]="{ category: 'girls' }" routerLinkActive="active">Girls</a>
          <a routerLink="/products" [queryParams]="{ category: 'boys' }" routerLinkActive="active">Boys</a>
          <a routerLink="/products" [queryParams]="{ category: 'baby-wear' }" routerLinkActive="active">Baby Wear</a>
          <a routerLink="/products" [queryParams]="{ category: 'ethnic-wear' }" routerLinkActive="active" class="highlight">Ethnic Wear</a>
          <a routerLink="/products" [queryParams]="{ filter: 'new-arrivals' }" routerLinkActive="active">New Arrivals</a>
          <a routerLink="/products" [queryParams]="{ filter: 'offers' }" routerLinkActive="active" class="offers">Offers</a>
          <a routerLink="/admin" class="admin-link">Admin Portal</a>
        </div>
      </nav>
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
  `]
})
export class HeaderComponent {
  shopService = inject(ShopService);
  searchQuery = '';

  onSearch() {
    if (this.searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(this.searchQuery)}`;
    }
  }
}


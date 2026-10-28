import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-wrapper">
      <aside class="admin-sidebar" [class.sidebar-open]="isSidebarOpen">
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
          <button class="sidebar-close-btn" (click)="closeSidebar()">✕</button>
        </div>

        <nav class="sidebar-menu">
          <a routerLink="/admin/dashboard" routerLinkActive="active-item" class="menu-item" (click)="closeSidebar()">
            <span class="menu-icon">📊</span> Dashboard
          </a>
          <a routerLink="/admin/products" routerLinkActive="active-item" [routerLinkActiveOptions]="{exact: true}" class="menu-item" (click)="closeSidebar()">
            <span class="menu-icon">📦</span> Products
          </a>
          <a routerLink="/admin/products/add" routerLinkActive="active-sub" class="sub-item" (click)="closeSidebar()">
            <span class="menu-icon">➕</span> Add Product
          </a>
          <a routerLink="/admin/orders" routerLinkActive="active-item" class="menu-item" (click)="closeSidebar()">
            <span class="menu-icon">🛒</span> Orders
          </a>
          <a routerLink="/admin/customers" routerLinkActive="active-item" class="menu-item" (click)="closeSidebar()">
            <span class="menu-icon">👥</span> Customers
          </a>
          <a routerLink="/admin/categories" routerLinkActive="active-item" class="menu-item" (click)="closeSidebar()">
            <span class="menu-icon">📑</span> Categories
          </a>
          <a routerLink="/admin/banners" routerLinkActive="active-item" class="menu-item" (click)="closeSidebar()">
            <span class="menu-icon">🖼️</span> Banners
          </a>
          <a routerLink="/admin/reviews" routerLinkActive="active-item" class="menu-item" (click)="closeSidebar()">
            <span class="menu-icon">⭐</span> Reviews
          </a>
          <a routerLink="/admin/coupons" routerLinkActive="active-item" class="menu-item" (click)="closeSidebar()">
            <span class="menu-icon">🏷️</span> Coupons
          </a>
          <a routerLink="/admin/reports" routerLinkActive="active-item" class="menu-item" (click)="closeSidebar()">
            <span class="menu-icon">📈</span> Reports
          </a>
          <a routerLink="/admin/settings" routerLinkActive="active-item" class="menu-item" (click)="closeSidebar()">
            <span class="menu-icon">⚙️</span> Settings
          </a>
          <div class="sidebar-footer">
            <a routerLink="/" class="menu-item logout-link" (click)="closeSidebar()">
              <span class="menu-icon">🚪</span> Back to Website
            </a>
          </div>
        </nav>
      </aside>

      @if (isSidebarOpen) {
        <div class="sidebar-overlay" (click)="closeSidebar()"></div>
      }

      <main class="admin-main">
        <header class="admin-header">
          <div class="header-left">
            <button class="mobile-sidebar-toggle" (click)="toggleSidebar()" aria-label="Toggle Navigation">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <span class="admin-title-mobile">Admin Portal</span>
          </div>

          <div class="header-right">
            <button class="icon-btn">🔔</button>
            <div class="admin-profile-pill">
              <span class="avatar">👨‍💼</span>
              <span class="admin-name">{{ authService.currentUser()?.fullName || 'SuperAdmin' }}</span>
              <button class="logout-btn" (click)="authService.logout()" title="Sign Out">Sign Out ⎋</button>
            </div>
          </div>
        </header>

        <div class="admin-content-outlet">
          <ng-content></ng-content>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-wrapper { display: flex; min-height: 100vh; background: #F8FAFC; position: relative; }
    .admin-sidebar { width: 250px; background-color: var(--dark-navy); color: #FFFFFF; display: flex; flex-direction: column; flex-shrink: 0; }
    .sidebar-brand { display: flex; align-items: center; gap: 8px; padding: 22px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); position: relative;
      .brand-text { font-size: 18px; font-weight: 800; color: var(--primary-pink); }
      .panel-tag { font-size: 12px; color: #94A3B8; }
      .sidebar-close-btn { display: none; margin-left: auto; background: none; border: none; color: #94A3B8; font-size: 18px; cursor: pointer; padding: 4px; }
    }
    .sidebar-menu { padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; flex: 1; overflow-y: auto;
      .menu-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 8px; font-size: 14px; font-weight: 600; color: #CBD5E1;
        &:hover, &.active-item { background-color: rgba(255, 64, 129, 0.15); color: #FFFFFF; }
        &.active-item { color: var(--primary-pink); }
      }
      .sub-item { display: flex; align-items: center; gap: 10px; padding: 8px 14px 8px 36px; font-size: 13px; color: #94A3B8; border-radius: 6px;
        &.active-sub { color: var(--primary-pink); font-weight: 700; }
      }
      .sidebar-footer { margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
    }
    .sidebar-overlay { display: none; }
    .admin-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .admin-header { background: #FFFFFF; padding: 14px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0;
      .header-left { display: flex; align-items: center; gap: 12px; }
      .mobile-sidebar-toggle { display: none; background: transparent; border: none; color: var(--dark-navy); cursor: pointer; padding: 4px; align-items: center; }
      .admin-title-mobile { display: none; font-weight: 800; color: var(--dark-navy); font-size: 16px; }
      .header-right { display: flex; align-items: center; gap: 20px; margin-left: auto;
        .icon-btn { background: transparent; font-size: 18px; border: none; cursor: pointer; }
        .admin-profile-pill { display: flex; align-items: center; gap: 8px; background: #F1F5F9; padding: 6px 14px; border-radius: 9999px;
          .admin-name { font-size: 13px; font-weight: 700; color: var(--dark-navy); }
          .logout-btn { background: #FFF0F5; border: 1px solid var(--border-pink); color: var(--primary-pink); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; cursor: pointer; margin-left: 6px;
            &:hover { background: var(--primary-pink); color: white; }
          }
        }
      }
    }
    .admin-content-outlet { padding: 32px; flex: 1; }

    @media (max-width: 1024px) {
      .admin-content-outlet { padding: 20px; }
      .admin-header { padding: 14px 20px; }
    }

    @media (max-width: 768px) {
      .sidebar-overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1050;
      }
      .admin-sidebar {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1060;
        transform: translateX(-100%);
        transition: transform 0.25s ease;
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
        &.sidebar-open {
          transform: translateX(0);
        }
      }
      .sidebar-brand .sidebar-close-btn {
        display: block;
      }
      .mobile-sidebar-toggle {
        display: flex !important;
      }
      .admin-title-mobile {
        display: inline-block !important;
      }
      .admin-header {
        padding: 12px 16px;
        .admin-profile-pill .admin-name {
          display: none;
        }
      }
      .admin-content-outlet {
        padding: 16px 12px;
      }
    }
  `]
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}


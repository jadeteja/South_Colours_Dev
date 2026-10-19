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
      <aside class="admin-sidebar">
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
        </div>

        <nav class="sidebar-menu">
          <a routerLink="/admin/dashboard" routerLinkActive="active-item" class="menu-item">
            <span class="menu-icon">📊</span> Dashboard
          </a>
          <a routerLink="/admin/products" routerLinkActive="active-item" [routerLinkActiveOptions]="{exact: true}" class="menu-item">
            <span class="menu-icon">📦</span> Products
          </a>
          <a routerLink="/admin/products/add" routerLinkActive="active-sub" class="sub-item">
            <span class="menu-icon">➕</span> Add Product
          </a>
          <a routerLink="/admin/orders" routerLinkActive="active-item" class="menu-item">
            <span class="menu-icon">🛒</span> Orders
          </a>
          <a routerLink="/admin/customers" routerLinkActive="active-item" class="menu-item">
            <span class="menu-icon">👥</span> Customers
          </a>
          <a routerLink="/admin/categories" routerLinkActive="active-item" class="menu-item">
            <span class="menu-icon">📑</span> Categories
          </a>
          <a routerLink="/admin/banners" routerLinkActive="active-item" class="menu-item">
            <span class="menu-icon">🖼️</span> Banners
          </a>
          <a routerLink="/admin/reviews" routerLinkActive="active-item" class="menu-item">
            <span class="menu-icon">⭐</span> Reviews
          </a>
          <a routerLink="/admin/coupons" routerLinkActive="active-item" class="menu-item">
            <span class="menu-icon">🏷️</span> Coupons
          </a>
          <a routerLink="/admin/reports" routerLinkActive="active-item" class="menu-item">
            <span class="menu-icon">📈</span> Reports
          </a>
          <a routerLink="/admin/settings" routerLinkActive="active-item" class="menu-item">
            <span class="menu-icon">⚙️</span> Settings
          </a>
          <div class="sidebar-footer">
            <a routerLink="/" class="menu-item logout-link">
              <span class="menu-icon">🚪</span> Back to Website
            </a>
          </div>
        </nav>
      </aside>

      <main class="admin-main">
        <header class="admin-header">
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
    .admin-wrapper { display: flex; min-height: 100vh; background: #F8FAFC; }
    .admin-sidebar { width: 250px; background-color: var(--dark-navy); color: #FFFFFF; display: flex; flex-direction: column; }
    .sidebar-brand { display: flex; align-items: center; gap: 8px; padding: 22px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      .brand-text { font-size: 18px; font-weight: 800; color: var(--primary-pink); }
      .panel-tag { font-size: 12px; color: #94A3B8; }
    }
    .sidebar-menu { padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; flex: 1;
      .menu-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 8px; font-size: 14px; font-weight: 600; color: #CBD5E1;
        &:hover, &.active-item { background-color: rgba(255, 64, 129, 0.15); color: #FFFFFF; }
        &.active-item { color: var(--primary-pink); }
      }
      .sub-item { display: flex; align-items: center; gap: 10px; padding: 8px 14px 8px 36px; font-size: 13px; color: #94A3B8; border-radius: 6px;
        &.active-sub { color: var(--primary-pink); font-weight: 700; }
      }
      .sidebar-footer { margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
    }
    .admin-main { flex: 1; display: flex; flex-direction: column; }
    .admin-header { background: #FFFFFF; padding: 14px 32px; display: flex; justify-content: flex-end; border-bottom: 1px solid #E2E8F0;
      .header-right { display: flex; align-items: center; gap: 20px;
        .icon-btn { background: transparent; font-size: 18px; border: none; cursor: pointer; }
        .admin-profile-pill { display: flex; align-items: center; gap: 8px; background: #F1F5F9; padding: 6px 14px; border-radius: 9999px;
          .admin-name { font-size: 13px; font-weight: 700; color: var(--dark-navy); }
          .logout-btn { background: #FFF0F5; border: 1px solid var(--border-pink); color: var(--primary-pink); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; cursor: pointer; margin-left: 6px;
            &:hover { background: var(--primary-pink); color: white; }
          }
        }
      }
    }
    .admin-content-outlet { padding: 32px; }
  `]
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
}


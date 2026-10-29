import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="toast-container" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-card" [ngClass]="toast.type">
          <div class="toast-icon-wrap">
            @if (toast.type === 'success') {
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            } @else if (toast.type === 'error') {
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            } @else {
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            }
          </div>

          <div class="toast-body">
            @if (toast.title) {
              <div class="toast-title">{{ toast.title }}</div>
            }
            <div class="toast-msg">{{ toast.message }}</div>

            @if (toast.actionText && toast.actionUrl) {
              <a [routerLink]="toast.actionUrl" class="toast-action" (click)="toastService.dismiss(toast.id)">
                {{ toast.actionText }} →
              </a>
            }
          </div>

          <button class="toast-close" (click)="toastService.dismiss(toast.id)" aria-label="Close notification">
            ✕
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 420px;
      width: calc(100% - 48px);
      pointer-events: none;
    }

    .toast-card {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 14px 18px;
      background: #FFFFFF;
      border-radius: 14px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(255, 64, 129, 0.1);
      border: 1px solid #F0E0E8;
      animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      backdrop-filter: blur(10px);

      &.success {
        border-left: 4px solid #FF4081;
        .toast-icon-wrap {
          color: #FF4081;
          background: #FFF0F5;
        }
      }

      &.error {
        border-left: 4px solid #E53935;
        .toast-icon-wrap {
          color: #E53935;
          background: #FFEBEE;
        }
      }

      &.info {
        border-left: 4px solid #1E88E5;
        .toast-icon-wrap {
          color: #1E88E5;
          background: #E3F2FD;
        }
      }
    }

    .toast-icon-wrap {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .toast-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .toast-title {
      font-size: 14px;
      font-weight: 800;
      color: #18263B;
      line-height: 1.3;
    }

    .toast-msg {
      font-size: 13px;
      color: #4A5568;
      line-height: 1.45;
      font-weight: 500;
    }

    .toast-action {
      display: inline-block;
      margin-top: 6px;
      font-size: 12px;
      font-weight: 700;
      color: #FF4081;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }

    .toast-close {
      background: transparent;
      border: none;
      color: #9AA5B1;
      font-size: 13px;
      cursor: pointer;
      padding: 4px;
      line-height: 1;
      margin-top: 2px;
      border-radius: 4px;
      transition: color 0.15s ease;
      &:hover {
        color: #18263B;
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: 480px) {
      .toast-container {
        bottom: 16px;
        right: 16px;
        left: 16px;
        width: auto;
      }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}

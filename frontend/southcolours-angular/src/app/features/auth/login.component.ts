import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page-wrapper">
      <div class="auth-card">
        <!-- Brand Header -->
        <div class="auth-brand">
          <div class="logo-mark">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF4081" stroke-width="2.2">
              <circle cx="12" cy="12" r="3" fill="#FF4081"/>
              <path d="M12 2a4 4 0 0 0-4 4c0 2 2 3 4 3s4-1 4-3a4 4 0 0 0-4-4z" fill="#FFD6E7"/>
              <path d="M12 22a4 4 0 0 0 4-4c0-2-2-3-4-3s-4 1-4 3a4 4 0 0 0 4 4z" fill="#FFD6E7"/>
              <path d="M2 12a4 4 0 0 0 4 4c2 0 3-2 3-4s-1-4-3-4a4 4 0 0 0-4 4z" fill="#FFD6E7"/>
              <path d="M22 12a4 4 0 0 0-4-4c-2 0-3 2-3 4s1 4 3 4a4 4 0 0 0 4-4z" fill="#FFD6E7"/>
            </svg>
          </div>
          <h1 class="brand-title">Southcolours</h1>
          <p class="brand-tagline">Little Styles, Big Smiles</p>
        </div>

        <h2 class="form-title">Welcome Back</h2>
        <p class="form-sub">Sign in to access your customer orders or administrative management portal.</p>

        @if (errorMessage) {
          <div class="alert-danger">
            {{ errorMessage }}
          </div>
        }

        <form (ngSubmit)="onLogin()" class="auth-form">
          <div class="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email" 
              placeholder="e.g. admin@southcolours.com" 
              required 
              class="form-control" 
            />
          </div>

          <div class="form-group">
            <div class="label-row">
              <label>Password</label>
              <a href="javascript:void(0)" class="forgot-link">Forgot?</a>
            </div>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password" 
              placeholder="••••••••••••" 
              required 
              class="form-control" 
            />
          </div>

          <!-- Quick Fill Testing Credentials -->
          <div class="quick-credentials">
            <span class="quick-label">⚡ Quick Fill Demo:</span>
            <button type="button" class="quick-chip" (click)="fillAdmin()">Admin Login</button>
            <button type="button" class="quick-chip" (click)="fillCustomer()">Customer Login</button>
          </div>

          <button type="submit" class="btn-primary submit-btn" [disabled]="!email || !password || isLoading">
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <div class="auth-footer">
          <span>New to Southcolours?</span>
          <a routerLink="/auth/register" class="register-link">Create Account</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page-wrapper {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 16px;
      background: linear-gradient(180deg, #FFF0F5 0%, #FFFFFF 100%);
    }
    .auth-card {
      background: #FFFFFF;
      width: 440px;
      max-width: 100%;
      border: 1px solid #F1F5F9;
      border-radius: 20px;
      padding: 36px 32px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    }
    .auth-brand {
      text-align: center;
      margin-bottom: 24px;
      .logo-mark { display: inline-block; margin-bottom: 6px; }
      .brand-title { font-size: 24px; font-weight: 800; color: var(--dark-navy); margin: 0; }
      .brand-tagline { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    }
    .form-title { font-size: 20px; color: var(--dark-navy); font-weight: 800; margin-bottom: 6px; }
    .form-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.4; }
    .alert-danger {
      background: #FEE2E2;
      border: 1px solid #FCA5A5;
      color: #991B1B;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 18px;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      label { font-size: 12px; font-weight: 700; color: #475569; }
      .label-row { display: flex; justify-content: space-between; align-items: center; }
      .forgot-link { font-size: 11px; color: var(--primary-pink); text-decoration: none; font-weight: 600; }
    }
    .form-control {
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 14px;
      outline: none;
      transition: all 0.2s;
      &:focus {
        border-color: var(--primary-pink);
        box-shadow: 0 0 0 3px rgba(255, 64, 129, 0.15);
      }
    }
    .quick-credentials {
      background: #F8FAFC;
      border: 1px dashed #CBD5E1;
      padding: 10px 12px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      .quick-label { font-size: 11px; font-weight: 700; color: #64748B; }
      .quick-chip {
        background: #FFFFFF;
        border: 1px solid #CBD5E1;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        color: var(--dark-navy);
        cursor: pointer;
        &:hover {
          background: #FFF0F5;
          border-color: var(--border-pink);
          color: var(--primary-pink);
        }
      }
    }
    .submit-btn {
      width: 100%;
      padding: 12px;
      font-size: 15px;
      border-radius: 10px;
      margin-top: 6px;
    }
    .auth-footer {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #F1F5F9;
      font-size: 13px;
      color: var(--text-muted);
      .register-link {
        color: var(--primary-pink);
        font-weight: 700;
        text-decoration: none;
      }
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 24px 18px;
        border-radius: 16px;
      }
      .auth-page-wrapper {
        padding: 20px 12px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  email = '';
  password = '';
  returnUrl = '';
  errorMessage = '';
  isLoading = false;

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  fillAdmin() {
    this.email = 'admin@southcolours.com';
    this.password = 'Admin@South123#';
    this.errorMessage = '';
  }

  fillCustomer() {
    this.email = 'customer@southcolours.com';
    this.password = 'Customer@123#';
    this.errorMessage = '';
  }

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (session) => {
        this.isLoading = false;
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 0) {
          this.errorMessage = 'Cannot reach the backend API. Please ensure the backend server is running.';
        } else {
          this.errorMessage = err.error?.message || 'Invalid email or password. Please try again.';
        }
      }
    });
  }
}


import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
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

        <h2 class="form-title">Create Account</h2>
        <p class="form-sub">Sign up for faster checkout, order tracking, and exclusive discounts.</p>

        @if (errorMessage) {
          <div class="alert-danger">
            {{ errorMessage }}
          </div>
        }

        <form (ngSubmit)="onRegister()" class="auth-form">
          <div class="form-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              [(ngModel)]="fullName" 
              name="fullName" 
              placeholder="e.g. Priya Sharma" 
              required 
              class="form-control" 
            />
          </div>

          <div class="form-group">
            <label>Email Address *</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email" 
              placeholder="e.g. priya.sharma@example.com" 
              required 
              class="form-control" 
            />
          </div>

          <div class="form-group">
            <label>Mobile Number</label>
            <input 
              type="tel" 
              [(ngModel)]="phoneNumber" 
              name="phoneNumber" 
              placeholder="10-digit mobile number" 
              class="form-control" 
            />
          </div>

          <div class="form-group">
            <label>Password (min 6 characters) *</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password" 
              placeholder="••••••••••••" 
              required 
              class="form-control" 
            />
          </div>

          <button type="submit" class="btn-primary submit-btn" [disabled]="!fullName || !email || !password || isLoading">
            {{ isLoading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>

        <div class="auth-footer">
          <span>Already have an account?</span>
          <a routerLink="/auth/login" class="login-link">Sign In</a>
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
      .login-link {
        color: var(--primary-pink);
        font-weight: 700;
        text-decoration: none;
      }
    }
  `]
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  fullName = '';
  email = '';
  phoneNumber = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  onRegister() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error creating account. Please check your details.';
      }
    });
  }
}


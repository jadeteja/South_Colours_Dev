import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
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

        @if (step === 1) {
          <h2 class="form-title">Forgot Password?</h2>
          <p class="form-sub">Enter your registered email address and we will send a 6-digit verification code to reset your password.</p>

          @if (errorMessage) {
            <div class="alert-danger">{{ errorMessage }}</div>
          }
          @if (infoMessage) {
            <div class="alert-success">{{ infoMessage }}</div>
          }

          <form (ngSubmit)="onSendOtp()" class="auth-form">
            <div class="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                [(ngModel)]="email" 
                name="email" 
                placeholder="e.g. you@example.com" 
                required 
                class="form-control" 
              />
            </div>

            <button type="submit" class="btn-primary submit-btn" [disabled]="!email || isLoading">
              {{ isLoading ? 'Sending Code...' : 'Send Reset Code' }}
            </button>
          </form>
        } @else {
          <h2 class="form-title">Reset Password</h2>
          <p class="form-sub">We've sent a 6-digit verification code to <strong>{{ email }}</strong>.</p>

          @if (errorMessage) {
            <div class="alert-danger">{{ errorMessage }}</div>
          }
          @if (infoMessage) {
            <div class="alert-success">{{ infoMessage }}</div>
          }

          <form (ngSubmit)="onResetPassword()" class="auth-form">
            <div class="form-group">
              <label>6-Digit Verification Code (OTP)</label>
              <input 
                type="text" 
                [(ngModel)]="otp" 
                name="otp" 
                maxlength="6"
                placeholder="123456" 
                required 
                class="form-control text-center tracking-widest" 
              />
            </div>

            <div class="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                [(ngModel)]="newPassword" 
                name="newPassword" 
                placeholder="At least 6 characters" 
                required 
                minlength="6"
                class="form-control" 
              />
            </div>

            <button type="submit" class="btn-primary submit-btn" [disabled]="!otp || !newPassword || newPassword.length < 6 || isLoading">
              {{ isLoading ? 'Resetting Password...' : 'Reset Password' }}
            </button>

            <button type="button" class="btn-link resend-btn" (click)="onSendOtp()" [disabled]="isLoading">
              Resend verification code
            </button>
          </form>
        }

        <div class="auth-footer">
          <span>Remember your password?</span>
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
      .brand-title { font-size: 24px; font-weight: 800; color: #1E293B; margin: 0; }
      .brand-tagline { font-size: 13px; color: #64748B; margin-top: 2px; }
    }
    .form-title {
      font-size: 20px;
      font-weight: 700;
      color: #1E293B;
      margin: 0 0 6px;
    }
    .form-sub {
      font-size: 13px;
      color: #64748B;
      margin: 0 0 20px;
      line-height: 1.4;
    }
    .alert-danger {
      background-color: #FEF2F2;
      border: 1px solid #FEE2E2;
      color: #DC2626;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 16px;
    }
    .alert-success {
      background-color: #ECFDF5;
      border: 1px solid #D1FAE5;
      color: #059669;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 16px;
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
      label {
        font-size: 13px;
        font-weight: 600;
        color: #334155;
      }
    }
    .form-control {
      padding: 10px 14px;
      border: 1.5px solid #E2E8F0;
      border-radius: 10px;
      font-size: 14px;
      transition: all 0.2s;
      outline: none;
      &:focus {
        border-color: #FF4081;
        box-shadow: 0 0 0 3px rgba(255, 64, 129, 0.12);
      }
    }
    .tracking-widest {
      letter-spacing: 6px;
      font-weight: bold;
      font-size: 18px;
    }
    .text-center {
      text-align: center;
    }
    .submit-btn {
      width: 100%;
      padding: 12px;
      font-size: 15px;
      border-radius: 10px;
      margin-top: 6px;
      background: #FF4081;
      color: white;
      border: none;
      font-weight: bold;
      cursor: pointer;
      &:hover:not(:disabled) {
        background: #E03570;
      }
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
    .resend-btn {
      background: none;
      border: none;
      color: #FF4081;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
      margin-top: 6px;
      &:hover {
        text-decoration: underline;
      }
    }
    .auth-footer {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #F1F5F9;
      font-size: 13px;
      color: #64748B;
      .login-link {
        color: #FF4081;
        font-weight: 700;
        text-decoration: none;
      }
    }
  `]
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  otp = '';
  newPassword = '';
  step = 1; // 1: enter email, 2: enter otp & new password
  isLoading = false;
  errorMessage = '';
  infoMessage = '';

  onSendOtp() {
    if (!this.email) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.infoMessage = '';

    this.authService.forgotPassword(this.email.trim()).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.infoMessage = res?.message || 'Verification code sent to your email.';
        this.step = 2;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to send verification code. Please check your email and try again.';
      }
    });
  }

  onResetPassword() {
    if (!this.email || !this.otp || !this.newPassword) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.infoMessage = '';

    this.authService.resetPassword({
      email: this.email.trim(),
      otp: this.otp.trim(),
      newPassword: this.newPassword
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.infoMessage = res?.message || 'Password has been reset successfully! Redirecting to sign in...';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid or expired verification code. Please try again.';
      }
    });
  }
}

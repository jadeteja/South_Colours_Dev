import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-col brand-col">
          <div class="logo-group">
            <span class="brand-title">Southcolours</span>
            <span class="brand-tagline">Little Styles, Big Smiles</span>
          </div>
          <p class="brand-desc">
            Premium Indian ethnic wear and trendy outfits thoughtfully crafted for your little ones with breathable fabrics and joy.
          </p>
          <div class="payment-badges">
            <span class="badge">UPI</span>
            <span class="badge">Razorpay</span>
            <span class="badge">Visa</span>
            <span class="badge">Mastercard</span>
          </div>
        </div>

        <div class="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><a routerLink="/products" [queryParams]="{ category: 'girls' }">Girls Wear</a></li>
            <li><a routerLink="/products" [queryParams]="{ category: 'boys' }">Boys Wear</a></li>
            <li><a routerLink="/products" [queryParams]="{ category: 'baby-wear' }">Baby Wear</a></li>
            <li><a routerLink="/products" [queryParams]="{ category: 'ethnic-wear' }">Ethnic Wear</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Customer Care</h4>
          <ul>
            <li><a routerLink="/orders">Track Order</a></li>
            <li><a routerLink="/returns">Returns & Refunds</a></li>
            <li><a routerLink="/shipping">Shipping Policy</a></li>
            <li><a routerLink="/contact">Contact Support</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Experience</h4>
          <ul>
            <li>100% Cotton Linings</li>
            <li>Safe & Secure Payments</li>
            <li>Free Shipping over ₹999</li>
            <li>Easy 7-Day Returns</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container bottom-flex">
          <p>© 2026 South Colours. All rights reserved.</p>
          <div class="legal-links">
            <a routerLink="/privacy">Privacy Policy</a>
            <span>•</span>
            <a routerLink="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #FFFFFF;
      border-top: 1px solid var(--border-pink);
      padding-top: 48px;
      margin-top: 60px;
    }
    .container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 36px;
      padding-bottom: 40px;
    }
    .brand-col {
      .brand-title {
        font-size: 24px;
        font-weight: 800;
        color: var(--primary-pink);
      }
      .brand-tagline {
        display: block;
        font-size: 11px;
        color: var(--text-muted);
        font-weight: 600;
      }
      .brand-desc {
        font-size: 13px;
        color: var(--text-muted);
        line-height: 1.6;
        margin: 14px 0 18px;
        max-width: 320px;
      }
      .payment-badges {
        display: flex;
        gap: 8px;
        .badge {
          background: #F3F4F6;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          color: var(--dark-navy);
        }
      }
    }
    .footer-col {
      h4 {
        font-size: 15px;
        font-weight: 800;
        color: var(--dark-navy);
        margin-bottom: 16px;
      }
      ul {
        list-style: none;
        li {
          margin-bottom: 10px;
          a, span {
            font-size: 13px;
            color: var(--text-muted);
            &:hover {
              color: var(--primary-pink);
            }
          }
        }
      }
    }
    .footer-bottom {
      border-top: 1px solid var(--border-pink);
      padding: 18px 0;
      font-size: 12px;
      color: var(--text-light);
    }
    .bottom-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .legal-links {
      display: flex;
      gap: 12px;
      a {
        color: var(--text-light);
        &:hover {
          color: var(--primary-pink);
        }
      }
    }
    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FooterComponent {}


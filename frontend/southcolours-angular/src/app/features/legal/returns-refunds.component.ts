import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-returns-refunds',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="legal-page">
      <div class="container">
        <!-- Page Header -->
        <header class="legal-header">
          <span class="badge-tag">Customer Support</span>
          <h1 class="page-title">Returns and Refunds Policy</h1>
          <p class="effective-date">Transparent, hassle-free policies for our customers</p>
        </header>

        <!-- Document Content -->
        <article class="legal-card">
          <div class="intro-block">
            <p>
              Thank you for shopping at 
              <a href="https://southcolours.co.in/" target="_blank" rel="noopener noreferrer">https://southcolours.co.in/</a> 
              and please read this policy carefully.
            </p>
          </div>

          <!-- Eligibility Section -->
          <section class="policy-section">
            <div class="highlight-rule-box">
              <div class="rule-icon">📦</div>
              <div class="rule-content">
                <h2>Return Window & Product Eligibility</h2>
                <p>
                  In order to be eligible for a refund, you have to return the product within the first <strong>7 days from delivery</strong>. 
                  The product must be in the same condition that you receive it and undamaged in any way.
                </p>
                <p>
                  To complete your return, we require the <strong>original invoice</strong> as proof of purchase.
                </p>
              </div>
            </div>
          </section>

          <!-- Inspection & Refund Processing -->
          <section class="policy-section">
            <h2>Inspection & Refund Processing</h2>
            <p>
              After we receive your item, our team of professionals will inspect it and process your refund. The money will be refunded to the original payment method you’ve used during the purchase.
            </p>
            <div class="timeline-box">
              <span class="clock-icon">⏱️</span>
              <p>
                For credit card payments it may take <strong>5 to 10 business days</strong> for a refund to show up on your credit card statement.
              </p>
            </div>
          </section>

          <!-- Ineligibility Clause -->
          <section class="policy-section">
            <h2>Non-Eligible Returns</h2>
            <div class="warning-box">
              <p>
                If the product is damaged in any way, or you have initiated the return after <strong>7 days of delivery</strong>, you will not be eligible for a refund.
              </p>
            </div>
          </section>

          <!-- Contact Us -->
          <section class="policy-section contact-box">
            <h2>Contact Us</h2>
            <p>If you have any questions about our Returns and Refunds Policy, please contact us:</p>
            <p class="contact-email">
              By email: <a href="mailto:prasuna.goje@gmail.com">prasuna.goje&#64;gmail.com</a>
            </p>
          </section>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .legal-page {
      background-color: var(--bg-page, #FFF9FB);
      color: var(--text-dark, #18263B);
      padding: 56px 0 80px;
      min-height: 80vh;
    }

    .container {
      max-width: 860px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .legal-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .badge-tag {
      display: inline-block;
      background: #FFF0F5;
      color: var(--primary-pink, #FF4081);
      border: 1px solid var(--border-pink, #F3DCE5);
      border-radius: 9999px;
      padding: 4px 14px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .page-title {
      font-size: 36px;
      font-weight: 800;
      color: var(--dark-navy, #18263B);
      margin-bottom: 8px;
    }

    .effective-date {
      font-size: 14px;
      color: var(--text-muted, #666666);
    }

    .legal-card {
      background: #FFFFFF;
      border: 1px solid var(--border-pink, #F3DCE5);
      border-radius: 20px;
      padding: 44px 40px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.03);
    }

    .intro-block {
      padding-bottom: 20px;
      border-bottom: 1px solid #F1F5F9;
      margin-bottom: 28px;
      p {
        font-size: 16px;
        line-height: 1.7;
        color: var(--text-dark, #18263B);
        margin: 0;
        a {
          color: var(--primary-pink, #FF4081);
          font-weight: 700;
          text-decoration: underline;
        }
      }
    }

    .policy-section {
      margin-bottom: 32px;
      h2 {
        font-size: 20px;
        font-weight: 800;
        color: var(--dark-navy, #18263B);
        margin-bottom: 12px;
      }
      p {
        font-size: 14.5px;
        line-height: 1.75;
        color: #475569;
        margin-bottom: 10px;
      }
    }

    .highlight-rule-box {
      background: #FFF9FB;
      border: 1px solid var(--border-pink, #F3DCE5);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      gap: 18px;
      align-items: flex-start;
      .rule-icon {
        font-size: 32px;
        flex-shrink: 0;
      }
      .rule-content {
        h2 {
          font-size: 18px;
          margin-bottom: 8px;
        }
        p {
          margin-bottom: 8px;
          &:last-child { margin-bottom: 0; }
        }
      }
    }

    .timeline-box {
      background: #F8FAFC;
      border-left: 4px solid #3B82F6;
      border-radius: 0 10px 10px 0;
      padding: 14px 18px;
      display: flex;
      gap: 12px;
      align-items: center;
      margin-top: 14px;
      .clock-icon {
        font-size: 20px;
      }
      p {
        margin: 0;
        font-size: 14px;
        color: #1E293B;
      }
    }

    .warning-box {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      border-radius: 12px;
      padding: 16px 20px;
      p {
        color: #991B1B;
        font-weight: 600;
        margin: 0;
      }
    }

    .contact-box {
      background: linear-gradient(135deg, #FFF0F5 0%, #FFFFFF 100%);
      border: 1px solid var(--border-pink, #F3DCE5);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 0;
      .contact-email {
        font-size: 15px;
        margin: 0;
        a {
          color: var(--primary-pink, #FF4081);
          font-weight: 700;
          text-decoration: underline;
        }
      }
    }

    @media (max-width: 768px) {
      .legal-card {
        padding: 28px 20px;
        border-radius: 16px;
      }
      .page-title {
        font-size: 28px;
      }
      .highlight-rule-box {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class ReturnsRefundsComponent implements OnInit {
  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit() {
    this.titleService.setTitle('Returns & Refunds Policy | SouthColours');
    this.metaService.updateTag({
      name: 'description',
      content: 'Learn about the 7-day return eligibility, inspection procedure, and refund processing timeline at SouthColours.'
    });
  }
}

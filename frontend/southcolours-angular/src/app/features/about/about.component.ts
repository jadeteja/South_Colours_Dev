import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="about-page">
      <!-- Hero Section -->
      <section class="about-hero">
        <div class="container hero-container">
          <div class="hero-badge">
            <span class="sparkle-icon">✨</span>
            <span>Enlights our culture</span>
          </div>
          <h1 class="hero-title">Crafting Joy & Elegance with <span class="gradient-text">SouthColours</span></h1>
          <p class="hero-subtitle">
            Welcome to SouthColours, where tradition embraces modern style. We are passionate about creating premium, thoughtfully curated fashion collections designed to deliver unmatched comfort, style, and happiness for every special occasion.
          </p>
          <div class="hero-cta-group">
            <a routerLink="/products" class="btn-primary">
              <span>Explore Collections</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            <a href="https://www.instagram.com/south_colours" target="_blank" rel="noopener noreferrer" class="btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>Follow &#64;south_colours</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Achievement Counters Section -->
      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon-wrap customer-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div class="stat-number-wrap">
                <span class="stat-number">{{ customerCounter }}</span>
                <span class="stat-suffix">+</span>
              </div>
              <p class="stat-label">Happy Customers</p>
              <p class="stat-detail">Families trusting us across India with joyful, stylish attire.</p>
            </div>

            <div class="stat-card">
              <div class="stat-icon-wrap instagram-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div class="stat-number-wrap">
                <span class="stat-number">{{ followerCounter | number }}</span>
                <span class="stat-suffix">+</span>
              </div>
              <p class="stat-label">Instagram Followers</p>
              <p class="stat-detail">Growing digital community celebrating fashion & joyous moments.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Choose SouthColours? -->
      <section class="features-section">
        <div class="container">
          <div class="section-header-center">
            <span class="section-tag">WHY CHOOSE US</span>
            <h2 class="section-heading">Thoughtfully Crafted for You</h2>
            <p class="section-sub">Discover the values that set SouthColours apart in modern fashion and customer satisfaction.</p>
          </div>

          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon pink">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3 class="feature-title">Carefully Selected Collections</h3>
              <p class="feature-desc">
                From vibrant festival lehengas and party frocks to traditional kurtas and everyday sets, every piece is curated to offer distinctive charm.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon violet">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 class="feature-title">Quality-Focused Products</h3>
              <p class="feature-desc">
                We prioritize skin-friendly, durable fabrics with soft internal linings to guarantee lasting comfort and refined finishing in every stitch.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon emerald">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 class="feature-title">Customer-Focused Support</h3>
              <p class="feature-desc">
                From size recommendations to order status queries, our responsive support team is always ready to assist via direct phone, email, and WhatsApp.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon amber">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 14 14"></polyline>
                </svg>
              </div>
              <h3 class="feature-title">Stylish Designs</h3>
              <p class="feature-desc">
                Harmonizing traditional South Indian elegance with modern youthful trends so your family always steps out in head-turning style.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Instagram Integration Section -->
      <section class="instagram-section">
        <div class="container">
          <div class="insta-banner">
            <div class="insta-content">
              <div class="insta-pill">
                <span class="insta-badge-icon">📸</span>
                <span>Join Our Instagram Community</span>
              </div>
              <h2 class="insta-title">Connect with us on Instagram</h2>
              <p class="insta-sub">
                Follow <strong>&#64;south_colours</strong> for fresh arrivals, festive styling inspiration, behind-the-scenes looks, and customer celebrations!
              </p>
              <div class="insta-action-row">
                <a 
                  href="https://www.instagram.com/south_colours" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn-insta-follow"
                  aria-label="Follow SouthColours on Instagram (opens in new tab)"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>Follow Us on Instagram</span>
                </a>
                <span class="insta-handle-text">&#64;south_colours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Information Section -->
      <section class="contact-section">
        <div class="container">
          <div class="section-header-center">
            <span class="section-tag">GET IN TOUCH</span>
            <h2 class="section-heading">We'd Love to Hear From You</h2>
            <p class="section-sub">Have a question regarding sizes, styling, or your order? Connect with us directly.</p>
          </div>

          <div class="contact-grid">
            <!-- Mobile Call / WhatsApp Card -->
            <a href="tel:+919398293994" class="contact-card">
              <div class="contact-icon phone">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3 class="contact-type">Call / Support</h3>
              <span class="contact-val">+91 9398293994</span>
              <span class="contact-hint">Tap to call our customer care</span>
            </a>

            <!-- Email Support Card -->
            <a href="mailto:prasuna.goje@gmail.com" class="contact-card">
              <div class="contact-icon email">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3 class="contact-type">Email Support</h3>
              <span class="contact-val">prasuna.goje&#64;gmail.com</span>
              <span class="contact-hint">Send us your queries anytime</span>
            </a>

            <!-- Instagram Card -->
            <a href="https://www.instagram.com/south_colours" target="_blank" rel="noopener noreferrer" class="contact-card">
              <div class="contact-icon insta">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <h3 class="contact-type">Instagram DM</h3>
              <span class="contact-val">&#64;south_colours</span>
              <span class="contact-hint">Message us directly on Instagram</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-page {
      background-color: var(--bg-page, #FFF9FB);
      color: var(--text-dark, #18263B);
      overflow-x: hidden;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Hero Section */
    .about-hero {
      padding: 72px 0 64px;
      text-align: center;
      background: radial-gradient(circle at 50% 20%, #FFF0F5 0%, #FFF9FB 80%);
      border-bottom: 1px solid rgba(255, 64, 129, 0.08);
    }

    .hero-container {
      max-width: 860px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: #FFFFFF;
      border: 1px solid var(--border-pink, #F3DCE5);
      border-radius: var(--radius-full, 9999px);
      font-size: 13px;
      font-weight: 700;
      color: var(--primary-pink, #FF4081);
      box-shadow: 0 2px 8px rgba(255, 64, 129, 0.08);
      margin-bottom: 24px;
    }

    .hero-title {
      font-size: 44px;
      line-height: 1.25;
      font-weight: 800;
      color: var(--dark-navy, #18263B);
      margin-bottom: 20px;
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #FF4081 0%, #D81B60 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 17px;
      line-height: 1.7;
      color: var(--text-muted, #666666);
      margin-bottom: 36px;
    }

    .hero-cta-group {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .btn-secondary {
      background: #FFFFFF;
      color: var(--dark-navy, #18263B);
      font-weight: 700;
      border: 1px solid #E2E8F0;
      border-radius: var(--radius-full, 9999px);
      padding: 10px 24px;
      font-size: 15px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      &:hover {
        border-color: var(--primary-pink);
        color: var(--primary-pink);
        transform: translateY(-1px);
      }
    }

    /* Stats Section */
    .stats-section {
      padding: 48px 0;
      margin-top: -30px;
      position: relative;
      z-index: 2;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .stat-card {
      background: #FFFFFF;
      border: 1px solid var(--border-pink, #F3DCE5);
      border-radius: 20px;
      padding: 36px 28px;
      text-align: center;
      box-shadow: 0 8px 30px rgba(255, 64, 129, 0.06);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 14px 40px rgba(255, 64, 129, 0.12);
      }
    }

    .stat-icon-wrap {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      margin: 0 auto 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.customer-icon {
        background: #FFF0F5;
        color: var(--primary-pink, #FF4081);
      }
      &.instagram-icon {
        background: linear-gradient(135deg, #FFF0F5 0%, #FFE4E6 100%);
        color: #E1306C;
      }
    }

    .stat-number-wrap {
      display: flex;
      align-items: baseline;
      justify-content: center;
      font-size: 46px;
      font-weight: 800;
      color: var(--dark-navy, #18263B);
      font-family: 'Nunito', sans-serif;
      line-height: 1;
    }

    .stat-suffix {
      color: var(--primary-pink, #FF4081);
      font-size: 34px;
      margin-left: 2px;
    }

    .stat-label {
      font-size: 16px;
      font-weight: 800;
      color: var(--dark-navy, #18263B);
      margin: 10px 0 6px;
    }

    .stat-detail {
      font-size: 13px;
      color: var(--text-muted, #666666);
      line-height: 1.5;
    }

    /* Features Section */
    .features-section {
      padding: 72px 0;
      background: #FFFFFF;
      border-top: 1px solid rgba(255, 64, 129, 0.08);
      border-bottom: 1px solid rgba(255, 64, 129, 0.08);
    }

    .section-header-center {
      text-align: center;
      max-width: 650px;
      margin: 0 auto 52px;
      .section-sub {
        font-size: 15px;
        color: var(--text-muted, #666666);
        line-height: 1.6;
        margin-top: 6px;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .feature-card {
      background: var(--bg-page, #FFF9FB);
      border: 1px solid var(--border-pink, #F3DCE5);
      border-radius: 18px;
      padding: 32px 22px;
      transition: all 0.3s ease;
      &:hover {
        transform: translateY(-4px);
        background: #FFFFFF;
        box-shadow: 0 12px 30px rgba(255, 64, 129, 0.1);
        border-color: var(--primary-pink);
      }
    }

    .feature-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      &.pink { background: #FFF0F5; color: var(--primary-pink); }
      &.violet { background: #F3E8FF; color: #8B5CF6; }
      &.emerald { background: #ECFDF5; color: #10B981; }
      &.amber { background: #FEF3C7; color: #F59E0B; }
    }

    .feature-title {
      font-size: 17px;
      font-weight: 800;
      color: var(--dark-navy, #18263B);
      margin-bottom: 12px;
      line-height: 1.35;
    }

    .feature-desc {
      font-size: 13.5px;
      color: var(--text-muted, #666666);
      line-height: 1.65;
    }

    /* Instagram Section */
    .instagram-section {
      padding: 72px 0;
    }

    .insta-banner {
      background: linear-gradient(135deg, #FFF0F5 0%, #FFE4E6 50%, #FFF5F7 100%);
      border: 1px solid var(--border-pink, #F3DCE5);
      border-radius: 24px;
      padding: 56px 36px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(255, 64, 129, 0.06);
    }

    .insta-content {
      max-width: 680px;
      margin: 0 auto;
    }

    .insta-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #FFFFFF;
      padding: 6px 14px;
      border-radius: var(--radius-full, 9999px);
      font-size: 12px;
      font-weight: 700;
      color: #E1306C;
      margin-bottom: 18px;
    }

    .insta-title {
      font-size: 32px;
      font-weight: 800;
      color: var(--dark-navy, #18263B);
      margin-bottom: 14px;
    }

    .insta-sub {
      font-size: 15px;
      color: var(--text-muted, #666666);
      line-height: 1.65;
      margin-bottom: 28px;
    }

    .insta-action-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .btn-insta-follow {
      background: linear-gradient(135deg, #E1306C 0%, #C13584 100%);
      color: #FFFFFF;
      font-weight: 700;
      border-radius: var(--radius-full, 9999px);
      padding: 12px 28px;
      font-size: 15px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 6px 20px rgba(225, 48, 108, 0.35);
      transition: all 0.2s ease;
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(225, 48, 108, 0.45);
      }
    }

    .insta-handle-text {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-muted, #666666);
    }

    /* Contact Section */
    .contact-section {
      padding: 72px 0 96px;
      background: #FFFFFF;
      border-top: 1px solid var(--border-pink, #F3DCE5);
    }

    .contact-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .contact-card {
      background: var(--bg-page, #FFF9FB);
      border: 1px solid var(--border-pink, #F3DCE5);
      border-radius: 18px;
      padding: 32px 24px;
      text-align: center;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.3s ease;
      &:hover {
        transform: translateY(-4px);
        border-color: var(--primary-pink, #FF4081);
        box-shadow: 0 12px 30px rgba(255, 64, 129, 0.12);
        background: #FFFFFF;
      }
    }

    .contact-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      &.phone { background: #EFF6FF; color: #2563EB; }
      &.email { background: #FFF0F5; color: var(--primary-pink, #FF4081); }
      &.insta { background: #FCE7F3; color: #DB2777; }
    }

    .contact-type {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-muted, #666666);
      margin-bottom: 6px;
    }

    .contact-val {
      font-size: 17px;
      font-weight: 800;
      color: var(--dark-navy, #18263B);
      margin-bottom: 8px;
      word-break: break-all;
    }

    .contact-hint {
      font-size: 12px;
      color: var(--primary-pink, #FF4081);
      font-weight: 600;
    }

    /* Responsive Breakpoints */
    @media (max-width: 992px) {
      .hero-title { font-size: 36px; }
      .story-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }
      .visual-card .story-img {
        height: 360px;
      }
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .contact-grid {
        grid-template-columns: 1fr;
        max-width: 500px;
        margin: 0 auto;
      }
    }

    @media (max-width: 600px) {
      .about-hero { padding: 48px 0 40px; }
      .hero-title { font-size: 28px; }
      .hero-subtitle { font-size: 15px; }
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .stat-card { padding: 24px 20px; }
      .stat-number-wrap { font-size: 38px; }
      .section-heading { font-size: 26px; }
      .features-grid {
        grid-template-columns: 1fr;
      }
      .insta-banner { padding: 36px 20px; }
      .insta-title { font-size: 24px; }
    }
  `]
})
export class AboutComponent implements OnInit {
  customerCounter = 0;
  followerCounter = 0;

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit() {
    this.titleService.setTitle('About Us | SouthColours - Enlights our culture');
    this.metaService.updateTag({
      name: 'description',
      content: 'Learn more about SouthColours, our passionate commitment to premium kids and ethnic wear, 600+ happy customers, and stylish quality fashion collections.'
    });

    this.animateCounters();
  }

  animateCounters() {
    const targetCustomers = 600;
    const targetFollowers = 1200;
    const duration = 1800; // 1.8s
    const steps = 60;
    const intervalTime = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // Ease out quad
      const eased = progress * (2 - progress);

      this.customerCounter = Math.floor(eased * targetCustomers);
      this.followerCounter = Math.floor(eased * targetFollowers);

      if (step >= steps) {
        this.customerCounter = targetCustomers;
        this.followerCounter = targetFollowers;
        clearInterval(timer);
      }
    }, intervalTime);
  }
}

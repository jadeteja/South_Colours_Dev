import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-size-chart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="size-chart-page">
      <!-- Hero Section -->
      <section class="size-chart-hero">
        <div class="container hero-container">
          <div class="hero-badge">
            <span class="sparkle-icon">📏</span>
            <span>Accurate Fit Guaranteed</span>
          </div>
          <h1 class="hero-title">Kids Size & Measurement Guide <span class="gradient-text">SouthColours</span></h1>
          <p class="hero-subtitle">
            Find the perfect, comfortable fit for your little ones. Refer to our detailed size charts below for Knee Length Frocks, Crop Top Lehenga Blouses, and Petticoat Lehenga Sets.
          </p>
          <div class="hero-cta-group">
            <a routerLink="/products" class="btn-primary">
              <span>Shop All Outfits</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            <a href="https://wa.me/919441113949" target="_blank" rel="noopener noreferrer" class="btn-secondary">
              <span>Need Custom Size? WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Category Filter Tabs -->
      <section class="filter-tabs-section">
        <div class="container">
          <div class="tabs-wrapper">
            <button 
              type="button" 
              class="tab-btn" 
              [class.active]="activeTab === 'all'" 
              (click)="activeTab = 'all'">
              All Size Charts (3)
            </button>
            <button 
              type="button" 
              class="tab-btn" 
              [class.active]="activeTab === 'frock'" 
              (click)="activeTab = 'frock'">
              👗 Knee Length Frock
            </button>
            <button 
              type="button" 
              class="tab-btn" 
              [class.active]="activeTab === 'croptop'" 
              (click)="activeTab = 'croptop'">
              👚 Crop Top Lehenga Blouse
            </button>
            <button 
              type="button" 
              class="tab-btn" 
              [class.active]="activeTab === 'petticoat'" 
              (click)="activeTab = 'petticoat'">
              🥻 Petticoat Lehenga Full Blouse
            </button>
          </div>
        </div>
      </section>

      <!-- Size Chart Cards Grid -->
      <section class="charts-section">
        <div class="container">
          <div class="charts-grid">

            <!-- Chart 1: Knee Length Frock -->
            @if (activeTab === 'all' || activeTab === 'frock') {
              <div class="chart-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <span class="badge-tag">Frocks & Dresses</span>
                    <h2>Knee Length Frock</h2>
                    <p class="card-subtitle">Recommended measurements for 1 Year to 5 Years girls.</p>
                  </div>
                </div>
                <div class="image-wrapper" (click)="openImageModal('assets/images/size-chart-knee-length-frock.jpg', 'Knee Length Frock Size Chart')">
                  <img src="assets/images/size-chart-knee-length-frock.jpg" alt="Knee Length Frock Size Chart - SouthColours" class="chart-img" />
                  <div class="zoom-overlay">
                    <span>🔍 Click to view full image</span>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="key-points">
                    <span>• <strong>Length:</strong> Measured from shoulder to knee ruffle edge</span>
                    <span>• <strong>Chest:</strong> Measured around fullest part of chest</span>
                  </div>
                </div>
              </div>
            }

            <!-- Chart 2: Crop Top Lehenga Blouse -->
            @if (activeTab === 'all' || activeTab === 'croptop') {
              <div class="chart-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <span class="badge-tag">Ethnic Lehenga Sets</span>
                    <h2>Crop Top Lehenga Blouse</h2>
                    <p class="card-subtitle">Detailed chart from 1 Year up to 13 Years teenagers.</p>
                  </div>
                </div>
                <div class="image-wrapper" (click)="openImageModal('assets/images/size-chart-crop-top-lehenga.jpg', 'Crop Top Lehenga Blouse Size Chart')">
                  <img src="assets/images/size-chart-crop-top-lehenga.jpg" alt="Crop Top Lehenga Blouse Size Chart - SouthColours" class="chart-img" />
                  <div class="zoom-overlay">
                    <span>🔍 Click to view full image</span>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="key-points">
                    <span>• <strong>Lehenga Length:</strong> Measured from waist to ankle border</span>
                    <span>• <strong>Blouse Length:</strong> Measured from shoulder to crop hem</span>
                  </div>
                </div>
              </div>
            }

            <!-- Chart 3: Petticoat Lehenga Full Blouse -->
            @if (activeTab === 'all' || activeTab === 'petticoat') {
              <div class="chart-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <span class="badge-tag">Traditional Wear / Pavadai Sattai</span>
                    <h2>Petticoat Lehenga Full Blouse (in inches)</h2>
                    <p class="card-subtitle">Complete sizing from 6 Months infants to 12 Years.</p>
                  </div>
                </div>
                <div class="image-wrapper" (click)="openImageModal('assets/images/size-chart-petticoat-lehenga.jpg', 'Petticoat Lehenga Full Blouse Size Chart')">
                  <img src="assets/images/size-chart-petticoat-lehenga.jpg" alt="Petticoat Lehenga Full Blouse Size Chart - SouthColours" class="chart-img" />
                  <div class="zoom-overlay">
                    <span>🔍 Click to view full image</span>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="key-points">
                    <span>• <strong>Lehenga Length:</strong> From shoulder to bottom hemline</span>
                    <span>• <strong>Full Blouse:</strong> Comfortable traditional South Indian fit</span>
                  </div>
                </div>
              </div>
            }

          </div>
        </div>
      </section>

      <!-- Measuring Tips Section -->
      <section class="tips-section">
        <div class="container">
          <div class="tips-card">
            <h3>How to Measure Your Little One at Home</h3>
            <div class="tips-grid">
              <div class="tip-box">
                <span class="tip-num">1</span>
                <div>
                  <strong>Chest Measurement</strong>
                  <p>Wrap the measuring tape comfortably around the fullest part of the chest, under the arms. Keep 1-finger space for easy breathing.</p>
                </div>
              </div>
              <div class="tip-box">
                <span class="tip-num">2</span>
                <div>
                  <strong>Dress / Lehenga Length</strong>
                  <p>Measure straight from the highest shoulder point down to the ankle or knee depending on dress style.</p>
                </div>
              </div>
              <div class="tip-box">
                <span class="tip-num">3</span>
                <div>
                  <strong>Between Sizes?</strong>
                  <p>Kids grow fast! If your child's measurement is on the borderline, we always recommend picking the next larger size.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Full-screen Image Lightbox Modal -->
      @if (modalImage) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal-container" (click)="$event.stopPropagation()">
            <button class="btn-close" (click)="closeModal()">✕</button>
            <h4 class="modal-title">{{ modalTitle }}</h4>
            <div class="modal-img-wrap">
              <img [src]="modalImage" [alt]="modalTitle" />
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .size-chart-page {
      background-color: #FAFAFB;
      min-height: 100vh;
      color: var(--dark-navy, #1E293B);
    }

    .container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Hero Section */
    .size-chart-hero {
      background: linear-gradient(135deg, #FFF0F5 0%, #FFFFFF 60%, #FFF5F8 100%);
      padding: 60px 0 45px;
      text-align: center;
      border-bottom: 1px solid var(--border-pink, #FFD6E7);
    }

    .hero-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 820px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #FFFFFF;
      border: 1px solid var(--border-pink, #FFD6E7);
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      color: var(--primary-pink, #FF4081);
      margin-bottom: 20px;
      box-shadow: 0 2px 10px rgba(255, 64, 129, 0.08);
    }

    .hero-title {
      font-size: 40px;
      font-weight: 800;
      line-height: 1.2;
      color: var(--dark-navy, #1E293B);
      margin-bottom: 16px;
      letter-spacing: -0.5px;
    }

    .gradient-text {
      background: linear-gradient(135deg, #FF4081 0%, #E91E63 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 16px;
      line-height: 1.6;
      color: var(--text-muted, #64748B);
      margin-bottom: 28px;
    }

    .hero-cta-group {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #FF4081 0%, #F50057 100%);
      color: #FFFFFF;
      font-weight: 700;
      font-size: 15px;
      padding: 12px 28px;
      border-radius: 9999px;
      text-decoration: none;
      box-shadow: 0 6px 18px rgba(255, 64, 129, 0.35);
      transition: all 0.2s ease;
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(255, 64, 129, 0.45);
      }
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #FFFFFF;
      color: #10B981;
      border: 1.5px solid #A7F3D0;
      font-weight: 700;
      font-size: 15px;
      padding: 12px 24px;
      border-radius: 9999px;
      text-decoration: none;
      transition: all 0.2s ease;
      &:hover {
        background: #ECFDF5;
        border-color: #34D399;
      }
    }

    /* Tabs Section */
    .filter-tabs-section {
      padding: 24px 0 8px;
    }

    .tabs-wrapper {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .tab-btn {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      padding: 10px 20px;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 700;
      color: #64748B;
      cursor: pointer;
      transition: all 0.2s ease;
      &:hover {
        border-color: #FF80AB;
        color: #FF4081;
      }
      &.active {
        background: #FF4081;
        border-color: #FF4081;
        color: #FFFFFF;
        box-shadow: 0 4px 14px rgba(255, 64, 129, 0.3);
      }
    }

    /* Charts Section */
    .charts-section {
      padding: 30px 0 40px;
    }

    .charts-grid {
      display: flex;
      flex-direction: column;
      gap: 36px;
    }

    .chart-card {
      background: #FFFFFF;
      border-radius: 20px;
      border: 1px solid #F1E5EC;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      &:hover {
        box-shadow: 0 8px 30px rgba(255, 64, 129, 0.08);
      }
    }

    .card-header {
      padding: 24px 28px 16px;
      border-bottom: 1px solid #F8FAFC;
    }

    .badge-tag {
      display: inline-block;
      background: #FFF0F5;
      color: #FF4081;
      border: 1px solid #FFD6E7;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 3px 10px;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    .card-title-group h2 {
      font-size: 24px;
      font-weight: 800;
      color: #1E293B;
      margin: 0 0 6px;
    }

    .card-subtitle {
      font-size: 14px;
      color: #64748B;
      margin: 0;
    }

    .image-wrapper {
      position: relative;
      cursor: pointer;
      background: #FFFFFF;
      display: flex;
      justify-content: center;
      padding: 16px 24px 24px;
      overflow: hidden;
      .chart-img {
        width: 100%;
        max-width: 960px;
        height: auto;
        border-radius: 14px;
        box-shadow: 0 2px 14px rgba(0, 0, 0, 0.04);
        transition: transform 0.25s ease;
      }
      .zoom-overlay {
        position: absolute;
        bottom: 34px;
        right: 34px;
        background: rgba(15, 23, 42, 0.75);
        color: #FFFFFF;
        font-size: 12px;
        font-weight: 600;
        padding: 6px 14px;
        border-radius: 9999px;
        backdrop-filter: blur(4px);
        transition: opacity 0.2s;
        pointer-events: none;
      }
      &:hover {
        .chart-img {
          transform: scale(1.015);
        }
      }
    }

    .card-footer {
      background: #FFFDFE;
      border-top: 1px solid #F8FAFC;
      padding: 16px 28px;
      .key-points {
        display: flex;
        gap: 24px;
        flex-wrap: wrap;
        font-size: 13px;
        color: #475569;
      }
    }

    /* Tips Section */
    .tips-section {
      padding: 20px 0 60px;
    }

    .tips-card {
      background: #FFFFFF;
      border-radius: 16px;
      border: 1px dashed #FF80AB;
      padding: 32px 36px;
      h3 {
        font-size: 20px;
        font-weight: 800;
        color: #1E293B;
        margin: 0 0 20px;
        text-align: center;
      }
    }

    .tips-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .tip-box {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      .tip-num {
        width: 36px;
        height: 36px;
        background: #FFF0F5;
        border: 1.5px solid #FF80AB;
        color: #FF4081;
        font-size: 16px;
        font-weight: 800;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      strong {
        display: block;
        font-size: 15px;
        color: #1E293B;
        margin-bottom: 4px;
      }
      p {
        font-size: 13px;
        line-height: 1.5;
        color: #64748B;
        margin: 0;
      }
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal-container {
      position: relative;
      background: #FFFFFF;
      border-radius: 16px;
      max-width: 1050px;
      width: 100%;
      max-height: 92vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    }

    .btn-close {
      position: absolute;
      top: 14px;
      right: 14px;
      background: #F1F5F9;
      border: none;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      font-size: 16px;
      font-weight: 800;
      color: #475569;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      &:hover {
        background: #EF4444;
        color: #FFFFFF;
      }
    }

    .modal-title {
      padding: 16px 24px;
      margin: 0;
      font-size: 17px;
      font-weight: 800;
      color: #1E293B;
      border-bottom: 1px solid #E2E8F0;
    }

    .modal-img-wrap {
      overflow-y: auto;
      padding: 16px;
      display: flex;
      justify-content: center;
      img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
      }
    }

    @media (max-width: 900px) {
      .hero-title { font-size: 30px; }
      .tips-grid { grid-template-columns: 1fr; gap: 18px; }
      .image-wrapper { padding: 12px; }
    }

    @media (max-width: 600px) {
      .size-chart-hero { padding: 36px 0 24px; }
      .hero-title { font-size: 24px; }
      .hero-subtitle { font-size: 14px; }
      .card-header { padding: 16px 18px 12px; }
      .card-title-group h2 { font-size: 19px; }
      .card-footer { padding: 12px 18px; }
      .tips-card { padding: 20px 16px; }
    }
  `]
})
export class SizeChartComponent implements OnInit {
  activeTab: 'all' | 'frock' | 'croptop' | 'petticoat' = 'all';

  modalImage: string | null = null;
  modalTitle = '';

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('Size Chart & Measurement Guide | SouthColours');
    this.meta.updateTag({
      name: 'description',
      content: 'Official SouthColours Kids size charts for Knee Length Frocks, Crop Top Lehenga Blouses, and Petticoat Lehengas. Find exact chest and length measurements.'
    });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  openImageModal(src: string, title: string) {
    this.modalImage = src;
    this.modalTitle = title;
  }

  closeModal() {
    this.modalImage = null;
    this.modalTitle = '';
  }
}

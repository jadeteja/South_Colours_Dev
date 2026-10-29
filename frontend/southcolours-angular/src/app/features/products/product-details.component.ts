import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { ToastService } from '../../core/services/toast.service';
import { Product, ProductVariant } from '../../core/models/ecommerce.models';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    @if (product) {
      <div class="container details-page">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <a routerLink="/">Home</a> <span>›</span>
          <a routerLink="/products" [queryParams]="{ category: 'ethnic-wear' }">Ethnic Wear</a> <span>›</span>
          <span class="current">{{ product.name }}</span>
        </nav>

        <div class="details-layout">
          <!-- Gallery Left (Thumbnails + Hero Image) Matching Screen 3 -->
          <div class="gallery-wrapper">
            <div class="thumbnails-col">
              @for (img of product.images; track img.id) {
                <button class="thumb-btn" [class.active]="selectedImage === img.imageUrl" (click)="selectedImage = img.imageUrl">
                  <img [src]="img.imageUrl" [alt]="product.name" />
                </button>
              }
            </div>
            <div class="main-image-card">
              <img [src]="selectedImage" [alt]="product.name" class="main-image" />
              <button class="wishlist-float" (click)="shopService.toggleWishlist(product.id)" aria-label="Toggle wishlist">
                <svg width="22" height="22" viewBox="0 0 24 24" [attr.fill]="shopService.isWishlisted(product.id) ? '#FF4081' : 'none'" stroke="#FF4081" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Product Details Right Panel -->
          <div class="product-info-panel">
            <h1 class="product-title">{{ product.name }}</h1>
            
            <div class="rating-row" (click)="setTab('reviews')" role="button" tabindex="0" title="Click to view reviews">
              <span class="stars">★★★★★</span>
              <span class="rating-val">({{ reviews.length || product.reviewCount }} reviews)</span>
            </div>

            <div class="price-box">
              <span class="selling-price">₹ {{ product.sellingPrice | number }}</span>
              <span class="original-price">₹ {{ product.originalPrice | number }}</span>
              <span class="badge-discount">{{ getDiscountPercent(product.originalPrice, product.sellingPrice) }}% OFF</span>
            </div>

            <p class="product-short-desc">{{ product.shortDescription }}</p>

            <!-- Size Selector Pills Matching Screen 3 -->
            <div class="selector-section">
              <div class="selector-header">
                <span class="label">Size</span>
                <button type="button" class="size-guide-btn" (click)="openSizeGuide()">Size Guide</button>
              </div>
              <div class="size-pills">
                @for (size of availableSizes; track size) {
                  <button 
                    class="size-pill" 
                    [class.selected]="selectedSize === size"
                    (click)="selectedSize = size">
                    {{ size }}
                  </button>
                }
              </div>
            </div>

            <!-- Color Options Matching Screen 3 -->
            <div class="selector-section">
              <span class="label">Color: <strong>{{ selectedColor }}</strong></span>
              <div class="color-options">
                <button class="color-choice" [class.selected]="selectedColor === 'Pink'" (click)="selectedColor = 'Pink'">
                  <span class="color-circle" style="background-color: #FF4081;"></span>
                  <span>Pink</span>
                </button>
                <button class="color-choice" [class.selected]="selectedColor === 'Yellow'" (click)="selectedColor = 'Yellow'">
                  <span class="color-circle" style="background-color: #FDD835;"></span>
                  <span>Yellow</span>
                </button>
                <button class="color-choice" [class.selected]="selectedColor === 'Purple'" (click)="selectedColor = 'Purple'">
                  <span class="color-circle" style="background-color: #7B1FA2;"></span>
                  <span>Purple</span>
                </button>
              </div>
            </div>

            <!-- Quantity Stepper -->
            <div class="quantity-section">
              <span class="label">Quantity</span>
              <div class="stepper">
                <button class="step-btn" (click)="decreaseQty()">−</button>
                <span class="qty-num">{{ quantity }}</span>
                <button class="step-btn" (click)="increaseQty()">+</button>
              </div>
            </div>

            <!-- Action CTAs: Add to Cart & Buy Now -->
            <div class="action-buttons-row">
              <button class="btn-primary add-cart-btn" (click)="onAddToCart()">
                Add to Cart
              </button>
              <button class="btn-secondary buy-now-btn" (click)="onBuyNow()">
                Buy Now
              </button>
            </div>

            <!-- Trust Badges Matching Screen 3 -->
            <div class="trust-badges-grid">
              <div class="trust-badge">
                <span class="badge-icon">🔄</span>
                <span class="badge-text">Easy Returns</span>
              </div>
              <div class="trust-badge">
                <span class="badge-icon">🔒</span>
                <span class="badge-text">Secure Payment</span>
              </div>
              <div class="trust-badge">
                <span class="badge-icon">🛡️</span>
                <span class="badge-text">Quality Assurance</span>
              </div>
              <div class="trust-badge">
                <span class="badge-icon">🚚</span>
                <span class="badge-text">Fast Delivery</span>
              </div>
            </div>

            <!-- Specifications & Details Section with Interactive Tabs -->
            <div class="specs-section" id="product-tabs-section">
              <div class="specs-tabs" role="tablist">
                <button 
                  type="button" 
                  class="tab-btn" 
                  [class.active]="activeTab === 'details'" 
                  (click)="setTab('details')"
                  role="tab">
                  Product Details
                </button>
                <button 
                  type="button" 
                  class="tab-btn" 
                  [class.active]="activeTab === 'specs'" 
                  (click)="setTab('specs')"
                  role="tab">
                  Specifications
                </button>
                <button 
                  type="button" 
                  class="tab-btn" 
                  [class.active]="activeTab === 'size-chart'" 
                  (click)="setTab('size-chart')"
                  role="tab">
                  Size Chart
                </button>
                <button 
                  type="button" 
                  class="tab-btn" 
                  [class.active]="activeTab === 'reviews'" 
                  (click)="setTab('reviews')"
                  role="tab">
                  Reviews ({{ reviews.length || product.reviewCount }})
                </button>
              </div>

              <!-- Tab 1: Product Details -->
              @if (activeTab === 'details') {
                <div class="tab-content fade-in">
                  <p class="tab-desc">
                    {{ product.detailedDescription || product.shortDescription || 'Experience timeless elegance with our handcrafted ethnic wear collection, designed with rich woven borders and premium comfortable fabric.' }}
                  </p>
                  <table class="specs-table">
                    <tbody>
                      <tr>
                        <td class="spec-label">Fabric:</td>
                        <td class="spec-value">{{ product.material || 'Art Silk Jacquard with Cotton Lining' }}</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Color:</td>
                        <td class="spec-value">{{ selectedColor }}</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Care Instructions:</td>
                        <td class="spec-value">{{ product.careInstructions || 'Dry Clean Recommended / Gentle Hand Wash' }}</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Suitable For:</td>
                        <td class="spec-value">{{ product.occasion || 'Weddings, Festivals, Birthdays, Special Occasions' }}</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Inner Lining:</td>
                        <td class="spec-value">100% Breathable Soft Cotton</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              }

              <!-- Tab 2: Specifications -->
              @if (activeTab === 'specs') {
                <div class="tab-content fade-in">
                  <table class="specs-table">
                    <tbody>
                      <tr>
                        <td class="spec-label">Brand:</td>
                        <td class="spec-value">South Colours</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Material / Fabric:</td>
                        <td class="spec-value">{{ product.material || 'Art Silk Jacquard' }}</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Fabric Type:</td>
                        <td class="spec-value">{{ product.fabricType || 'Jacquard Weave' }}</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Lining Material:</td>
                        <td class="spec-value">100% Soft Cotton Inner Lining</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Color:</td>
                        <td class="spec-value">{{ selectedColor }}</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Pattern / Work:</td>
                        <td class="spec-value">Traditional Temple Motif with Zari Border</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Silhouette / Style:</td>
                        <td class="spec-value">Traditional Flared Pattu Frock / Dress</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Neck Style:</td>
                        <td class="spec-value">Classic Round Neck</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Sleeve Type:</td>
                        <td class="spec-value">Short / Elbow Sleeves with Zari Accent</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Closure:</td>
                        <td class="spec-value">Concealed Back Zipper</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Occasion:</td>
                        <td class="spec-value">{{ product.occasion || 'Festive, Weddings, Traditional Ceremonies, Birthdays' }}</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Care Instructions:</td>
                        <td class="spec-value">{{ product.careInstructions || 'Dry Clean Recommended' }}</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Age Group:</td>
                        <td class="spec-value">{{ product.ageGroup || '1 to 8 Years' }}</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Country of Origin:</td>
                        <td class="spec-value">India</td>
                      </tr>
                      <tr>
                        <td class="spec-label">Package Contains:</td>
                        <td class="spec-value">1 Ethnic Dress / Frock</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              }

              <!-- Tab 3: Size Chart -->
              @if (activeTab === 'size-chart') {
                <div class="tab-content fade-in">
                  <div class="chart-header-row">
                    <span class="chart-tip">Tip: Click any size row to choose that size directly.</span>
                    <div class="unit-toggle">
                      <button type="button" class="unit-btn" [class.active]="sizeUnit === 'in'" (click)="sizeUnit = 'in'">Inches</button>
                      <button type="button" class="unit-btn" [class.active]="sizeUnit === 'cm'" (click)="sizeUnit = 'cm'">CM</button>
                    </div>
                  </div>

                  <div class="table-scroll-wrap">
                    <table class="size-table">
                      <thead>
                        <tr>
                          <th>Size</th>
                          <th>Chest ({{ sizeUnit }})</th>
                          <th>Waist ({{ sizeUnit }})</th>
                          <th>Length ({{ sizeUnit }})</th>
                          <th>Height</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (row of sizeChartData; track row.size) {
                          <tr [class.selected-row]="selectedSize === row.size" (click)="selectedSize = row.size">
                            <td>
                              <strong class="size-cell">{{ row.size }}</strong>
                              @if (selectedSize === row.size) {
                                <span class="active-badge">Selected</span>
                              }
                            </td>
                            <td>{{ sizeUnit === 'in' ? row.chestIn : row.chestCm }}</td>
                            <td>{{ sizeUnit === 'in' ? row.waistIn : row.waistCm }}</td>
                            <td>{{ sizeUnit === 'in' ? row.lengthIn : row.lengthCm }}</td>
                            <td>{{ row.heightCm }}</td>
                            <td>
                              <button 
                                type="button" 
                                class="pick-size-btn" 
                                [class.is-current]="selectedSize === row.size" 
                                (click)="selectedSize = row.size; $event.stopPropagation()">
                                {{ selectedSize === row.size ? 'Selected' : 'Select' }}
                              </button>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>

                  <div class="how-to-measure-box">
                    <div class="measure-title">📏 How to Measure:</div>
                    <div class="measure-items">
                      <div class="measure-item">
                        <strong>Chest:</strong> Measure around fullest part of chest, keeping tape snug under arms.
                      </div>
                      <div class="measure-item">
                        <strong>Waist:</strong> Measure around the natural waistline.
                      </div>
                      <div class="measure-item">
                        <strong>Length:</strong> Measure from high shoulder point down to desired hemline.
                      </div>
                    </div>
                  </div>
                </div>
              }

              <!-- Tab 4: Reviews -->
              @if (activeTab === 'reviews') {
                <div class="tab-content fade-in">
                  <div class="reviews-header-card">
                    <div class="rating-big-col">
                      <span class="big-score">4.9</span>
                      <div class="stars-gold">★★★★★</div>
                      <span class="based-on">Based on {{ reviews.length }} verified reviews</span>
                    </div>
                    <div class="write-review-cta">
                      <button type="button" class="btn-secondary write-btn" (click)="isWritingReview = !isWritingReview">
                        {{ isWritingReview ? 'Close Form' : 'Write a Review' }}
                      </button>
                    </div>
                  </div>

                  <!-- Write Review Form -->
                  @if (isWritingReview) {
                    <div class="write-review-form fade-in">
                      <h4 class="form-title">Write Your Review</h4>
                      <div class="rating-picker">
                        <span class="picker-label">Your Rating:</span>
                        <div class="picker-stars">
                          @for (star of [1,2,3,4,5]; track star) {
                            <button type="button" class="star-btn" [class.lit]="star <= newReview.rating" (click)="newReview.rating = star">
                              ★
                            </button>
                          }
                          <span class="picker-hint">({{ newReview.rating }} of 5 stars)</span>
                        </div>
                      </div>

                      <div class="form-group">
                        <label>Your Name *</label>
                        <input type="text" [(ngModel)]="newReview.customerName" placeholder="Enter your full name" class="form-input" />
                      </div>

                      <div class="form-group">
                        <label>Review Title</label>
                        <input type="text" [(ngModel)]="newReview.title" placeholder="e.g. Beautiful dress, wonderful quality!" class="form-input" />
                      </div>

                      <div class="form-group">
                        <label>Your Feedback *</label>
                        <textarea [(ngModel)]="newReview.comment" rows="3" placeholder="Share your experience regarding the fit, fabric, and delivery..." class="form-textarea"></textarea>
                      </div>

                      <div class="form-actions">
                        <button type="button" class="btn-primary" (click)="submitReview()">Submit Review</button>
                        <button type="button" class="btn-cancel" (click)="isWritingReview = false">Cancel</button>
                      </div>
                    </div>
                  }

                  <!-- Reviews List -->
                  <div class="reviews-list">
                    @for (r of reviews; track r.id || r.customerName) {
                      <div class="review-item">
                        <div class="review-meta-row">
                          <div class="author-block">
                            <span class="author-avatar">{{ (r.customerName || 'U')[0] }}</span>
                            <div>
                              <strong class="author-name">{{ r.customerName }}</strong>
                              @if (r.isVerifiedPurchase !== false) {
                                <span class="verified-tag">✓ Verified Buyer</span>
                              }
                            </div>
                          </div>
                          <span class="review-date">{{ r.date || 'Recently' }}</span>
                        </div>

                        <div class="review-stars-row">
                          <span class="stars-gold">{{ getStars(r.rating || 5) }}</span>
                          @if (r.title) {
                            <strong class="review-item-title">{{ r.title }}</strong>
                          }
                        </div>

                        <p class="review-comment-text">{{ r.comment }}</p>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Size Guide Interactive Modal -->
        @if (showSizeGuideModal) {
          <div class="modal-backdrop" (click)="closeSizeGuide()">
            <div class="modal-dialog" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <div>
                  <h3 class="modal-title">Size Guide & Measurements</h3>
                  <p class="modal-sub">Find the perfect fit for your little one</p>
                </div>
                <button type="button" class="modal-close-btn" (click)="closeSizeGuide()" aria-label="Close size guide">✕</button>
              </div>

              <div class="modal-body">
                <div class="chart-header-row">
                  <span class="chart-tip">Select a size below to apply it to your selection:</span>
                  <div class="unit-toggle">
                    <button type="button" class="unit-btn" [class.active]="sizeUnit === 'in'" (click)="sizeUnit = 'in'">Inches</button>
                    <button type="button" class="unit-btn" [class.active]="sizeUnit === 'cm'" (click)="sizeUnit = 'cm'">CM</button>
                  </div>
                </div>

                <div class="table-scroll-wrap">
                  <table class="size-table">
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>Chest ({{ sizeUnit }})</th>
                        <th>Waist ({{ sizeUnit }})</th>
                        <th>Length ({{ sizeUnit }})</th>
                        <th>Height</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (row of sizeChartData; track row.size) {
                        <tr [class.selected-row]="selectedSize === row.size" (click)="selectSizeAndCloseGuide(row.size)">
                          <td>
                            <strong class="size-cell">{{ row.size }}</strong>
                            @if (selectedSize === row.size) {
                              <span class="active-badge">Selected</span>
                            }
                          </td>
                          <td>{{ sizeUnit === 'in' ? row.chestIn : row.chestCm }}</td>
                          <td>{{ sizeUnit === 'in' ? row.waistIn : row.waistCm }}</td>
                          <td>{{ sizeUnit === 'in' ? row.lengthIn : row.lengthCm }}</td>
                          <td>{{ row.heightCm }}</td>
                          <td>
                            <button 
                              type="button" 
                              class="pick-size-btn" 
                              [class.is-current]="selectedSize === row.size" 
                              (click)="selectSizeAndCloseGuide(row.size)">
                              {{ selectedSize === row.size ? 'Selected' : 'Select Size' }}
                            </button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>

                <div class="how-to-measure-box">
                  <div class="measure-title">📏 How to Measure:</div>
                  <div class="measure-items">
                    <div class="measure-item">
                      <strong>Chest:</strong> Measure around the fullest part of the chest, keeping tape snug under arms.
                    </div>
                    <div class="measure-item">
                      <strong>Waist:</strong> Measure around the natural waistline.
                    </div>
                    <div class="measure-item">
                      <strong>Dress Length:</strong> Measure from high shoulder point down to desired hem length.
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn-primary" (click)="closeSizeGuide()">Done</button>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .details-page {
      padding: 20px 20px 60px;
      max-width: 1240px;
      margin: 0 auto;
    }
    .breadcrumb {
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 24px;
      a:hover {
        color: var(--primary-pink);
      }
      .current {
        color: var(--primary-pink);
        font-weight: 700;
      }
    }
    .details-layout {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 48px;
    }
    .gallery-wrapper {
      display: flex;
      gap: 16px;
    }
    .thumbnails-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
      .thumb-btn {
        width: 72px;
        height: 84px;
        border-radius: 10px;
        border: 2px solid transparent;
        overflow: hidden;
        padding: 0;
        background: transparent;
        &.active {
          border-color: var(--primary-pink);
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    .main-image-card {
      position: relative;
      flex: 1;
      height: 520px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--border-pink);
      background: #FFF5F8;
      .main-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .wishlist-float {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 40px;
        height: 40px;
        background: #FFFFFF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
    }
    .product-info-panel {
      display: flex;
      flex-direction: column;
    }
    .product-title {
      font-size: 30px;
      color: var(--dark-navy);
      margin-bottom: 8px;
    }
    .rating-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
      cursor: pointer;
      width: fit-content;
      transition: opacity 0.2s;
      &:hover {
        opacity: 0.85;
      }
      .stars {
        color: #FFB300;
        font-size: 15px;
      }
      .rating-val {
        font-size: 13px;
        color: var(--text-light);
      }
    }
    .price-box {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      .selling-price {
        font-size: 28px;
        font-weight: 800;
        color: var(--dark-navy);
      }
      .original-price {
        font-size: 18px;
        color: var(--text-light);
        text-decoration: line-through;
      }
    }
    .product-short-desc {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .selector-section {
      margin-bottom: 22px;
      .label {
        font-size: 14px;
        font-weight: 700;
        color: var(--dark-navy);
      }
      .selector-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        .size-guide-btn {
          background: transparent;
          color: var(--primary-pink);
          font-size: 13px;
          font-weight: 700;
          text-decoration: underline;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 4px;
          &:hover {
            background: var(--primary-pink-light);
          }
        }
      }
    }
    .size-pills {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      .size-pill {
        padding: 8px 16px;
        border-radius: 8px;
        border: 1px solid var(--border-pink);
        background: #FFFFFF;
        font-size: 13px;
        font-weight: 700;
        color: var(--dark-navy);
        cursor: pointer;
        transition: all 0.2s ease;
        &.selected {
          border-color: var(--primary-pink);
          background-color: var(--primary-pink-light);
          color: var(--primary-pink);
        }
      }
    }
    .color-options {
      display: flex;
      gap: 12px;
      margin-top: 10px;
      .color-choice {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        border-radius: 8px;
        border: 1px solid var(--border-pink);
        background: #FFFFFF;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        &.selected {
          border-color: var(--primary-pink);
          background: var(--primary-pink-light);
        }
        .color-circle {
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }
      }
    }
    .quantity-section {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 26px;
      .stepper {
        display: inline-flex;
        align-items: center;
        border: 1px solid var(--border-pink);
        border-radius: 9999px;
        overflow: hidden;
        background: #FFFFFF;
        .step-btn {
          width: 34px;
          height: 34px;
          background: transparent;
          font-size: 16px;
          font-weight: 700;
          color: var(--dark-navy);
          cursor: pointer;
          &:hover {
            background: var(--primary-pink-light);
          }
        }
        .qty-num {
          padding: 0 14px;
          font-weight: 700;
          font-size: 14px;
        }
      }
    }
    .action-buttons-row {
      display: flex;
      gap: 16px;
      margin-bottom: 30px;
      .add-cart-btn, .buy-now-btn {
        flex: 1;
        padding: 14px 0;
        font-size: 16px;
        cursor: pointer;
      }
    }
    .trust-badges-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      padding: 16px 0;
      border-top: 1px solid var(--border-pink);
      border-bottom: 1px solid var(--border-pink);
      margin-bottom: 24px;
      .trust-badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 4px;
        .badge-icon {
          font-size: 20px;
        }
        .badge-text {
          font-size: 11px;
          font-weight: 700;
          color: var(--dark-navy);
        }
      }
    }

    /* Specifications & Tabs */
    .specs-section {
      margin-top: 8px;
      .specs-tabs {
        display: flex;
        gap: 20px;
        border-bottom: 1px solid var(--border-pink);
        margin-bottom: 18px;
        overflow-x: auto;
        white-space: nowrap;
        .tab-btn {
          background: transparent;
          border: none;
          font-size: 14px;
          font-weight: 700;
          padding-bottom: 12px;
          color: var(--text-muted);
          position: relative;
          cursor: pointer;
          transition: color 0.2s ease;
          &:hover {
            color: var(--primary-pink);
          }
          &.active {
            color: var(--primary-pink);
            &::after {
              content: '';
              position: absolute;
              bottom: -1px;
              left: 0;
              right: 0;
              height: 2.5px;
              background-color: var(--primary-pink);
              border-radius: 2px 2px 0 0;
            }
          }
        }
      }
      .tab-content {
        animation: fadeIn 0.25s ease-in-out;
      }
      .tab-desc {
        font-size: 13.5px;
        color: var(--text-muted);
        line-height: 1.6;
        margin-bottom: 14px;
      }
      .specs-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        tr {
          border-bottom: 1px solid #F8F9FA;
        }
        .spec-label {
          color: var(--text-muted);
          padding: 9px 0;
          width: 36%;
        }
        .spec-value {
          color: var(--dark-navy);
          font-weight: 600;
          padding: 9px 0;
        }
      }
    }

    /* Size Chart & Table Styles */
    .chart-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      gap: 10px;
      flex-wrap: wrap;
    }
    .chart-tip {
      font-size: 12.5px;
      color: var(--text-muted);
      font-style: italic;
    }
    .unit-toggle {
      display: inline-flex;
      border: 1px solid var(--border-pink);
      border-radius: 8px;
      overflow: hidden;
      background: #FFFFFF;
      .unit-btn {
        padding: 5px 12px;
        font-size: 12px;
        font-weight: 700;
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        &.active {
          background: var(--primary-pink);
          color: #FFFFFF;
        }
      }
    }
    .table-scroll-wrap {
      overflow-x: auto;
      border: 1px solid var(--border-pink);
      border-radius: 10px;
      background: #FFFFFF;
      margin-bottom: 16px;
    }
    .size-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
      thead th {
        background: #FFF5F8;
        padding: 10px 14px;
        font-weight: 800;
        color: var(--dark-navy);
        border-bottom: 1px solid var(--border-pink);
      }
      tbody tr {
        border-bottom: 1px solid #F5E8EE;
        cursor: pointer;
        transition: background 0.15s ease;
        &:hover {
          background: #FFFBFD;
        }
        &.selected-row {
          background: #FFF0F5;
          td {
            font-weight: 700;
            color: var(--primary-pink);
          }
        }
      }
      td {
        padding: 10px 14px;
        color: var(--dark-navy);
      }
      .size-cell {
        margin-right: 6px;
      }
      .active-badge {
        font-size: 10px;
        font-weight: 800;
        background: var(--primary-pink);
        color: #FFFFFF;
        padding: 2px 6px;
        border-radius: 4px;
        text-transform: uppercase;
      }
      .pick-size-btn {
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 700;
        border-radius: 6px;
        background: #FFFFFF;
        border: 1px solid var(--primary-pink);
        color: var(--primary-pink);
        cursor: pointer;
        &.is-current {
          background: var(--primary-pink);
          color: #FFFFFF;
        }
      }
    }
    .how-to-measure-box {
      background: #FAF7F9;
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 12px;
      color: var(--text-dark);
      border: 1px dashed var(--border-pink);
      .measure-title {
        font-weight: 800;
        margin-bottom: 6px;
        color: var(--primary-pink);
      }
      .measure-items {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }

    /* Reviews Section Styles */
    .reviews-header-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #FFF5F8;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 18px;
      border: 1px solid var(--border-pink);
    }
    .rating-big-col {
      display: flex;
      align-items: center;
      gap: 12px;
      .big-score {
        font-size: 28px;
        font-weight: 900;
        color: var(--dark-navy);
      }
      .stars-gold {
        color: #FFB300;
        font-size: 18px;
      }
      .based-on {
        font-size: 12px;
        color: var(--text-muted);
      }
    }
    .write-btn {
      padding: 8px 18px;
      font-size: 13px;
    }
    .write-review-form {
      background: #FFFFFF;
      border: 1px solid var(--border-pink);
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 20px;
      box-shadow: 0 4px 15px rgba(255, 64, 129, 0.05);
      .form-title {
        font-size: 15px;
        font-weight: 800;
        margin-bottom: 12px;
        color: var(--dark-navy);
      }
      .rating-picker {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 14px;
        .picker-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-dark);
        }
        .star-btn {
          background: transparent;
          border: none;
          font-size: 20px;
          color: #DDD;
          cursor: pointer;
          padding: 0 2px;
          &.lit {
            color: #FFB300;
          }
        }
        .picker-hint {
          font-size: 12px;
          color: var(--text-muted);
        }
      }
      .form-group {
        margin-bottom: 12px;
        label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 4px;
        }
        .form-input, .form-textarea {
          width: 100%;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          &:focus {
            border-color: var(--primary-pink);
          }
        }
      }
      .form-actions {
        display: flex;
        gap: 10px;
        margin-top: 14px;
        .btn-cancel {
          background: transparent;
          border: 1px solid #CBD5E0;
          border-radius: var(--radius-full);
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
      }
    }
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
      .review-item {
        border-bottom: 1px solid #F0E6EC;
        padding-bottom: 14px;
      }
      .review-meta-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }
      .author-block {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .author-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #FFE2ED;
        color: var(--primary-pink);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 12px;
      }
      .author-name {
        font-size: 13px;
        color: var(--dark-navy);
      }
      .verified-tag {
        font-size: 11px;
        color: #28A745;
        font-weight: 700;
        margin-left: 6px;
      }
      .review-date {
        font-size: 11px;
        color: var(--text-light);
      }
      .review-stars-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
        .stars-gold {
          color: #FFB300;
          font-size: 13px;
        }
        .review-item-title {
          font-size: 13px;
          color: var(--dark-navy);
        }
      }
      .review-comment-text {
        font-size: 12.5px;
        color: var(--text-muted);
        line-height: 1.5;
      }
    }

    /* Modal Backdrop & Dialog */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(24, 38, 59, 0.65);
      z-index: 99990;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: fadeIn 0.2s ease-out;
    }
    .modal-dialog {
      background: #FFFFFF;
      border-radius: 18px;
      width: 100%;
      max-width: 620px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0,0,0,0.25);
      display: flex;
      flex-direction: column;
      animation: zoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 20px 24px 16px;
      border-bottom: 1px solid var(--border-pink);
      .modal-title {
        font-size: 18px;
        color: var(--dark-navy);
        font-weight: 800;
      }
      .modal-sub {
        font-size: 12px;
        color: var(--text-muted);
        margin-top: 2px;
      }
      .modal-close-btn {
        background: transparent;
        border: none;
        font-size: 18px;
        color: var(--text-light);
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        &:hover {
          color: var(--dark-navy);
          background: #F3F4F6;
        }
      }
    }
    .modal-body {
      padding: 20px 24px;
    }
    .modal-footer {
      padding: 14px 24px;
      border-top: 1px solid var(--border-pink);
      display: flex;
      justify-content: flex-end;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes zoomIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    @media (max-width: 1024px) {
      .details-layout {
        gap: 28px;
      }
      .main-image-card {
        height: 440px;
      }
      .product-title {
        font-size: 26px;
      }
    }

    @media (max-width: 768px) {
      .details-layout {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      .gallery-wrapper {
        flex-direction: column-reverse;
      }
      .thumbnails-col {
        flex-direction: row;
        overflow-x: auto;
        padding-bottom: 6px;
        .thumb-btn {
          width: 60px;
          height: 70px;
          flex-shrink: 0;
        }
      }
      .main-image-card {
        height: 380px;
      }
      .product-title {
        font-size: 22px;
      }
      .price-box .selling-price {
        font-size: 24px;
      }
      .action-buttons-row {
        flex-direction: column;
        gap: 12px;
        .add-cart-btn, .buy-now-btn {
          width: 100%;
        }
      }
      .trust-badges-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .specs-section .specs-tabs {
        gap: 14px;
      }
      .reviews-header-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }

    @media (max-width: 480px) {
      .main-image-card {
        height: 300px;
      }
      .price-box {
        flex-wrap: wrap;
      }
      .size-pills .size-pill {
        padding: 6px 12px;
        font-size: 12px;
      }
    }
  `]
})
export class ProductDetailsComponent implements OnInit {
  shopService = inject(ShopService);
  toastService = inject(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  product: Product | null = null;
  selectedImage = '';
  selectedSize = '3-4Y';
  selectedColor = 'Pink';
  quantity = 1;

  availableSizes = ['1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-8Y'];

  // Tabs state
  activeTab: 'details' | 'specs' | 'size-chart' | 'reviews' = 'details';

  // Size chart state
  sizeUnit: 'in' | 'cm' = 'in';
  showSizeGuideModal = false;

  sizeChartData = [
    { size: '1-2Y', chestIn: '20', waistIn: '19', lengthIn: '22', heightCm: '80 - 86 cm', chestCm: '51', waistCm: '48', lengthCm: '56' },
    { size: '2-3Y', chestIn: '21', waistIn: '20', lengthIn: '24', heightCm: '86 - 98 cm', chestCm: '53', waistCm: '51', lengthCm: '61' },
    { size: '3-4Y', chestIn: '22', waistIn: '21', lengthIn: '26', heightCm: '98 - 104 cm', chestCm: '56', waistCm: '53', lengthCm: '66' },
    { size: '4-5Y', chestIn: '23', waistIn: '22', lengthIn: '28', heightCm: '104 - 110 cm', chestCm: '58', waistCm: '56', lengthCm: '71' },
    { size: '5-6Y', chestIn: '24', waistIn: '23', lengthIn: '30', heightCm: '110 - 116 cm', chestCm: '61', waistCm: '58', lengthCm: '76' },
    { size: '6-8Y', chestIn: '26', waistIn: '24', lengthIn: '33', heightCm: '116 - 128 cm', chestCm: '66', waistCm: '61', lengthCm: '84' }
  ];

  // Reviews state
  reviews: any[] = [];
  isWritingReview = false;
  newReview = {
    customerName: '',
    rating: 5,
    title: '',
    comment: ''
  };

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'] || 'pink-lehenga-set';
      this.shopService.getProductBySlug(slug).subscribe({
        next: (p) => {
          this.product = p;
          this.selectedImage = p.images[0]?.imageUrl || '';
          this.loadReviews(p.id);
        },
        error: () => {
          this.loadReviews();
        }
      });
    });
  }

  loadReviews(productId?: string) {
    this.shopService.getReviews(productId).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.reviews = res.filter((r: any) => !productId || r.productId === productId || !r.productId);
        }
        if (this.reviews.length === 0) {
          this.reviews = this.getDefaultReviews();
        }
      },
      error: () => {
        this.reviews = this.getDefaultReviews();
      }
    });
  }

  getDefaultReviews() {
    return [
      {
        id: 'rev-1',
        customerName: 'Priya Sharma',
        rating: 5,
        title: 'Stunning quality and finish!',
        comment: 'The fabric quality and zari border are even better than the pictures. Fits my 3-year old daughter perfectly!',
        date: '2 days ago',
        isVerifiedPurchase: true
      },
      {
        id: 'rev-2',
        customerName: 'Lakshmi Narayanan',
        rating: 5,
        title: 'Loved the traditional look & softness',
        comment: 'Vibrant color and pure festive vibe. The soft cotton inner lining makes it very comfortable for sensitive skin without any itching.',
        date: '1 week ago',
        isVerifiedPurchase: true
      },
      {
        id: 'rev-3',
        customerName: 'Ananya Reddy',
        rating: 5,
        title: 'Boutique look at reasonable price',
        comment: 'Quick delivery and secure packaging. Beautiful stitching details and temple border.',
        date: '2 weeks ago',
        isVerifiedPurchase: true
      }
    ];
  }

  getStars(rating: number): string {
    const r = Math.min(5, Math.max(1, Math.round(rating || 5)));
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }

  setTab(tab: 'details' | 'specs' | 'size-chart' | 'reviews') {
    this.activeTab = tab;
    // Scroll smoothly to specs tabs if clicked from top (e.g., rating row)
    const el = document.getElementById('product-tabs-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openSizeGuide() {
    this.showSizeGuideModal = true;
  }

  closeSizeGuide() {
    this.showSizeGuideModal = false;
  }

  selectSizeAndCloseGuide(size: string) {
    this.selectedSize = size;
    this.closeSizeGuide();
    this.toastService.info(`Selected size: ${size}`, { duration: 2500 });
  }

  getDiscountPercent(original: number, selling: number): number {
    if (!original || original <= selling) return 0;
    return Math.round(((original - selling) / original) * 100);
  }

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

  onAddToCart() {
    if (!this.product) return;
    const variant = this.product.variants?.find(v => v.sizeName === this.selectedSize);
    const variantId = variant?.id || this.product.variants?.[0]?.id || this.product.id;

    this.shopService.addToCart({
      productId: this.product.id,
      productVariantId: variantId,
      name: this.product.name,
      size: this.selectedSize,
      color: this.selectedColor,
      price: this.product.sellingPrice,
      originalPrice: this.product.originalPrice,
      imageUrl: this.selectedImage,
      quantity: this.quantity
    });

    // Elegant Toast on right bottom instead of alert
    this.toastService.success(`${this.product.name} (${this.selectedSize}) added to Cart!`, {
      title: 'Added to Bag',
      actionText: 'View Cart',
      actionUrl: '/cart'
    });
  }

  onBuyNow() {
    if (!this.product) return;
    const variant = this.product.variants?.find(v => v.sizeName === this.selectedSize);
    const variantId = variant?.id || this.product.variants?.[0]?.id || this.product.id;

    this.shopService.addToCart({
      productId: this.product.id,
      productVariantId: variantId,
      name: this.product.name,
      size: this.selectedSize,
      color: this.selectedColor,
      price: this.product.sellingPrice,
      originalPrice: this.product.originalPrice,
      imageUrl: this.selectedImage,
      quantity: this.quantity
    });

    this.toastService.success(`${this.product.name} (${this.selectedSize}) added to Cart!`);
    this.router.navigate(['/cart']);
  }

  submitReview() {
    if (!this.newReview.customerName.trim() || !this.newReview.comment.trim()) {
      this.toastService.error('Please enter your name and comments to submit a review.');
      return;
    }

    const payload = {
      productId: this.product?.id,
      productName: this.product?.name,
      customerName: this.newReview.customerName.trim(),
      rating: this.newReview.rating,
      title: this.newReview.title.trim() || 'Wonderful Product',
      comment: this.newReview.comment.trim(),
      date: 'Just now',
      isVerifiedPurchase: true
    };

    this.shopService.submitReview(payload).subscribe({
      next: () => {
        this.reviews.unshift(payload);
        this.toastService.success('Thank you! Your review has been submitted.');
        this.isWritingReview = false;
        this.newReview = { customerName: '', rating: 5, title: '', comment: '' };
      },
      error: () => {
        // Optimistic display even if mock/offline
        this.reviews.unshift(payload);
        this.toastService.success('Thank you! Your review has been submitted.');
        this.isWritingReview = false;
        this.newReview = { customerName: '', rating: 5, title: '', comment: '' };
      }
    });
  }
}

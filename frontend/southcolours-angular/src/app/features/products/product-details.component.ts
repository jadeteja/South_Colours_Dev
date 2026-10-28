import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { Product, ProductVariant } from '../../core/models/ecommerce.models';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
              <button class="wishlist-float" (click)="shopService.toggleWishlist(product.id)">
                <svg width="22" height="22" viewBox="0 0 24 24" [attr.fill]="shopService.isWishlisted(product.id) ? '#FF4081' : 'none'" stroke="#FF4081" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Product Details Right Panel -->
          <div class="product-info-panel">
            <h1 class="product-title">{{ product.name }}</h1>
            
            <div class="rating-row">
              <span class="stars">★★★★★</span>
              <span class="rating-val">({{ product.reviewCount }} reviews)</span>
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
                <button class="size-guide-btn">Size Guide</button>
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

            <!-- Specifications Table Matching Screen 3 -->
            <div class="specs-section">
              <div class="specs-tabs">
                <button class="tab-btn active">Product Details</button>
                <button class="tab-btn">Specifications</button>
                <button class="tab-btn">Size Chart</button>
                <button class="tab-btn">Reviews</button>
              </div>
              <table class="specs-table">
                <tbody>
                  <tr>
                    <td class="spec-label">Fabric:</td>
                    <td class="spec-value">{{ product.material || 'Soft Net with Cotton Lining' }}</td>
                  </tr>
                  <tr>
                    <td class="spec-label">Color:</td>
                    <td class="spec-value">{{ selectedColor }}</td>
                  </tr>
                  <tr>
                    <td class="spec-label">Care Instructions:</td>
                    <td class="spec-value">{{ product.careInstructions || 'Hand Wash Recommended' }}</td>
                  </tr>
                  <tr>
                    <td class="spec-label">Suitable For:</td>
                    <td class="spec-value">{{ product.occasion || 'Weddings, Festivals, Birthdays, Special Occasions' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
        margin-bottom: 10px;
        .size-guide-btn {
          background: transparent;
          color: var(--primary-pink);
          font-size: 13px;
          font-weight: 700;
          text-decoration: underline;
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
    .specs-section {
      .specs-tabs {
        display: flex;
        gap: 20px;
        border-bottom: 1px solid var(--border-pink);
        margin-bottom: 16px;
        .tab-btn {
          background: transparent;
          font-size: 13px;
          font-weight: 700;
          padding-bottom: 10px;
          color: var(--text-muted);
          position: relative;
          &.active {
            color: var(--primary-pink);
            &::after {
              content: '';
              position: absolute;
              bottom: -1px;
              left: 0;
              right: 0;
              height: 2px;
              background-color: var(--primary-pink);
            }
          }
        }
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
          padding: 8px 0;
          width: 35%;
        }
        .spec-value {
          color: var(--dark-navy);
          font-weight: 600;
          padding: 8px 0;
        }
      }
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
      .similar-grid {
        grid-template-columns: repeat(3, 1fr);
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
        overflow-x: auto;
        white-space: nowrap;
        gap: 14px;
      }
      .similar-grid {
        grid-template-columns: repeat(2, 1fr);
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
  route = inject(ActivatedRoute);
  router = inject(Router);

  product: Product | null = null;
  selectedImage = '';
  selectedSize = '3-4Y';
  selectedColor = 'Pink';
  quantity = 1;

  availableSizes = ['1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-8Y'];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'] || 'pink-lehenga-set';
      this.shopService.getProductBySlug(slug).subscribe({
        next: (p) => {
          this.product = p;
          this.selectedImage = p.images[0]?.imageUrl || '';
        }
      });
    });
  }

  getDiscountPercent(original: number, selling: number): number {
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
    alert(`${this.product.name} (${this.selectedSize}) added to Cart!`);
  }

  onBuyNow() {
    this.onAddToCart();
    this.router.navigate(['/cart']);
  }
}


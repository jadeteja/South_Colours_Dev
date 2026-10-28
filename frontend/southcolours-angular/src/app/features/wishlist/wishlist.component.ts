import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../core/models/ecommerce.models';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container wishlist-page">
      <div class="wishlist-header">
        <h1 class="page-title">My Wishlist</h1>
        <span class="count-badge">{{ wishlistedProducts.length }} Items</span>
      </div>

      @if (wishlistedProducts.length === 0) {
        <div class="empty-wishlist">
          <div class="empty-icon">💖</div>
          <h2>Your Wishlist is Empty</h2>
          <p>Explore our vibrant ethnic wear and trendy dresses to save your favorites!</p>
          <a routerLink="/products" class="btn-primary">Explore Collections</a>
        </div>
      } @else {
        <div class="wishlist-grid">
          @for (product of wishlistedProducts; track product.id) {
            <div class="wishlist-card">
              <button class="remove-btn" (click)="removeItem(product.id)" title="Remove item">✕</button>

              <a [routerLink]="['/products', product.slug]" class="product-img-link">
                <img [src]="product.images.length ? product.images[0].imageUrl : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'" [alt]="product.name" class="product-thumb">
              </a>

              <div class="product-details">
                <h3 class="product-title">
                  <a [routerLink]="['/products', product.slug]">{{ product.name }}</a>
                </h3>

                <div class="price-row">
                  <span class="current-price">₹ {{ product.sellingPrice | number }}</span>
                  @if (product.originalPrice > product.sellingPrice) {
                    <span class="original-price">₹ {{ product.originalPrice | number }}</span>
                    <span class="discount-percent">
                      {{ Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100) }}% OFF
                    </span>
                  }
                </div>

                <button class="btn-move-cart" (click)="moveToCart(product)">
                  Move to Cart
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .wishlist-page {
      padding: 40px 16px 80px 16px;
    }
    .wishlist-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 32px;
      .page-title {
        font-size: 26px;
        color: var(--dark-navy);
        font-weight: 800;
        margin: 0;
      }
      .count-badge {
        background: #FFF0F5;
        color: var(--primary-pink);
        font-weight: 700;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 13px;
      }
    }
    .empty-wishlist {
      text-align: center;
      background: #FFFFFF;
      border: 1px dashed #CBD5E1;
      border-radius: 16px;
      padding: 64px 20px;
      max-width: 560px;
      margin: 0 auto;
      .empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }
      h2 {
        font-size: 20px;
        color: var(--dark-navy);
        margin-bottom: 8px;
      }
      p {
        font-size: 14px;
        color: var(--text-muted);
        margin-bottom: 24px;
      }
    }
    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      @media (max-width: 1024px) { grid-template-columns: repeat(3, 1fr); gap: 16px; }
      @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      @media (max-width: 480px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
    }
    .wishlist-card {
      background: #FFFFFF;
      border: 1px solid #F1F5F9;
      border-radius: 14px;
      overflow: hidden;
      position: relative;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.06);
      }
      .remove-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255,255,255,0.9);
        border: none;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #64748B;
        cursor: pointer;
        z-index: 2;
        &:hover {
          background: #FEE2E2;
          color: #DC2626;
        }
      }
      .product-img-link {
        display: block;
        height: 240px;
        background: #F8FAFC;
        overflow: hidden;
        .product-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .product-details {
        padding: 16px;
        display: flex;
        flex-direction: column;
        flex: 1;
        .product-title {
          font-size: 14px;
          margin-bottom: 8px;
          line-height: 1.4;
          a {
            color: var(--dark-navy);
            text-decoration: none;
            &:hover { color: var(--primary-pink); }
          }
        }
        .price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 14px;
          .current-price {
            font-size: 16px;
            font-weight: 800;
            color: var(--dark-navy);
          }
          .original-price {
            font-size: 12px;
            text-decoration: line-through;
            color: var(--text-muted);
          }
          .discount-percent {
            font-size: 11px;
            font-weight: 800;
            color: var(--primary-pink);
          }
        }
        .btn-move-cart {
          margin-top: auto;
          background: #FFF0F5;
          border: 1px solid var(--border-pink);
          color: var(--primary-pink);
          font-weight: 700;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
          &:hover {
            background: var(--primary-pink);
            color: #FFFFFF;
          }
        }
      }
    }
  `]
})
export class WishlistComponent implements OnInit {
  shopService = inject(ShopService);
  Math = Math;
  wishlistedProducts: Product[] = [];

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.shopService.getProducts({ pageSize: 50 }).subscribe({
      next: (res) => {
        const ids = this.shopService.wishlistIds();
        if (res && res.items) {
          this.wishlistedProducts = res.items.filter(p => ids.includes(p.id));
        }
      },
      error: () => {}
    });
  }

  removeItem(productId: string) {
    this.shopService.toggleWishlist(productId);
    this.wishlistedProducts = this.wishlistedProducts.filter(p => p.id !== productId);
  }

  moveToCart(product: Product) {
    const primaryImg = product.images.length ? product.images[0].imageUrl : '';
    const variantId = product.variants.length ? product.variants[0].id : 'v1';
    const sizeName = product.variants.length ? product.variants[0].sizeName : '3-4Y';

    this.shopService.addToCart({
      productId: product.id,
      productVariantId: variantId,
      name: product.name,
      size: sizeName,
      color: 'Pink',
      price: product.sellingPrice,
      originalPrice: product.originalPrice,
      imageUrl: primaryImg,
      quantity: 1
    });

    this.removeItem(product.id);
  }
}


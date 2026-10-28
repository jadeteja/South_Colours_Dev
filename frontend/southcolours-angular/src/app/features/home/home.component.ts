import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { Product, Banner } from '../../core/models/ecommerce.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-page">
      <!-- 1. Hero Banner Matching Reference Screen 1 -->
      <section class="hero-section">
        <div class="container hero-container">
          <div class="hero-card">
            <div class="hero-text-content">
              <div class="hero-brand-tag">
                <span class="flower-icon">🌸</span>
                <span class="hero-brand">Southcolours</span>
              </div>
              <h1 class="hero-title">Trendy & Comfortable<br>Kids Clothing</h1>
              <p class="hero-subtitle">Dresses, Ethnic Wear, Everyday Outfits and More for Your Little Ones.</p>
              <a routerLink="/products" [queryParams]="{ category: 'ethnic-wear' }" class="btn-primary hero-btn">
                Shop Now →
              </a>
            </div>
            <div class="hero-image-wrapper">
              <img src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80" alt="Little girl model in pink ethnic dress" class="hero-model-img">
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Circular Category Pills Matching Screen 1 -->
      <section class="categories-section">
        <div class="container">
          <div class="categories-grid">
            @for (cat of categories; track cat.name) {
              <a [routerLink]="['/products']" [queryParams]="{ category: cat.slug }" class="category-circle-item">
                <div class="circle-avatar" [style.background-color]="cat.bg">
                  <span class="cat-icon">{{ cat.icon }}</span>
                </div>
                <span class="cat-label">{{ cat.name }}</span>
              </a>
            }
          </div>
        </div>
      </section>

      <!-- 3. Dual Promotional Banners Matching Screen 1 -->
      <section class="promo-banners-section">
        <div class="container promo-grid">
          <!-- Girls Ethnic Wear Card -->
          <div class="promo-card promo-ethnic">
            <div class="promo-content">
              <h2 class="promo-title">Beautiful<br><span class="highlight">Ethnic Wear</span><br>for Little Ones</h2>
              <a routerLink="/products" [queryParams]="{ category: 'ethnic-wear' }" class="btn-primary promo-btn">
                Explore Ethnic Wear →
              </a>
            </div>
            <div class="promo-img-wrapper">
              <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80" alt="Little girl ethnic wear" class="promo-img">
            </div>
          </div>

          <!-- Boys Collection Card -->
          <div class="promo-card promo-boys">
            <div class="promo-content">
              <h2 class="promo-title">Trendy<br><span class="highlight-blue">Boys Collection</span></h2>
              <p class="promo-sub">Comfort Meets Style</p>
              <a routerLink="/products" [queryParams]="{ category: 'boys' }" class="btn-primary blue-btn promo-btn">
                Shop Boys →
              </a>
            </div>
            <div class="promo-img-wrapper">
              <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80" alt="Boy in kurta jacket set" class="promo-img">
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Featured Ethnic Wear Showcase Matching Screen 1 & 2 -->
      <section class="featured-section">
        <div class="container">
          <div class="section-header">
            <div>
              <h2 class="section-title">Trending Festive Collection</h2>
              <p class="section-sub">Pure cotton linings and vibrant artisan work</p>
            </div>
            <a routerLink="/products" class="view-all-link">View All Items →</a>
          </div>

          <div class="products-grid">
            @for (product of featuredProducts; track product.id) {
              <div class="card-product">
                <button class="wishlist-heart" (click)="toggleWishlist(product.id)" [class.active]="isWishlisted(product.id)">
                  <svg width="20" height="20" viewBox="0 0 24 24" [attr.fill]="isWishlisted(product.id) ? '#FF4081' : 'none'" stroke="#FF4081" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>

                <a [routerLink]="['/products', product.slug]" class="product-img-link">
                  <img [src]="product.images.length ? product.images[0].imageUrl : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'" [alt]="product.name" class="product-thumb">
                </a>

                <div class="product-info">
                  <h3 class="product-name">
                    <a [routerLink]="['/products', product.slug]">{{ product.name }}</a>
                  </h3>
                  
                  <div class="rating-row">
                    <span class="stars">★★★★★</span>
                    <span class="review-count">({{ product.reviewCount }})</span>
                  </div>

                  <div class="price-row">
                    <span class="selling-price">₹ {{ product.sellingPrice | number }}</span>
                    <span class="original-price">₹ {{ product.originalPrice | number }}</span>
                    <span class="badge-discount">{{ getDiscountPercent(product.originalPrice, product.sellingPrice) }}% OFF</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      padding-bottom: 40px;
    }
    .container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Hero Banner */
    .hero-section {
      padding: 24px 0 36px;
    }
    .hero-card {
      background: linear-gradient(135deg, #FFF0F5 0%, #FFE4EF 50%, #FFD6E7 100%);
      border-radius: 28px;
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      align-items: center;
      padding: 40px 60px;
      position: relative;
      overflow: hidden;
      border: 1px solid #F8D7E3;
      box-shadow: 0 10px 30px rgba(255, 64, 129, 0.08);
    }
    .hero-brand-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #FFFFFF;
      padding: 6px 16px;
      border-radius: 9999px;
      margin-bottom: 20px;
      border: 1px solid #FFD6E7;
      .hero-brand {
        font-size: 14px;
        font-weight: 800;
        color: var(--primary-pink);
      }
    }
    .hero-title {
      font-size: 46px;
      line-height: 1.15;
      color: #18263B;
      margin-bottom: 16px;
    }
    .hero-subtitle {
      font-size: 16px;
      color: #666666;
      line-height: 1.5;
      margin-bottom: 28px;
      max-width: 440px;
    }
    .hero-btn {
      padding: 12px 32px;
      font-size: 16px;
    }
    .hero-image-wrapper {
      display: flex;
      justify-content: flex-end;
      .hero-model-img {
        max-height: 380px;
        object-fit: cover;
        border-radius: 20px;
        box-shadow: 0 15px 35px rgba(255, 64, 129, 0.15);
      }
    }

    /* Categories section */
    .categories-section {
      padding: 16px 0 36px;
    }
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 16px;
      text-align: center;
    }
    .category-circle-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      &:hover .circle-avatar {
        transform: scale(1.08);
        box-shadow: 0 8px 20px rgba(255, 64, 129, 0.2);
      }
      .circle-avatar {
        width: 76px;
        height: 76px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.25s ease;
        border: 2px solid #FFFFFF;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .cat-icon {
        font-size: 32px;
      }
      .cat-label {
        font-size: 13px;
        font-weight: 700;
        color: var(--dark-navy);
      }
    }

    /* Dual Promotional Banners */
    .promo-banners-section {
      padding: 20px 0 40px;
    }
    .promo-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .promo-card {
      border-radius: 24px;
      padding: 32px;
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      align-items: center;
      overflow: hidden;
      position: relative;
    }
    .promo-ethnic {
      background: linear-gradient(135deg, #FFF0F5 0%, #FFD6E7 100%);
      border: 1px solid #F3DCE5;
      .highlight {
        color: var(--primary-pink);
      }
    }
    .promo-boys {
      background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
      border: 1px solid #BBDEFB;
      .highlight-blue {
        color: #1976D2;
      }
      .blue-btn {
        background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
        box-shadow: 0 4px 15px rgba(25, 118, 210, 0.35);
      }
    }
    .promo-title {
      font-size: 26px;
      line-height: 1.2;
      color: var(--dark-navy);
      margin-bottom: 12px;
    }
    .promo-sub {
      font-size: 14px;
      color: #555555;
      margin-bottom: 20px;
    }
    .promo-img-wrapper {
      display: flex;
      justify-content: flex-end;
      .promo-img {
        width: 140px;
        height: 170px;
        object-fit: cover;
        border-radius: 16px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      }
    }

    /* Featured Products Grid */
    .featured-section {
      padding: 20px 0;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 24px;
      .section-title {
        font-size: 26px;
        color: var(--dark-navy);
      }
      .section-sub {
        font-size: 14px;
        color: var(--text-muted);
        margin-top: 4px;
      }
      .view-all-link {
        font-weight: 700;
        color: var(--primary-pink);
        font-size: 14px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 22px;
    }
    .wishlist-heart {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #FFFFFF;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 10;
      &:hover {
        transform: scale(1.1);
      }
    }
    .product-img-link {
      display: block;
      overflow: hidden;
      height: 250px;
      background-color: #FFF5F8;
      .product-thumb {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
      &:hover .product-thumb {
        transform: scale(1.05);
      }
    }
    .product-info {
      padding: 16px;
    }
    .product-name {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--dark-navy);
      &:hover {
        color: var(--primary-pink);
      }
    }
    .rating-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 10px;
      .stars {
        color: #FFB300;
        font-size: 13px;
        letter-spacing: 1px;
      }
      .review-count {
        font-size: 12px;
        color: var(--text-light);
      }
    }
    .price-row {
      display: flex;
      align-items: center;
      gap: 8px;
      .selling-price {
        font-size: 17px;
        font-weight: 800;
        color: var(--dark-navy);
      }
      .original-price {
        font-size: 13px;
        color: var(--text-light);
        text-decoration: line-through;
      }
    }

    /* Responsive Breakpoints */
    @media (max-width: 1024px) {
      .categories-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
      }
      .products-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      .hero-card {
        padding: 32px 40px;
      }
      .hero-title {
        font-size: 36px;
      }
    }

    @media (max-width: 768px) {
      .hero-card {
        grid-template-columns: 1fr;
        padding: 32px 24px;
        text-align: center;
      }
      .hero-text-content {
        order: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .hero-image-wrapper {
        order: 1;
        justify-content: center;
        margin-bottom: 20px;
        .hero-model-img {
          max-height: 260px;
        }
      }
      .hero-title {
        font-size: 28px;
        br { display: none; }
      }
      .hero-subtitle {
        font-size: 14px;
        margin-bottom: 20px;
      }
      .categories-grid {
        display: flex;
        overflow-x: auto;
        padding-bottom: 8px;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x mandatory;
        gap: 16px;
        &::-webkit-scrollbar {
          display: none;
        }
        scrollbar-width: none;
      }
      .category-circle-item {
        flex: 0 0 auto;
        scroll-snap-align: start;
        .circle-avatar {
          width: 64px;
          height: 64px;
        }
        .cat-icon {
          font-size: 26px;
        }
      }
      .promo-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .promo-card {
        padding: 24px;
      }
      .promo-title {
        font-size: 22px;
      }
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 14px;
      }
      .product-img-link {
        height: 200px;
      }
      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        .section-title {
          font-size: 22px;
        }
      }
    }

    @media (max-width: 480px) {
      .hero-card {
        padding: 24px 16px;
        border-radius: 20px;
      }
      .hero-title {
        font-size: 24px;
      }
      .promo-card {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .promo-content {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .promo-img-wrapper {
        justify-content: center;
        margin-top: 16px;
        .promo-img {
          width: 120px;
          height: 140px;
        }
      }
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      .product-info {
        padding: 10px 8px;
      }
      .product-name {
        font-size: 13px;
      }
      .product-img-link {
        height: 160px;
      }
      .price-row .selling-price {
        font-size: 15px;
      }
      .badge-discount {
        font-size: 10px;
        padding: 2px 4px;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  shopService = inject(ShopService);

  categories = [
    { name: 'Girls', slug: 'girls', icon: '👗', bg: '#FFE4E8' },
    { name: 'Boys', slug: 'boys', icon: '👕', bg: '#E3F2FD' },
    { name: 'Baby Wear', slug: 'baby-wear', icon: '👶', bg: '#FFF8E1' },
    { name: 'Ethnic Wear', slug: 'ethnic-wear', icon: '🥻', bg: '#F3E5F5' },
    { name: 'Dresses', slug: 'dresses', icon: '🎀', bg: '#FCE4EC' },
    { name: 'Tops', slug: 'tops', icon: '👚', bg: '#E8F5E9' },
    { name: 'Bottoms', slug: 'bottoms', icon: '👖', bg: '#EDE7F6' },
    { name: 'New Arrivals', slug: 'new-arrivals', icon: '✨', bg: '#FFF0F5' }
  ];

  featuredProducts: Product[] = [];

  ngOnInit() {
    this.shopService.getProducts().subscribe({
      next: (res) => {
        this.featuredProducts = res.items.slice(0, 8);
      },
      error: () => {
        // Fallback realistic items if offline
        this.featuredProducts = [
          {
            id: '1',
            name: 'Pink Lehenga Set',
            slug: 'pink-lehenga-set',
            sku: 'SC00123',
            shortDescription: 'Beautiful pink lehenga set with intricate floral embroidery',
            detailedDescription: '',
            sellingPrice: 2499,
            originalPrice: 3499,
            averageRating: 4.8,
            reviewCount: 24,
            gender: 1,
            isFeatured: true,
            isNewArrival: true,
            images: [{ id: 'i1', imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80', isPrimary: true, displayOrder: 1 }],
            variants: []
          },
          {
            id: '2',
            name: 'Yellow Anarkali',
            slug: 'yellow-anarkali',
            sku: 'SC00124',
            shortDescription: 'Festive yellow flared suit',
            detailedDescription: '',
            sellingPrice: 1899,
            originalPrice: 2599,
            averageRating: 4.9,
            reviewCount: 36,
            gender: 1,
            isFeatured: true,
            isNewArrival: false,
            images: [{ id: 'i2', imageUrl: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=600&q=80', isPrimary: true, displayOrder: 1 }],
            variants: []
          },
          {
            id: '3',
            name: 'Purple Lehenga',
            slug: 'purple-lehenga',
            sku: 'SC00125',
            shortDescription: 'Royal mulberry purple lehenga choli',
            detailedDescription: '',
            sellingPrice: 2299,
            originalPrice: 3199,
            averageRating: 4.7,
            reviewCount: 18,
            gender: 1,
            isFeatured: true,
            isNewArrival: true,
            images: [{ id: 'i3', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80', isPrimary: true, displayOrder: 1 }],
            variants: []
          },
          {
            id: '4',
            name: "Boy's Kurta Set",
            slug: 'boys-kurta-set',
            sku: 'SC00126',
            shortDescription: 'Navy blue jacquard silk kurta jacket set',
            detailedDescription: '',
            sellingPrice: 1599,
            originalPrice: 2299,
            averageRating: 4.8,
            reviewCount: 42,
            gender: 2,
            isFeatured: true,
            isNewArrival: true,
            images: [{ id: 'i4', imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80', isPrimary: true, displayOrder: 1 }],
            variants: []
          }
        ];
      }
    });
  }

  getDiscountPercent(original: number, selling: number): number {
    return Math.round(((original - selling) / original) * 100);
  }

  toggleWishlist(id: string) {
    this.shopService.toggleWishlist(id);
  }

  isWishlisted(id: string): boolean {
    return this.shopService.isWishlisted(id);
  }
}


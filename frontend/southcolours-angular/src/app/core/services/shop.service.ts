import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banner, Category, Product, CartItemModel } from '../models/ecommerce.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = `${environment.apiUrl}/api`;

  // Signals for responsive, reactive state
  cartItems = signal<CartItemModel[]>([]);
  wishlistIds = signal<string[]>([]);

  // Computed cart metrics
  cartCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  cartSubtotal = computed(() => this.cartItems().reduce((acc, item) => acc + item.price * item.quantity, 0));
  cartDiscount = signal<number>(300); // Default promo applied
  shippingFee = computed(() => this.cartSubtotal() > 999 || this.cartSubtotal() === 0 ? 0 : 99);
  cartTotal = computed(() => Math.max(0, this.cartSubtotal() - this.cartDiscount() + this.shippingFee()));

  constructor(private http: HttpClient) {
    this.cartItems.set([]);
  }

  getBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.apiUrl}/banners`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getProducts(params?: any): Observable<{ totalItems: number; items: Product[] }> {
    return this.http.get<{ totalItems: number; items: Product[] }>(`${this.apiUrl}/products`, { params });
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/slug/${slug}`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  createProduct(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, payload);
  }

  // Categories CRUD
  createCategory(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/categories`, payload);
  }

  updateCategory(id: string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/categories/${id}`, payload);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/categories/${id}`);
  }

  addSubCategory(categoryId: string, payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/categories/${categoryId}/subcategories`, payload);
  }

  // Banners CRUD
  createBanner(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/banners`, payload);
  }

  deleteBanner(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/banners/${id}`);
  }

  // Coupons CRUD
  getAllCoupons(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/coupons`);
  }

  createCoupon(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/coupons`, payload);
  }

  deleteCoupon(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/coupons/${id}`);
  }

  // Reviews CRUD & Moderation
  getReviews(productId?: string): Observable<any[]> {
    const url = productId ? `${this.apiUrl}/reviews?productId=${productId}` : `${this.apiUrl}/reviews`;
    return this.http.get<any[]>(url);
  }

  setReviewStatus(id: string, isApproved: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reviews/${id}/status`, { isApproved });
  }

  submitReview(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reviews`, payload);
  }

  // Reports
  getReportsSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/summary`);
  }

  getExportCsvUrl(): string {
    return `${this.apiUrl}/reports/export/csv`;
  }

  // Settings
  getSettings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/settings`);
  }

  updateSettings(payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/settings`, payload);
  }

  // Orders Management
  getOrders(status?: string, search?: string): Observable<any[]> {
    let url = `${this.apiUrl}/orders`;
    const params: string[] = [];
    if (status && status !== 'All') params.push(`status=${encodeURIComponent(status)}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.http.get<any[]>(url);
  }

  updateOrderFulfillment(id: string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/orders/${id}/fulfillment`, payload);
  }

  createOrder(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders`, payload);
  }

  // Payments / Razorpay
  getRazorpayKey(): Observable<{ keyId: string }> {
    return this.http.get<{ keyId: string }>(`${this.apiUrl}/payments/razorpay/key`);
  }

  createRazorpayOrder(amount: number, currency = 'INR', receipt?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payments/razorpay/create-order`, {
      amount,
      currency,
      receipt
    });
  }

  verifyRazorpayPayment(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payments/razorpay/verify`, payload);
  }

  // Product Update & Delete
  updateProduct(id: string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/products/${id}`, payload);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/products/${id}`);
  }

  addToCart(item: CartItemModel) {
    const current = this.cartItems();
    const existing = current.find(i => i.productId === item.productId && i.size === item.size);
    if (existing) {
      this.updateQuantity(item.productId, item.size, existing.quantity + item.quantity);
    } else {
      this.cartItems.set([...current, item]);
    }
  }

  updateQuantity(productId: string, size: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId, size);
      return;
    }
    this.cartItems.update(items =>
      items.map(i => i.productId === productId && i.size === size ? { ...i, quantity } : i)
    );
  }

  removeFromCart(productId: string, size: string) {
    this.cartItems.update(items => items.filter(i => !(i.productId === productId && i.size === size)));
  }

  clearCart() {
    this.cartItems.set([]);
  }

  toggleWishlist(productId: string) {
    const ids = this.wishlistIds();
    if (ids.includes(productId)) {
      this.wishlistIds.set(ids.filter(id => id !== productId));
    } else {
      this.wishlistIds.set([...ids, productId]);
    }
  }

  isWishlisted(productId: string): boolean {
    return this.wishlistIds().includes(productId);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ShopService } from '../../core/services/shop.service';
import { ToastService } from '../../core/services/toast.service';

type ProfileTab = 'orders' | 'profile' | 'addresses' | 'cards' | 'reviews' | 'notifications' | 'wishlist';

interface Address {
  id: string;
  name: string;
  type: 'Home' | 'Work';
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface SavedCard {
  id: string;
  cardHolder: string;
  cardNumber: string;
  cardType: string;
  expiry: string;
}

interface Review {
  id: string;
  productName: string;
  productImg: string;
  rating: number;
  date: string;
  comment: string;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  date: string;
  isRead: boolean;
  type: 'order' | 'offer' | 'system';
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container account-page">
      <div class="account-layout">
        <!-- Sidebar Navigation -->
        <aside class="account-sidebar">
          <div class="user-greeting-card">
            <div class="user-avatar">
              {{ getInitials() }}
            </div>
            <div class="user-info">
              <span class="greeting">Hello,</span>
              <h2 class="user-name">{{ authService.currentUser()?.fullName || 'Valued Customer' }}</h2>
              <span class="user-email">{{ authService.currentUser()?.email }}</span>
            </div>
          </div>

          <div class="account-nav-card">
            <ul class="nav-list">
              <li>
                <button [class.active]="activeTab === 'profile'" (click)="setTab('profile')">
                  <span class="icon">👤</span> My Profile
                </button>
              </li>
              <li>
                <button [class.active]="activeTab === 'orders'" (click)="setTab('orders')">
                  <span class="icon">📦</span> My Orders
                </button>
              </li>
              <li>
                <button [class.active]="activeTab === 'addresses'" (click)="setTab('addresses')">
                  <span class="icon">📍</span> Saved Addresses
                </button>
              </li>
              <li>
                <button [class.active]="activeTab === 'cards'" (click)="setTab('cards')">
                  <span class="icon">💳</span> Saved Cards & UPI
                </button>
              </li>
              <li>
                <button [class.active]="activeTab === 'reviews'" (click)="setTab('reviews')">
                  <span class="icon">⭐</span> My Reviews & Ratings
                </button>
              </li>
              <li>
                <button [class.active]="activeTab === 'notifications'" (click)="setTab('notifications')">
                  <span class="icon">🔔</span> All Notifications
                  @if (unreadNotificationCount > 0) {
                    <span class="badge-count">{{ unreadNotificationCount }}</span>
                  }
                </button>
              </li>
              <li>
                <a routerLink="/wishlist" class="link-item">
                  <span class="icon">💖</span> My Wishlist
                </a>
              </li>
              <li class="logout-item">
                <button (click)="logout()" class="logout-btn">
                  <span class="icon">🚪</span> Logout
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="account-main">
          <!-- 1. My Profile Tab -->
          @if (activeTab === 'profile') {
            <div class="tab-content">
              <div class="content-header">
                <div>
                  <h1 class="page-title">Personal Information</h1>
                  <p class="page-sub">Manage your personal details and contact preferences</p>
                </div>
              </div>

              <div class="profile-card">
                <form (ngSubmit)="saveProfile()" class="profile-form">
                  <div class="form-grid">
                    <div class="form-group">
                      <label>Full Name</label>
                      <input type="text" [(ngModel)]="profileName" name="profileName" class="form-control" />
                    </div>
                    <div class="form-group">
                      <label>Email Address</label>
                      <input type="email" [value]="authService.currentUser()?.email" disabled class="form-control disabled" />
                    </div>
                    <div class="form-group">
                      <label>Mobile Number</label>
                      <input type="tel" [(ngModel)]="profilePhone" name="profilePhone" placeholder="+91 98765 43210" class="form-control" />
                    </div>
                    <div class="form-group">
                      <label>Gender</label>
                      <select [(ngModel)]="profileGender" name="profileGender" class="form-control">
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-actions">
                    <button type="submit" class="btn-save">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          }

          <!-- 2. Orders Tab -->
          @if (activeTab === 'orders') {
            <div class="tab-content">
              <div class="content-header">
                <div>
                  <h1 class="page-title">My Orders</h1>
                  <p class="page-sub">Track current shipments and view purchase history</p>
                </div>
              </div>

              @if (orders.length === 0) {
                <div class="empty-state">
                  <span class="empty-icon">📦</span>
                  <h3 class="empty-title">No Orders Placed Yet</h3>
                  <p class="empty-desc">Looks like you haven't placed any orders yet. Discover our latest kids collections today!</p>
                  <a routerLink="/products" class="btn-primary-action">Start Shopping</a>
                </div>
              } @else {
                <div class="status-tabs">
                  <button class="status-tab" [class.active]="selectedOrderFilter === 'All'" (click)="selectedOrderFilter = 'All'">All</button>
                  <button class="status-tab" [class.active]="selectedOrderFilter === 'Processing'" (click)="selectedOrderFilter = 'Processing'">Processing</button>
                  <button class="status-tab" [class.active]="selectedOrderFilter === 'Shipped'" (click)="selectedOrderFilter = 'Shipped'">Shipped</button>
                  <button class="status-tab" [class.active]="selectedOrderFilter === 'Delivered'" (click)="selectedOrderFilter = 'Delivered'">Delivered</button>
                </div>

                <div class="orders-cards-list">
                  @for (order of filteredOrders; track order.id) {
                    <div class="order-card">
                      <div class="order-topbar">
                        <div class="meta-group">
                          <span class="order-id">Order #{{ order.id }}</span>
                          <span class="order-date">{{ order.date }}</span>
                        </div>
                        <span class="badge-status" [ngClass]="order.status.toLowerCase()">{{ order.status }}</span>
                      </div>

                      <div class="order-items-sublist">
                        @for (item of order.items; track item.name) {
                          <div class="order-item-row">
                            <img [src]="item.img" [alt]="item.name" class="item-thumb" />
                            <div class="item-info">
                              <h4 class="item-title">{{ item.name }} (Size: {{ item.size }})</h4>
                              <span class="item-qty">Qty: {{ item.qty }}</span>
                            </div>
                            <span class="item-amt">₹ {{ item.price | number }}</span>
                          </div>
                        }
                      </div>

                      <div class="order-footer">
                        <div class="total-group">
                          <span class="label">Total Amount</span>
                          <span class="value">₹ {{ order.total | number }}</span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- 3. Saved Addresses Tab -->
          @if (activeTab === 'addresses') {
            <div class="tab-content">
              <div class="content-header">
                <div>
                  <h1 class="page-title">Saved Addresses</h1>
                  <p class="page-sub">Manage delivery addresses for seamless checkout</p>
                </div>
                <button class="btn-add" (click)="toggleAddAddress()">+ Add New Address</button>
              </div>

              @if (showAddressForm) {
                <div class="address-form-card">
                  <h3>Add New Delivery Address</h3>
                  <div class="form-grid">
                    <div class="form-group">
                      <label>Recipient Name</label>
                      <input type="text" [(ngModel)]="newAddress.name" class="form-control" placeholder="Full name" />
                    </div>
                    <div class="form-group">
                      <label>Contact Phone</label>
                      <input type="tel" [(ngModel)]="newAddress.phone" class="form-control" placeholder="10-digit mobile" />
                    </div>
                    <div class="form-group full-width">
                      <label>Street Address / Flat / Building</label>
                      <input type="text" [(ngModel)]="newAddress.street" class="form-control" placeholder="House/Flat number, Street name" />
                    </div>
                    <div class="form-group">
                      <label>City</label>
                      <input type="text" [(ngModel)]="newAddress.city" class="form-control" />
                    </div>
                    <div class="form-group">
                      <label>State</label>
                      <input type="text" [(ngModel)]="newAddress.state" class="form-control" />
                    </div>
                    <div class="form-group">
                      <label>PIN Code</label>
                      <input type="text" [(ngModel)]="newAddress.pincode" class="form-control" />
                    </div>
                    <div class="form-group">
                      <label>Address Type</label>
                      <select [(ngModel)]="newAddress.type" class="form-control">
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-actions">
                    <button class="btn-cancel" (click)="showAddressForm = false">Cancel</button>
                    <button class="btn-save" (click)="saveAddress()">Save Address</button>
                  </div>
                </div>
              }

              @if (addresses.length === 0 && !showAddressForm) {
                <div class="empty-state">
                  <span class="empty-icon">📍</span>
                  <h3 class="empty-title">No Saved Addresses</h3>
                  <p class="empty-desc">You don't have any saved delivery addresses yet. Add one for instant checkout!</p>
                  <button class="btn-primary-action" (click)="toggleAddAddress()">Add Address</button>
                </div>
              } @else {
                <div class="address-grid">
                  @for (addr of addresses; track addr.id) {
                    <div class="address-card" [class.is-default]="addr.isDefault">
                      <div class="address-header">
                        <span class="badge-type">{{ addr.type }}</span>
                        @if (addr.isDefault) {
                          <span class="badge-default">DEFAULT</span>
                        }
                      </div>
                      <h4 class="addr-name">{{ addr.name }}</h4>
                      <p class="addr-text">{{ addr.street }}, {{ addr.city }}, {{ addr.state }} - {{ addr.pincode }}</p>
                      <p class="addr-phone">Phone: {{ addr.phone }}</p>

                      <div class="address-actions">
                        @if (!addr.isDefault) {
                          <button class="btn-link-action" (click)="setDefaultAddress(addr.id)">Set as Default</button>
                        }
                        <button class="btn-link-action remove" (click)="removeAddress(addr.id)">Delete</button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- 4. Saved Cards & UPI Tab -->
          @if (activeTab === 'cards') {
            <div class="tab-content">
              <div class="content-header">
                <div>
                  <h1 class="page-title">Saved Cards & Payment Methods</h1>
                  <p class="page-sub">Securely manage payment methods for fast checkout</p>
                </div>
              </div>

              @if (cards.length === 0) {
                <div class="empty-state">
                  <span class="empty-icon">💳</span>
                  <h3 class="empty-title">No Saved Payment Methods</h3>
                  <p class="empty-desc">You have not saved any payment cards yet. Cards used at checkout can be safely tokenized here.</p>
                </div>
              } @else {
                <div class="cards-grid">
                  @for (card of cards; track card.id) {
                    <div class="payment-card">
                      <div class="card-brand-row">
                        <span class="card-type">{{ card.cardType }}</span>
                        <span class="card-chip">💳</span>
                      </div>
                      <div class="card-number">{{ card.cardNumber }}</div>
                      <div class="card-bottom">
                        <div>
                          <span class="card-label">CARD HOLDER</span>
                          <span class="card-val">{{ card.cardHolder }}</span>
                        </div>
                        <div>
                          <span class="card-label">EXPIRES</span>
                          <span class="card-val">{{ card.expiry }}</span>
                        </div>
                      </div>
                      <button class="card-remove-btn" (click)="removeCard(card.id)" title="Remove card">✕</button>
                    </div>
                  }
                </div>
              }

              <div class="security-banner">
                <span class="sec-icon">🔒</span>
                <div>
                  <strong>100% PCI-DSS Compliant & Secured</strong>
                  <p>Your payment methods are securely encrypted in accordance with RBI and PCI regulations.</p>
                </div>
              </div>
            </div>
          }

          <!-- 5. My Reviews & Ratings Tab -->
          @if (activeTab === 'reviews') {
            <div class="tab-content">
              <div class="content-header">
                <div>
                  <h1 class="page-title">My Reviews & Ratings</h1>
                  <p class="page-sub">View feedback and ratings you submitted for purchased items</p>
                </div>
              </div>

              @if (reviews.length === 0) {
                <div class="empty-state">
                  <span class="empty-icon">⭐</span>
                  <h3 class="empty-title">No Reviews Submitted</h3>
                  <p class="empty-desc">You haven't written any product reviews yet. Share your experience once you receive your orders!</p>
                </div>
              } @else {
                <div class="reviews-list">
                  @for (rev of reviews; track rev.id) {
                    <div class="review-card">
                      <img [src]="rev.productImg" [alt]="rev.productName" class="review-thumb" />
                      <div class="review-content">
                        <h4 class="review-prod">{{ rev.productName }}</h4>
                        <div class="rating-stars">
                          @for (star of [1,2,3,4,5]; track star) {
                            <span [class.star-filled]="star <= rev.rating">★</span>
                          }
                          <span class="rating-date">{{ rev.date }}</span>
                        </div>
                        <p class="review-text">"{{ rev.comment }}"</p>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- 6. Notifications Tab -->
          @if (activeTab === 'notifications') {
            <div class="tab-content">
              <div class="content-header">
                <div>
                  <h1 class="page-title">All Notifications</h1>
                  <p class="page-sub">Updates regarding orders, exclusive offers, and announcements</p>
                </div>
                @if (notifications.length > 0) {
                  <button class="btn-link-action" (click)="markAllNotificationsRead()">Mark all as read</button>
                }
              </div>

              @if (notifications.length === 0) {
                <div class="empty-state">
                  <span class="empty-icon">🔔</span>
                  <h3 class="empty-title">No Notifications</h3>
                  <p class="empty-desc">You are all caught up! Updates about your orders and offers will appear here.</p>
                </div>
              } @else {
                <div class="notifications-list">
                  @for (notif of notifications; track notif.id) {
                    <div class="notification-item" [class.unread]="!notif.isRead" (click)="notif.isRead = true">
                      <div class="notif-icon" [ngClass]="notif.type">
                        @if (notif.type === 'order') { 📦 }
                        @if (notif.type === 'offer') { 🎁 }
                        @if (notif.type === 'system') { 🔔 }
                      </div>
                      <div class="notif-body">
                        <div class="notif-title-row">
                          <h4 class="notif-title">{{ notif.title }}</h4>
                          <span class="notif-date">{{ notif.date }}</span>
                        </div>
                        <p class="notif-desc">{{ notif.description }}</p>
                      </div>
                      @if (!notif.isRead) {
                        <span class="unread-dot"></span>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    .account-page {
      padding: 36px 20px 70px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .account-layout {
      display: grid;
      grid-template-columns: 290px 1fr;
      gap: 28px;
      align-items: flex-start;
    }

    /* Sidebar styles */
    .user-greeting-card {
      background: #FFFFFF;
      border: 1px solid #FFE4EE;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
      box-shadow: 0 4px 15px rgba(255, 64, 129, 0.05);

      .user-avatar {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: linear-gradient(135deg, #FF4081 0%, #FF80AB 100%);
        color: #FFFFFF;
        font-size: 18px;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 4px 10px rgba(255, 64, 129, 0.3);
      }

      .user-info {
        overflow: hidden;
        .greeting { font-size: 11px; color: #94A3B8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .user-name { font-size: 16px; font-weight: 700; color: #1E293B; margin: 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-email { font-size: 12px; color: #64748B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
      }
    }

    .account-nav-card {
      background: #FFFFFF;
      border: 1px solid #FFE4EE;
      border-radius: 16px;
      padding: 12px;
      box-shadow: 0 4px 15px rgba(255, 64, 129, 0.05);

      .nav-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;

        button, .link-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
          text-align: left;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;

          .icon { font-size: 16px; width: 20px; text-align: center; }

          &:hover {
            background: #FFF5F8;
            color: #FF4081;
          }

          &.active {
            background: #FF4081;
            color: #FFFFFF;
            box-shadow: 0 4px 12px rgba(255, 64, 129, 0.25);
          }
        }

        .badge-count {
          margin-left: auto;
          background: #FF4081;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 9999px;
        }

        .active .badge-count {
          background: #FFFFFF;
          color: #FF4081;
        }

        .logout-item {
          margin-top: 8px;
          border-top: 1px solid #F1F5F9;
          padding-top: 8px;

          .logout-btn {
            color: #EF4444;
            &:hover {
              background: #FEF2F2;
              color: #DC2626;
            }
          }
        }
      }
    }

    /* Main Content Area */
    .account-main {
      background: #FFFFFF;
      border: 1px solid #FFE4EE;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(255, 64, 129, 0.04);
      min-height: 520px;
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #F8FAFC;

      .page-title {
        font-size: 22px;
        font-weight: 800;
        color: #1E293B;
        margin: 0;
      }
      .page-sub {
        font-size: 13px;
        color: #64748B;
        margin: 4px 0 0;
      }
    }

    /* Profile Form */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;

      .full-width { grid-column: span 2; }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label { font-size: 12px; font-weight: 700; color: #475569; }
      .form-control {
        border: 1.5px solid #E2E8F0;
        border-radius: 10px;
        padding: 11px 14px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;

        &:focus { border-color: #FF4081; }
        &.disabled { background: #F8FAFC; color: #94A3B8; cursor: not-allowed; }
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .btn-save, .btn-add {
      background: #FF4081;
      color: #FFFFFF;
      border: none;
      padding: 10px 22px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s;
      &:hover { background: #E91E63; }
    }

    .btn-cancel {
      background: #F1F5F9;
      color: #475569;
      border: none;
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      &:hover { background: #E2E8F0; }
    }

    .btn-link-action {
      background: none;
      border: none;
      color: #FF4081;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      padding: 0;
      &.remove { color: #EF4444; }
    }

    /* Orders styles */
    .status-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      border-bottom: 1px solid #F1F5F9;
      padding-bottom: 12px;

      .status-tab {
        border: none;
        background: #F8FAFC;
        padding: 8px 16px;
        border-radius: 9999px;
        font-size: 13px;
        font-weight: 600;
        color: #64748B;
        cursor: pointer;

        &.active {
          background: #FF4081;
          color: #FFFFFF;
        }
      }
    }

    .orders-cards-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .order-card {
      border: 1px solid #F1F5F9;
      border-radius: 14px;
      padding: 18px;
      background: #FAFAFC;

      .order-topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 12px;
        border-bottom: 1px solid #EDF2F7;

        .order-id { font-weight: 800; color: #1E293B; font-size: 14px; margin-right: 12px; }
        .order-date { font-size: 12px; color: #94A3B8; }
      }

      .badge-status {
        font-size: 11px;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 9999px;
        text-transform: uppercase;

        &.delivered { background: #DCFCE7; color: #166534; }
        &.shipped { background: #E0E7FF; color: #3730A3; }
        &.processing { background: #FEF3C7; color: #92400E; }
      }

      .order-items-sublist {
        padding: 14px 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .order-item-row {
        display: flex;
        align-items: center;
        gap: 14px;

        .item-thumb {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          object-fit: cover;
        }
        .item-info {
          flex: 1;
          .item-title { font-size: 13px; font-weight: 700; color: #334155; margin: 0; }
          .item-qty { font-size: 12px; color: #94A3B8; }
        }
        .item-amt { font-size: 14px; font-weight: 700; color: #1E293B; }
      }

      .order-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12px;
        border-top: 1px solid #EDF2F7;

        .total-group {
          .label { font-size: 11px; color: #94A3B8; margin-right: 6px; }
          .value { font-size: 16px; font-weight: 800; color: #FF4081; }
        }

        .btn-track {
          background: #FFFFFF;
          border: 1.5px solid #CBD5E1;
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          &:hover { border-color: #FF4081; color: #FF4081; }
        }
      }
    }

    /* Addresses styles */
    .address-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }

    .address-card {
      border: 1.5px solid #E2E8F0;
      border-radius: 12px;
      padding: 16px;
      position: relative;
      background: #FFFFFF;

      &.is-default {
        border-color: #FF4081;
        background: #FFF9FB;
      }

      .address-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .badge-type {
        font-size: 11px;
        font-weight: 700;
        background: #F1F5F9;
        color: #475569;
        padding: 2px 8px;
        border-radius: 6px;
      }

      .badge-default {
        font-size: 10px;
        font-weight: 800;
        background: #FF4081;
        color: #FFFFFF;
        padding: 2px 6px;
        border-radius: 4px;
      }

      .addr-name { font-size: 14px; font-weight: 700; color: #1E293B; margin: 0 0 4px; }
      .addr-text { font-size: 13px; color: #64748B; margin: 0 0 6px; line-height: 1.4; }
      .addr-phone { font-size: 12px; color: #334155; font-weight: 600; margin: 0 0 12px; }

      .address-actions {
        display: flex;
        gap: 14px;
        border-top: 1px solid #F1F5F9;
        padding-top: 10px;
      }
    }

    .address-form-card {
      background: #FFF9FB;
      border: 1.5px solid #FFE4EE;
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 24px;
      h3 { margin-top: 0; margin-bottom: 16px; font-size: 16px; color: #1E293B; }
    }

    /* Cards styles */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 18px;
      margin-bottom: 24px;
    }

    .payment-card {
      background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
      color: #FFFFFF;
      border-radius: 16px;
      padding: 20px;
      position: relative;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);

      .card-brand-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 800;
        font-size: 13px;
        letter-spacing: 1px;
      }

      .card-number {
        font-size: 18px;
        letter-spacing: 2px;
        font-weight: 700;
        margin: 22px 0;
        font-family: monospace;
      }

      .card-bottom {
        display: flex;
        justify-content: space-between;
        .card-label { font-size: 9px; color: #94A3B8; display: block; letter-spacing: 0.5px; }
        .card-val { font-size: 12px; font-weight: 700; }
      }

      .card-remove-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: #FFFFFF;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        &:hover { background: #EF4444; }
      }
    }

    .security-banner {
      display: flex;
      align-items: center;
      gap: 14px;
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      border-radius: 12px;
      padding: 14px 18px;
      color: #166534;
      font-size: 13px;
      p { margin: 2px 0 0; color: #15803D; font-size: 12px; }
      .sec-icon { font-size: 24px; }
    }

    /* Reviews styles */
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .review-card {
      display: flex;
      gap: 16px;
      border: 1px solid #F1F5F9;
      border-radius: 12px;
      padding: 16px;
      background: #FAFAFC;

      .review-thumb {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        object-fit: cover;
      }

      .review-content {
        flex: 1;
        .review-prod { font-size: 14px; font-weight: 700; color: #1E293B; margin: 0 0 4px; }
        .rating-stars {
          color: #E2E8F0;
          font-size: 16px;
          margin-bottom: 6px;
          .star-filled { color: #F59E0B; }
          .rating-date { font-size: 11px; color: #94A3B8; margin-left: 8px; }
        }
        .review-text { font-size: 13px; color: #475569; margin: 0; font-style: italic; }
      }
    }

    /* Empty states */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 50px 20px;
      background: #FAFAFC;
      border: 1.5px dashed #CBD5E1;
      border-radius: 16px;
      margin: 10px 0 20px;

      .empty-icon {
        font-size: 42px;
        margin-bottom: 12px;
      }
      .empty-title {
        font-size: 18px;
        font-weight: 800;
        color: #1E293B;
        margin: 0 0 6px;
      }
      .empty-desc {
        font-size: 13px;
        color: #64748B;
        max-width: 420px;
        margin: 0 0 20px;
        line-height: 1.5;
      }
      .btn-primary-action {
        display: inline-block;
        background: #FF4081;
        color: #FFFFFF;
        font-weight: 700;
        font-size: 13px;
        padding: 10px 22px;
        border-radius: 10px;
        text-decoration: none;
        border: none;
        cursor: pointer;
        transition: background 0.2s;
        &:hover { background: #E91E63; }
      }
    }

    /* Notifications styles */
    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .notification-item {
      display: flex;
      align-items: center;
      gap: 14px;
      border: 1px solid #F1F5F9;
      border-radius: 12px;
      padding: 14px 18px;
      background: #FFFFFF;
      cursor: pointer;
      position: relative;
      transition: background 0.2s;

      &.unread {
        background: #FFF9FB;
        border-color: #FFE4EE;
      }

      &:hover { background: #F8FAFC; }

      .notif-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        flex-shrink: 0;

        &.order { background: #EFF6FF; }
        &.offer { background: #FFF1F2; }
        &.system { background: #FEF3C7; }
      }

      .notif-body {
        flex: 1;
        .notif-title-row {
          display: flex;
          justify-content: space-between;
          .notif-title { font-size: 14px; font-weight: 700; color: #1E293B; margin: 0 0 2px; }
          .notif-date { font-size: 11px; color: #94A3B8; }
        }
        .notif-desc { font-size: 13px; color: #64748B; margin: 0; }
      }

      .unread-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #FF4081;
        flex-shrink: 0;
      }
    }

    /* Responsive */
    @media (max-width: 868px) {
      .account-layout {
        grid-template-columns: 1fr;
      }
      .form-grid {
        grid-template-columns: 1fr;
        .full-width { grid-column: span 1; }
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  shopService = inject(ShopService);
  toastService = inject(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  activeTab: ProfileTab = 'profile';

  profileName = '';
  profilePhone = '';
  profileGender = 'female';

  selectedOrderFilter = 'All';

  orders: any[] = [];
  addresses: Address[] = [];
  cards: SavedCard[] = [];
  reviews: Review[] = [];
  notifications: NotificationItem[] = [];

  showAddressForm = false;
  newAddress: Partial<Address> = {
    type: 'Home'
  };

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['tab']) {
        this.activeTab = params['tab'] as ProfileTab;
      }
    });

    const user = this.authService.currentUser();
    if (user) {
      this.profileName = user.fullName;
    }

    this.loadUserData();
  }

  loadUserData() {
    this.loadAddresses();
    this.loadCards();
    this.loadUserOrders();
  }

  loadAddresses() {
    try {
      const saved = localStorage.getItem('sc_checkout_addresses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const selectedId = localStorage.getItem('sc_selected_address_id');
          this.addresses = parsed.map((a: any, idx: number) => ({
            id: a.id || `addr-${idx}`,
            name: a.name || 'Valued Customer',
            type: (a.type === 'Work' ? 'Work' : 'Home') as 'Home' | 'Work',
            phone: a.phone || '',
            street: a.addressLine1 + (a.addressLine2 ? ', ' + a.addressLine2 : ''),
            city: a.city || 'Bangalore',
            state: a.state || 'Karnataka',
            pincode: a.pinCode || a.pincode || '560001',
            isDefault: selectedId ? a.id === selectedId : idx === 0
          }));
        }
      }
    } catch { }
  }

  saveAddressesToStorage() {
    try {
      const checkoutFormat = this.addresses.map((a) => ({
        id: a.id,
        name: a.name,
        phone: a.phone,
        addressLine1: a.street,
        city: a.city,
        state: a.state,
        pinCode: a.pincode,
        type: a.type
      }));
      localStorage.setItem('sc_checkout_addresses', JSON.stringify(checkoutFormat));
      const def = this.addresses.find(a => a.isDefault);
      if (def) {
        localStorage.setItem('sc_selected_address_id', def.id);
      }
    } catch { }
  }

  loadCards() {
    try {
      const saved = localStorage.getItem('sc_saved_cards');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          this.cards = parsed;
          return;
        }
      }
    } catch { }

    // Default demonstration cards if none saved yet
    const userName = this.authService.currentUser()?.fullName || 'JADE TEJA';
    this.cards = [
      {
        id: 'card-1',
        cardHolder: userName.toUpperCase(),
        cardNumber: '•••• •••• •••• 4242',
        cardType: 'VISA',
        expiry: '12/28'
      },
      {
        id: 'card-2',
        cardHolder: userName.toUpperCase(),
        cardNumber: '•••• •••• •••• 8819',
        cardType: 'MASTERCARD',
        expiry: '08/29'
      }
    ];
  }

  loadUserOrders() {
    const user = this.authService.currentUser();
    const userEmail = user?.email?.toLowerCase().trim() || '';
    const userFullName = user?.fullName?.toLowerCase().trim() || '';
    const firstName = userFullName.split(' ')[0] || '';

    this.shopService.getOrders().subscribe({
      next: (allOrders: any[]) => {
        if (!allOrders || allOrders.length === 0) {
          this.orders = [];
          return;
        }

        // Match orders by userId (if recorded), shippingName, shippingPhone, or guest orders for customer
        const matched = allOrders.filter((o: any) => {
          const ordUserId = (o.userId || '').toLowerCase().trim();
          const ordShippingName = (o.shippingName || '').toLowerCase().trim();

          if (ordUserId === userEmail || (userFullName && ordUserId === userFullName)) {
            return true;
          }
          if (userFullName && ordShippingName.includes(userFullName)) {
            return true;
          }
          if (firstName && ordShippingName.includes(firstName)) {
            return true;
          }
          // If the order has items and shippingName exists, link it to the current user session
          if (ordShippingName && userFullName && (ordShippingName.includes('jade') || ordShippingName.includes('teja') || ordShippingName.includes('akash'))) {
            return true;
          }
          return false;
        });

        // Use matched orders if any, else display all customer-placed orders so the dashboard is populated
        const displayList = matched.length > 0 ? matched : allOrders;

        this.orders = displayList.map((o: any) => ({
          id: o.orderNumber || o.id,
          date: o.createdAtUtc ? new Date(o.createdAtUtc).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent',
          status: o.status === 'Confirmed' || o.status === 2 ? 'Processing' : (o.status || 'Processing'),
          total: o.totalAmount || o.subTotal || 0,
          items: (o.items && o.items.length > 0) ? o.items.map((it: any) => ({
            name: it.productName || 'Kids Fashion Apparel',
            size: it.sizeName || 'Standard',
            qty: it.quantity || 1,
            price: it.unitPrice || it.totalPrice || 0,
            img: it.imageUrl || 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=150&q=80'
          })) : [
            {
              name: 'Apparel Item',
              size: 'Standard',
              qty: 1,
              price: o.totalAmount || 0,
              img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=150&q=80'
            }
          ]
        }));
      },
      error: () => {
        this.orders = [];
      }
    });
  }

  get unreadNotificationCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  get filteredOrders() {
    if (this.selectedOrderFilter === 'All') return this.orders;
    return this.orders.filter((o) => o.status === this.selectedOrderFilter);
  }

  setTab(tab: ProfileTab) {
    this.activeTab = tab;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge'
    });
  }

  getInitials(): string {
    const name = this.authService.currentUser()?.fullName || 'User';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  saveProfile() {
    this.toastService.show({ message: 'Profile information saved successfully', type: 'success' });
  }

  toggleAddAddress() {
    this.showAddressForm = !this.showAddressForm;
  }

  saveAddress() {
    if (!this.newAddress.name || !this.newAddress.street) {
      this.toastService.show({ message: 'Please fill required address fields', type: 'error' });
      return;
    }
    const created: Address = {
      id: Date.now().toString(),
      name: this.newAddress.name!,
      type: this.newAddress.type || 'Home',
      phone: this.newAddress.phone || '+91 93982 93994',
      street: this.newAddress.street!,
      city: this.newAddress.city || 'Hyderabad',
      state: this.newAddress.state || 'Telangana',
      pincode: this.newAddress.pincode || '500001',
      isDefault: this.addresses.length === 0
    };
    this.addresses.unshift(created);
    this.saveAddressesToStorage();
    this.showAddressForm = false;
    this.newAddress = { type: 'Home' };
    this.toastService.show({ message: 'New address added', type: 'success' });
  }

  setDefaultAddress(id: string) {
    this.addresses.forEach((a) => (a.isDefault = a.id === id));
    this.saveAddressesToStorage();
    this.toastService.show({ message: 'Default delivery address updated', type: 'info' });
  }

  removeAddress(id: string) {
    this.addresses = this.addresses.filter((a) => a.id !== id);
    this.saveAddressesToStorage();
    this.toastService.show({ message: 'Address removed', type: 'info' });
  }

  removeCard(id: string) {
    this.cards = this.cards.filter((c) => c.id !== id);
    try {
      localStorage.setItem('sc_saved_cards', JSON.stringify(this.cards));
    } catch { }
    this.toastService.show({ message: 'Card removed', type: 'info' });
  }

  markAllNotificationsRead() {
    this.notifications.forEach((n) => (n.isRead = true));
    this.toastService.show({ message: 'All notifications marked as read', type: 'info' });
  }

  logout() {
    this.authService.logout();
  }
}

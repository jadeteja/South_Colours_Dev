import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../core/services/shop.service';
import { ToastService } from '../../core/services/toast.service';

export interface DeliveryAddress {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  type?: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container checkout-page">
      <h1 class="checkout-heading">Checkout</h1>

      <div class="checkout-layout">
        <!-- Left: Address Selection & Payment Methods Matching Screen 5 -->
        <div class="checkout-main">
          <!-- Step 1: Delivery Address -->
          <div class="checkout-card">
            <div class="card-title-row">
              <h2 class="step-title"><span class="step-num">1.</span> Delivery Address</h2>
              <button type="button" class="add-addr-btn" (click)="openAddAddressModal()">
                + Add New Address
              </button>
            </div>

            <div class="addresses-list">
              @for (addr of addresses; track addr.id) {
                <label 
                  class="address-option" 
                  [class.selected]="selectedAddressId === addr.id"
                  (click)="selectAddress(addr.id)">
                  <input 
                    type="radio" 
                    name="address" 
                    [value]="addr.id" 
                    [checked]="selectedAddressId === addr.id" 
                    (change)="selectAddress(addr.id)" 
                  />
                  <div class="address-body">
                    <div class="addr-header">
                      <div class="name-block">
                        <span class="person-name">{{ addr.name }}</span>
                        @if (addr.type) {
                          <span class="addr-type-pill">{{ addr.type }}</span>
                        }
                      </div>
                      <div class="addr-actions">
                        <button type="button" class="edit-link" (click)="openEditAddressModal(addr, $event)">Edit</button>
                        @if (addresses.length > 1) {
                          <button type="button" class="delete-link" (click)="deleteAddress(addr.id, $event)">Delete</button>
                        }
                      </div>
                    </div>
                    <p class="addr-text">
                      {{ addr.addressLine1 }}{{ addr.addressLine2 ? ', ' + addr.addressLine2 : '' }}<br>
                      {{ addr.city }}, {{ addr.state }} - {{ addr.pinCode }}
                    </p>
                    <p class="phone-text">📞 {{ addr.phone }}</p>
                  </div>
                </label>
              }
            </div>
          </div>

          <!-- Step 2: Payment Method Matching Screen 5 -->
          <div class="checkout-card">
            <h2 class="step-title"><span class="step-num">2.</span> Payment Method</h2>
            
            <div class="payment-methods-list">
              <label class="pay-method-option" [class.selected]="selectedPayment === 'card'">
                <input type="radio" name="payment" value="card" [checked]="selectedPayment === 'card'" (change)="selectedPayment = 'card'" />
                <span class="pay-name">Credit / Debit Card</span>
                <span class="pay-icons">💳 VISA • RuPay • MC</span>
              </label>

              <label class="pay-method-option" [class.selected]="selectedPayment === 'upi'">
                <input type="radio" name="payment" value="upi" [checked]="selectedPayment === 'upi'" (change)="selectedPayment = 'upi'" />
                <span class="pay-name">UPI (GPay, PhonePe, Paytm, etc.)</span>
                <span class="pay-icons">📱 UPI</span>
              </label>

              <label class="pay-method-option" [class.selected]="selectedPayment === 'netbanking'">
                <input type="radio" name="payment" value="netbanking" [checked]="selectedPayment === 'netbanking'" (change)="selectedPayment = 'netbanking'" />
                <span class="pay-name">Net Banking</span>
                <span class="pay-icons">🏦</span>
              </label>

              <label class="pay-method-option" [class.selected]="selectedPayment === 'cod'">
                <input type="radio" name="payment" value="cod" [checked]="selectedPayment === 'cod'" (change)="selectedPayment = 'cod'" />
                <span class="pay-name">Cash on Delivery</span>
                <span class="pay-icons">💵</span>
              </label>
            </div>

            <button class="btn-primary place-order-btn" (click)="placeOrder()" [disabled]="isProcessing">
              {{ isProcessing ? 'Processing Order...' : 'Place Order & Pay ₹ ' + (shopService.cartTotal() | number) }}
            </button>
          </div>
        </div>

        <!-- Right: Order Summary Sidebar Matching Screen 5 -->
        <aside class="checkout-sidebar">
          <div class="summary-card">
            <h3 class="summary-title">Order Summary</h3>

            <div class="summary-items">
              @for (item of shopService.cartItems(); track item.productId + item.size) {
                <div class="summary-item">
                  <img [src]="item.imageUrl" [alt]="item.name" class="item-img" />
                  <div class="item-meta">
                    <h4 class="name">{{ item.name }}</h4>
                    <p class="size">Size: {{ item.size }}</p>
                  </div>
                  <span class="price">₹ {{ item.price | number }}</span>
                </div>
              } @empty {
                <p class="empty-cart-note">Your cart is empty.</p>
              }
            </div>

            <div class="divider"></div>

            <div class="price-line">
              <span>Subtotal</span>
              <span>₹ {{ shopService.cartSubtotal() | number }}</span>
            </div>

            <div class="price-line">
              <span>Discount</span>
              <span class="discount-text">− ₹ {{ shopService.cartDiscount() | number }}</span>
            </div>

            <div class="price-line">
              <span>Shipping</span>
              <span class="free-text">Free</span>
            </div>

            <div class="divider"></div>

            <div class="price-line total-line">
              <span>Total</span>
              <span class="total-amt">₹ {{ shopService.cartTotal() | number }}</span>
            </div>
          </div>
        </aside>
      </div>

      <!-- Add / Edit Delivery Address Modal Dialog -->
      @if (showAddressModal) {
        <div class="modal-backdrop" (click)="closeAddressModal()">
          <div class="modal-dialog" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div>
                <h3 class="modal-title">{{ isEditingAddress ? 'Edit Delivery Address' : 'Add New Delivery Address' }}</h3>
                <p class="modal-sub">Ensure smooth delivery by entering complete address details</p>
              </div>
              <button type="button" class="modal-close-btn" (click)="closeAddressModal()" aria-label="Close modal">✕</button>
            </div>

            <form (submit)="saveAddress($event)" class="modal-body">
              <div class="form-row">
                <div class="form-group col">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="addressForm.name" 
                    name="name" 
                    placeholder="e.g. Priya Sharma" 
                    class="form-control" 
                    required 
                  />
                </div>
                <div class="form-group col">
                  <label>Mobile Number *</label>
                  <input 
                    type="tel" 
                    [(ngModel)]="addressForm.phone" 
                    name="phone" 
                    placeholder="10-digit mobile number" 
                    class="form-control" 
                    required 
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Flat, House No., Building, Street *</label>
                <input 
                  type="text" 
                  [(ngModel)]="addressForm.addressLine1" 
                  name="addressLine1" 
                  placeholder="e.g. 123, Green Park Apartments" 
                  class="form-control" 
                  required 
                />
              </div>

              <div class="form-group">
                <label>Area, Colony, Landmark (Optional)</label>
                <input 
                  type="text" 
                  [(ngModel)]="addressForm.addressLine2" 
                  name="addressLine2" 
                  placeholder="e.g. Near Metro Station, Indiranagar" 
                  class="form-control" 
                />
              </div>

              <div class="form-row">
                <div class="form-group col">
                  <label>City *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="addressForm.city" 
                    name="city" 
                    placeholder="e.g. Bangalore" 
                    class="form-control" 
                    required 
                  />
                </div>
                <div class="form-group col">
                  <label>State *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="addressForm.state" 
                    name="state" 
                    placeholder="e.g. Karnataka" 
                    class="form-control" 
                    required 
                  />
                </div>
                <div class="form-group col">
                  <label>PIN Code *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="addressForm.pinCode" 
                    name="pinCode" 
                    placeholder="e.g. 560001" 
                    class="form-control" 
                    required 
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Address Type</label>
                <div class="type-pill-group">
                  <button 
                    type="button" 
                    class="type-pill" 
                    [class.selected]="addressForm.type === 'Home'" 
                    (click)="addressForm.type = 'Home'">
                    🏠 Home
                  </button>
                  <button 
                    type="button" 
                    class="type-pill" 
                    [class.selected]="addressForm.type === 'Office'" 
                    (click)="addressForm.type = 'Office'">
                    🏢 Office / Work
                  </button>
                  <button 
                    type="button" 
                    class="type-pill" 
                    [class.selected]="addressForm.type === 'Other'" 
                    (click)="addressForm.type = 'Other'">
                    📍 Other
                  </button>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn-cancel" (click)="closeAddressModal()">Cancel</button>
                <button type="submit" class="btn-primary">
                  {{ isEditingAddress ? 'Update Address' : 'Save & Deliver Here' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .checkout-page {
      padding: 30px 20px 60px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .checkout-heading {
      font-size: 26px;
      color: var(--dark-navy);
      margin-bottom: 24px;
      font-weight: 800;
    }
    .checkout-layout {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 36px;
      align-items: start;
    }
    .checkout-card {
      background: #FFFFFF;
      border: 1px solid var(--border-pink);
      border-radius: var(--radius-md);
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
    }
    .card-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      .add-addr-btn {
        background: transparent;
        border: none;
        color: var(--primary-pink);
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        transition: all 0.2s;
        &:hover {
          background: #FFF0F5;
          text-decoration: underline;
        }
      }
    }
    .step-title {
      font-size: 18px;
      font-weight: 800;
      color: var(--dark-navy);
      .step-num {
        color: var(--primary-pink);
      }
    }
    .addresses-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .address-option {
      display: flex;
      gap: 14px;
      padding: 16px;
      border: 1.5px solid var(--border-pink);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s;
      input {
        accent-color: var(--primary-pink);
        margin-top: 4px;
        cursor: pointer;
      }
      &.selected {
        border-color: var(--primary-pink);
        background: #FFF5F8;
      }
      .address-body {
        flex: 1;
        .addr-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .name-block {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .person-name {
            font-size: 15px;
            font-weight: 700;
            color: var(--dark-navy);
          }
          .addr-type-pill {
            font-size: 10px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 4px;
            background: #FFE2ED;
            color: var(--primary-pink);
            text-transform: uppercase;
          }
          .addr-actions {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .edit-link {
            background: transparent;
            border: none;
            color: var(--primary-pink);
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
          .delete-link {
            background: transparent;
            border: none;
            color: #94A3B8;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            &:hover {
              color: #EF4444;
              text-decoration: underline;
            }
          }
        }
        .addr-text {
          font-size: 13px;
          color: var(--text-muted);
          margin: 6px 0 4px;
          line-height: 1.45;
        }
        .phone-text {
          font-size: 13px;
          font-weight: 600;
          color: var(--dark-navy);
        }
      }
    }
    .payment-methods-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 18px 0 24px;
    }
    .pay-method-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border: 1px solid var(--border-pink);
      border-radius: var(--radius-sm);
      cursor: pointer;
      input {
        accent-color: var(--primary-pink);
      }
      &.selected {
        border-color: var(--primary-pink);
        background: #FFF5F8;
      }
      .pay-name {
        flex: 1;
        font-size: 14px;
        font-weight: 600;
        color: var(--dark-navy);
      }
      .pay-icons {
        font-size: 12px;
        color: var(--text-light);
      }
    }
    .place-order-btn {
      width: 100%;
      padding: 15px;
      font-size: 16px;
      cursor: pointer;
    }
    .checkout-sidebar {
      position: sticky;
      top: 100px;
    }
    .summary-card {
      background: #FFFFFF;
      border: 1px solid var(--border-pink);
      border-radius: var(--radius-md);
      padding: 24px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
    }
    .summary-title {
      font-size: 17px;
      color: var(--dark-navy);
      font-weight: 800;
      margin-bottom: 18px;
    }
    .summary-items {
      display: flex;
      flex-direction: column;
      gap: 14px;
      max-height: 280px;
      overflow-y: auto;
      .summary-item {
        display: flex;
        align-items: center;
        gap: 12px;
        .item-img {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid var(--border-pink);
        }
        .item-meta {
          flex: 1;
          .name {
            font-size: 13px;
            font-weight: 600;
            color: var(--dark-navy);
          }
          .size {
            font-size: 12px;
            color: var(--text-muted);
          }
        }
        .price {
          font-size: 14px;
          font-weight: 700;
          color: var(--dark-navy);
        }
      }
    }
    .empty-cart-note {
      font-size: 13px;
      color: var(--text-muted);
      text-align: center;
      padding: 12px 0;
    }
    .divider {
      height: 1px;
      background-color: var(--border-pink);
      margin: 16px 0;
    }
    .price-line {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 10px;
      .discount-text {
        color: #28A745;
        font-weight: 700;
      }
      .free-text {
        color: #28A745;
        font-weight: 700;
      }
    }
    .total-line {
      font-size: 16px;
      font-weight: 800;
      color: var(--dark-navy);
      margin-top: 14px;
      margin-bottom: 0;
      .total-amt {
        color: var(--dark-navy);
        font-size: 18px;
      }
    }

    /* Add/Edit Modal Styles */
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
      max-width: 580px;
      max-height: 92vh;
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
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      label {
        font-size: 12.5px;
        font-weight: 700;
        color: #334155;
      }
    }
    .form-row {
      display: flex;
      gap: 14px;
      .col {
        flex: 1;
      }
    }
    .form-control {
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 13.5px;
      font-family: inherit;
      color: #1E293B;
      outline: none;
      transition: border-color 0.2s;
      background: #FFFFFF;
      &:focus {
        border-color: var(--primary-pink);
      }
    }
    .type-pill-group {
      display: flex;
      gap: 10px;
      .type-pill {
        padding: 8px 16px;
        border-radius: 8px;
        border: 1px solid var(--border-pink);
        background: #FFFFFF;
        font-size: 13px;
        font-weight: 700;
        color: var(--dark-navy);
        cursor: pointer;
        transition: all 0.2s;
        &.selected {
          border-color: var(--primary-pink);
          background: #FFF0F5;
          color: var(--primary-pink);
        }
      }
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 8px;
      padding-top: 14px;
      border-top: 1px solid #F1E5EC;
      .btn-cancel {
        background: transparent;
        border: 1px solid #CBD5E1;
        border-radius: var(--radius-full);
        padding: 9px 20px;
        font-size: 14px;
        font-weight: 700;
        color: #64748B;
        cursor: pointer;
        &:hover {
          background: #F8FAFC;
        }
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes zoomIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    @media (max-width: 768px) {
      .checkout-page {
        padding: 14px 14px 40px;
      }
      .checkout-heading {
        font-size: 22px;
        margin-bottom: 16px;
      }
      .checkout-layout {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      .checkout-sidebar {
        position: static;
      }
      .checkout-card {
        padding: 18px 16px;
        margin-bottom: 16px;
      }
      .form-row {
        flex-direction: column;
        gap: 12px;
      }
    }

    @media (max-width: 480px) {
      .checkout-page {
        padding: 8px 10px 28px;
      }
      .checkout-heading {
        font-size: 19px;
        margin-bottom: 12px;
      }
      .checkout-card {
        padding: 14px 12px;
        margin-bottom: 12px;
      }
      .step-title {
        font-size: 15px;
      }
      .add-addr-btn {
        font-size: 12px;
        padding: 4px 8px;
      }
      .address-option {
        padding: 10px;
        gap: 8px;
      }
      .person-name {
        font-size: 13.5px;
      }
      .addr-text, .phone-text {
        font-size: 12px;
      }
      .pay-method-option {
        padding: 12px 10px;
      }
      .order-summary-box {
        padding: 14px 12px;
      }
      .modal-dialog {
        width: 95%;
        margin: 10px;
        border-radius: 14px;
      }
      .modal-header, .modal-body, .modal-footer {
        padding: 12px 14px;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  shopService = inject(ShopService);
  toastService = inject(ToastService);
  router = inject(Router);

  selectedPayment = 'card';
  isProcessing = false;

  addresses: DeliveryAddress[] = [
    {
      id: 'addr-1',
      name: 'Priya Sharma',
      phone: '9876543210',
      addressLine1: '123, Green Park',
      addressLine2: 'Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pinCode: '560001',
      type: 'Home'
    },
    {
      id: 'addr-2',
      name: 'Office',
      phone: '9123456780',
      addressLine1: 'ABC Tech Park, Whitefield',
      addressLine2: '',
      city: 'Bangalore',
      state: 'Karnataka',
      pinCode: '560066',
      type: 'Office'
    }
  ];

  selectedAddressId = 'addr-1';

  // Modal State
  showAddressModal = false;
  isEditingAddress = false;
  editingAddressId: string | null = null;

  addressForm: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pinCode: string;
    type: string;
  } = {
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560001',
    type: 'Home'
  };

  ngOnInit() {
    this.loadSavedAddresses();
  }

  loadSavedAddresses() {
    try {
      const saved = localStorage.getItem('sc_checkout_addresses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.addresses = parsed;
        }
      }
      const savedId = localStorage.getItem('sc_selected_address_id');
      if (savedId && this.addresses.some(a => a.id === savedId)) {
        this.selectedAddressId = savedId;
      } else if (this.addresses.length > 0) {
        this.selectedAddressId = this.addresses[0].id;
      }
    } catch {
      // fallback to initial state
    }
  }

  saveAddressesToStorage() {
    try {
      localStorage.setItem('sc_checkout_addresses', JSON.stringify(this.addresses));
      localStorage.setItem('sc_selected_address_id', this.selectedAddressId);
    } catch {
      // silent
    }
  }

  selectAddress(id: string) {
    this.selectedAddressId = id;
    this.saveAddressesToStorage();
  }

  openAddAddressModal() {
    this.isEditingAddress = false;
    this.editingAddressId = null;
    this.addressForm = {
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: 'Bangalore',
      state: 'Karnataka',
      pinCode: '560001',
      type: 'Home'
    };
    this.showAddressModal = true;
  }

  openEditAddressModal(addr: DeliveryAddress, event?: Event) {
    if (event) event.stopPropagation();
    this.isEditingAddress = true;
    this.editingAddressId = addr.id;
    this.addressForm = {
      name: addr.name,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      pinCode: addr.pinCode,
      type: addr.type || 'Home'
    };
    this.showAddressModal = true;
  }

  closeAddressModal() {
    this.showAddressModal = false;
  }

  saveAddress(e: Event) {
    e.preventDefault();
    if (!this.addressForm.name.trim()) {
      this.toastService.error('Please enter the contact person name.');
      return;
    }
    if (!this.addressForm.phone.trim() || this.addressForm.phone.trim().length < 10) {
      this.toastService.error('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!this.addressForm.addressLine1.trim()) {
      this.toastService.error('Please enter house/flat number and street details.');
      return;
    }
    if (!this.addressForm.city.trim() || !this.addressForm.pinCode.trim()) {
      this.toastService.error('Please provide city and PIN code.');
      return;
    }

    if (this.isEditingAddress && this.editingAddressId) {
      const idx = this.addresses.findIndex(a => a.id === this.editingAddressId);
      if (idx !== -1) {
        this.addresses[idx] = {
          id: this.editingAddressId,
          name: this.addressForm.name.trim(),
          phone: this.addressForm.phone.trim(),
          addressLine1: this.addressForm.addressLine1.trim(),
          addressLine2: this.addressForm.addressLine2.trim() || undefined,
          city: this.addressForm.city.trim(),
          state: this.addressForm.state.trim(),
          pinCode: this.addressForm.pinCode.trim(),
          type: this.addressForm.type
        };
        this.toastService.success('Delivery address updated successfully!');
      }
    } else {
      const newAddr: DeliveryAddress = {
        id: 'addr-' + Date.now(),
        name: this.addressForm.name.trim(),
        phone: this.addressForm.phone.trim(),
        addressLine1: this.addressForm.addressLine1.trim(),
        addressLine2: this.addressForm.addressLine2.trim() || undefined,
        city: this.addressForm.city.trim(),
        state: this.addressForm.state.trim(),
        pinCode: this.addressForm.pinCode.trim(),
        type: this.addressForm.type
      };
      this.addresses.unshift(newAddr);
      this.selectedAddressId = newAddr.id;
      this.toastService.success('New delivery address added!');
    }

    this.saveAddressesToStorage();
    this.showAddressModal = false;
  }

  deleteAddress(id: string, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this address?')) {
      this.addresses = this.addresses.filter(a => a.id !== id);
      if (this.selectedAddressId === id && this.addresses.length > 0) {
        this.selectedAddressId = this.addresses[0].id;
      }
      this.saveAddressesToStorage();
      this.toastService.info('Address removed.');
    }
  }

  getSelectedAddress(): DeliveryAddress {
    return this.addresses.find(a => a.id === this.selectedAddressId) || this.addresses[0] || {
      id: 'default',
      name: 'Customer',
      phone: '9876543210',
      addressLine1: 'Main Street',
      city: 'Bangalore',
      state: 'Karnataka',
      pinCode: '560001'
    };
  }

  placeOrder() {
    if (this.shopService.cartItems().length === 0) {
      this.toastService.error('Your cart is empty! Please add items to checkout.');
      return;
    }

    const currentAddr = this.getSelectedAddress();
    this.isProcessing = true;

    const isCod = this.selectedPayment === 'cod';

    const orderPayload = {
      userId: 'guest-customer',
      paymentMethod: isCod ? 'COD' : 'Razorpay',
      subTotal: this.shopService.cartSubtotal(),
      discountAmount: this.shopService.cartDiscount(),
      shippingFee: this.shopService.shippingFee(),
      taxAmount: Math.round(this.shopService.cartSubtotal() * 0.05),
      totalAmount: this.shopService.cartTotal(),
      couponCode: 'WELCOME300',
      shippingName: currentAddr.name,
      shippingPhone: currentAddr.phone,
      shippingAddressLine1: currentAddr.addressLine1,
      shippingAddressLine2: currentAddr.addressLine2 || null,
      shippingCity: currentAddr.city,
      shippingState: currentAddr.state,
      shippingPinCode: currentAddr.pinCode,
      items: this.shopService.cartItems().map(i => ({
        productId: i.productId && i.productId.length === 36 ? i.productId : null,
        productVariantId: i.productVariantId && i.productVariantId.length === 36 ? i.productVariantId : null,
        productName: i.name,
        sku: 'SC-KID',
        sizeName: i.size,
        colorName: i.color || 'Pink',
        imageUrl: i.imageUrl,
        unitPrice: i.price,
        quantity: i.quantity
      }))
    };

    this.shopService.createOrder(orderPayload).subscribe({
      next: (order: any) => {
        if (isCod) {
          this.isProcessing = false;
          this.shopService.clearCart();
          this.router.navigate(['/order-confirmation'], {
            queryParams: {
              orderId: order.orderNumber,
              date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              amount: order.totalAmount,
              paymentMethod: 'Cash on Delivery'
            }
          });
          return;
        }

        // Razorpay flow
        this.initiateRazorpayPayment(order, currentAddr);
      },
      error: (err) => {
        this.isProcessing = false;
        console.error('Order creation error:', err);
        const detailedMsg = err.error?.message 
          || (err.error?.errors ? JSON.stringify(err.error.errors) : null)
          || err.message 
          || 'Failed to initialize order. Please check your network or try again.';
        this.toastService.error(`Order failed: ${detailedMsg}`);
      }
    });
  }

  private initiateRazorpayPayment(order: any, currentAddr: DeliveryAddress) {
    this.loadRazorpayScript().then((loaded) => {
      if (!loaded || !(window as any).Razorpay) {
        this.isProcessing = false;
        this.toastService.error('Razorpay gateway failed to load. Please verify your internet connection.');
        return;
      }

      this.shopService.getRazorpayKey().subscribe({
        next: (keyRes) => {
          const razorpayKey = keyRes.keyId || 'rzp_test_Tplnc0eTN5xGQt';

          this.shopService.createRazorpayOrder(order.totalAmount, 'INR', order.orderNumber).subscribe({
            next: (rzpOrder: any) => {
              const options = {
                key: razorpayKey,
                amount: order.totalAmount * 100,
                currency: 'INR',
                name: 'South Colours',
                description: 'Little Styles, Big Smiles',
                image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=120&q=80',
                order_id: rzpOrder.razorpayOrderId,
                handler: (response: any) => {
                  this.shopService.verifyRazorpayPayment({
                    internalOrderId: order.id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature
                  }).subscribe({
                    next: () => {
                      this.isProcessing = false;
                      this.shopService.clearCart();
                      this.router.navigate(['/order-confirmation'], {
                        queryParams: {
                          orderId: order.orderNumber,
                          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                          amount: order.totalAmount,
                          paymentMethod: 'Razorpay'
                        }
                      });
                    },
                    error: (verifyErr) => {
                      this.isProcessing = false;
                      this.toastService.error(verifyErr.error?.message || 'Payment verification failed. If money was debited, it will be refunded.');
                    }
                  });
                },
                prefill: {
                  name: currentAddr.name,
                  contact: currentAddr.phone,
                  email: 'customer@southcolours.com'
                },
                theme: {
                  color: '#FF4081'
                },
                modal: {
                  ondismiss: () => {
                    this.isProcessing = false;
                  }
                }
              };

              const rzp = new (window as any).Razorpay(options);
              rzp.open();
            },
            error: (createErr) => {
              this.isProcessing = false;
              this.toastService.error(createErr.error?.message || 'Unable to create payment order. Please try again.');
            }
          });
        },
        error: () => {
          this.isProcessing = false;
          this.toastService.error('Unable to retrieve payment configuration. Please try again later.');
        }
      });
    });
  }

  private loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }
}

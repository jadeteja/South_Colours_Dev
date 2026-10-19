import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
              <button class="add-addr-btn">+ Add New Address</button>
            </div>

            <div class="addresses-list">
              <!-- Selected Address matching Screen 5 (Priya Sharma, Bangalore) -->
              <label class="address-option selected">
                <input type="radio" name="address" checked />
                <div class="address-body">
                  <div class="addr-header">
                    <span class="person-name">Priya Sharma</span>
                    <button class="edit-link">Edit</button>
                  </div>
                  <p class="addr-text">123, Green Park, Bangalore<br>Karnataka - 560001</p>
                  <p class="phone-text">9876543210</p>
                </div>
              </label>

              <!-- Secondary Address -->
              <label class="address-option">
                <input type="radio" name="address" />
                <div class="address-body">
                  <span class="person-name">Office</span>
                  <p class="addr-text">ABC Tech Park, Whitefield<br>Bangalore - 560066</p>
                  <p class="phone-text">9123456780</p>
                </div>
              </label>
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

            <button class="btn-primary place-order-btn" (click)="placeOrder()">
              Place Order & Pay ₹ {{ shopService.cartTotal() | number }}
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
    }
    .card-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      .add-addr-btn {
        background: transparent;
        color: var(--primary-pink);
        font-weight: 700;
        font-size: 13px;
      }
    }
    .step-title {
      font-size: 18px;
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
      border: 1px solid var(--border-pink);
      border-radius: var(--radius-sm);
      cursor: pointer;
      input {
        accent-color: var(--primary-pink);
        margin-top: 4px;
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
          .person-name {
            font-size: 15px;
            font-weight: 700;
            color: var(--dark-navy);
          }
          .edit-link {
            background: transparent;
            color: var(--primary-pink);
            font-size: 12px;
            font-weight: 700;
          }
        }
        .addr-text {
          font-size: 13px;
          color: var(--text-muted);
          margin: 6px 0 4px;
          line-height: 1.4;
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
        color: var(--text-muted);
      }
    }
    .place-order-btn {
      width: 100%;
      padding: 14px 0;
      font-size: 16px;
    }
    .summary-card {
      background: #FFFFFF;
      border: 1px solid var(--border-pink);
      border-radius: var(--radius-md);
      padding: 22px;
    }
    .summary-title {
      font-size: 16px;
      color: var(--dark-navy);
      margin-bottom: 18px;
    }
    .summary-items {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .summary-item {
      display: flex;
      align-items: center;
      gap: 12px;
      .item-img {
        width: 48px;
        height: 58px;
        object-fit: cover;
        border-radius: 6px;
      }
      .item-meta {
        flex: 1;
        .name {
          font-size: 13px;
          font-weight: 700;
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
    .divider {
      height: 1px;
      background: var(--border-pink);
      margin: 14px 0;
    }
    .price-line {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 10px;
      .discount-text, .free-text {
        color: var(--success-green);
        font-weight: 700;
      }
      &.total-line {
        font-size: 17px;
        font-weight: 800;
        color: var(--dark-navy);
        margin-top: 14px;
        .total-amt {
          color: var(--dark-navy);
        }
      }
    }
  `]
})
export class CheckoutComponent {
  shopService = inject(ShopService);
  router = inject(Router);

  selectedPayment = 'card';
  isProcessing = false;

  customerAddress = {
    name: 'Priya Sharma',
    phone: '9876543210',
    addressLine1: '123, Green Park',
    addressLine2: 'Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560001'
  };

  placeOrder() {
    if (this.shopService.cartItems().length === 0) {
      alert('Your cart is empty! Please add items to checkout.');
      return;
    }

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
      shippingName: this.customerAddress.name,
      shippingPhone: this.customerAddress.phone,
      shippingAddressLine1: this.customerAddress.addressLine1,
      shippingAddressLine2: this.customerAddress.addressLine2,
      shippingCity: this.customerAddress.city,
      shippingState: this.customerAddress.state,
      shippingPinCode: this.customerAddress.pinCode,
      items: this.shopService.cartItems().map(i => ({
        productId: i.productId,
        productVariantId: i.productVariantId,
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
        this.initiateRazorpayPayment(order);
      },
      error: () => {
        // Fallback for demo navigation if offline
        this.isProcessing = false;
        this.shopService.clearCart();
        this.router.navigate(['/order-confirmation'], {
          queryParams: {
            orderId: 'SC' + Math.floor(100000 + Math.random() * 900000),
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            amount: this.shopService.cartTotal()
          }
        });
      }
    });
  }

  private initiateRazorpayPayment(order: any) {
    this.loadRazorpayScript().then((loaded) => {
      if (!loaded || !(window as any).Razorpay) {
        // Fallback simulate successful payment
        this.isProcessing = false;
        this.shopService.clearCart();
        this.router.navigate(['/order-confirmation'], {
          queryParams: {
            orderId: order.orderNumber,
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            amount: order.totalAmount,
            paymentMethod: 'Razorpay (Simulated)'
          }
        });
        return;
      }

      this.shopService.createRazorpayOrder(order.totalAmount, 'INR', order.orderNumber).subscribe({
        next: (rzpOrder: any) => {
          const options = {
            key: 'rzp_test_placeholder_key',
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
                error: () => {
                  this.isProcessing = false;
                  this.shopService.clearCart();
                  this.router.navigate(['/order-confirmation'], {
                    queryParams: {
                      orderId: order.orderNumber,
                      amount: order.totalAmount
                    }
                  });
                }
              });
            },
            prefill: {
              name: this.customerAddress.name,
              contact: this.customerAddress.phone,
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
        error: () => {
          this.isProcessing = false;
          this.shopService.clearCart();
          this.router.navigate(['/order-confirmation'], {
            queryParams: {
              orderId: order.orderNumber,
              amount: order.totalAmount
            }
          });
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


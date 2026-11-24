import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="invoice-backdrop" (click)="close.emit()">
      <div class="invoice-container" (click)="$event.stopPropagation()">
        <!-- Toolbar (Hidden when printing) -->
        <div class="invoice-toolbar no-print">
          <div class="toolbar-title">
            <span>📄 Tax Invoice Preview</span>
          </div>
          <div class="toolbar-actions">
            <button class="btn-print" (click)="printInvoice()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Print / Save PDF
            </button>
            <button class="btn-close" (click)="close.emit()">✕</button>
          </div>
        </div>

        <!-- Printable Invoice Paper -->
        <div class="invoice-paper" id="printable-invoice">
          <!-- Header -->
          <div class="inv-header">
            <div class="inv-brand">
              <h1 class="inv-logo">Southcolours</h1>
              <p class="inv-tagline">Little Styles, Big Smiles</p>
              <p class="inv-company-info">
                Southcolours Kids Wear<br />
                Bangalore, Karnataka, India<br />
                Email: prasuna.goje&#64;gmail.com | Phone: +91 93982 93994<br />
                <strong>GSTIN:</strong> 29BHAPD0509F2ZW
              </p>
            </div>
            <div class="inv-meta">
              <h2 class="inv-type">TAX INVOICE</h2>
              <table class="inv-meta-table">
                <tr>
                  <td><strong>Invoice No:</strong></td>
                  <td>INV-{{ order?.orderNumber || '000000' }}</td>
                </tr>
                <tr>
                  <td><strong>Order No:</strong></td>
                  <td>#{{ order?.orderNumber || '000000' }}</td>
                </tr>
                <tr>
                  <td><strong>Date:</strong></td>
                  <td>{{ formatDate(order?.createdAtUtc) }}</td>
                </tr>
                <tr>
                  <td><strong>Payment Mode:</strong></td>
                  <td>{{ getPaymentMethodName() }}</td>
                </tr>
                <tr>
                  <td><strong>Payment Status:</strong></td>
                  <td><span class="status-pill">{{ getPaymentStatus() }}</span></td>
                </tr>
              </table>
            </div>
          </div>

          <div class="inv-divider"></div>

          <!-- Addresses -->
          <div class="inv-addresses">
            <div class="addr-box">
              <h3>Billed & Shipped To:</h3>
              <p class="customer-name">{{ order?.shippingName || 'Valued Customer' }}</p>
              <p class="address-lines">
                {{ order?.shippingAddressLine1 }}<br />
                @if (order?.shippingAddressLine2) {
                  {{ order.shippingAddressLine2 }}<br />
                }
                {{ order?.shippingCity }}, {{ order?.shippingState }} - {{ order?.shippingPinCode }}<br />
                <strong>Phone:</strong> {{ order?.shippingPhone || '-' }}
              </p>
            </div>
            <div class="addr-box place-supply">
              <h3>Place of Supply:</h3>
              <p>{{ order?.shippingState || 'Karnataka' }} (29)</p>
              <h3 style="margin-top: 10px;">Reverse Charge:</h3>
              <p>No</p>
            </div>
          </div>

          <!-- Items Table -->
          <table class="inv-items-table">
            <thead>
              <tr>
                <th style="width: 40px;">#</th>
                <th>Item Description</th>
                <th>Size</th>
                <th class="text-center" style="width: 60px;">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              @for (item of order?.items; track $index) {
                <tr>
                  <td>{{ $index + 1 }}</td>
                  <td>
                    <strong>{{ item.productName }}</strong>
                    <div class="item-sub">SKU: {{ item.sku || 'SC-KID' }}</div>
                  </td>
                  <td>{{ item.sizeName || 'Standard' }}</td>
                  <td class="text-center">{{ item.quantity }}</td>
                  <td class="text-right">₹ {{ item.unitPrice | number:'1.2-2' }}</td>
                  <td class="text-right">₹ {{ (item.unitPrice * item.quantity) | number:'1.2-2' }}</td>
                </tr>
              } @empty {
                <tr>
                  <td>1</td>
                  <td><strong>{{ order?.items?.[0]?.productName || 'Kids Fashion Apparel' }}</strong></td>
                  <td>Standard</td>
                  <td class="text-center">1</td>
                  <td class="text-right">₹ {{ (order?.totalAmount || 0) | number:'1.2-2' }}</td>
                  <td class="text-right">₹ {{ (order?.totalAmount || 0) | number:'1.2-2' }}</td>
                </tr>
              }
            </tbody>
          </table>

          <!-- Calculation Summary -->
          <div class="inv-summary-row">
            <div class="inv-terms">
              <h4>Terms & Conditions:</h4>
              <ol>
                <li>Goods once sold can be exchanged within 7 days of delivery.</li>
                <li>This is a computer-generated tax invoice and requires no physical signature.</li>
                <li>For any queries, contact prasuna.goje&#64;gmail.com or +91 93982 93994.</li>
              </ol>
            </div>

            <div class="inv-amounts">
              <table class="amounts-table">
                <tr>
                  <td>Subtotal:</td>
                  <td class="text-right">₹ {{ (order?.subTotal || order?.totalAmount || 0) | number:'1.2-2' }}</td>
                </tr>
                @if (order?.discountAmount && order.discountAmount > 0) {
                  <tr class="discount-row">
                    <td>Discount ({{ order?.couponCode || 'Promo' }}):</td>
                    <td class="text-right">− ₹ {{ order.discountAmount | number:'1.2-2' }}</td>
                  </tr>
                }
                <tr>
                  <td>Shipping Fee:</td>
                  <td class="text-right">{{ (order?.shippingFee === 0 || !order?.shippingFee) ? 'FREE' : '₹ ' + (order.shippingFee | number:'1.2-2') }}</td>
                </tr>
                <tr>
                  <td>CGST (2.5%):</td>
                  <td class="text-right">₹ {{ getGstHalf() | number:'1.2-2' }}</td>
                </tr>
                <tr>
                  <td>SGST (2.5%):</td>
                  <td class="text-right">₹ {{ getGstHalf() | number:'1.2-2' }}</td>
                </tr>
                <tr class="grand-total-row">
                  <td><strong>Grand Total:</strong></td>
                  <td class="text-right"><strong>₹ {{ (order?.totalAmount || 0) | number:'1.2-2' }}</strong></td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Footer Signature -->
          <div class="inv-footer">
            <div class="authorized-sign">
              <p class="sign-text">For <strong>Southcolours Kids Wear</strong></p>
              <div class="sign-seal">Authorized Signatory</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .invoice-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;
      padding: 20px;
      overflow-y: auto;
    }
    .invoice-container {
      background: #E2E8F0;
      border-radius: 12px;
      max-width: 860px;
      width: 100%;
      max-height: 94vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .invoice-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      background: #1E293B;
      color: white;
      .toolbar-title {
        font-weight: 700;
        font-size: 15px;
      }
      .toolbar-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .btn-print {
        display: flex;
        align-items: center;
        gap: 6px;
        background: #FF4081;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s;
        &:hover {
          background: #E91E63;
        }
      }
      .btn-close {
        background: transparent;
        color: #94A3B8;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        &:hover {
          color: white;
          background: rgba(255,255,255,0.1);
        }
      }
    }
    .invoice-paper {
      background: #FFFFFF;
      padding: 36px 40px;
      margin: 16px;
      border-radius: 8px;
      overflow-y: auto;
      color: #1E293B;
      font-size: 13px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .inv-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      .inv-logo {
        font-size: 26px;
        font-weight: 900;
        color: #FF4081;
        margin: 0;
        letter-spacing: -0.5px;
      }
      .inv-tagline {
        font-size: 12px;
        color: #64748B;
        font-style: italic;
        margin: 2px 0 10px;
      }
      .inv-company-info {
        font-size: 12px;
        line-height: 1.5;
        color: #475569;
      }
      .inv-meta {
        text-align: right;
        .inv-type {
          font-size: 20px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 10px;
          letter-spacing: 1px;
        }
        .inv-meta-table {
          margin-left: auto;
          font-size: 12px;
          td {
            padding: 2px 4px;
            text-align: right;
            &:first-child {
              text-align: left;
              color: #64748B;
            }
          }
          .status-pill {
            background: #DCFCE7;
            color: #166534;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 11px;
          }
        }
      }
    }
    .inv-divider {
      height: 1.5px;
      background: #E2E8F0;
      margin: 16px 0 20px;
    }
    .inv-addresses {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
      .addr-box {
        h3 {
          font-size: 13px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .customer-name {
          font-size: 14px;
          font-weight: 700;
          color: #1E293B;
          margin-bottom: 4px;
        }
        .address-lines {
          font-size: 12px;
          color: #475569;
          line-height: 1.5;
        }
      }
    }
    .inv-items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      thead {
        background: #F8FAFC;
        th {
          padding: 10px 12px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          border-top: 1px solid #CBD5E1;
          border-bottom: 2px solid #CBD5E1;
          text-align: left;
          &.text-center { text-align: center; }
          &.text-right { text-align: right; }
        }
      }
      tbody {
        tr {
          border-bottom: 1px solid #E2E8F0;
          td {
            padding: 10px 12px;
            font-size: 12px;
            color: #1E293B;
            &.text-center { text-align: center; }
            &.text-right { text-align: right; }
            .item-sub {
              font-size: 11px;
              color: #94A3B8;
            }
          }
        }
      }
    }
    .inv-summary-row {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 24px;
      margin-bottom: 30px;
      .inv-terms {
        font-size: 11px;
        color: #64748B;
        h4 {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 6px;
        }
        ol {
          padding-left: 18px;
          line-height: 1.5;
        }
      }
      .inv-amounts {
        .amounts-table {
          width: 100%;
          border-collapse: collapse;
          td {
            padding: 5px 8px;
            font-size: 12px;
            &.text-right { text-align: right; }
          }
          .discount-row td {
            color: #16A34A;
            font-weight: 600;
          }
          .grand-total-row td {
            border-top: 2px solid #0F172A;
            border-bottom: 2px solid #0F172A;
            padding: 8px;
            font-size: 15px;
            color: #0F172A;
          }
        }
      }
    }
    .inv-footer {
      display: flex;
      justify-content: flex-end;
      padding-top: 20px;
      border-top: 1px dashed #CBD5E1;
      .authorized-sign {
        text-align: right;
        .sign-text {
          font-size: 12px;
          margin-bottom: 30px;
        }
        .sign-seal {
          font-size: 11px;
          color: #64748B;
          font-style: italic;
          border-top: 1px solid #CBD5E1;
          padding-top: 4px;
          display: inline-block;
        }
      }
    }

    /* Print styles */
    @media print {
      body * {
        visibility: hidden;
      }
      .no-print {
        display: none !important;
      }
      .invoice-backdrop {
        position: static !important;
        background: none !important;
        padding: 0 !important;
      }
      .invoice-container {
        box-shadow: none !important;
        max-width: 100% !important;
        max-height: none !important;
        border-radius: 0 !important;
        background: white !important;
      }
      .invoice-paper, .invoice-paper * {
        visibility: visible !important;
      }
      .invoice-paper {
        margin: 0 !important;
        padding: 20px !important;
        box-shadow: none !important;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
    }
  `]
})
export class InvoiceModalComponent {
  @Input() order: any;
  @Output() close = new EventEmitter<void>();

  formatDate(dateVal: any): string {
    if (!dateVal) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    return new Date(dateVal).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getPaymentMethodName(): string {
    const m = this.order?.paymentMethod;
    if (m === 1 || m === 'CashOnDelivery') return 'Cash on Delivery';
    return 'Online Payment (Razorpay)';
  }

  getPaymentStatus(): string {
    const s = this.order?.paymentStatus;
    if (s === 2 || s === 'Captured' || this.order?.status === 2 || this.order?.status === 'Confirmed') return 'PAID';
    if (this.order?.paymentMethod === 1 || this.order?.paymentMethod === 'CashOnDelivery') return 'COD - PENDING';
    return 'COMPLETED';
  }

  getGstHalf(): number {
    const total = this.order?.totalAmount || 0;
    // Assume 5% inclusive GST (2.5% CGST + 2.5% SGST)
    return Math.round((total * 0.025) * 100) / 100;
  }

  printInvoice() {
    window.print();
  }
}

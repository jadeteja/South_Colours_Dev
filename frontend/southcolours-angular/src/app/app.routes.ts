import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductListingComponent } from './features/products/product-listing.component';
import { ProductDetailsComponent } from './features/products/product-details.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrderConfirmationComponent } from './features/checkout/order-confirmation.component';
import { OrdersComponent } from './features/orders/orders.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { adminGuard } from './core/guards/admin.guard';

import { AdminAddProductComponent } from './features/admin/admin-add-product.component';
import { AdminEditProductComponent } from './features/admin/admin-edit-product.component';
import { AdminOrdersComponent } from './features/admin/admin-orders.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { AdminProductsListComponent } from './features/admin/admin-products-list.component';
import { AdminCustomersComponent } from './features/admin/admin-customers.component';
import { AdminCategoriesComponent } from './features/admin/admin-categories.component';
import { AdminBannersComponent } from './features/admin/admin-banners.component';
import { AdminReviewsComponent } from './features/admin/admin-reviews.component';
import { AdminCouponsComponent } from './features/admin/admin-coupons.component';
import { AdminReportsComponent } from './features/admin/admin-reports.component';
import { AdminSettingsComponent } from './features/admin/admin-settings.component';

export const routes: Routes = [
  // Customer Website Pages
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListingComponent },
  { path: 'products/:slug', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmation', component: OrderConfirmationComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'wishlist', component: WishlistComponent },

  // Auth Routes
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  // Admin Portal Routes (Protected by adminGuard)
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/products', component: AdminProductsListComponent, canActivate: [adminGuard] },
  { path: 'admin/products/add', component: AdminAddProductComponent, canActivate: [adminGuard] },
  { path: 'admin/products/edit/:id', component: AdminEditProductComponent, canActivate: [adminGuard] },
  { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [adminGuard] },
  { path: 'admin/customers', component: AdminCustomersComponent, canActivate: [adminGuard] },
  { path: 'admin/categories', component: AdminCategoriesComponent, canActivate: [adminGuard] },
  { path: 'admin/banners', component: AdminBannersComponent, canActivate: [adminGuard] },
  { path: 'admin/reviews', component: AdminReviewsComponent, canActivate: [adminGuard] },
  { path: 'admin/coupons', component: AdminCouponsComponent, canActivate: [adminGuard] },
  { path: 'admin/reports', component: AdminReportsComponent, canActivate: [adminGuard] },
  { path: 'admin/settings', component: AdminSettingsComponent, canActivate: [adminGuard] },

  // Fallback
  { path: '**', redirectTo: '' }
];

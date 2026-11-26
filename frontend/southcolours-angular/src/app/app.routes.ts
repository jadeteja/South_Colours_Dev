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
import { ForgotPasswordComponent } from './features/auth/forgot-password.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AboutComponent } from './features/about/about.component';
import { SizeChartComponent } from './features/size-chart/size-chart.component';
import { PrivacyPolicyComponent } from './features/legal/privacy-policy.component';
import { ReturnsRefundsComponent } from './features/legal/returns-refunds.component';
import { TermsConditionsComponent } from './features/legal/terms-conditions.component';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

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
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'about-us', redirectTo: 'about', pathMatch: 'full' },
  { path: 'size-chart', component: SizeChartComponent },
  { path: 'size-guide', redirectTo: 'size-chart', pathMatch: 'full' },
  { path: 'contact', redirectTo: 'about', pathMatch: 'full' },
  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: 'privacy-policy', redirectTo: 'privacy', pathMatch: 'full' },
  { path: 'returns', component: ReturnsRefundsComponent },
  { path: 'refunds', redirectTo: 'returns', pathMatch: 'full' },
  { path: 'returns-refunds', redirectTo: 'returns', pathMatch: 'full' },
  { path: 'terms', component: TermsConditionsComponent },
  { path: 'terms-and-conditions', redirectTo: 'terms', pathMatch: 'full' },
  { path: 'terms-of-service', redirectTo: 'terms', pathMatch: 'full' },
  { path: 'addresses', redirectTo: 'profile?tab=addresses', pathMatch: 'full' },
  { path: 'payments', redirectTo: 'profile?tab=cards', pathMatch: 'full' },
  { path: 'wishlist', component: WishlistComponent },

  // Auth Routes
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },

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

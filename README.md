# South Colours — Little Styles, Big Smiles 🌸

A complete, production-ready, scalable, secure, and responsive e-commerce platform for kids' clothing and ethnic wear built with **ASP.NET Core 10 Web API**, **Entity Framework Core**, **SQL Server**, and **Angular 19**.

---

## 🎨 Visual Design System & Reference
Faithfully built following the supplied **South Colours** reference design:
- **Brand Colors**: Primary Pink (`#FF4081`), Soft Pink (`#FFF0F5`), Blush Pink (`#FFD6E7`), Dark Navy (`#18263B`), Success Green (`#28A745`)
- **Components**: Rounded pill search bar, pastel circular category avatars, 3-column product cards, sticky headers, rich variant selector, Razorpay integration, and full admin workspace.

---

## 🚀 Quick Start

### 1. Start the Backend API:
```powershell
cd backend
dotnet run --project Southcolours.API/Southcolours.API.csproj --urls "http://localhost:5000"
```

### 2. Start the Frontend App:
```powershell
cd frontend/southcolours-angular
npm start
```
Open **[http://localhost:4200](http://localhost:4200)** in your browser!

---

## 📱 The 8 Core Pages
1. **Homepage** (`/`): Hero kids fashion banner, 8 circular category avatars, dual promo cards, featured collection.
2. **Product Listing** (`/products`): Age group checkboxes, price slider, color swatches, sorting, 3-column cards.
3. **Product Details** (`/products/:slug`): Thumbnail strip, image preview, size pills (`1-2Y` to `6-8Y`), color picker, quantity stepper, trust badges, specs table.
4. **Cart** (`/cart`): Live items list, coupon application (`WELCOME300`, `FESTIVE15`), price breakdown.
5. **Checkout** (`/checkout`): Saved addresses, payment method options (Cards, UPI, Net Banking, COD), order summary.
6. **Order Confirmation** (`/order-confirmation`): Celebration bunny badge, order number, amount, order date.
7. **Customer Order History** (`/orders`): My Account sidebar, status tabs (Delivered, Shipped, Processing).
8. **Admin Panel** (`/admin/products/add`): Dark Navy sidebar (`#18263B`), rich toolbar, size checkboxes, multi-image uploader.


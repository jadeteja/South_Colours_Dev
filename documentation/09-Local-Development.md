# South Colours — Local Development & Run Guide

## Prerequisites
1. **.NET 10 SDK** (installed)
2. **Node.js (v20+ or v24+) & npm** (installed)
3. **Microsoft SQL Server** (`.\SQLEXPRESS` installed and running)

---

## 1. Running the Backend API (.NET)

Open a PowerShell terminal in the repository root:
```powershell
cd backend
dotnet run --project Southcolours.API/Southcolours.API.csproj --urls "http://localhost:5000"
```
The API server automatically:
- Connects to `.\SQLEXPRESS`
- Creates database `SouthColoursDb` if not existing
- Runs EF Core migrations
- Seeds default Admin (`admin@southcolours.com` / `Admin@South123#`), Categories, Realistic Kids Fashion products matching the reference design, Coupons, and Banners.

Swagger / OpenAPI documentation: `http://localhost:5000/openapi/v1.json`

---

## 2. Running the Frontend (Angular 19)

Open another terminal:
```powershell
cd frontend/southcolours-angular
npm start
```
The website will launch at `http://localhost:4200`.

---

## 3. Navigating the 8 Key Screens

1. **Homepage**: `http://localhost:4200/`
2. **Ethnic Wear Catalog**: `http://localhost:4200/products?category=ethnic-wear`
3. **Product Details**: `http://localhost:4200/products/pink-lehenga-set`
4. **Shopping Cart**: `http://localhost:4200/cart`
5. **Checkout**: `http://localhost:4200/checkout`
6. **Order Confirmation**: `http://localhost:4200/order-confirmation`
7. **Customer Order History**: `http://localhost:4200/orders`
8. **Admin Panel (Add Product)**: `http://localhost:4200/admin/products/add`


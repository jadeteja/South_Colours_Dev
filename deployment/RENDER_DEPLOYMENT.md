# Deploy South Colours on Render 🚀

This guide provides step-by-step instructions for deploying the **South Colours** fullstack e-commerce application (.NET 10 Web API + Angular 19 + SQL Server) to [Render](https://render.com/).

---

## 🏗️ Architecture Overview on Render

1. **`southcolours-api` (Render Web Service - Docker)**
   - Built via [Dockerfile.api](file:///c:/Users/jadet/Documents/code/SouthColors_Dev/Dockerfile.api)
   - Targets .NET 10.0 ASP.NET Web API runtime
   - Connects to your external SQL Server
   - Automatically migrates and seeds categories, banners, and sample products upon startup

2. **`southcolours-web` (Render Static Site - Angular 19)**
   - Root directory: `frontend/southcolours-angular`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist/southcolours-angular/browser`
   - SPA Routing Rule: `/*` -> `/index.html`

3. **External SQL Server**
   - Cloud SQL Server instance (e.g. Azure SQL, AWS RDS for SQL Server, or Aiven)
   - Connection string injected via `ConnectionStrings__DefaultConnection` environment variable on Render.

---

## 🛠️ Step 1: Push your latest changes to GitHub

Make sure the new deployment files (`render.yaml`, `Dockerfile.api`, environments, and CORS updates) are committed and pushed:

```powershell
git add .
git commit -m "Configure Render deployment blueprints and Dockerfile"
git push origin main
```

---

## 🚀 Step 2: Deploy on Render

### Option A: Using Render Blueprints (Easiest)

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** at the top right and select **Blueprint**.
3. Connect your repository: `jadeteja/South_Colours_Dev`.
4. Render will read [render.yaml](file:///c:/Users/jadet/Documents/code/SouthColors_Dev/render.yaml) and automatically configure both `southcolours-api` and `southcolours-web`.
5. Under `southcolours-api` environment variables, enter:
   - `ConnectionStrings__DefaultConnection`: Your cloud SQL Server connection string (e.g., `Server=tcp:yourserver.database.windows.net,1433;Initial Catalog=SouthColoursDb;Persist Security Info=False;User ID=adminuser;Password=YourPassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;`).
   - `Razorpay__KeyId`: Your Razorpay Key ID.
   - `Razorpay__KeySecret`: Your Razorpay Secret.
6. Click **Apply**. Render will automatically build the Docker container and the Angular static site.

---

### Option B: Manual Setup on Render Dashboard

#### 1. Backend Web Service (`southcolours-api`):
- Click **New +** > **Web Service**.
- Select repo: `jadeteja/South_Colours_Dev`.
- Runtime: **Docker**.
- Dockerfile Path: `./Dockerfile.api`.
- Docker Context: `.`.
- Instance Type: **Free**.
- In **Environment Variables**, add:
  - `ASPNETCORE_ENVIRONMENT`: `Production`
  - `ConnectionStrings__DefaultConnection`: `<Your-Cloud-SQL-Server-Connection-String>`
  - `JwtSettings__Secret`: `<Any long secure 32+ char secret string>`
  - `JwtSettings__Issuer`: `SouthColoursAPI`
  - `JwtSettings__Audience`: `SouthColoursFrontend`
  - `FrontendUrl`: `https://<your-angular-site-name>.onrender.com`
  - `Razorpay__KeyId`: `rzp_test_...`
  - `Razorpay__KeySecret`: `...`

#### 2. Frontend Static Site (`southcolours-web`):
- Click **New +** > **Static Site**.
- Select repo: `jadeteja/South_Colours_Dev`.
- Root Directory: `frontend/southcolours-angular`.
- Build Command: `npm install && npm run build`.
- Publish Directory: `dist/southcolours-angular/browser`.
- In **Redirects / Rewrites**:
  - Add Rule: **Rewrite**
  - Source: `/*`
  - Destination: `/index.html`

---

## 🔗 Step 3: Link Frontend to Backend API

Once your `southcolours-api` web service is deployed, Render assigns it a public HTTPS URL (for example: `https://southcolours-api.onrender.com`).

Set this URL in [environment.prod.ts](file:///c:/Users/jadet/Documents/code/SouthColors_Dev/frontend/southcolours-angular/src/environments/environment.prod.ts):

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://southcolours-api.onrender.com'
};
```

Commit & push to GitHub:
```powershell
git commit -am "Set production API URL"
git push origin main
```
Render will trigger an automatic redeploy of the Angular static site with the live API endpoint connected!

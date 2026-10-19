# South Colours Kids E-Commerce Platform — Technical Architecture

## 1. Overview
South Colours is a production-oriented e-commerce platform built specifically for children's fashion and ethnic wear in India.

## 2. Technology Stack
- **Backend API**: ASP.NET Core 10 / LTS Web API
- **ORM & DB**: Entity Framework Core 10, Microsoft SQL Server (Local `.\SQLEXPRESS` / `SouthColoursDb`)
- **Authentication**: ASP.NET Core Identity, JWT Bearer tokens, Role-Based Access Control, Google OpenID Connect ready
- **Payment Gateway**: Razorpay standard checkout, order creation, HMAC-SHA256 signature verification, idempotent webhooks
- **Frontend**: Angular 19 (Standalone Components, Signals, Reactive Forms, SCSS)
- **UI Design System**: South Colours Pink-and-White theme (`#FF4081`, `#FFF0F5`, `#18263B` Dark Navy)

## 3. Project Structure
```text
Southcolours/
├── backend/
│   ├── Southcolours.API/             # Controllers, Minimal APIs, Program.cs, Appsettings
│   ├── Southcolours.Application/     # DTOs, Business Logic, Validation
│   ├── Southcolours.Domain/          # Core Entities, Enums, BaseEntity
│   ├── Southcolours.Infrastructure/  # Razorpay integration, Security, External Clients
│   ├── Southcolours.Persistence/     # DbContext, Migrations, Seed Data
│   └── Southcolours.Tests/           # Unit & Integration Tests
├── frontend/
│   └── southcolours-angular/         # Angular 19 Standalone Single Page App
└── documentation/                    # Complete architectural and deployment guides
```


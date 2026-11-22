# SouthColours Playwright TypeScript E2E Automation Framework

Professional, scalable, and maintainable End-to-End (E2E) automation testing framework for **[SouthColours](https://southcolours.in/)**, built with **Playwright**, **TypeScript**, and **Allure Reporting**.

---

## 1. Overview & Architecture

The framework utilizes the **Page Object Model (POM)** design pattern, strict TypeScript type safety, custom fixtures, environment variable isolation, and automated reporting.

```text
southcolours-automation/
├── tests/
│   ├── e2e/                # End-to-End full user journeys (Browse -> Cart -> Checkout)
│   ├── smoke/              # Core smoke sanity checks
│   ├── authentication/     # Login, registration, form validation & quick-fill
│   ├── products/           # Listing, details, sizes, colors, categories, search
│   ├── cart/               # Add to cart, quantity change, coupon apply, clear cart
│   ├── checkout/           # Addresses, payment selection, order placement checks
│   └── navigation/         # Header brand links, category routing, footer policies
│
├── pages/
│   ├── BasePage.ts         # Common locators (Header, Footer, Navigation, Search)
│   ├── HomePage.ts         # Hero banner, featured sections, category shortcuts
│   ├── LoginPage.ts        # Login credentials, validation alerts, demo chips
│   ├── RegisterPage.ts     # User registration fields & submit validation
│   ├── ProductPage.ts      # Product listing catalog, filtering, PDP, sizes, add-to-cart
│   ├── CartPage.ts         # Cart items table, stepper, price summary, checkout CTA
│   ├── CheckoutPage.ts     # Addresses, payment options (UPI, Card, NetBanking)
│   └── AccountPage.ts      # Customer orders and account management
│
├── fixtures/
│   └── testFixtures.ts     # Dependency injection fixtures for all Page Objects
│
├── utils/
│   ├── helpers.ts          # Safe clicks, string formatters, currency helpers
│   ├── logger.ts           # Standardized test step and console logging
│   └── testData.ts         # Dynamic Faker.js mock data & static constants
│
├── data/
│   └── testData.json       # Route URLs, static validation messages
│
├── reports/
│   ├── allure-results/     # Raw test execution telemetry for Allure
│   └── allure-report/      # Generated standalone HTML Allure report
│
├── test-results/           # Playwright traces, screenshots, video captures
├── playwright.config.ts    # Multi-browser & device configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Project dependencies & npm run scripts
└── README.md               # Framework documentation
```

---

## 2. Technology Stack

- **Test Framework:** [Playwright](https://playwright.dev/) (`@playwright/test`)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (strict mode, NodeNext module resolution)
- **Reporting:** [Allure Report](https://allurereport.org/) (`allure-playwright` & `allure-commandline`)
- **Mock Data Generation:** `@faker-js/faker`
- **Environment Management:** `dotenv`
- **Code Quality:** `eslint`, `prettier`

---

## 3. Prerequisites

- **Node.js:** v18+ (tested on Node v26.13.1)
- **NPM:** v9+ (tested on npm 11.20.0)
- **Java Runtime Environment (JRE):** Required for generating Allure reports (`allure generate`)

---

## 4. Installation & Setup

1. Navigate to the automation directory:
   ```bash
   cd southcolours-automation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browser engines:
   ```bash
   npx playwright install chromium firefox webkit
   ```

4. Verify or customize `.env`:
   ```bash
   cp .env.example .env
   ```

---

## 5. Test Execution Commands

| Command | Description |
|---|---|
| `npm run test` | Run all test suites across all configured projects |
| `npm run test:headed` | Run tests in headed browser mode |
| `npm run test:smoke` | Run only the high-priority Smoke test suite |
| `npm run test:chromium` | Run all suites on Desktop Chromium / Chrome |
| `npm run test:firefox` | Run all suites on Desktop Firefox |
| `npm run test:webkit` | Run all suites on WebKit (Safari engine) |
| `npm run test:mobile` | Run tests simulating Mobile Chrome (Pixel 5) |

---

## 6. Allure Reporting

Generate and view rich visual execution reports:

1. **Generate Allure HTML Report:**
   ```bash
   npm run allure:generate
   ```
2. **Open Allure Report in Local Browser:**
   ```bash
   npm run allure:open
   ```
3. **One-step Generate & Open:**
   ```bash
   npm run allure:report
   ```

---

## 7. CI/CD Integration

The framework is configured for CI/CD pipelines (e.g., GitHub Actions, GitLab CI, Jenkins):
- Automatic artifact retention (screenshots, videos, Playwright traces on failure).
- Parallel execution support with custom worker control.
- Headless execution with configurable retry logic.

# Glamouré — Enterprise Luxury Salon SaaS & AI Operations Engine

Glamouré is a full-stack, multi-tenant enterprise salon management SaaS and intelligent scheduling platform built for luxury ateliers, aesthetic clinics, and high-end spas.

It combines an editorial guest booking experience with an operations management suite for salon owners and artisans, powered by an embedded predictive AI/ML intelligence engine.

---

## Key Modules & Capabilities

### 1. Multi-Role Management Architecture
- **Proprietor (Owner) Portal**: Complete command center for multi-branch operations, real-time revenue analytics, team scheduling, service catalogs, inventory management, and customer CRM dossiers.
- **Artisan (Member) Portal**: Dedicated interface for stylists and specialists to manage daily schedules, chair assignments, commission earnings, and client preferences.
- **Guest Concierge Booking Experience**: High-fashion editorial booking journey with real-time slot selection, specialist matching, add-on bundling, and reservation management.

### 2. Predictive AI & Machine Learning Suite
- **Bayesian Capacity Scheduling**: Hard-constraint scheduling engine preventing double-bookings, respecting certified rest breaks, and balancing workstation loads.
- **Demand Time-Series Forecasting**: Exponential smoothing with day-of-week seasonality to predict appointment volume across 7-day, 30-day, and 90-day horizons.
- **Client Retention & Churn Classifier**: RFM-based behavioral scoring detecting cancellation momentum and lapsed visitation cycles to trigger automated retention offers.
- **Financial Projections & Service Margins**: 14-day revenue forecasts with 95% confidence intervals and service category gross margin profitability matrices.
- **Workstation Vision & Live Monitor**: Optical chair occupancy tracking and service milestone telemetry simulator with privacy-preserving edge blurring.
- **Interactive AI Salon Assistant**: Grounded query assistant answering real-time business queries on salon performance without hallucinations.

### 3. Salon Operations & Compliance
- **GST Invoicing & Taxation**: Automated 18% GST calculation (9% CGST + 9% SGST) with sequential invoice numbering and tax breakdown receipts.
- **Historical Price Snapshotting**: Historical reservations and invoices preserve exact price snapshots regardless of future catalog price adjustments.
- **Artisan Commission Governance**: Automated commission calculations per service according to individualized contract rates.
- **Walk-In Lounge Queue**: Live queue management tracking waiting times, service readiness, and chair allocation.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 (TypeScript) |
| **Build & Tooling** | Vite, Oxlint |
| **Styling & Design System** | Tailwind CSS v4, Lucide Icons, Custom Luxury Editorial Tokens |
| **State & Architecture** | React Context API, Multi-Tenant Domain Services |
| **Testing & Quality Assurance** | Vitest, 105 Automated Unit & Integration Tests |
| **CI/CD Automation** | GitHub Actions (CI Build, Vitest Test Suite, CodeQL Security Scan, Dependabot) |

---

## Project Structure

```
glamoure/
├── .agent/skills/          # Engineering, design tokens, and accessibility standards
├── .github/workflows/      # Automated CI test suites and security scans
├── src/
│   ├── components/         # Shared UI elements, layouts, and navigation
│   │   ├── layout/         # TopNav, Sidebar, Dashboard shells
│   │   └── ui/             # Buttons, Cards, DataTables, Badges, Modals
│   ├── context/            # AuthContext, BranchContext, NotificationContext
│   ├── database/           # In-memory relational schema, repositories, and seed state
│   ├── intelligence/       # ML models, forecasting, churn scoring, and AI querying
│   ├── pages/
│   │   ├── owner/          # 18 Owner Portal management pages
│   │   ├── member/         # Artisan dashboard and shift management
│   │   ├── customer/       # Guest profile and booking history
│   │   └── public/         # Editorial landing page, authentication, and booking
│   ├── tests/              # 10 test suites covering RBAC, security, workflows, and ML
│   └── types/              # TypeScript interfaces for multi-tenant entities
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/glamoure.git
   cd glamoure
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## Testing & Quality Assurance

Glamouré includes an automated test suite verifying platform security, RBAC rules, booking workflows, and machine learning pipelines:

```bash
npm test
```

### Test Coverage Highlights
- **RBAC & Authorization**: Role-based access validation across 7 distinct organizational roles.
- **Data Isolation**: Multi-tenant data segregation preventing cross-salon data leaks.
- **Workflow Reliability**: End-to-end appointment lifecycle from booking to GST invoice generation.
- **Model Grounding**: Constraint validation ensuring zero overlapping bookings and valid forecasting intervals.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

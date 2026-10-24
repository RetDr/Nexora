# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server at `http://localhost:5173` |
| `npm run build` | Build production bundle: `tsc -b && vite build` |
| `npm run preview` | Preview production build locally |

## 📝 Build, Lint & Test Commands

- **Build**: `npm run build` — runs TypeScript checker (`tsc -b`) then Vite build
- **TypeScript check only**: `npx tsc -b` (from project root)
- **Lint**: No dedicated lint script configured; code quality enforced via TypeScript `strict: true` and `noUnusedLocals`/`noUnusedParameters`
- **Tests**: No test runner configured in this project. See `IMPLEMENTATION_NOTES.md` §9 for verification guidance. If adding tests, use `vitest` or `jest` — install dependencies manually if needed.

## 🏗️ High-Level Architecture

This is a **React 18 + TypeScript + Vite** frontend application that reconstructs the Cadra (Larkspur Cycles) operations platform. Key architectural decisions:

### Routing
- **Hash-based routing** using `window.location.hash` (e.g., `#/manufacturing/scheduling`)
- Route changes handled in `src/App.tsx` via `hashchange` event listener
- All navigation must update the hash: `window.location.hash = path`
- Back/forward browser navigation preserved

### Data Layer
- **100% local data** — all data lives in `src/data/cadraData.ts`
- Type definitions in `src/types/index.ts` covering: WorkOrderItem, GanttOrder, GanttOperation, LiveFloorItem, SaleDeal, ContactItem, POSProduct, CartItem, StockItem, PurchaseOrderItem, ShipmentItem, LedgerEntry, InvoiceItem, PaymentTransaction
- No backend, no database, no real authentication
- Mutations update React state locally; some behaviors simulated honestly in localStorage

### Module Structure

```
src/
├── App.tsx              # Root component, hash routing, dark mode toggle
├── main.tsx             # Entry point, render React root
├── styles.css           # Global CSS variables and theme styles
├── data/
│   └── cadraData.ts     # All local mock data
├── types/
│   └── index.ts         # TypeScript interfaces for all data models
├── components/
│   ├── layout/
│   │   ├── Header.tsx               # Top nav with sliding pill, notifications, avatar
│   │   ├── LeftDock.tsx             # Floating dock: search, create, theme toggle, dashboard
│   │   ├── QuickSearchModal.tsx     # Command palette / quick search
│   │   ├── QuickCreateModal.tsx     # Modal: create order, quote, or contact
│   │   └── LiveFloorPill.tsx        # Live floor indicator component
│   └── ui/
│       ├── AnimatedCounter.tsx        # Animated number counter
│       ├── Toast.tsx                  # Global toast notifications
│       └── ... (other UI components)
└── pages/
    ├── dashboard/DashboardPage.tsx              # Dashboard with KPIs, time scrubber, annual chart
    ├── manufacturing/SchedulingPage.tsx         # Gantt schedule (flagship reference screen)
    ├── manufacturing/WorkOrdersPage.tsx         # Work orders list with KPI filters
    ├── sales/PipelinePage.tsx                   # Kanban pipeline board
    ├── sales/ContactsPage.tsx                   # Alphabetical directory with favorites
    ├── sales/POSPage.tsx                        # Point of sale terminal
    ├── stock/StockPage.tsx                      # Inventory capital breakdown & stock alerts
    ├── stock/PurchaseOrdersPage.tsx             # PO sequential status (5-step)
    ├── stock/ShipmentsPage.tsx                # Logistics shipment tracking
    ├── accounting/GeneralLedgerPage.tsx         # Chart of accounts & daily ledger
    ├── accounting/InvoicesPage.tsx              # AR aging & major debtors
    ├── accounting/PaymentsPage.tsx              # Cash flow graph & pending invoices
    ├── reporting/ReportingOverviewPage.tsx      # Revenue vs costs gauge & delivery compliance
    ├── reporting/ReportBuilderPage.tsx          # Interactive report builder
    ├── hr/DirectoryProfileDrawer.tsx            # Employee directory & Noor profile drawer
    └── settings/SettingsPage.tsx                # Company profile with real-time billing preview
```

### Visual Design System

- **Typography**: `Plus Jakarta Sans` (400/500/600/700/800) + `JetBrains Mono` mono
- **Color palette** (from `IMPLEMENTATION_NOTES.md`):
  - Fondo: `#f4f4f2` / `#f5f5f3` (off-white)
  - Superficies: `#ffffff` con `border-radius: 16px`
  - Acento terracota: `#e06845` / `#d8603d` (badges, alertas, botones de compra)
  - Verde oliva: `#4e7c59` / `#3f6b49` (operaciones a tiempo, cobros activos)
  - Azul cobalto: `#2563eb`
  - Texto principal: `#17181a`
  - Texto secundario/muted: `#6b7280` / `#737982`
  - Bordes: `#e6e6e2` / `#e8e8e4`
- **Dark mode**: Toggleable via LeftDock or `#/settings`; stored in `localStorage.cadra-theme`
- **Responsive**: Desktop-first (1440×900 preferred); horizontal scroll for tables on narrower screens

### Key Navigation Patterns

| Section | Hash Route | Key Features |
|---|---|---|
| Dashboard | `#/dashboard` | Time scrubber (7AM–5PM), KPI cards with sparklines, annual chart, sales funnel, "On the floor today" |
| Manufacturing Scheduling | `#/manufacturing/scheduling` | Gantt chart with current time marker (12:02 PM), phase connections, live floor panel |
| Manufacturing Work Orders | `#/manufacturing/orders` | 4 KPI cards, state filters, dense table with station route diagrams |
| Sales Pipeline | `#/sales/pipeline` | Kanban by stage (Quote→Confirmed→In production→Ready→Shipped), salesperson filter |
| Contacts | `#/contacts` | A-Z directory, favorite star chips, company distribution donut chart |
| POS | `#/pos` | Category catalog, interactive cart, discount selector (5%/10%/15%), tax-free (Oregon), receipt modal |
| Inventory Stock | `#/inventory/stock` | Capital breakdown horizontal, low-stock alerts, warehouse breakdown (SEW/DIV/PHL) |
| Purchasing Orders | `#/purchasing/orders` | 5-step sequential status indicator, filters, spend distribution chart |
| Logistics Shipments | `#/logistics/shipments` | Real-time route lines, customs hold identification |
| Accounting Ledger | `#/accounting/ledger` | Chart of accounts, daily ledger, filter by origin (Sales/Bank/Purchases/Payroll/Manual) |
| Accounting Invoices | `#/accounting/invoices` | AR aging by time bands, major debtors panel |
| Accounting Payments | `#/accounting/payments` | Cash flow continuous graph, payment method volume, pending invoices |
| Reporting Overview | `#/reporting/overview` | Revenue vs goods cost graph, radial delivery compliance gauge |
| Reporting Builder | `#/reporting/builder` | Metric selector (Revenue/Units/Margin) + temporal/distributor grouping |
| HR Directory | `#/hr/directory` / `#/hr/directory/s-noor` | Plant team list, side drawer with Noor Haddad full profile |
| Settings | `#/settings` | Fiscal/legal data form, real-time billing document preview |

### Theme & State Management

- **Dark mode**: Controlled by `darkMode` state in `App.tsx`, toggled via LeftDock button, URL `?theme=dark`, or `localStorage.cadra-theme`
- **Profile drawer**: Opens automatically when navigating to `#/hr/directory/s-noor`; manually togglable from Header
- **Toasts**: Global toast system via `Toast` component; `showToast(msg)` pattern in App
- **Notifications**: Array in `Header.tsx` with urgent/non-urgent items; dropdown modal

### Component Patterns (from `IMPLEMENTATION_NOTES.md` §4)

- **POS**: Reactive category filtering, predictive SKU search, cart with add/subtract/remove, discount recalculation, receipt modal
- **Scheduling**: Interactive Gantt, phase collapse/expand, sequential phase connections (TIG → Align → Paint)
- **Pipeline Kanban**: Draggable/interactive cards, owner filter
- **Contacts**: Alphabetical filter, star favorites, donut company distribution
- **Settings**: Bidirectional form → preview reactivity (updating fiscal data updates billing preview in real time)

### Verification

Per `IMPLEMENTATION_NOTES.md` §3.3 and §7:
- Visual comparison against reference images in `Nexora images/`
- Use Chromium headless or available browser to capture and compare screenshots
- Compare at 1440×900 viewport as baseline
- Document any differences
- Build must complete: `npm run build` with no TypeScript errors

## 📖 Reference Documents (already in project)

- `README.md` — Quick start, install, dev server, preview, navigation map
- `REFERENCE_MAP.md` — Exhaustive mapping between reference images and modules/routes
- `IMPLEMENTATION_NOTES.md` — Architecture decisions, visual tokens, limitations, interaction guidelines
- `.claude/settings.json` — Harness settings (currently empty)

## 🚫 Constraints & Reminders

- **Frontend only** — no backend, no database, no real authentication
- **No real payments** — POS emits simulated receipts local-only
- **No external APIs** — no Stripe/Square/other payment gateways
- **Data is local** — all mutations in React state; some behaviors honored in localStorage only
- **Visual fidelity** is the priority — desktop 1440×900 viewport preferred
- **Hash routing** must be preserved; do not convert to full-page reloads
- **Theme system** must continue working (light/dark toggle, localStorage persistence)
- **TypeScript strict mode** — do not disable `noUnusedLocals`/`noUnusedParameters` to force a build
- **Do not invent reference images** or claim visual fidelity without comparison

## 💡 Quick Start for New Instances

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:5173
#    Navigation via hash: #/manufacturing/scheduling, #/dashboard, etc.

# 4. Build for production
npm run build
```
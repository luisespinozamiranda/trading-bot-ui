# CLAUDE.md - Trading Bot UI

## Project Overview

Enterprise trading bot dashboard built with React 19 + TypeScript + Vite 8 + Tailwind CSS 4. This is the frontend for the `trading-bot` Java Spring Boot backend, providing a professional UI for managing trading strategies, running backtests, controlling live paper trading, and analyzing performance.

**Repository**: `trading-bot-ui` (separate from `trading-bot` backend)
**Backend Location**: `../trading-bot/` (sibling directory)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4.2 (utility-first, CSS custom properties for theming) |
| State (global) | Zustand 5 (persisted in localStorage) |
| State (server) | TanStack React Query 5 (polling, cache, mutations) |
| HTTP | Axios (API key interceptor via `X-API-Key` header) |
| Routing | React Router v6 (nested routes with AppLayout) |
| Charts | Recharts 3 (equity curves, bar charts), Lightweight Charts 5 (candlestick) |
| Tables | TanStack Table v8 (headless), TanStack Virtual (virtualization) |
| Forms | React Hook Form + Zod |
| Notifications | Sonner (toasts) |
| Icons | Lucide React |
| Dates | date-fns |
| Deployment | Docker (node:22 build + nginx:alpine) |

## Architecture

```
src/
├── api/                    # API layer
│   ├── client.ts           # Axios instance + interceptors (API key auth)
│   ├── endpoints.ts        # All API route constants (/api/v1/...)
│   ├── hooks/              # TanStack Query hooks (1 per endpoint group)
│   │   ├── mutations/      # POST/PUT/DELETE hooks (backtest, live, strategy, data)
│   │   ├── useAccountSnapshot.ts   # GET /account/snapshot (poll 10s)
│   │   ├── useLiveStatus.ts        # GET /live/status (poll 10s)
│   │   ├── useLiveTrades.ts        # GET /live/trades, /summary/* (poll 10s)
│   │   ├── useStrategies.ts        # GET /strategies, /active, /enabled
│   │   ├── useBacktestResults.ts   # GET /backtest/results, /{id}
│   │   └── useDataStatus.ts        # GET /data/status, /settings
│   └── types/              # TypeScript interfaces matching Java DTOs
│       ├── account.ts      # AccountSnapshot, OpenPosition
│       ├── backtest.ts     # BacktestResponse, BinanceBacktestRequest, MonteCarloResult, etc.
│       ├── live.ts         # LiveStatusResponse, TradeDecisionLog, DailyTradingSummary
│       ├── strategy.ts     # SavedStrategy, ActiveAssignment
│       ├── data.ts         # BackfillRequest, DataStatus, AppSetting
│       └── common.ts       # ApiError, PaginatedResponse
├── components/
│   ├── charts/             # EquityCurveChart (Recharts AreaChart)
│   ├── layout/             # AppLayout, Sidebar, TopBar, StatusBar
│   ├── shared/             # EmptyState, LoadingSkeleton, PageHeader
│   └── trading/            # MetricCard, PnlDisplay, StatusBadge, ParameterSlider
├── pages/                  # 1 file per route
│   ├── Dashboard.tsx       # /
│   ├── strategies/         # /strategies, /strategies/active
│   ├── backtest/           # /backtest, /backtest/results, /backtest/:id
│   ├── live/               # /live, /live/trades, /live/daily
│   ├── data/               # /data
│   └── settings/           # /settings
├── stores/
│   ├── themeStore.ts       # dark/light theme (Zustand + persist)
│   └── appStore.ts         # selectedSymbol, sidebarCollapsed (Zustand + persist)
├── lib/
│   ├── constants.ts        # SYMBOLS, INTERVALS, STRATEGIES, POLLING_INTERVALS, DEFAULT_BACKTEST_PARAMS
│   └── utils.ts            # cn(), formatCurrency(), formatPercent(), formatPrice(), etc.
├── App.tsx                 # Route definitions
├── main.tsx                # Entry: QueryClient, BrowserRouter, Toaster
└── index.css               # Tailwind + CSS custom properties (design tokens)
```

## Routing

| Path | Component | Backend Endpoints |
|------|-----------|------------------|
| `/` | Dashboard | `/account/snapshot`, `/live/status`, `/live/trades`, `/strategies/active/enabled`, `/live/summary/daily` |
| `/strategies` | StrategiesPage | `/strategies` + PUT deploy/reject |
| `/strategies/active` | ActiveStrategiesPage | `/strategies/active` + POST assign + DELETE |
| `/backtest` | BacktestPage | POST `/backtest/run/binance` + GET `/backtest/results` |
| `/backtest/results` | BacktestResultsPage | `/backtest/results` |
| `/backtest/:id` | BacktestDetailPage | `/backtest/{id}` |
| `/live` | LiveTradingPage | `/live/status`, `/live/summary/total` + POST start/stop |
| `/live/trades` | TradeLogsPage | `/live/trades` |
| `/live/daily` | DailySummaryPage | `/live/summary/daily` |
| `/data` | DataManagementPage | `/data/status` + POST backfill/sync |
| `/settings` | SettingsPage | `/settings` + PUT update |

## Backend API Contract

**Base URL**: `http://localhost:8080/api/v1` (dev proxy via Vite, nginx proxy in Docker)
**Auth**: `X-API-Key` header (value from `VITE_API_KEY` env var)

### Key Endpoints

```
GET  /account/snapshot              → AccountSnapshot
POST /backtest/run/binance          → BacktestResponse
POST /backtest/run/binance/optimize → BacktestResponse[]
POST /backtest/run/binance/compare  → CompareResponse
POST /backtest/{id}/monte-carlo     → MonteCarloResult
GET  /backtest/{id}                 → BacktestResponse
GET  /backtest/results              → BacktestResponse[]
POST /live/start                    → void
POST /live/stop                     → void
GET  /live/status                   → LiveStatusResponse
GET  /live/trades                   → TradeDecisionLog[]
GET  /live/summary/daily            → DailyTradingSummary[]
GET  /live/summary/total            → TotalSummary
GET  /strategies                    → SavedStrategy[]
GET  /strategies/best               → SavedStrategy[]
PUT  /strategies/{id}/deploy        → void
PUT  /strategies/{id}/reject        → void
GET  /strategies/active             → ActiveAssignment[]
GET  /strategies/active/enabled     → ActiveAssignment[]
POST /strategies/active/assign      → void
DELETE /strategies/active/{id}      → void
POST /data/backfill                 → void
POST /data/sync                     → void
GET  /data/status                   → DataStatus[]
GET  /settings                      → AppSetting[]
PUT  /settings/{key}                → void
```

## Theming

- Dark theme (default) + light theme via CSS custom properties
- Toggle in TopBar, persisted via Zustand + localStorage
- Theme class (`dark`/`light`) applied to `<html>` element
- All colors use CSS variables: `var(--color-bg-primary)`, `var(--color-accent)`, etc.
- Fonts: Inter (UI), JetBrains Mono (financial data, monospace)
- Color palette defined in `src/index.css` under `@theme` block

## Design Tokens (src/index.css)

```
Background: bg-primary (#0D1117), bg-secondary (#161B22), bg-tertiary (#1C2333)
Text: text-primary (#E6EDF3), text-secondary (#8B949E), text-muted (#6E7681)
Accent: accent (#2F81F7), success (#2EA043), danger (#DA3633), warning (#D29922)
Charts: candle-green (#26A69A), candle-red (#EF5350), SMA (#FF9800), RSI (#7C4DFF)
```

## Environment Variables

```
VITE_API_BASE_URL=http://localhost:8080   # Backend URL
VITE_API_KEY=changeme-dev-only            # API authentication key
```

## Docker

```bash
# Dev (frontend only)
npm run dev                          # http://localhost:5173

# Full stack (UI + API + PostgreSQL)
docker compose up                    # UI at :3000, API at :8080, PG at :5432
```

- `Dockerfile`: Multi-stage (node:22-alpine build → nginx:alpine)
- `nginx.conf`: SPA routing (`try_files $uri /index.html`), API proxy (`/api/` → `trading-bot-api:8080`)
- `docker-compose.yml`: 3 services (ui, trading-bot-api, postgres)

## Conventions

- **File naming**: PascalCase for components/pages, camelCase for hooks/utils/stores
- **API hooks**: One query hook per GET endpoint, grouped mutation hooks per domain
- **Polling**: 10s interval for live data (account, status, trades) via `refetchInterval`
- **State**: Zustand for UI state only (theme, sidebar, selected symbol). Server state always via TanStack Query.
- **Formatting**: `formatCurrency()`, `formatPercent()`, `formatPrice()` from `lib/utils.ts`
- **Styling**: Tailwind utility classes + CSS custom properties for theming. No CSS modules.
- **Component pattern**: Functional components, no class components. Props via interface.
- **Exports**: Default exports for pages/components, named exports for hooks/utils

## Known Gaps / TODO

- **Candlestick chart**: Lightweight Charts is installed but not yet integrated (requires backend candle endpoint)
- **Monte Carlo view**: API hook exists (`useRunMonteCarlo`) but no dedicated page yet
- **Walk-forward optimization**: Backend supports it but no UI page yet
- **Portfolio backtest**: API hook exists (`useRunPortfolioBacktest`) but no dedicated page yet
- **WebSocket**: Backend uses WS for Binance feed. Frontend currently polls REST. Future: add WS subscription for real-time trade updates.
- **Backend CORS**: Needs to be configured in SecurityConfig.java for localhost:5173 (dev) and localhost:3000 (Docker)
- **Backend equity curve**: BacktestResponse needs `equityCurve: EquityPoint[]` field for chart rendering

## Commands

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

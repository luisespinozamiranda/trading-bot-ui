# Trading Bot UI

Enterprise dashboard for a quantitative trading bot. Manage strategies, run backtests, control live paper trading, and analyze performance.

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS 4**, and **TanStack Query**.

## Screenshots

> Dark theme professional interface with sidebar navigation, metric cards, equity curves, and trade logs.

## Features

### Dashboard
- Portfolio overview (equity, cash, unrealized P/L)
- Open positions with real-time P/L
- Engine status indicator (running/stopped)
- Active strategies list
- Recent trades feed
- Daily performance summary

### Strategy Management
- Sortable/filterable strategy table (by symbol, status, score)
- Train/test metrics comparison
- Deploy and reject actions
- Active strategy assignments per symbol/interval

### Backtest Lab
- Full parameter configuration with interactive sliders
  - Indicators: SMA period, RSI period, RSI threshold
  - Risk: Take profit, stop loss, risk per trade
  - Costs: Fees, slippage, spread
- Backtest history sidebar with quick navigation
- Detailed results view with 8 key metrics
- Equity curve chart with initial capital reference line
- Trade list with CSV export

### Live Trading
- Start/stop paper trading engine
- Real-time trade decision logs with expandable detail rows
- Decision summaries explaining the "why" behind each trade
- Daily P/L summaries with bar chart visualization
- Cumulative performance metrics

### Data Management
- Multi-symbol/interval data backfill from Binance
- Sync latest candles
- Data availability status table

### Settings
- Inline editing of all application settings
- Grouped by category (live, binance, strategy)

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4.2 |
| Server State | TanStack React Query 5 |
| Global State | Zustand 5 |
| HTTP | Axios |
| Routing | React Router v6 |
| Charts | Recharts 3, Lightweight Charts 5 |
| Tables | TanStack Table v8 |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Notifications | Sonner |
| Deployment | Docker (nginx) |

## Quick Start

### Prerequisites

- Node.js 22+
- Backend running at `http://localhost:8080` (see [trading-bot](https://github.com/luisespinozamiranda/trading-bot))

### Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

The Vite dev server proxies `/api` requests to `http://localhost:8080`.

### Environment Variables

Create a `.env` file (see `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_KEY=changeme-dev-only
```

### Production Build

```bash
npm run build
npm run preview   # Preview at http://localhost:4173
```

## Docker

### Full Stack (UI + Backend + PostgreSQL)

```bash
docker compose up
```

| Service | Port | Description |
|---------|------|-------------|
| `ui` | 3000 | React app served by nginx |
| `trading-bot-api` | 8080 | Spring Boot backend |
| `postgres` | 5432 | PostgreSQL 16 |

### Frontend Only

```bash
docker build -t trading-bot-ui .
docker run -p 3000:80 trading-bot-ui
```

## Project Structure

```
src/
├── api/
│   ├── client.ts           # Axios instance (API key auth)
│   ├── endpoints.ts        # API route constants
│   ├── hooks/              # TanStack Query hooks
│   │   ├── mutations/      # POST/PUT/DELETE mutations
│   │   ├── useAccountSnapshot.ts
│   │   ├── useBacktestResults.ts
│   │   ├── useDataStatus.ts
│   │   ├── useLiveStatus.ts
│   │   ├── useLiveTrades.ts
│   │   └── useStrategies.ts
│   └── types/              # TypeScript interfaces (matching backend DTOs)
├── components/
│   ├── charts/             # EquityCurveChart
│   ├── layout/             # AppLayout, Sidebar, TopBar, StatusBar
│   ├── shared/             # EmptyState, LoadingSkeleton, PageHeader
│   └── trading/            # MetricCard, PnlDisplay, StatusBadge, ParameterSlider
├── pages/
│   ├── Dashboard.tsx
│   ├── strategies/         # StrategiesPage, ActiveStrategiesPage
│   ├── backtest/           # BacktestPage, BacktestResultsPage, BacktestDetailPage
│   ├── live/               # LiveTradingPage, TradeLogsPage, DailySummaryPage
│   ├── data/               # DataManagementPage
│   └── settings/           # SettingsPage
├── stores/                 # Zustand stores (theme, app state)
├── lib/                    # Constants, utilities, formatters
├── App.tsx                 # Route definitions
├── main.tsx                # Entry point
└── index.css               # Tailwind config + design tokens
```

## Backend Integration

This UI connects to the [trading-bot](https://github.com/luisespinozamiranda/trading-bot) Spring Boot backend.

### Required Backend Configuration

**CORS** must be enabled in `SecurityConfig.java`:

```java
http.cors(cors -> cors.configurationSource(request -> {
    var config = new CorsConfiguration();
    config.setAllowedOrigins(List.of(
        "http://localhost:5173",  // Vite dev
        "http://localhost:3000"   // Docker
    ));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    return config;
}));
```

### API Endpoints Used

| Method | Endpoint | UI Page |
|--------|----------|---------|
| GET | `/api/v1/account/snapshot` | Dashboard, StatusBar |
| GET | `/api/v1/live/status` | Dashboard, TopBar, Live Trading |
| GET | `/api/v1/live/trades` | Dashboard, Trade Logs |
| GET | `/api/v1/live/summary/daily` | Dashboard, Daily Summary |
| GET | `/api/v1/live/summary/total` | Live Trading |
| POST | `/api/v1/live/start` | Live Trading |
| POST | `/api/v1/live/stop` | Live Trading |
| GET | `/api/v1/strategies` | Strategies |
| GET | `/api/v1/strategies/active/enabled` | Dashboard |
| GET | `/api/v1/strategies/active` | Active Strategies |
| PUT | `/api/v1/strategies/{id}/deploy` | Strategies |
| PUT | `/api/v1/strategies/{id}/reject` | Strategies |
| POST | `/api/v1/strategies/active/assign` | Active Strategies |
| DELETE | `/api/v1/strategies/active/{id}` | Active Strategies |
| POST | `/api/v1/backtest/run/binance` | Backtest Lab |
| GET | `/api/v1/backtest/results` | Backtest Results |
| GET | `/api/v1/backtest/{id}` | Backtest Detail |
| POST | `/api/v1/data/backfill` | Data Management |
| POST | `/api/v1/data/sync` | Data Management |
| GET | `/api/v1/data/status` | Data Management |
| GET | `/api/v1/settings` | Settings |
| PUT | `/api/v1/settings/{key}` | Settings |

## Design

### Theme

Dark theme (default) with light theme toggle. All colors use CSS custom properties for seamless switching.

**Dark palette**: `#0D1117` background, `#E6EDF3` text, `#2F81F7` accent, `#2EA043` profit, `#DA3633` loss

### Typography

- **UI text**: Inter (400/500/600/700)
- **Financial data**: JetBrains Mono (monospace for numbers and prices)

## Scripts

```bash
npm run dev       # Development server (port 5173)
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## License

Private

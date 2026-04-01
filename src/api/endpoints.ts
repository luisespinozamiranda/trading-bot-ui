const API = {
  account: {
    snapshot: '/api/v1/account/snapshot',
  },
  backtest: {
    run: '/api/v1/backtest/run',
    runAsync: '/api/v1/backtest/run/async',
    runBinance: '/api/v1/backtest/run/binance',
    optimize: '/api/v1/backtest/run/binance/optimize',
    compare: '/api/v1/backtest/run/binance/compare',
    monteCarlo: (id: string) => `/api/v1/backtest/${id}/monte-carlo`,
    getById: (id: string) => `/api/v1/backtest/${id}`,
    results: '/api/v1/backtest/results',
  },
  portfolio: {
    run: '/api/v1/backtest/portfolio/run',
  },
  live: {
    start: '/api/v1/live/start',
    stop: '/api/v1/live/stop',
    status: '/api/v1/live/status',
    trades: '/api/v1/live/trades',
    dailySummary: '/api/v1/live/summary/daily',
    totalSummary: '/api/v1/live/summary/total',
    reload: '/api/v1/live/reload',
  },
  strategies: {
    list: '/api/v1/strategies',
    best: '/api/v1/strategies/best',
    bySymbol: (symbol: string) => `/api/v1/strategies/${symbol}`,
    deploy: (id: number) => `/api/v1/strategies/${id}/deploy`,
    reject: (id: number) => `/api/v1/strategies/${id}/reject`,
  },
  activeStrategies: {
    list: '/api/v1/strategies/active',
    enabled: '/api/v1/strategies/active/enabled',
    assign: '/api/v1/strategies/active/assign',
    delete: (id: number) => `/api/v1/strategies/active/${id}`,
  },
  data: {
    backfill: '/api/v1/data/backfill',
    sync: '/api/v1/data/sync',
    status: '/api/v1/data/status',
    candles: '/api/v1/data/candles',
  },
  settings: {
    list: '/api/v1/settings',
    update: (key: string) => `/api/v1/settings/${key}`,
  },
} as const

export default API

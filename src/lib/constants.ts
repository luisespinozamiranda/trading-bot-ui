export const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'] as const
export type Symbol = (typeof SYMBOLS)[number]

export const INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1d'] as const
export type Interval = (typeof INTERVALS)[number]

export const STRATEGIES = ['rsi_crossover', 'trend_pullback'] as const
export type StrategyName = (typeof STRATEGIES)[number]

export const STRATEGY_DISPLAY_NAMES: Record<StrategyName, string> = {
  rsi_crossover: 'RSI Crossover',
  trend_pullback: 'Trend Pullback',
}

export const STRATEGY_STATUS = {
  VALIDATED: 'VALIDATED',
  DEPLOYED: 'DEPLOYED',
  REJECTED: 'REJECTED',
} as const
export type StrategyStatus = (typeof STRATEGY_STATUS)[keyof typeof STRATEGY_STATUS]

export const POLLING_INTERVALS = {
  ACCOUNT: 10_000,
  LIVE_STATUS: 10_000,
  LIVE_TRADES: 10_000,
} as const

export const DEFAULT_BACKTEST_PARAMS: Record<string, number> = {
  smaPeriod: 50,
  rsiPeriod: 14,
  rsiThreshold: 45,
  takeProfitPercent: 8.0,
  stopLossPercent: 3.0,
  feePercent: 0.1,
  slippagePercent: 0.05,
  spreadPercent: 0.02,
  riskPerTradePercent: 1.5,
  initialCapital: 10000,
  candleLimit: 365,
  trainSizePercent: 70,
}

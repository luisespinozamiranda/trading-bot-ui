export interface TradeDto {
  entryPrice: number
  exitPrice: number
  grossProfitPercent: number
  netProfitPercent: number
  netProfitAmount: number
  totalFees: number
  capitalAtEntry: number
  positionSize: number
  entryTime: string
  exitTime: string
  duration: string
}

export interface BacktestResponse {
  id: string
  symbol: string
  timeframe: string
  experimentName: string
  status: string
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  netProfitPercent: number
  netProfitDollar: number
  maxDrawdown: number
  profitFactor: number
  sharpeRatio: number
  sortinoRatio: number
  expectancy: number
  initialCapital: number
  finalCapital: number
  totalFees: number
  trades: TradeDto[]
  equityCurve: EquityPoint[]
  executedAt: string
}

export interface EquityPoint {
  timestamp: string
  capital: number
  drawdownPercent: number
}

export interface BinanceBacktestRequest {
  symbol: string
  interval: string
  candleLimit: number
  experimentName: string
  initialCapital: number
  strategyName: string
  smaPeriod: number
  rsiPeriod: number
  rsiThreshold: number
  takeProfitPercent: number
  stopLossPercent: number
  feePercent: number
  slippagePercent: number
  spreadPercent: number
  riskPerTradePercent: number
}

export interface OptimizeRequest {
  symbol: string
  interval: string
  candleLimit: number
  trainSizePercent: number
  targetMetric: string
  smaPeriodRange: number[]
  rsiThresholdRange: number[]
  takeProfitRange: number[]
  stopLossRange: number[]
}

export interface MonteCarloRequest {
  simulations: number
}

export interface MonteCarloResult {
  simulations: number
  probabilityOfProfit: number
  medianFinalCapital: number
  p5FinalCapital: number
  p25FinalCapital: number
  p75FinalCapital: number
  p95FinalCapital: number
  medianMaxDrawdown: number
  p95MaxDrawdown: number
}

export interface CompareRequest {
  symbol: string
  interval: string
  candleLimit: number
  variants: BinanceBacktestRequest[]
}

export interface CompareResponse {
  results: BacktestResponse[]
  bestVariant: string
}

export interface PortfolioBacktestRequest {
  initialCapital: number
  maxPositionPercent: number
  maxConcurrentPositions: number
  entries: PortfolioEntry[]
}

export interface PortfolioEntry {
  symbol: string
  interval: string
  strategyName: string
  smaPeriod: number
  rsiPeriod: number
  rsiThreshold: number
  takeProfitPercent: number
  stopLossPercent: number
  feePercent: number
  slippagePercent: number
  riskPerTradePercent: number
  candleLimit: number
}

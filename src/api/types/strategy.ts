export interface SavedStrategy {
  id: number
  symbol: string
  interval: string
  strategyName: string
  smaPeriod: number
  rsiPeriod: number
  rsiThreshold: number
  takeProfitPct: number
  stopLossPct: number
  trainProfitPct: number
  testProfitPct: number
  profitFactor: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  trainTrades: number
  testTrades: number
  score: number
  status: string
  createdAt: string
}

export interface ActiveAssignment {
  id: number
  symbol: string
  interval: string
  strategyId: number
  strategyName: string
  enabled: boolean
  assignedAt: string
}

export interface AssignStrategyRequest {
  symbol: string
  interval: string
  strategyId: number
}

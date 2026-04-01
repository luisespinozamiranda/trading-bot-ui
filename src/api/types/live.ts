export interface EngineDetail {
  symbol: string
  interval: string
  strategyName: string
  running: boolean
  hasOpenPosition: boolean
}

export interface LiveStatusResponse {
  managerRunning: boolean
  wsConnected: boolean
  totalEquity: number
  cashBalance: number
  openPositions: number
  engines: EngineDetail[]
}

export interface ReloadResult {
  symbol: string
  interval: string
  status: string
}

export interface ReloadResponse {
  engines: ReloadResult[]
  reloaded: number
  skipped: number
  removed: number
  added: number
}

export interface TradeDecisionLog {
  id: number
  tradeId: string
  symbol: string
  action: 'BUY' | 'SELL'
  price: number
  quantity: number
  positionSize: number
  pnlPercent: number
  pnlAmount: number
  commission: number
  capitalBefore: number
  capitalAfter: number
  timestamp: string
  exitReason: string | null
  decisionSummary: string
}

export interface DailyTradingSummary {
  date: string
  tradesOpened: number
  tradesClosed: number
  realizedPnl: number
  totalEquity: number
  dailyReturnPercent: number
  drawdownFromPeak: number
}

export interface TotalSummary {
  entries: number
  exits: number
  wins: number
  winRate: number
  totalPnl: number
  currentCapital: number
}

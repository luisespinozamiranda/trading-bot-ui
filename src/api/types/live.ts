export interface LiveTradingRequest {
  symbol: string
  interval: string
  initialCapital: number
}

export interface LiveStatusResponse {
  running: boolean
  symbol: string
  interval: string
  currentCapital: number
  openPositions: number
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

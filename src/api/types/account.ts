export interface OpenPosition {
  symbol: string
  quantity: number
  entryPrice: number
  currentPrice: number
  unrealizedPnl: number
}

export interface AccountSnapshot {
  totalEquity: number
  availableCash: number
  unrealizedPnl: number
  openPositions: OpenPosition[]
  timestamp: string
}

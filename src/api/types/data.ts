export interface BackfillRequest {
  symbols: string[]
  intervals: string[]
  monthsBack: number
}

export interface SyncRequest {
  symbols: string[]
  intervals: string[]
}

export interface DataStatus {
  symbol: string
  interval: string
  totalCandles: number
  firstCandle: string | null
  lastCandle: string | null
}

export interface AppSetting {
  key: string
  value: string
  category: string
}

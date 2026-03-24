import { useQuery } from '@tanstack/react-query'
import apiClient from '../client'
import API from '../endpoints'
import type { TradeDecisionLog, DailyTradingSummary, TotalSummary } from '../types'
import { POLLING_INTERVALS } from '@/lib/constants'

export function useLiveTrades() {
  return useQuery<TradeDecisionLog[]>({
    queryKey: ['live', 'trades'],
    queryFn: async () => {
      const { data } = await apiClient.get<TradeDecisionLog[]>(API.live.trades)
      return data
    },
    refetchInterval: POLLING_INTERVALS.LIVE_TRADES,
  })
}

export function useDailySummaries() {
  return useQuery<DailyTradingSummary[]>({
    queryKey: ['live', 'summary', 'daily'],
    queryFn: async () => {
      const { data } = await apiClient.get<DailyTradingSummary[]>(API.live.dailySummary)
      return data
    },
    refetchInterval: POLLING_INTERVALS.LIVE_TRADES,
  })
}

export function useTotalSummary() {
  return useQuery<TotalSummary>({
    queryKey: ['live', 'summary', 'total'],
    queryFn: async () => {
      const { data } = await apiClient.get<TotalSummary>(API.live.totalSummary)
      return data
    },
    refetchInterval: POLLING_INTERVALS.LIVE_TRADES,
  })
}

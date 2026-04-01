import { useQuery } from '@tanstack/react-query'
import apiClient from '../client'
import API from '../endpoints'
import type { CandleData } from '../types'

export function useCandles(symbol: string, interval: string, limit = 500) {
  return useQuery<CandleData[]>({
    queryKey: ['data', 'candles', symbol, interval],
    queryFn: async () => {
      const { data } = await apiClient.get<CandleData[]>(API.data.candles, {
        params: { symbol, interval, limit },
      })
      return data
    },
    enabled: !!symbol,
  })
}

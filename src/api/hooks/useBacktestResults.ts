import { useQuery } from '@tanstack/react-query'
import apiClient from '../client'
import API from '../endpoints'
import type { BacktestResponse } from '../types'

export function useBacktestResults() {
  return useQuery<BacktestResponse[]>({
    queryKey: ['backtest', 'results'],
    queryFn: async () => {
      const { data } = await apiClient.get<BacktestResponse[]>(API.backtest.results)
      return data
    },
  })
}

export function useBacktestById(id: string | undefined) {
  return useQuery<BacktestResponse>({
    queryKey: ['backtest', id],
    queryFn: async () => {
      const { data } = await apiClient.get<BacktestResponse>(API.backtest.getById(id!))
      return data
    },
    enabled: !!id,
  })
}

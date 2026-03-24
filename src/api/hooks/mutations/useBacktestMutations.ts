import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../client'
import API from '../../endpoints'
import type {
  BinanceBacktestRequest,
  BacktestResponse,
  OptimizeRequest,
  MonteCarloRequest,
  MonteCarloResult,
  CompareRequest,
  CompareResponse,
  PortfolioBacktestRequest,
} from '../../types'

export function useRunBinanceBacktest() {
  const queryClient = useQueryClient()

  return useMutation<BacktestResponse, Error, BinanceBacktestRequest>({
    mutationFn: async (request) => {
      const { data } = await apiClient.post<BacktestResponse>(API.backtest.runBinance, request)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backtest', 'results'] })
    },
  })
}

export function useOptimize() {
  return useMutation<BacktestResponse[], Error, OptimizeRequest>({
    mutationFn: async (request) => {
      const { data } = await apiClient.post<BacktestResponse[]>(API.backtest.optimize, request)
      return data
    },
  })
}

export function useRunMonteCarlo(backtestId: string) {
  return useMutation<MonteCarloResult, Error, MonteCarloRequest>({
    mutationFn: async (request) => {
      const { data } = await apiClient.post<MonteCarloResult>(
        API.backtest.monteCarlo(backtestId),
        request,
      )
      return data
    },
  })
}

export function useCompareStrategies() {
  return useMutation<CompareResponse, Error, CompareRequest>({
    mutationFn: async (request) => {
      const { data } = await apiClient.post<CompareResponse>(API.backtest.compare, request)
      return data
    },
  })
}

export function useRunPortfolioBacktest() {
  return useMutation<BacktestResponse, Error, PortfolioBacktestRequest>({
    mutationFn: async (request) => {
      const { data } = await apiClient.post<BacktestResponse>(API.portfolio.run, request)
      return data
    },
  })
}

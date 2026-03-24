import { useQuery } from '@tanstack/react-query'
import apiClient from '../client'
import API from '../endpoints'
import type { SavedStrategy, ActiveAssignment } from '../types'

export function useStrategies() {
  return useQuery<SavedStrategy[]>({
    queryKey: ['strategies'],
    queryFn: async () => {
      const { data } = await apiClient.get<SavedStrategy[]>(API.strategies.list)
      return data
    },
  })
}

export function useBestStrategies() {
  return useQuery<SavedStrategy[]>({
    queryKey: ['strategies', 'best'],
    queryFn: async () => {
      const { data } = await apiClient.get<SavedStrategy[]>(API.strategies.best)
      return data
    },
  })
}

export function useStrategiesBySymbol(symbol: string) {
  return useQuery<SavedStrategy[]>({
    queryKey: ['strategies', symbol],
    queryFn: async () => {
      const { data } = await apiClient.get<SavedStrategy[]>(API.strategies.bySymbol(symbol))
      return data
    },
    enabled: !!symbol,
  })
}

export function useActiveStrategies() {
  return useQuery<ActiveAssignment[]>({
    queryKey: ['strategies', 'active'],
    queryFn: async () => {
      const { data } = await apiClient.get<ActiveAssignment[]>(API.activeStrategies.list)
      return data
    },
  })
}

export function useEnabledStrategies() {
  return useQuery<ActiveAssignment[]>({
    queryKey: ['strategies', 'active', 'enabled'],
    queryFn: async () => {
      const { data } = await apiClient.get<ActiveAssignment[]>(API.activeStrategies.enabled)
      return data
    },
  })
}

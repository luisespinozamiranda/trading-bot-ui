import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../client'
import API from '../../endpoints'
import type { ReloadResponse } from '../../types'

export function useStartLiveTrading() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await apiClient.post(API.live.start)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live'] })
    },
  })
}

export function useStopLiveTrading() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await apiClient.post(API.live.stop)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live'] })
    },
  })
}

export function useReloadStrategies() {
  const queryClient = useQueryClient()

  return useMutation<ReloadResponse, Error, void>({
    mutationFn: async () => {
      const { data } = await apiClient.post<ReloadResponse>(API.live.reload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live'] })
    },
  })
}

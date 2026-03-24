import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../client'
import API from '../../endpoints'
import type { LiveTradingRequest } from '../../types'

export function useStartLiveTrading() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, LiveTradingRequest>({
    mutationFn: async (request) => {
      await apiClient.post(API.live.start, request)
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

import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../client'
import API from '../../endpoints'
import type { BackfillRequest, SyncRequest } from '../../types'

export function useBackfillData() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, BackfillRequest>({
    mutationFn: async (request) => {
      await apiClient.post(API.data.backfill, request)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'status'] })
    },
  })
}

export function useSyncData() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, SyncRequest>({
    mutationFn: async (request) => {
      await apiClient.post(API.data.sync, request)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', 'status'] })
    },
  })
}

export function useUpdateSetting() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { key: string; value: string }>({
    mutationFn: async ({ key, value }) => {
      await apiClient.put(API.settings.update(key), { value })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}

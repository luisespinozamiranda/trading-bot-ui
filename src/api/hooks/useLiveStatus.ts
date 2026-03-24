import { useQuery } from '@tanstack/react-query'
import apiClient from '../client'
import API from '../endpoints'
import type { LiveStatusResponse } from '../types'
import { POLLING_INTERVALS } from '@/lib/constants'

export function useLiveStatus() {
  return useQuery<LiveStatusResponse>({
    queryKey: ['live', 'status'],
    queryFn: async () => {
      const { data } = await apiClient.get<LiveStatusResponse>(API.live.status)
      return data
    },
    refetchInterval: POLLING_INTERVALS.LIVE_STATUS,
  })
}

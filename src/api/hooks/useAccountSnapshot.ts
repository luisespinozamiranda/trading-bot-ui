import { useQuery } from '@tanstack/react-query'
import apiClient from '../client'
import API from '../endpoints'
import type { AccountSnapshot } from '../types'
import { POLLING_INTERVALS } from '@/lib/constants'

export function useAccountSnapshot() {
  return useQuery<AccountSnapshot>({
    queryKey: ['account', 'snapshot'],
    queryFn: async () => {
      const { data } = await apiClient.get<AccountSnapshot>(API.account.snapshot)
      return data
    },
    refetchInterval: POLLING_INTERVALS.ACCOUNT,
  })
}

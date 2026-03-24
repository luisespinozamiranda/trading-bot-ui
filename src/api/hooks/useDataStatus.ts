import { useQuery } from '@tanstack/react-query'
import apiClient from '../client'
import API from '../endpoints'
import type { DataStatus, AppSetting } from '../types'

export function useDataStatus() {
  return useQuery<DataStatus[]>({
    queryKey: ['data', 'status'],
    queryFn: async () => {
      const { data } = await apiClient.get<DataStatus[]>(API.data.status)
      return data
    },
  })
}

export function useSettings() {
  return useQuery<AppSetting[]>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await apiClient.get<AppSetting[]>(API.settings.list)
      return data
    },
  })
}

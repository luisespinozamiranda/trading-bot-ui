import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../client'
import API from '../../endpoints'
import type { AssignStrategyRequest } from '../../types'

export function useDeployStrategy() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.put(API.strategies.deploy(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] })
    },
  })
}

export function useRejectStrategy() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.put(API.strategies.reject(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] })
    },
  })
}

export function useAssignStrategy() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, AssignStrategyRequest>({
    mutationFn: async (request) => {
      await apiClient.post(API.activeStrategies.assign, request)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies', 'active'] })
    },
  })
}

export function useDisableAssignment() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(API.activeStrategies.delete(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies', 'active'] })
    },
  })
}

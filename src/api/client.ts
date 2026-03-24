import axios from 'axios'
import type { ApiError } from './types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

apiClient.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_API_KEY
  if (apiKey) {
    config.headers['X-API-Key'] = apiKey
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      status: error.response?.status ?? 500,
      message: error.response?.data?.message ?? error.message ?? 'Unknown error',
      timestamp: new Date().toISOString(),
    }
    return Promise.reject(apiError)
  },
)

export default apiClient

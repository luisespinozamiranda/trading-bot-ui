export interface ApiError {
  status: number
  message: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}

import type { Exercise, Workout, AuthToken } from '../../api/types'

export type { Exercise, Workout, AuthToken }

/** API error response shape */
export interface ApiError {
  error: string
}

/** Type guard for API error responses */
export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof (value as ApiError).error === 'string'
  )
}

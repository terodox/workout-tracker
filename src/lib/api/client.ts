import { isApiError } from './types'

const TOKEN_KEY = 'workout_auth_token'
const EXPIRES_KEY = 'workout_auth_expires'

/** Get stored auth token if valid */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem(TOKEN_KEY)
  const expires = localStorage.getItem(EXPIRES_KEY)
  if (!token || !expires) return null
  if (new Date(expires) <= new Date()) {
    clearStoredToken()
    return null
  }
  return token
}

/** Store auth token */
export function setStoredToken(token: string, expiresAt: string): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(EXPIRES_KEY, expiresAt)
}

/** Clear stored auth token */
export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EXPIRES_KEY)
}

/** Custom error for API failures */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

/**
 * Base fetch wrapper with auth header injection.
 * Throws ApiClientError on non-ok responses.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`/api${path}`, { ...options, headers })

  if (!response.ok) {
    const data: unknown = await response.json().catch(() => ({}))
    const message = isApiError(data) ? data.error : 'Request failed'
    throw new ApiClientError(message, response.status)
  }

  return response.json() as Promise<T>
}

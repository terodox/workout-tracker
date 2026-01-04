import { apiFetch, setStoredToken } from './client'
import type { AuthToken } from './types'

/**
 * Authenticate with password and store token.
 */
export async function login(password: string): Promise<AuthToken> {
  const result = await apiFetch<AuthToken>('/auth', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
  setStoredToken(result.token, result.expiresAt)
  return result
}

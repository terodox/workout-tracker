import type { AuthToken } from '../types'

const PREFIX = 'tokens:'

/**
 * Storage operations for auth tokens in KV with TTL support.
 */
export const TokenStore = {
  async get(kv: KVNamespace, token: string): Promise<AuthToken | null> {
    const data = await kv.get(PREFIX + token)
    return data ? JSON.parse(data) : null
  },

  async save(kv: KVNamespace, authToken: AuthToken, ttlSeconds: number): Promise<void> {
    await kv.put(PREFIX + authToken.token, JSON.stringify(authToken), {
      expirationTtl: ttlSeconds,
    })
  },

  async delete(kv: KVNamespace, token: string): Promise<void> {
    await kv.delete(PREFIX + token)
  },
}

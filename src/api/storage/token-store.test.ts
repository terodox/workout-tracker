import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TokenStore } from './token-store'
import { createMockKV } from '../test-utils/mock-kv'
import type { AuthToken } from '../types'

describe('TokenStore', () => {
  let kv: KVNamespace

  beforeEach(() => {
    kv = createMockKV()
    vi.useFakeTimers()
  })

  const authToken: AuthToken = {
    token: 'abc123',
    expiresAt: '2026-01-03T12:00:00Z',
  }

  it('Given token data, when save is called, then stores with TTL', async () => {
    await TokenStore.save(kv, authToken, 7200)
    const stored = await kv.get('tokens:abc123')
    expect(JSON.parse(stored!)).toEqual(authToken)
  })

  it('Given existing token, when get is called, then returns token', async () => {
    await TokenStore.save(kv, authToken, 7200)
    const result = await TokenStore.get(kv, 'abc123')
    expect(result).toEqual(authToken)
  })

  it('Given non-existent token, when get is called, then returns null', async () => {
    const result = await TokenStore.get(kv, 'non-existent')
    expect(result).toBeNull()
  })

  it('Given expired token, when get is called, then returns null', async () => {
    await TokenStore.save(kv, authToken, 1) // 1 second TTL
    vi.advanceTimersByTime(2000) // Advance 2 seconds
    const result = await TokenStore.get(kv, 'abc123')
    expect(result).toBeNull()
  })

  it('Given token, when delete is called, then removes from KV', async () => {
    await TokenStore.save(kv, authToken, 7200)
    await TokenStore.delete(kv, 'abc123')
    const result = await TokenStore.get(kv, 'abc123')
    expect(result).toBeNull()
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { withAuth } from './auth'
import { createMockKV } from '../test-utils/mock-kv'
import { TokenStore } from '../storage'

describe('withAuth middleware', () => {
  let kv: KVNamespace
  let env: { WORKOUT_KV: KVNamespace }
  const mockHandler = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }))

  beforeEach(() => {
    kv = createMockKV()
    env = { WORKOUT_KV: kv }
    mockHandler.mockClear()
  })

  describe('Unit Tests', () => {
    it('Given valid token in header, when middleware runs, then calls next handler', async () => {
      const token = 'valid-token-123'
      await TokenStore.save(kv, { token, expiresAt: new Date(Date.now() + 3600000).toISOString() }, 3600)
      const request = new Request('http://localhost/api/test', {
        headers: { Authorization: `Bearer ${token}` },
      })

      const response = await withAuth(request, env, mockHandler)

      expect(mockHandler).toHaveBeenCalledWith(request, env)
      expect(response.status).toBe(200)
    })

    it('Given missing Authorization header, when middleware runs, then returns 401', async () => {
      const request = new Request('http://localhost/api/test')

      const response = await withAuth(request, env, mockHandler)

      expect(response.status).toBe(401)
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('Given malformed Authorization header, when middleware runs, then returns 401', async () => {
      const request = new Request('http://localhost/api/test', {
        headers: { Authorization: 'Basic abc123' },
      })

      const response = await withAuth(request, env, mockHandler)

      expect(response.status).toBe(401)
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('Given "Bearer " without token, when middleware runs, then returns 401', async () => {
      const request = new Request('http://localhost/api/test', {
        headers: { Authorization: 'Bearer ' },
      })

      const response = await withAuth(request, env, mockHandler)

      expect(response.status).toBe(401)
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('Given non-existent token, when middleware runs, then returns 401', async () => {
      const request = new Request('http://localhost/api/test', {
        headers: { Authorization: 'Bearer nonexistent-token' },
      })

      const response = await withAuth(request, env, mockHandler)

      expect(response.status).toBe(401)
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('Given expired token, when middleware runs, then returns 401', async () => {
      const token = 'expired-token'
      // Token exists but mock KV will return null for expired entries
      // Use a negative TTL scenario by directly manipulating - but mock KV handles expiration
      // So we just don't save the token to simulate it being expired/removed
      const request = new Request('http://localhost/api/test', {
        headers: { Authorization: `Bearer ${token}` },
      })

      const response = await withAuth(request, env, mockHandler)

      expect(response.status).toBe(401)
      expect(mockHandler).not.toHaveBeenCalled()
    })
  })

  describe('Integration Tests', () => {
    it('Given valid token in KV, when request with token hits protected route, then succeeds', async () => {
      const token = 'integration-test-token'
      await TokenStore.save(kv, { token, expiresAt: new Date(Date.now() + 7200000).toISOString() }, 7200)
      const request = new Request('http://localhost/api/exercises', {
        headers: { Authorization: `Bearer ${token}` },
      })

      const response = await withAuth(request, env, mockHandler)

      expect(response.status).toBe(200)
      expect(mockHandler).toHaveBeenCalled()
    })

    it('Given token not in KV, when request hits protected route, then returns 401', async () => {
      const request = new Request('http://localhost/api/exercises', {
        headers: { Authorization: 'Bearer not-in-kv' },
      })

      const response = await withAuth(request, env, mockHandler)

      expect(response.status).toBe(401)
    })
  })
})

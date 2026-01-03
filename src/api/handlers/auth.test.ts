import { beforeEach, describe, expect, it } from 'vitest'
import { createMockKV } from '../test-utils/mock-kv'
import { createMockRequest } from '../test-utils/mock-request'
import { TOKEN_TTL_SECONDS } from '../utils/token'
import { handleAuth } from './auth'

describe('handleAuth', () => {
  const AUTH_PASSWORD = 'test-password'
  let kv: KVNamespace
  let env: { WORKOUT_KV: KVNamespace; AUTH_PASSWORD: string }

  beforeEach(() => {
    kv = createMockKV()
    env = { WORKOUT_KV: kv, AUTH_PASSWORD }
  })

  describe('Unit Tests', () => {
    it('Given correct password, when auth is called, then returns token and expiresAt', async () => {
      const request = createMockRequest('POST', '/api/auth', {
        body: { password: AUTH_PASSWORD },
      })

      const response = await handleAuth(request, env)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.token).toMatch(/^[a-f0-9]{64}$/)
      expect(data.expiresAt).toBeDefined()
      expect(new Date(data.expiresAt).getTime()).toBeGreaterThan(Date.now())
    })

    it('Given incorrect password, when auth is called, then returns 401', async () => {
      const request = createMockRequest('POST', '/api/auth', {
        body: { password: 'wrong' },
      })

      const response = await handleAuth(request, env)

      expect(response.status).toBe(401)
    })

    it('Given missing password in body, when auth is called, then returns 400', async () => {
      const request = createMockRequest('POST', '/api/auth', { body: {} })

      const response = await handleAuth(request, env)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Password is required')
    })

    it('Given empty password, when auth is called, then returns 400', async () => {
      const request = createMockRequest('POST', '/api/auth', {
        body: { password: '' },
      })

      const response = await handleAuth(request, env)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Password is required')
    })

    it('Given malformed JSON body, when auth is called, then returns 400', async () => {
      const request = new Request('http://localhost/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not json',
      })

      const response = await handleAuth(request, env)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid JSON body')
    })
  })

  describe('Integration Tests', () => {
    it('Given correct password, when POST /api/auth, then token is stored in KV', async () => {
      const request = createMockRequest('POST', '/api/auth', {
        body: { password: AUTH_PASSWORD },
      })

      const response = await handleAuth(request, env)
      const data = await response.json()

      const stored = await kv.get(`tokens:${data.token}`)
      expect(stored).not.toBeNull()
      const parsed = JSON.parse(stored!)
      expect(parsed.token).toBe(data.token)
      expect(parsed.expiresAt).toBe(data.expiresAt)
    })

    it('Given correct password, when POST /api/auth, then token TTL is ~2 hours', async () => {
      const request = createMockRequest('POST', '/api/auth', {
        body: { password: AUTH_PASSWORD },
      })

      const response = await handleAuth(request, env)
      const data = await response.json()

      const expiresAt = new Date(data.expiresAt).getTime()
      const expectedExpiry = Date.now() + TOKEN_TTL_SECONDS * 1000
      // Allow 5 second tolerance
      expect(Math.abs(expiresAt - expectedExpiry)).toBeLessThan(5000)
    })
  })
})

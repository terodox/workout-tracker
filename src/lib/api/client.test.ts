import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  apiFetch,
  ApiClientError,
} from './client'

describe('client', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('token storage', () => {
    it('Given valid token stored, when getStoredToken called, then returns token', () => {
      const futureDate = new Date(Date.now() + 3600000).toISOString()
      setStoredToken('test-token', futureDate)
      expect(getStoredToken()).toBe('test-token')
    })

    it('Given no token stored, when getStoredToken called, then returns null', () => {
      expect(getStoredToken()).toBeNull()
    })

    it('Given expired token, when getStoredToken called, then returns null', () => {
      const pastDate = new Date(Date.now() - 1000).toISOString()
      setStoredToken('expired-token', pastDate)
      expect(getStoredToken()).toBeNull()
    })

    it('Given token stored, when clearStoredToken called, then token is removed', () => {
      const futureDate = new Date(Date.now() + 3600000).toISOString()
      setStoredToken('test-token', futureDate)
      clearStoredToken()
      expect(getStoredToken()).toBeNull()
    })
  })

  describe('apiFetch', () => {
    it('Given successful response, when apiFetch called, then returns data', async () => {
      const mockData = { id: '1', name: 'Test' }
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response)

      const result = await apiFetch('/test')
      expect(result).toEqual(mockData)
    })

    it('Given valid token, when apiFetch called, then includes Authorization header', async () => {
      const futureDate = new Date(Date.now() + 3600000).toISOString()
      setStoredToken('my-token', futureDate)

      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response)

      await apiFetch('/test')

      expect(fetchSpy).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer my-token',
          }),
        })
      )
    })

    it('Given error response, when apiFetch called, then throws ApiClientError', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Bad request' }),
      } as Response)

      await expect(apiFetch('/test')).rejects.toThrow(ApiClientError)
      await expect(apiFetch('/test')).rejects.toMatchObject({
        message: 'Bad request',
        status: 400,
      })
    })

    it('Given 401 response, when apiFetch called, then throws with status 401', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      } as Response)

      await expect(apiFetch('/test')).rejects.toMatchObject({
        status: 401,
      })
    })
  })
})

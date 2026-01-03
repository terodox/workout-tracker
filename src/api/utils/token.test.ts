import { describe, it, expect } from 'vitest'
import { generateToken, TOKEN_TTL_SECONDS } from './token'

describe('token', () => {
  describe('generateToken', () => {
    it('Given generateToken called, when executed, then returns 64 character hex string', () => {
      const token = generateToken()
      expect(token).toMatch(/^[a-f0-9]{64}$/)
    })

    it('Given generateToken called twice, when compared, then returns different tokens', () => {
      const token1 = generateToken()
      const token2 = generateToken()
      expect(token1).not.toBe(token2)
    })
  })

  describe('TOKEN_TTL_SECONDS', () => {
    it('Given TOKEN_TTL_SECONDS, when checked, then equals 2 hours in seconds', () => {
      expect(TOKEN_TTL_SECONDS).toBe(7200)
    })
  })
})

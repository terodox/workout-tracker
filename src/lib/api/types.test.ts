import { describe, it, expect, beforeEach, vi } from 'vitest'
import { isApiError } from './types'

describe('types', () => {
  describe('isApiError', () => {
    it('Given object with error string, when checked, then returns true', () => {
      expect(isApiError({ error: 'Something went wrong' })).toBe(true)
    })

    it('Given object without error, when checked, then returns false', () => {
      expect(isApiError({ message: 'test' })).toBe(false)
    })

    it('Given null, when checked, then returns false', () => {
      expect(isApiError(null)).toBe(false)
    })

    it('Given string, when checked, then returns false', () => {
      expect(isApiError('error')).toBe(false)
    })
  })
})

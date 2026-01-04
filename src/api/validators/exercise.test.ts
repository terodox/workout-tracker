import { describe, expect, it } from 'vitest'
import { ApiError } from '../utils/errors'
import { validateExercise } from './exercise'

describe('validateExercise', () => {
  describe('Given valid exercise data', () => {
    it('When exercise has name and repCount, then passes validation', () => {
      const data = { name: 'Push-ups', repCount: 10 }
      const result = validateExercise(data)

      expect(result).toEqual({
        id: '',
        name: 'Push-ups',
        repCount: 10,
      })
    })

    it('When exercise has name and duration, then passes validation', () => {
      const data = { name: 'Plank', duration: 60 }
      const result = validateExercise(data)

      expect(result).toEqual({
        id: '',
        name: 'Plank',
        duration: 60,
      })
    })

    it('When exercise has valid imageUrl, then includes it', () => {
      const data = {
        name: 'Push-ups',
        repCount: 10,
        imageUrl: 'https://example.com/image.jpg',
      }
      const result = validateExercise(data)

      expect(result.imageUrl).toBe('https://example.com/image.jpg')
    })

    it('When exercise has valid videoUrl, then includes it', () => {
      const data = {
        name: 'Push-ups',
        repCount: 10,
        videoUrl: 'https://youtube.com/watch?v=123',
      }
      const result = validateExercise(data)

      expect(result.videoUrl).toBe('https://youtube.com/watch?v=123')
    })

    it('When exercise name has whitespace, then trims it', () => {
      const data = { name: '  Push-ups  ', repCount: 10 }
      const result = validateExercise(data)

      expect(result.name).toBe('Push-ups')
    })
  })

  describe('Given invalid exercise data', () => {
    it('When data is not an object, then throws 400', () => {
      expect(() => validateExercise(null)).toThrow(ApiError)
      expect(() => validateExercise('string')).toThrow(ApiError)
      expect(() => validateExercise(123)).toThrow(ApiError)
    })

    it('When exercise has both repCount and duration, then throws 400', () => {
      const data = { name: 'Invalid', repCount: 10, duration: 60 }

      expect(() => validateExercise(data)).toThrow(ApiError)
      expect(() => validateExercise(data)).toThrow(
        'cannot have both repCount and duration',
      )
    })

    it('When exercise has neither repCount nor duration, then throws 400', () => {
      const data = { name: 'Invalid' }

      expect(() => validateExercise(data)).toThrow(ApiError)
      expect(() => validateExercise(data)).toThrow(
        'must have either repCount or duration',
      )
    })

    it('When exercise has no name, then throws 400', () => {
      const data = { repCount: 10 }

      expect(() => validateExercise(data)).toThrow(ApiError)
      expect(() => validateExercise(data)).toThrow('name is required')
    })

    it('When exercise has empty name, then throws 400', () => {
      const data = { name: '', repCount: 10 }

      expect(() => validateExercise(data)).toThrow(ApiError)
      expect(() => validateExercise(data)).toThrow('name is required')
    })

    it('When exercise has whitespace-only name, then throws 400', () => {
      const data = { name: '   ', repCount: 10 }

      expect(() => validateExercise(data)).toThrow(ApiError)
      expect(() => validateExercise(data)).toThrow('name is required')
    })

    it('When exercise has negative repCount, then throws 400', () => {
      const data = { name: 'Push-ups', repCount: -5 }

      expect(() => validateExercise(data)).toThrow(ApiError)
      expect(() => validateExercise(data)).toThrow('repCount must be positive')
    })

    it('When exercise has zero repCount, then throws 400', () => {
      const data = { name: 'Push-ups', repCount: 0 }

      expect(() => validateExercise(data)).toThrow(ApiError)
      expect(() => validateExercise(data)).toThrow('repCount must be positive')
    })

    it('When exercise has negative duration, then throws 400', () => {
      const data = { name: 'Plank', duration: -30 }

      expect(() => validateExercise(data)).toThrow(ApiError)
      expect(() => validateExercise(data)).toThrow('duration must be positive')
    })

    it('When exercise has zero duration, then throws 400', () => {
      const data = { name: 'Plank', duration: 0 }

      expect(() => validateExercise(data)).toThrow(ApiError)
      expect(() => validateExercise(data)).toThrow('duration must be positive')
    })

    it('When exercise has invalid imageUrl, then throws 400', () => {
      const data = { name: 'Push-ups', repCount: 10, imageUrl: 'not-a-url' }

      expect(() => validateExercise(data)).toThrow(ApiError)
      expect(() => validateExercise(data)).toThrow(
        'imageUrl must be a valid URL',
      )
    })

    it('When exercise has invalid videoUrl, then throws 400', () => {
      const data = { name: 'Push-ups', repCount: 10, videoUrl: 'invalid-url' }

      expect(() => validateExercise(data)).toThrow(ApiError)
      expect(() => validateExercise(data)).toThrow(
        'videoUrl must be a valid URL',
      )
    })
  })
})

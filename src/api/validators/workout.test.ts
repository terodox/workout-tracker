import { describe, expect, it } from 'vitest'
import { ApiError } from '../utils/errors'
import { validateWorkoutData } from './workout'

describe('validateWorkoutData', () => {
  it('should validate valid workout data', () => {
    // Given valid workout data
    const data = { name: 'Push Day' }

    // When validating
    const result = validateWorkoutData(data)

    // Then should return validated data
    expect(result).toEqual({ name: 'Push Day' })
  })

  it('should trim whitespace from name', () => {
    // Given workout data with whitespace
    const data = { name: '  Pull Day  ' }

    // When validating
    const result = validateWorkoutData(data)

    // Then should trim whitespace
    expect(result).toEqual({ name: 'Pull Day' })
  })

  it('should throw error for missing name', () => {
    // Given data without name
    const data = {}

    // When validating
    // Then should throw error
    expect(() => validateWorkoutData(data)).toThrow(ApiError)
    expect(() => validateWorkoutData(data)).toThrow('Name is required')
  })

  it('should throw error for empty name', () => {
    // Given data with empty name
    const data = { name: '' }

    // When validating
    // Then should throw error
    expect(() => validateWorkoutData(data)).toThrow(ApiError)
    expect(() => validateWorkoutData(data)).toThrow('Name is required')
  })

  it('should throw error for invalid request body', () => {
    // Given invalid data
    const data = null

    // When validating
    // Then should throw error
    expect(() => validateWorkoutData(data)).toThrow(ApiError)
    expect(() => validateWorkoutData(data)).toThrow('Invalid request body')
  })
})

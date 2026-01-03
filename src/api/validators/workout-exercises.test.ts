import { describe, it, expect } from 'vitest'
import { validateAddExercise, validateReorder } from './workout-exercises'
import { ApiError } from '../utils/errors'

describe('validateAddExercise', () => {
  it('Given valid exerciseId, when validated, then returns exerciseId', () => {
    const result = validateAddExercise({ exerciseId: 'ex-1' })
    expect(result).toEqual({ exerciseId: 'ex-1' })
  })

  it('Given missing exerciseId, when validated, then throws error', () => {
    expect(() => validateAddExercise({})).toThrow(ApiError)
    expect(() => validateAddExercise({})).toThrow('exerciseId is required')
  })

  it('Given invalid body, when validated, then throws error', () => {
    expect(() => validateAddExercise(null)).toThrow('Invalid request body')
  })
})

describe('validateReorder', () => {
  it('Given valid exerciseIds array, when validated, then returns exerciseIds', () => {
    const result = validateReorder({ exerciseIds: ['ex-1', 'ex-2'] })
    expect(result).toEqual({ exerciseIds: ['ex-1', 'ex-2'] })
  })

  it('Given empty array, when validated, then returns empty array', () => {
    const result = validateReorder({ exerciseIds: [] })
    expect(result).toEqual({ exerciseIds: [] })
  })

  it('Given non-array exerciseIds, when validated, then throws error', () => {
    expect(() => validateReorder({ exerciseIds: 'not-array' })).toThrow('exerciseIds must be an array')
  })

  it('Given array with non-strings, when validated, then throws error', () => {
    expect(() => validateReorder({ exerciseIds: ['ex-1', 123] })).toThrow('exerciseIds must contain only strings')
  })

  it('Given array with duplicates, when validated, then throws error', () => {
    expect(() => validateReorder({ exerciseIds: ['ex-1', 'ex-1'] })).toThrow('exerciseIds contains duplicates')
  })

  it('Given invalid body, when validated, then throws error', () => {
    expect(() => validateReorder(null)).toThrow('Invalid request body')
  })
})

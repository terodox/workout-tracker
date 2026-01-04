import { badRequest } from '../utils/errors'
import type { Exercise } from '../types'

/**
 * Type guard to check if value is a record object.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/**
 * Type guard to check if value is a non-empty string.
 */
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

/**
 * Type guard to check if value is a positive number.
 */
function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && value > 0
}

/**
 * Validates a URL string.
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validates exercise data according to business rules:
 * - name: required, non-empty string
 * - repCount XOR duration: exactly one must be present and positive
 * - imageUrl/videoUrl: valid URL format if present
 */
export function validateExercise(data: unknown): Exercise {
  if (!isRecord(data)) {
    throw badRequest('Exercise data must be an object')
  }

  // Validate name
  if (!isNonEmptyString(data.name)) {
    throw badRequest('Exercise name is required and must be a non-empty string')
  }
  const name = data.name.trim()

  // Validate repCount XOR duration
  const hasRepCount = typeof data.repCount === 'number'
  const hasDuration = typeof data.duration === 'number'

  if (!hasRepCount && !hasDuration) {
    throw badRequest('Exercise must have either repCount or duration')
  }

  if (hasRepCount && hasDuration) {
    throw badRequest('Exercise cannot have both repCount and duration')
  }

  if (hasRepCount && !isPositiveNumber(data.repCount)) {
    throw badRequest('repCount must be positive')
  }

  if (hasDuration && !isPositiveNumber(data.duration)) {
    throw badRequest('duration must be positive')
  }

  // Validate URLs if present
  if (data.imageUrl !== undefined) {
    if (!isNonEmptyString(data.imageUrl) || !isValidUrl(data.imageUrl)) {
      throw badRequest('imageUrl must be a valid URL')
    }
  }

  if (data.videoUrl !== undefined) {
    if (!isNonEmptyString(data.videoUrl) || !isValidUrl(data.videoUrl)) {
      throw badRequest('videoUrl must be a valid URL')
    }
  }

  // Build the validated exercise object
  const exercise: Exercise = {
    id: typeof data.id === 'string' ? data.id : '',
    name,
  }

  if (isPositiveNumber(data.repCount)) {
    exercise.repCount = data.repCount
  }

  if (isPositiveNumber(data.duration)) {
    exercise.duration = data.duration
  }

  if (isNonEmptyString(data.imageUrl)) {
    exercise.imageUrl = data.imageUrl
  }

  if (isNonEmptyString(data.videoUrl)) {
    exercise.videoUrl = data.videoUrl
  }

  return exercise
}

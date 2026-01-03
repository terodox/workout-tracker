import type { Exercise } from '../types'
import { badRequest } from '../utils/errors'

/**
 * Validates exercise data according to business rules:
 * - name: required, non-empty string
 * - repCount XOR duration: exactly one must be present and positive
 * - imageUrl/videoUrl: valid URL format if present
 */
export function validateExercise(data: unknown): Exercise {
  if (!data || typeof data !== 'object') {
    throw badRequest('Exercise data must be an object')
  }

  const exercise = data as Record<string, unknown>

  // Validate name
  if (!exercise.name || typeof exercise.name !== 'string' || exercise.name.trim() === '') {
    throw badRequest('Exercise name is required and must be a non-empty string')
  }

  // Validate repCount XOR duration
  const hasRepCount = typeof exercise.repCount === 'number'
  const hasDuration = typeof exercise.duration === 'number'

  if (!hasRepCount && !hasDuration) {
    throw badRequest('Exercise must have either repCount or duration')
  }

  if (hasRepCount && hasDuration) {
    throw badRequest('Exercise cannot have both repCount and duration')
  }

  if (hasRepCount && exercise.repCount! <= 0) {
    throw badRequest('repCount must be positive')
  }

  if (hasDuration && exercise.duration! <= 0) {
    throw badRequest('duration must be positive')
  }

  // Validate URLs if present
  if (exercise.imageUrl && !isValidUrl(exercise.imageUrl as string)) {
    throw badRequest('imageUrl must be a valid URL')
  }

  if (exercise.videoUrl && !isValidUrl(exercise.videoUrl as string)) {
    throw badRequest('videoUrl must be a valid URL')
  }

  return {
    id: exercise.id as string,
    name: exercise.name.trim(),
    ...(hasRepCount && { repCount: exercise.repCount as number }),
    ...(hasDuration && { duration: exercise.duration as number }),
    ...(exercise.imageUrl && { imageUrl: exercise.imageUrl as string }),
    ...(exercise.videoUrl && { videoUrl: exercise.videoUrl as string }),
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
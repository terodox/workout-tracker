import { badRequest } from '../utils/errors'

/**
 * Validates add exercise request body.
 */
export function validateAddExercise(data: unknown): { exerciseId: string } {
  if (!data || typeof data !== 'object') {
    throw badRequest('Invalid request body')
  }

  const { exerciseId } = data as Record<string, unknown>

  if (!exerciseId || typeof exerciseId !== 'string') {
    throw badRequest('exerciseId is required')
  }

  return { exerciseId }
}

/**
 * Validates reorder exercises request body.
 */
export function validateReorder(data: unknown): { exerciseIds: Array<string> } {
  if (!data || typeof data !== 'object') {
    throw badRequest('Invalid request body')
  }

  const { exerciseIds } = data as Record<string, unknown>

  if (!Array.isArray(exerciseIds)) {
    throw badRequest('exerciseIds must be an array')
  }

  if (exerciseIds.some((id) => typeof id !== 'string')) {
    throw badRequest('exerciseIds must contain only strings')
  }

  const unique = new Set(exerciseIds)
  if (unique.size !== exerciseIds.length) {
    throw badRequest('exerciseIds contains duplicates')
  }

  return { exerciseIds }
}

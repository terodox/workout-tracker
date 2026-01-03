import { badRequest } from '../utils/errors'

export function validateWorkoutData(data: unknown): { name: string } {
  if (!data || typeof data !== 'object') {
    throw badRequest('Invalid request body')
  }

  const { name } = data as Record<string, unknown>

  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw badRequest('Name is required')
  }

  return { name: name.trim() }
}

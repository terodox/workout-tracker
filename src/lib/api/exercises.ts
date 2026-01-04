import { apiFetch } from './client'
import type { Exercise } from './types'

/** Fetch all exercises */
export async function getExercises(): Promise<Array<Exercise>> {
  return apiFetch<Array<Exercise>>('/exercises')
}

/** Fetch single exercise by ID */
export async function getExercise(id: string): Promise<Exercise> {
  return apiFetch<Exercise>(`/exercises/${id}`)
}

/** Create new exercise */
export async function createExercise(
  data: Omit<Exercise, 'id'>,
): Promise<Exercise> {
  return apiFetch<Exercise>('/exercises', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/** Update existing exercise */
export async function updateExercise(
  id: string,
  data: Partial<Omit<Exercise, 'id'>>,
): Promise<Exercise> {
  return apiFetch<Exercise>(`/exercises/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

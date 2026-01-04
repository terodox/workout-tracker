import { apiFetch } from './client'
import type { Workout } from './types'

/** Fetch all workouts */
export async function getWorkouts(): Promise<Array<Workout>> {
  return apiFetch<Array<Workout>>('/workouts')
}

/** Fetch single workout by ID */
export async function getWorkout(id: string): Promise<Workout> {
  return apiFetch<Workout>(`/workouts/${id}`)
}

/** Create new workout */
export async function createWorkout(name: string): Promise<Workout> {
  return apiFetch<Workout>('/workouts', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

/** Update workout name */
export async function updateWorkout(id: string, name: string): Promise<Workout> {
  return apiFetch<Workout>(`/workouts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  })
}

/** Add exercise to workout */
export async function addExerciseToWorkout(
  workoutId: string,
  exerciseId: string
): Promise<Workout> {
  return apiFetch<Workout>(`/workouts/${workoutId}/exercises`, {
    method: 'POST',
    body: JSON.stringify({ exerciseId }),
  })
}

/** Remove exercise from workout */
export async function removeExerciseFromWorkout(
  workoutId: string,
  exerciseId: string
): Promise<Workout> {
  return apiFetch<Workout>(`/workouts/${workoutId}/exercises/${exerciseId}`, {
    method: 'DELETE',
  })
}

/** Reorder exercises in workout */
export async function reorderWorkoutExercises(
  workoutId: string,
  exerciseIds: Array<string>
): Promise<Workout> {
  return apiFetch<Workout>(`/workouts/${workoutId}/exercises/reorder`, {
    method: 'PUT',
    body: JSON.stringify({ exerciseIds }),
  })
}

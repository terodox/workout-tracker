import { WorkoutStore, ExerciseStore } from '../storage'
import { errorResponse, jsonResponse } from '../utils/response'
import { notFound, badRequest, conflict } from '../utils/errors'
import { validateAddExercise, validateReorder } from '../validators/workout-exercises'

/**
 * Adds an exercise to a workout.
 */
export async function addExerciseToWorkout(
  workoutId: string,
  request: Request,
  kv: KVNamespace
): Promise<Response> {
  try {
    const workout = await WorkoutStore.get(kv, workoutId)
    if (!workout) {
      throw notFound('Workout not found')
    }

    const body = await request.json()
    const { exerciseId } = validateAddExercise(body)

    const exercise = await ExerciseStore.get(kv, exerciseId)
    if (!exercise) {
      throw badRequest('Exercise not found')
    }

    if (workout.exercises.some((e) => e.exerciseId === exerciseId)) {
      throw conflict('Exercise already in workout')
    }

    const maxOrder = workout.exercises.reduce((max, e) => Math.max(max, e.order), -1)
    workout.exercises.push({ exerciseId, order: maxOrder + 1 })

    await WorkoutStore.save(kv, workout)
    return jsonResponse(workout)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * Removes an exercise from a workout.
 */
export async function removeExerciseFromWorkout(
  workoutId: string,
  exerciseId: string,
  kv: KVNamespace
): Promise<Response> {
  try {
    const workout = await WorkoutStore.get(kv, workoutId)
    if (!workout) {
      throw notFound('Workout not found')
    }

    const index = workout.exercises.findIndex((e) => e.exerciseId === exerciseId)
    if (index === -1) {
      throw notFound('Exercise not in workout')
    }

    workout.exercises.splice(index, 1)
    workout.exercises.forEach((e, i) => (e.order = i))

    await WorkoutStore.save(kv, workout)
    return jsonResponse(workout)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * Reorders exercises in a workout.
 */
export async function reorderExercises(
  workoutId: string,
  request: Request,
  kv: KVNamespace
): Promise<Response> {
  try {
    const workout = await WorkoutStore.get(kv, workoutId)
    if (!workout) {
      throw notFound('Workout not found')
    }

    const body = await request.json()
    const { exerciseIds } = validateReorder(body)

    const currentIds = workout.exercises.map((e) => e.exerciseId).sort()
    const newIds = [...exerciseIds].sort()

    if (currentIds.length !== newIds.length || !currentIds.every((id, i) => id === newIds[i])) {
      throw badRequest('exerciseIds must match current exercises')
    }

    workout.exercises = exerciseIds.map((exerciseId, order) => ({ exerciseId, order }))

    await WorkoutStore.save(kv, workout)
    return jsonResponse(workout)
  } catch (error) {
    return errorResponse(error)
  }
}

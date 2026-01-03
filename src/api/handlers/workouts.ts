import { WorkoutStore } from '../storage'
import { errorResponse, jsonResponse } from '../utils/response'
import { notFound } from '../utils/errors'
import { validateWorkoutData } from '../validators/workout'
import type { Workout } from '../types'

export async function createWorkout(
  request: Request,
  kv: KVNamespace,
): Promise<Response> {
  try {
    const body = await request.json()
    const { name } = validateWorkoutData(body)

    const workout: Workout = {
      id: crypto.randomUUID(),
      name,
      exercises: [],
    }

    await WorkoutStore.save(kv, workout)
    return jsonResponse(workout, 201)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function getWorkouts(kv: KVNamespace): Promise<Response> {
  try {
    const workouts = await WorkoutStore.list(kv)
    return jsonResponse(workouts)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function getWorkout(
  id: string,
  kv: KVNamespace,
): Promise<Response> {
  try {
    const workout = await WorkoutStore.get(kv, id)
    if (!workout) {
      throw notFound('Workout not found')
    }
    return jsonResponse(workout)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function updateWorkout(
  id: string,
  request: Request,
  kv: KVNamespace,
): Promise<Response> {
  try {
    const existing = await WorkoutStore.get(kv, id)
    if (!existing) {
      throw notFound('Workout not found')
    }

    const body = await request.json()
    const { name } = validateWorkoutData(body)

    const updated: Workout = { ...existing, name }
    await WorkoutStore.save(kv, updated)
    return jsonResponse(updated)
  } catch (error) {
    return errorResponse(error)
  }
}

import { ExerciseStore } from '../storage'
import { validateExercise } from '../validators/exercise'
import { errorResponse, jsonResponse } from '../utils/response'
import { notFound } from '../utils/errors'

/**
 * POST /api/exercises - Create new exercise
 */
export async function createExercise(
  request: Request,
  kv: KVNamespace,
): Promise<Response> {
  try {
    const body = await request.json()
    const exercise = validateExercise(body)

    // Generate UUID for new exercise
    exercise.id = crypto.randomUUID()

    await ExerciseStore.save(kv, exercise)
    return jsonResponse(exercise, 201)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * GET /api/exercises - List all exercises
 */
export async function listExercises(
  _: Request,
  kv: KVNamespace,
): Promise<Response> {
  try {
    const exercises = await ExerciseStore.list(kv)
    return jsonResponse(exercises)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * GET /api/exercises/:id - Get single exercise
 */
export async function getExercise(
  _: Request,
  kv: KVNamespace,
  id: string,
): Promise<Response> {
  try {
    const exercise = await ExerciseStore.get(kv, id)
    if (!exercise) {
      throw notFound('Exercise not found')
    }
    return jsonResponse(exercise)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * PUT /api/exercises/:id - Update exercise
 */
export async function updateExercise(
  request: Request,
  kv: KVNamespace,
  id: string,
): Promise<Response> {
  try {
    const existing = await ExerciseStore.get(kv, id)
    if (!existing) {
      throw notFound('Exercise not found')
    }

    const body = await request.json()
    const exercise = validateExercise(body)
    exercise.id = id // Preserve the ID from URL

    await ExerciseStore.save(kv, exercise)
    return jsonResponse(exercise)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * DELETE /api/exercises/:id - Delete exercise
 */
export async function deleteExercise(
  kv: KVNamespace,
  id: string,
): Promise<Response> {
  try {
    const existing = await ExerciseStore.get(kv, id)
    if (!existing) {
      throw notFound('Exercise not found')
    }

    await ExerciseStore.delete(kv, id)
    return new Response(null, { status: 204 })
  } catch (error) {
    return errorResponse(error)
  }
}

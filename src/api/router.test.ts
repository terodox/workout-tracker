import { beforeEach, describe, expect, it } from 'vitest'
import { createMockKV } from './test-utils/mock-kv'
import { createMockRequest, parseJson } from './test-utils/mock-request'
import { handleAuth } from './handlers/auth'
import {
  createExercise,
  getExercise,
  listExercises,
  updateExercise,
} from './handlers/exercises'
import {
  createWorkout,
  getWorkout,
  getWorkouts,
  updateWorkout,
} from './handlers/workouts'
import {
  addExerciseToWorkout,
  removeExerciseFromWorkout,
} from './handlers/workout-exercises'
import { withAuth } from './middleware/auth'
import { TokenStore } from './storage'
import type { Exercise, Workout } from './types'

/**
 * Integration tests for API router behavior.
 */
describe('API Router Integration', () => {
  let kv: KVNamespace
  let validToken: string

  beforeEach(async () => {
    kv = createMockKV()
    validToken = 'test-token-123'
    await TokenStore.save(
      kv,
      {
        token: validToken,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      },
      3600,
    )
  })

  const env = () => ({ WORKOUT_KV: kv, AUTH_PASSWORD: 'test-password' })

  describe('route protection', () => {
    it('Given unauthenticated request to protected route, then returns 401', async () => {
      const request = createMockRequest('GET', '/api/exercises')
      const response = await withAuth(request, env(), () =>
        listExercises(request, kv),
      )

      expect(response.status).toBe(401)
    })

    it('Given authenticated request to protected route, then succeeds', async () => {
      const request = createMockRequest('GET', '/api/exercises', {
        headers: { Authorization: `Bearer ${validToken}` },
      })
      const response = await withAuth(request, env(), () =>
        listExercises(request, kv),
      )

      expect(response.status).toBe(200)
    })
  })

  describe('full auth flow', () => {
    it('Given valid credentials, when auth then access protected route, then succeeds', async () => {
      const authRequest = createMockRequest('POST', '/api/auth', {
        body: { password: 'test-password' },
      })
      const authResponse = await handleAuth(authRequest, env())
      expect(authResponse.status).toBe(200)

      const { token } = await parseJson<{ token: string }>(authResponse)

      const exercisesRequest = createMockRequest('GET', '/api/exercises', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const exercisesResponse = await withAuth(exercisesRequest, env(), () =>
        listExercises(exercisesRequest, kv),
      )

      expect(exercisesResponse.status).toBe(200)
    })
  })

  describe('exercise CRUD flow', () => {
    it('Given authenticated user, when full exercise CRUD cycle, then succeeds', async () => {
      const headers = { Authorization: `Bearer ${validToken}` }

      // Create
      const createReq = createMockRequest('POST', '/api/exercises', {
        headers,
        body: { name: 'Push-ups', repCount: 10 },
      })
      const createRes = await withAuth(createReq, env(), () =>
        createExercise(createReq, kv),
      )
      expect(createRes.status).toBe(201)
      const created = await parseJson<Exercise>(createRes)

      // Read
      const getReq = createMockRequest('GET', `/api/exercises/${created.id}`, {
        headers,
      })
      const getRes = await withAuth(getReq, env(), () =>
        getExercise(getReq, kv, created.id),
      )
      expect(getRes.status).toBe(200)

      // Update
      const updateReq = createMockRequest(
        'PUT',
        `/api/exercises/${created.id}`,
        {
          headers,
          body: { name: 'Updated Push-ups', repCount: 15 },
        },
      )
      const updateRes = await withAuth(updateReq, env(), () =>
        updateExercise(updateReq, kv, created.id),
      )
      expect(updateRes.status).toBe(200)

      // List
      const listReq = createMockRequest('GET', '/api/exercises', { headers })
      const listRes = await withAuth(listReq, env(), () =>
        listExercises(listReq, kv),
      )
      expect(listRes.status).toBe(200)
      const list = await parseJson<Array<Exercise>>(listRes)
      expect(list.some((e) => e.id === created.id)).toBe(true)
    })
  })

  describe('workout CRUD flow', () => {
    it('Given authenticated user, when full workout CRUD cycle, then succeeds', async () => {
      const headers = { Authorization: `Bearer ${validToken}` }

      // Create
      const createReq = createMockRequest('POST', '/api/workouts', {
        headers,
        body: { name: 'Push Day' },
      })
      const createRes = await withAuth(createReq, env(), () =>
        createWorkout(createReq, kv),
      )
      expect(createRes.status).toBe(201)
      const created = await parseJson<Workout>(createRes)

      // Read
      const getReq = createMockRequest('GET', `/api/workouts/${created.id}`, {
        headers,
      })
      const getRes = await withAuth(getReq, env(), () =>
        getWorkout(created.id, kv),
      )
      expect(getRes.status).toBe(200)

      // Update
      const updateReq = createMockRequest(
        'PUT',
        `/api/workouts/${created.id}`,
        {
          headers,
          body: { name: 'Updated Push Day' },
        },
      )
      const updateRes = await withAuth(updateReq, env(), () =>
        updateWorkout(created.id, updateReq, kv),
      )
      expect(updateRes.status).toBe(200)

      // List
      const listReq = createMockRequest('GET', '/api/workouts', { headers })
      const listRes = await withAuth(listReq, env(), () => getWorkouts(kv))
      expect(listRes.status).toBe(200)
    })
  })

  describe('workout-exercise linking flow', () => {
    it('Given authenticated user, when full linking cycle, then succeeds', async () => {
      const headers = { Authorization: `Bearer ${validToken}` }

      // Create exercise
      const exReq = createMockRequest('POST', '/api/exercises', {
        headers,
        body: { name: 'Squats', repCount: 10 },
      })
      const exRes = await withAuth(exReq, env(), () =>
        createExercise(exReq, kv),
      )
      const exercise = await parseJson<Exercise>(exRes)

      // Create workout
      const wkReq = createMockRequest('POST', '/api/workouts', {
        headers,
        body: { name: 'Leg Day' },
      })
      const wkRes = await withAuth(wkReq, env(), () => createWorkout(wkReq, kv))
      const workout = await parseJson<Workout>(wkRes)

      // Add exercise to workout
      const addReq = createMockRequest(
        'POST',
        `/api/workouts/${workout.id}/exercises`,
        {
          headers,
          body: { exerciseId: exercise.id },
        },
      )
      const addRes = await withAuth(addReq, env(), () =>
        addExerciseToWorkout(workout.id, addReq, kv),
      )
      expect(addRes.status).toBe(200)

      // Verify exercise in workout
      const getReq = createMockRequest('GET', `/api/workouts/${workout.id}`, {
        headers,
      })
      const getRes = await withAuth(getReq, env(), () =>
        getWorkout(workout.id, kv),
      )
      const workoutData = await parseJson<Workout>(getRes)
      expect(workoutData.exercises).toHaveLength(1)

      // Remove exercise
      const removeRes = await withAuth(
        createMockRequest(
          'DELETE',
          `/api/workouts/${workout.id}/exercises/${exercise.id}`,
          { headers },
        ),
        env(),
        () => removeExerciseFromWorkout(workout.id, exercise.id, kv),
      )
      expect(removeRes.status).toBe(200)
    })
  })
})

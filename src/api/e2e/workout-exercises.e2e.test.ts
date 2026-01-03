import { beforeAll, describe, expect, it } from 'vitest'

const BASE_URL =
  process.env.API_BASE_URL || 'https://workout-tracker.terodox.workers.dev'
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || ''

let authToken: string

async function getAuthToken(): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: AUTH_PASSWORD }),
  })
  const data = await response.json()
  return data.token
}

async function createExercise(name: string): Promise<{ id: string }> {
  const response = await fetch(`${BASE_URL}/api/exercises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ name, repCount: 10 }),
  })
  return response.json()
}

async function createWorkout(name: string): Promise<{ id: string }> {
  const response = await fetch(`${BASE_URL}/api/workouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ name }),
  })
  return response.json()
}

describe('Workout-Exercise Linking E2E', () => {
  beforeAll(async () => {
    authToken = await getAuthToken()
  })

  it('Given authenticated user, when POST /api/workouts/:id/exercises, then adds exercise', async () => {
    const workout = await createWorkout('E2E Link Test')
    const exercise = await createExercise('E2E Link Exercise')

    const response = await fetch(
      `${BASE_URL}/api/workouts/${workout.id}/exercises`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ exerciseId: exercise.id }),
      },
    )

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.exercises).toHaveLength(1)
    expect(data.exercises[0].exerciseId).toBe(exercise.id)
  })

  it('Given authenticated user with workout, when GET /api/workouts/:id, then returns exercises in order', async () => {
    const workout = await createWorkout('E2E Order Test')
    const ex1 = await createExercise('E2E Order Ex1')
    const ex2 = await createExercise('E2E Order Ex2')

    await fetch(`${BASE_URL}/api/workouts/${workout.id}/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ exerciseId: ex1.id }),
    })
    await fetch(`${BASE_URL}/api/workouts/${workout.id}/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ exerciseId: ex2.id }),
    })

    const response = await fetch(`${BASE_URL}/api/workouts/${workout.id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.exercises).toHaveLength(2)
    expect(data.exercises[0].order).toBe(0)
    expect(data.exercises[1].order).toBe(1)
  })

  it('Given unauthenticated user, when POST /api/workouts/:id/exercises, then returns 401', async () => {
    const response = await fetch(`${BASE_URL}/api/workouts/some-id/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId: 'some-exercise' }),
    })

    expect(response.status).toBe(401)
  })
})

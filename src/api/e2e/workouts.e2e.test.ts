import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { parseJson } from '../test-utils/mock-request'
import type { Workout } from '../types'

const BASE_URL =
  process.env.API_BASE_URL || 'https://workout-tracker.terodox.workers.dev'
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || ''

let authToken: string
const createdWorkoutIds: Array<string> = []

async function getAuthToken(): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: AUTH_PASSWORD }),
  })
  const data = await parseJson<{ token: string }>(response)
  return data.token
}

async function deleteWorkout(id: string): Promise<void> {
  await fetch(`${BASE_URL}/api/workouts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authToken}` },
  })
}

describe('Workouts E2E', () => {
  beforeAll(async () => {
    authToken = await getAuthToken()
  })

  afterAll(async () => {
    for (const id of createdWorkoutIds) {
      await deleteWorkout(id)
    }
  })

  it('Given authenticated user, when GET /api/workouts, then returns 200 with array', async () => {
    const response = await fetch(`${BASE_URL}/api/workouts`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    expect(response.status).toBe(200)
    const data = await parseJson<Array<Workout>>(response)
    expect(Array.isArray(data)).toBe(true)
  })

  it('Given authenticated user, when POST /api/workouts with valid data, then returns 201', async () => {
    const response = await fetch(`${BASE_URL}/api/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name: 'E2E Test Workout' }),
    })

    expect(response.status).toBe(201)
    const data = await parseJson<Workout>(response)
    expect(data.id).toBeDefined()
    expect(data.name).toBe('E2E Test Workout')
    expect(data.exercises).toEqual([])
    createdWorkoutIds.push(data.id)
  })

  it('Given authenticated user, when GET /api/workouts/:id with valid id, then returns 200', async () => {
    const createResponse = await fetch(`${BASE_URL}/api/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name: 'E2E Get Workout Test' }),
    })
    const created = await parseJson<Workout>(createResponse)
    createdWorkoutIds.push(created.id)

    const response = await fetch(`${BASE_URL}/api/workouts/${created.id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    expect(response.status).toBe(200)
    const data = await parseJson<Workout>(response)
    expect(data.id).toBe(created.id)
    expect(data.name).toBe('E2E Get Workout Test')
  })

  it('Given authenticated user, when PUT /api/workouts/:id with valid data, then returns 200', async () => {
    const createResponse = await fetch(`${BASE_URL}/api/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name: 'E2E Update Workout Test' }),
    })
    const created = await parseJson<Workout>(createResponse)
    createdWorkoutIds.push(created.id)

    const response = await fetch(`${BASE_URL}/api/workouts/${created.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name: 'E2E Updated Workout' }),
    })

    expect(response.status).toBe(200)
    const data = await parseJson<Workout>(response)
    expect(data.name).toBe('E2E Updated Workout')
  })

  it('Given unauthenticated user, when GET /api/workouts, then returns 401', async () => {
    const response = await fetch(`${BASE_URL}/api/workouts`)

    expect(response.status).toBe(401)
  })

  it('Given authenticated user, when GET /api/workouts/:id with invalid id, then returns 404', async () => {
    const response = await fetch(`${BASE_URL}/api/workouts/non-existent-id`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    expect(response.status).toBe(404)
  })
})

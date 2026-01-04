import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { parseJson } from '../test-utils/mock-request'
import type { Exercise } from '../types'

const BASE_URL =
  process.env.API_BASE_URL || 'https://workout-tracker.terodox.workers.dev'
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || ''

let authToken: string
const createdExerciseIds: Array<string> = []

async function getAuthToken(): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: AUTH_PASSWORD }),
  })
  const data = await parseJson<{ token: string }>(response)
  return data.token
}

async function deleteExercise(id: string): Promise<void> {
  await fetch(`${BASE_URL}/api/exercises/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authToken}` },
  })
}

describe('Exercises E2E', () => {
  beforeAll(async () => {
    authToken = await getAuthToken()
  })

  afterAll(async () => {
    for (const id of createdExerciseIds) {
      await deleteExercise(id)
    }
  })

  it('Given authenticated user, when GET /api/exercises, then returns 200 with array', async () => {
    const response = await fetch(`${BASE_URL}/api/exercises`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    expect(response.status).toBe(200)
    const data = await parseJson<Array<Exercise>>(response)
    expect(Array.isArray(data)).toBe(true)
  })

  it('Given authenticated user, when POST /api/exercises with valid data, then returns 201', async () => {
    const response = await fetch(`${BASE_URL}/api/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name: 'E2E Test Exercise', repCount: 10 }),
    })

    expect(response.status).toBe(201)
    const data = await parseJson<Exercise>(response)
    expect(data.id).toBeDefined()
    expect(data.name).toBe('E2E Test Exercise')
    expect(data.repCount).toBe(10)
    createdExerciseIds.push(data.id)
  })

  it('Given authenticated user, when GET /api/exercises/:id with valid id, then returns 200', async () => {
    const createResponse = await fetch(`${BASE_URL}/api/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name: 'E2E Get Test', duration: 30 }),
    })
    const created = await parseJson<Exercise>(createResponse)
    createdExerciseIds.push(created.id)

    const response = await fetch(`${BASE_URL}/api/exercises/${created.id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    expect(response.status).toBe(200)
    const data = await parseJson<Exercise>(response)
    expect(data.id).toBe(created.id)
    expect(data.name).toBe('E2E Get Test')
  })

  it('Given authenticated user, when PUT /api/exercises/:id with valid data, then returns 200', async () => {
    const createResponse = await fetch(`${BASE_URL}/api/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name: 'E2E Update Test', repCount: 5 }),
    })
    const created = await parseJson<Exercise>(createResponse)
    createdExerciseIds.push(created.id)

    const response = await fetch(`${BASE_URL}/api/exercises/${created.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name: 'E2E Updated', repCount: 15 }),
    })

    expect(response.status).toBe(200)
    const data = await parseJson<Exercise>(response)
    expect(data.name).toBe('E2E Updated')
    expect(data.repCount).toBe(15)
  })

  it('Given unauthenticated user, when GET /api/exercises, then returns 401', async () => {
    const response = await fetch(`${BASE_URL}/api/exercises`)

    expect(response.status).toBe(401)
  })

  it('Given authenticated user, when GET /api/exercises/:id with invalid id, then returns 404', async () => {
    const response = await fetch(`${BASE_URL}/api/exercises/non-existent-id`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    expect(response.status).toBe(404)
  })
})

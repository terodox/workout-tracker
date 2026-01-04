import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockKV } from '../test-utils/mock-kv'
import { createMockRequest, parseJson } from '../test-utils/mock-request'
import {
  createExercise,
  getExercise,
  listExercises,
  updateExercise,
} from './exercises'
import type { Exercise } from '../types'

// Mock crypto.randomUUID
const mockUUID = 'test-uuid-123'
vi.stubGlobal('crypto', {
  randomUUID: () => mockUUID,
})

describe('Exercise Handlers', () => {
  let mockKV: KVNamespace

  beforeEach(() => {
    mockKV = createMockKV()
  })

  describe('createExercise', () => {
    it('Given valid exercise data, when POST /api/exercises, then returns 201 with exercise', async () => {
      const request = createMockRequest('POST', '/api/exercises', {
        body: { name: 'Push-ups', repCount: 10 },
      })

      const response = await createExercise(request, mockKV)
      const data = await parseJson<Exercise>(response)

      expect(response.status).toBe(201)
      expect(data).toEqual({
        id: mockUUID,
        name: 'Push-ups',
        repCount: 10,
      })
    })

    it('Given exercise with duration, when POST /api/exercises, then returns 201', async () => {
      const request = createMockRequest('POST', '/api/exercises', {
        body: { name: 'Plank', duration: 60 },
      })

      const response = await createExercise(request, mockKV)
      const data = await parseJson<Exercise>(response)

      expect(response.status).toBe(201)
      expect(data.duration).toBe(60)
    })

    it('Given exercise with URLs, when POST /api/exercises, then includes URLs', async () => {
      const request = createMockRequest('POST', '/api/exercises', {
        body: {
          name: 'Push-ups',
          repCount: 10,
          imageUrl: 'https://example.com/image.jpg',
          videoUrl: 'https://youtube.com/watch?v=123',
        },
      })

      const response = await createExercise(request, mockKV)
      const data = await parseJson<Exercise>(response)

      expect(data.imageUrl).toBe('https://example.com/image.jpg')
      expect(data.videoUrl).toBe('https://youtube.com/watch?v=123')
    })

    it('Given invalid exercise data, when POST /api/exercises, then returns 400', async () => {
      const request = createMockRequest('POST', '/api/exercises', {
        body: { name: 'Invalid' }, // Missing repCount/duration
      })

      const response = await createExercise(request, mockKV)
      const data = await parseJson<{ error: string }>(response)

      expect(response.status).toBe(400)
      expect(data.error).toContain('must have either repCount or duration')
    })

    it('Given malformed JSON, when POST /api/exercises, then returns 500', async () => {
      const request = new Request('http://localhost/api/exercises', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await createExercise(request, mockKV)

      expect(response.status).toBe(500)
    })
  })

  describe('listExercises', () => {
    it('Given exercises exist, when GET /api/exercises, then returns array', async () => {
      // Pre-populate KV with exercises
      const exercise1: Exercise = { id: '1', name: 'Push-ups', repCount: 10 }
      const exercise2: Exercise = { id: '2', name: 'Plank', duration: 60 }

      await mockKV.put('exercises:1', JSON.stringify(exercise1))
      await mockKV.put('exercises:2', JSON.stringify(exercise2))

      const request = createMockRequest('GET', '/api/exercises')
      const response = await listExercises(request, mockKV)
      const data = await parseJson<Array<Exercise>>(response)

      expect(response.status).toBe(200)
      expect(data).toHaveLength(2)
      expect(data).toContainEqual(exercise1)
      expect(data).toContainEqual(exercise2)
    })

    it('Given no exercises, when GET /api/exercises, then returns empty array', async () => {
      const request = createMockRequest('GET', '/api/exercises')
      const response = await listExercises(request, mockKV)
      const data = await parseJson<Array<Exercise>>(response)

      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })
  })

  describe('getExercise', () => {
    it('Given valid id, when GET /api/exercises/:id, then returns exercise', async () => {
      const exercise: Exercise = { id: '123', name: 'Push-ups', repCount: 10 }
      await mockKV.put('exercises:123', JSON.stringify(exercise))

      const request = createMockRequest('GET', '/api/exercises/123')
      const response = await getExercise(request, mockKV, '123')
      const data = await parseJson<Exercise>(response)

      expect(response.status).toBe(200)
      expect(data).toEqual(exercise)
    })

    it('Given invalid id, when GET /api/exercises/:id, then returns 404', async () => {
      const request = createMockRequest('GET', '/api/exercises/nonexistent')
      const response = await getExercise(request, mockKV, 'nonexistent')
      const data = await parseJson<{ error: string }>(response)

      expect(response.status).toBe(404)
      expect(data.error).toBe('Exercise not found')
    })
  })

  describe('updateExercise', () => {
    it('Given valid update, when PUT /api/exercises/:id, then returns updated exercise', async () => {
      const original: Exercise = { id: '123', name: 'Push-ups', repCount: 10 }
      await mockKV.put('exercises:123', JSON.stringify(original))

      const request = createMockRequest('PUT', '/api/exercises/123', {
        body: { name: 'Modified Push-ups', repCount: 15 },
      })

      const response = await updateExercise(request, mockKV, '123')
      const data = await parseJson<Exercise>(response)

      expect(response.status).toBe(200)
      expect(data).toEqual({
        id: '123',
        name: 'Modified Push-ups',
        repCount: 15,
      })

      // Verify it was saved to KV
      const saved = await mockKV.get('exercises:123')
      expect(JSON.parse(saved!)).toEqual(data)
    })

    it('Given change from repCount to duration, when PUT /api/exercises/:id, then succeeds', async () => {
      const original: Exercise = { id: '123', name: 'Push-ups', repCount: 10 }
      await mockKV.put('exercises:123', JSON.stringify(original))

      const request = createMockRequest('PUT', '/api/exercises/123', {
        body: { name: 'Plank', duration: 60 },
      })

      const response = await updateExercise(request, mockKV, '123')
      const data = await parseJson<Exercise>(response)

      expect(response.status).toBe(200)
      expect(data.duration).toBe(60)
      expect(data.repCount).toBeUndefined()
    })

    it('Given non-existent id, when PUT /api/exercises/:id, then returns 404', async () => {
      const request = createMockRequest('PUT', '/api/exercises/nonexistent', {
        body: { name: 'Test', repCount: 10 },
      })

      const response = await updateExercise(request, mockKV, 'nonexistent')
      const data = await parseJson<{ error: string }>(response)

      expect(response.status).toBe(404)
      expect(data.error).toBe('Exercise not found')
    })

    it('Given invalid update data, when PUT /api/exercises/:id, then returns 400', async () => {
      const original: Exercise = { id: '123', name: 'Push-ups', repCount: 10 }
      await mockKV.put('exercises:123', JSON.stringify(original))

      const request = createMockRequest('PUT', '/api/exercises/123', {
        body: { name: 'Invalid' }, // Missing repCount/duration
      })

      const response = await updateExercise(request, mockKV, '123')
      const data = await parseJson<{ error: string }>(response)

      expect(response.status).toBe(400)
      expect(data.error).toContain('must have either repCount or duration')
    })
  })

  describe('Integration Tests', () => {
    it('Given mock KV, when full CRUD cycle performed, then data persists correctly', async () => {
      // Create
      const createRequest = createMockRequest('POST', '/api/exercises', {
        body: { name: 'Test Exercise', repCount: 5 },
      })
      const createResponse = await createExercise(createRequest, mockKV)
      const created = await parseJson<Exercise>(createResponse)

      expect(createResponse.status).toBe(201)
      expect(created.id).toBe(mockUUID)

      // Read
      const getRequest = createMockRequest(
        'GET',
        `/api/exercises/${created.id}`,
      )
      const getResponse = await getExercise(getRequest, mockKV, created.id)
      const retrieved = await parseJson<Exercise>(getResponse)

      expect(getResponse.status).toBe(200)
      expect(retrieved).toEqual(created)

      // Update
      const updateRequest = createMockRequest(
        'PUT',
        `/api/exercises/${created.id}`,
        {
          body: { name: 'Updated Exercise', duration: 30 },
        },
      )
      const updateResponse = await updateExercise(
        updateRequest,
        mockKV,
        created.id,
      )
      const updated = await parseJson<Exercise>(updateResponse)

      expect(updateResponse.status).toBe(200)
      expect(updated.name).toBe('Updated Exercise')
      expect(updated.duration).toBe(30)
      expect(updated.repCount).toBeUndefined()

      // List includes updated
      const listRequest = createMockRequest('GET', '/api/exercises')
      const listResponse = await listExercises(listRequest, mockKV)
      const exercises = await parseJson<Array<Exercise>>(listResponse)

      expect(exercises).toContainEqual(updated)
    })

    it('Given created exercise, when listed, then appears in results', async () => {
      const createRequest = createMockRequest('POST', '/api/exercises', {
        body: { name: 'List Test', repCount: 3 },
      })
      await createExercise(createRequest, mockKV)

      const listRequest = createMockRequest('GET', '/api/exercises')
      const listResponse = await listExercises(listRequest, mockKV)
      const exercises = await parseJson<Array<Exercise>>(listResponse)

      expect(exercises).toHaveLength(1)
      expect(exercises[0].name).toBe('List Test')
    })
  })
})

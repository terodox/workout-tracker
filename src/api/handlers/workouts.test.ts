import { beforeEach, describe, expect, it } from 'vitest'
import { createMockKV } from '../test-utils/mock-kv'
import { createMockRequest } from '../test-utils/mock-request'
import {
  createWorkout,
  getWorkout,
  getWorkouts,
  updateWorkout,
} from './workouts'
import type { Workout } from '../types'

describe('workout handlers', () => {
  let kv: KVNamespace

  beforeEach(() => {
    kv = createMockKV()
  })

  describe('createWorkout', () => {
    it('should create workout with valid data', async () => {
      // Given valid workout request
      const request = createMockRequest('POST', '/workouts', {
        body: { name: 'Push Day' },
      })

      // When creating workout
      const response = await createWorkout(request, kv)
      const result = await response.json()

      // Then should return created workout
      expect(response.status).toBe(201)
      expect(result.name).toBe('Push Day')
      expect(result.exercises).toEqual([])
      expect(result.id).toBeDefined()
    })

    it('should return error for invalid data', async () => {
      // Given invalid workout request
      const request = createMockRequest('POST', '/workouts', {
        body: { name: '' },
      })

      // When creating workout
      const response = await createWorkout(request, kv)
      const result = await response.json()

      // Then should return error
      expect(response.status).toBe(400)
      expect(result.error).toBe('Name is required')
    })
  })

  describe('getWorkouts', () => {
    it('should return empty array when no workouts', async () => {
      // Given empty storage
      // When getting workouts
      const response = await getWorkouts(kv)
      const result = await response.json()

      // Then should return empty array
      expect(response.status).toBe(200)
      expect(result).toEqual([])
    })

    it('should return all workouts', async () => {
      // Given workouts in storage
      const workout1: Workout = { id: '1', name: 'Push Day', exercises: [] }
      const workout2: Workout = { id: '2', name: 'Pull Day', exercises: [] }
      await kv.put('workouts:1', JSON.stringify(workout1))
      await kv.put('workouts:2', JSON.stringify(workout2))

      // When getting workouts
      const response = await getWorkouts(kv)
      const result = await response.json()

      // Then should return all workouts
      expect(response.status).toBe(200)
      expect(result).toHaveLength(2)
    })
  })

  describe('getWorkout', () => {
    it('should return workout by id', async () => {
      // Given workout in storage
      const workout: Workout = { id: '1', name: 'Push Day', exercises: [] }
      await kv.put('workouts:1', JSON.stringify(workout))

      // When getting workout
      const response = await getWorkout('1', kv)
      const result = await response.json()

      // Then should return workout
      expect(response.status).toBe(200)
      expect(result).toEqual(workout)
    })

    it('should return 404 for non-existent workout', async () => {
      // Given empty storage
      // When getting non-existent workout
      const response = await getWorkout('999', kv)
      const result = await response.json()

      // Then should return 404
      expect(response.status).toBe(404)
      expect(result.error).toBe('Workout not found')
    })
  })

  describe('updateWorkout', () => {
    it('should update existing workout', async () => {
      // Given existing workout
      const workout: Workout = { id: '1', name: 'Push Day', exercises: [] }
      await kv.put('workouts:1', JSON.stringify(workout))
      const request = createMockRequest('PUT', '/workouts/1', {
        body: { name: 'Updated Push Day' },
      })

      // When updating workout
      const response = await updateWorkout('1', request, kv)
      const result = await response.json()

      // Then should return updated workout
      expect(response.status).toBe(200)
      expect(result.name).toBe('Updated Push Day')
      expect(result.id).toBe('1')
    })

    it('should return 404 for non-existent workout', async () => {
      // Given empty storage
      const request = createMockRequest('PUT', '/workouts/999', {
        body: { name: 'Updated' },
      })

      // When updating non-existent workout
      const response = await updateWorkout('999', request, kv)
      const result = await response.json()

      // Then should return 404
      expect(response.status).toBe(404)
      expect(result.error).toBe('Workout not found')
    })
  })
})

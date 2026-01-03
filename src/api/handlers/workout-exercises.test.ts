import { beforeEach, describe, expect, it } from 'vitest'
import { createMockKV } from '../test-utils/mock-kv'
import { createMockRequest } from '../test-utils/mock-request'
import {
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  reorderExercises,
} from './workout-exercises'
import type { Exercise, Workout } from '../types'

describe('workout-exercises handlers', () => {
  let kv: KVNamespace

  beforeEach(() => {
    kv = createMockKV()
  })

  describe('addExerciseToWorkout', () => {
    it('Given valid workout and exercise, when POST, then adds exercise to workout', async () => {
      const workout: Workout = { id: 'w1', name: 'Push Day', exercises: [] }
      const exercise: Exercise = { id: 'ex1', name: 'Push-ups', repCount: 10 }
      await kv.put('workouts:w1', JSON.stringify(workout))
      await kv.put('exercises:ex1', JSON.stringify(exercise))

      const request = createMockRequest('POST', '/workouts/w1/exercises', {
        body: { exerciseId: 'ex1' },
      })
      const response = await addExerciseToWorkout('w1', request, kv)
      const result = await response.json()

      expect(response.status).toBe(200)
      expect(result.exercises).toHaveLength(1)
      expect(result.exercises[0]).toEqual({ exerciseId: 'ex1', order: 0 })
    })

    it('Given non-existent workout, when POST, then returns 404', async () => {
      const request = createMockRequest('POST', '/workouts/w1/exercises', {
        body: { exerciseId: 'ex1' },
      })
      const response = await addExerciseToWorkout('w1', request, kv)

      expect(response.status).toBe(404)
      expect(await response.json()).toEqual({ error: 'Workout not found' })
    })

    it('Given non-existent exercise, when POST, then returns 400', async () => {
      const workout: Workout = { id: 'w1', name: 'Push Day', exercises: [] }
      await kv.put('workouts:w1', JSON.stringify(workout))

      const request = createMockRequest('POST', '/workouts/w1/exercises', {
        body: { exerciseId: 'ex1' },
      })
      const response = await addExerciseToWorkout('w1', request, kv)

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ error: 'Exercise not found' })
    })

    it('Given exercise already in workout, when POST, then returns 409', async () => {
      const workout: Workout = {
        id: 'w1',
        name: 'Push Day',
        exercises: [{ exerciseId: 'ex1', order: 0 }],
      }
      const exercise: Exercise = { id: 'ex1', name: 'Push-ups', repCount: 10 }
      await kv.put('workouts:w1', JSON.stringify(workout))
      await kv.put('exercises:ex1', JSON.stringify(exercise))

      const request = createMockRequest('POST', '/workouts/w1/exercises', {
        body: { exerciseId: 'ex1' },
      })
      const response = await addExerciseToWorkout('w1', request, kv)

      expect(response.status).toBe(409)
      expect(await response.json()).toEqual({
        error: 'Exercise already in workout',
      })
    })

    it('Given missing exerciseId, when POST, then returns 400', async () => {
      const workout: Workout = { id: 'w1', name: 'Push Day', exercises: [] }
      await kv.put('workouts:w1', JSON.stringify(workout))

      const request = createMockRequest('POST', '/workouts/w1/exercises', {
        body: {},
      })
      const response = await addExerciseToWorkout('w1', request, kv)

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ error: 'exerciseId is required' })
    })

    it('Given existing exercises, when adding new, then appends with correct order', async () => {
      const workout: Workout = {
        id: 'w1',
        name: 'Push Day',
        exercises: [
          { exerciseId: 'ex1', order: 0 },
          { exerciseId: 'ex2', order: 1 },
        ],
      }
      const exercise: Exercise = { id: 'ex3', name: 'Dips', repCount: 10 }
      await kv.put('workouts:w1', JSON.stringify(workout))
      await kv.put('exercises:ex3', JSON.stringify(exercise))

      const request = createMockRequest('POST', '/workouts/w1/exercises', {
        body: { exerciseId: 'ex3' },
      })
      const response = await addExerciseToWorkout('w1', request, kv)
      const result = await response.json()

      expect(result.exercises).toHaveLength(3)
      expect(result.exercises[2]).toEqual({ exerciseId: 'ex3', order: 2 })
    })
  })

  describe('removeExerciseFromWorkout', () => {
    it('Given exercise in workout, when DELETE, then removes exercise', async () => {
      const workout: Workout = {
        id: 'w1',
        name: 'Push Day',
        exercises: [{ exerciseId: 'ex1', order: 0 }],
      }
      await kv.put('workouts:w1', JSON.stringify(workout))

      const response = await removeExerciseFromWorkout('w1', 'ex1', kv)
      const result = await response.json()

      expect(response.status).toBe(200)
      expect(result.exercises).toHaveLength(0)
    })

    it('Given non-existent workout, when DELETE, then returns 404', async () => {
      const response = await removeExerciseFromWorkout('w1', 'ex1', kv)

      expect(response.status).toBe(404)
      expect(await response.json()).toEqual({ error: 'Workout not found' })
    })

    it('Given exercise not in workout, when DELETE, then returns 404', async () => {
      const workout: Workout = { id: 'w1', name: 'Push Day', exercises: [] }
      await kv.put('workouts:w1', JSON.stringify(workout))

      const response = await removeExerciseFromWorkout('w1', 'ex1', kv)

      expect(response.status).toBe(404)
      expect(await response.json()).toEqual({
        error: 'Exercise not in workout',
      })
    })

    it('Given removal, when complete, then remaining exercises reorder correctly', async () => {
      const workout: Workout = {
        id: 'w1',
        name: 'Push Day',
        exercises: [
          { exerciseId: 'ex1', order: 0 },
          { exerciseId: 'ex2', order: 1 },
          { exerciseId: 'ex3', order: 2 },
        ],
      }
      await kv.put('workouts:w1', JSON.stringify(workout))

      const response = await removeExerciseFromWorkout('w1', 'ex2', kv)
      const result = await response.json()

      expect(result.exercises).toEqual([
        { exerciseId: 'ex1', order: 0 },
        { exerciseId: 'ex3', order: 1 },
      ])
    })
  })

  describe('reorderExercises', () => {
    it('Given valid order array, when PUT reorder, then updates order', async () => {
      const workout: Workout = {
        id: 'w1',
        name: 'Push Day',
        exercises: [
          { exerciseId: 'ex1', order: 0 },
          { exerciseId: 'ex2', order: 1 },
        ],
      }
      await kv.put('workouts:w1', JSON.stringify(workout))

      const request = createMockRequest(
        'PUT',
        '/workouts/w1/exercises/reorder',
        {
          body: { exerciseIds: ['ex2', 'ex1'] },
        },
      )
      const response = await reorderExercises('w1', request, kv)
      const result = await response.json()

      expect(response.status).toBe(200)
      expect(result.exercises).toEqual([
        { exerciseId: 'ex2', order: 0 },
        { exerciseId: 'ex1', order: 1 },
      ])
    })

    it('Given non-existent workout, when PUT reorder, then returns 404', async () => {
      const request = createMockRequest(
        'PUT',
        '/workouts/w1/exercises/reorder',
        {
          body: { exerciseIds: [] },
        },
      )
      const response = await reorderExercises('w1', request, kv)

      expect(response.status).toBe(404)
      expect(await response.json()).toEqual({ error: 'Workout not found' })
    })

    it('Given order array with missing exercise, when PUT reorder, then returns 400', async () => {
      const workout: Workout = {
        id: 'w1',
        name: 'Push Day',
        exercises: [
          { exerciseId: 'ex1', order: 0 },
          { exerciseId: 'ex2', order: 1 },
        ],
      }
      await kv.put('workouts:w1', JSON.stringify(workout))

      const request = createMockRequest(
        'PUT',
        '/workouts/w1/exercises/reorder',
        {
          body: { exerciseIds: ['ex1'] },
        },
      )
      const response = await reorderExercises('w1', request, kv)

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({
        error: 'exerciseIds must match current exercises',
      })
    })

    it('Given order array with extra exercise, when PUT reorder, then returns 400', async () => {
      const workout: Workout = {
        id: 'w1',
        name: 'Push Day',
        exercises: [{ exerciseId: 'ex1', order: 0 }],
      }
      await kv.put('workouts:w1', JSON.stringify(workout))

      const request = createMockRequest(
        'PUT',
        '/workouts/w1/exercises/reorder',
        {
          body: { exerciseIds: ['ex1', 'ex2'] },
        },
      )
      const response = await reorderExercises('w1', request, kv)

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({
        error: 'exerciseIds must match current exercises',
      })
    })

    it('Given order array with duplicates, when PUT reorder, then returns 400', async () => {
      const workout: Workout = {
        id: 'w1',
        name: 'Push Day',
        exercises: [{ exerciseId: 'ex1', order: 0 }],
      }
      await kv.put('workouts:w1', JSON.stringify(workout))

      const request = createMockRequest(
        'PUT',
        '/workouts/w1/exercises/reorder',
        {
          body: { exerciseIds: ['ex1', 'ex1'] },
        },
      )
      const response = await reorderExercises('w1', request, kv)

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({
        error: 'exerciseIds contains duplicates',
      })
    })

    it('Given empty order array for empty workout, when PUT reorder, then succeeds', async () => {
      const workout: Workout = { id: 'w1', name: 'Push Day', exercises: [] }
      await kv.put('workouts:w1', JSON.stringify(workout))

      const request = createMockRequest(
        'PUT',
        '/workouts/w1/exercises/reorder',
        {
          body: { exerciseIds: [] },
        },
      )
      const response = await reorderExercises('w1', request, kv)
      const result = await response.json()

      expect(response.status).toBe(200)
      expect(result.exercises).toEqual([])
    })
  })
})

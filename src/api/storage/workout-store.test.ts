import { describe, it, expect, beforeEach } from 'vitest'
import { WorkoutStore } from './workout-store'
import { createMockKV } from '../test-utils/mock-kv'
import type { Workout } from '../types'

describe('WorkoutStore', () => {
  let kv: KVNamespace

  beforeEach(() => {
    kv = createMockKV()
  })

  const workout: Workout = {
    id: 'wk-1',
    name: 'Morning Routine',
    exercises: [],
  }

  it('Given valid workout data, when save is called, then stores with correct key', async () => {
    await WorkoutStore.save(kv, workout)
    const stored = await kv.get('workouts:wk-1')
    expect(JSON.parse(stored!)).toEqual(workout)
  })

  it('Given existing workout id, when get is called, then returns workout', async () => {
    await WorkoutStore.save(kv, workout)
    const result = await WorkoutStore.get(kv, 'wk-1')
    expect(result).toEqual(workout)
  })

  it('Given non-existent id, when get is called, then returns null', async () => {
    const result = await WorkoutStore.get(kv, 'non-existent')
    expect(result).toBeNull()
  })

  it('Given existing workout, when update is called, then overwrites data', async () => {
    await WorkoutStore.save(kv, workout)
    const updated = { ...workout, name: 'Evening Routine' }
    await WorkoutStore.save(kv, updated)
    const result = await WorkoutStore.get(kv, 'wk-1')
    expect(result?.name).toBe('Evening Routine')
  })

  it('Given workout id, when delete is called, then removes from KV', async () => {
    await WorkoutStore.save(kv, workout)
    await WorkoutStore.delete(kv, 'wk-1')
    const result = await WorkoutStore.get(kv, 'wk-1')
    expect(result).toBeNull()
  })

  it('Given multiple workouts, when list is called, then returns all workouts', async () => {
    const workout2: Workout = { id: 'wk-2', name: 'Leg Day', exercises: [] }
    await WorkoutStore.save(kv, workout)
    await WorkoutStore.save(kv, workout2)
    const result = await WorkoutStore.list(kv)
    expect(result).toHaveLength(2)
    expect(result).toContainEqual(workout)
    expect(result).toContainEqual(workout2)
  })

  it('Given mock KV, when WorkoutStore performs CRUD cycle, then data persists correctly', async () => {
    // Create
    await WorkoutStore.save(kv, workout)
    expect(await WorkoutStore.get(kv, 'wk-1')).toEqual(workout)

    // Update
    const updated: Workout = {
      ...workout,
      exercises: [{ exerciseId: 'ex-1', order: 0 }],
    }
    await WorkoutStore.save(kv, updated)
    expect((await WorkoutStore.get(kv, 'wk-1'))?.exercises).toHaveLength(1)

    // List
    expect(await WorkoutStore.list(kv)).toHaveLength(1)

    // Delete
    await WorkoutStore.delete(kv, 'wk-1')
    expect(await WorkoutStore.get(kv, 'wk-1')).toBeNull()
    expect(await WorkoutStore.list(kv)).toHaveLength(0)
  })
})

import { beforeEach, describe, expect, it } from 'vitest'
import { createMockKV } from '../test-utils/mock-kv'
import { ExerciseStore } from './exercise-store'
import type { Exercise } from '../types'

describe('ExerciseStore', () => {
  let kv: KVNamespace

  beforeEach(() => {
    kv = createMockKV()
  })

  const exercise: Exercise = {
    id: 'ex-1',
    name: 'Push-ups',
    repCount: 10,
  }

  it('Given valid exercise data, when save is called, then stores with correct key', async () => {
    await ExerciseStore.save(kv, exercise)
    const stored = await kv.get('exercises:ex-1')
    expect(JSON.parse(stored!)).toEqual(exercise)
  })

  it('Given existing exercise id, when get is called, then returns exercise', async () => {
    await ExerciseStore.save(kv, exercise)
    const result = await ExerciseStore.get(kv, 'ex-1')
    expect(result).toEqual(exercise)
  })

  it('Given non-existent id, when get is called, then returns null', async () => {
    const result = await ExerciseStore.get(kv, 'non-existent')
    expect(result).toBeNull()
  })

  it('Given existing exercise, when update is called, then overwrites data', async () => {
    await ExerciseStore.save(kv, exercise)
    const updated = { ...exercise, name: 'Modified Push-ups' }
    await ExerciseStore.save(kv, updated)
    const result = await ExerciseStore.get(kv, 'ex-1')
    expect(result?.name).toBe('Modified Push-ups')
  })

  it('Given exercise id, when delete is called, then removes from KV', async () => {
    await ExerciseStore.save(kv, exercise)
    await ExerciseStore.delete(kv, 'ex-1')
    const result = await ExerciseStore.get(kv, 'ex-1')
    expect(result).toBeNull()
  })

  it('Given multiple exercises, when list is called, then returns all exercises', async () => {
    const exercise2: Exercise = { id: 'ex-2', name: 'Squats', duration: 60 }
    await ExerciseStore.save(kv, exercise)
    await ExerciseStore.save(kv, exercise2)
    const result = await ExerciseStore.list(kv)
    expect(result).toHaveLength(2)
    expect(result).toContainEqual(exercise)
    expect(result).toContainEqual(exercise2)
  })

  it('Given mock KV, when ExerciseStore performs CRUD cycle, then data persists correctly', async () => {
    // Create
    await ExerciseStore.save(kv, exercise)
    expect(await ExerciseStore.get(kv, 'ex-1')).toEqual(exercise)

    // Update
    const updated = { ...exercise, repCount: 20 }
    await ExerciseStore.save(kv, updated)
    expect((await ExerciseStore.get(kv, 'ex-1'))?.repCount).toBe(20)

    // List
    expect(await ExerciseStore.list(kv)).toHaveLength(1)

    // Delete
    await ExerciseStore.delete(kv, 'ex-1')
    expect(await ExerciseStore.get(kv, 'ex-1')).toBeNull()
    expect(await ExerciseStore.list(kv)).toHaveLength(0)
  })
})

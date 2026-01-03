import type { Workout } from '../types'

const PREFIX = 'workouts:'

/**
 * Storage operations for workouts in KV.
 */
export const WorkoutStore = {
  async get(kv: KVNamespace, id: string): Promise<Workout | null> {
    const data = await kv.get(PREFIX + id)
    return data ? JSON.parse(data) : null
  },

  async save(kv: KVNamespace, workout: Workout): Promise<void> {
    await kv.put(PREFIX + workout.id, JSON.stringify(workout))
  },

  async delete(kv: KVNamespace, id: string): Promise<void> {
    await kv.delete(PREFIX + id)
  },

  async list(kv: KVNamespace): Promise<Array<Workout>> {
    const { keys } = await kv.list({ prefix: PREFIX })
    const workouts = await Promise.all(
      keys.map(async ({ name }: { name: string }) => {
        const data = await kv.get(name)
        return data ? JSON.parse(data) : null
      }),
    )
    return workouts.filter(Boolean) as Array<Workout>
  },
}

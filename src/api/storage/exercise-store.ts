import type { Exercise } from '../types'

const PREFIX = 'exercises:'

/**
 * Storage operations for exercises in KV.
 */
export const ExerciseStore = {
  async get(kv: KVNamespace, id: string): Promise<Exercise | null> {
    const data = await kv.get(PREFIX + id)
    return data ? JSON.parse(data) : null
  },

  async save(kv: KVNamespace, exercise: Exercise): Promise<void> {
    await kv.put(PREFIX + exercise.id, JSON.stringify(exercise))
  },

  async delete(kv: KVNamespace, id: string): Promise<void> {
    await kv.delete(PREFIX + id)
  },

  async list(kv: KVNamespace): Promise<Array<Exercise>> {
    const { keys } = await kv.list({ prefix: PREFIX })
    const exercises = await Promise.all(
      keys.map(async ({ name }: { name: string }) => {
        const data = await kv.get(name)
        return data ? JSON.parse(data) : null
      }),
    )
    return exercises.filter(Boolean) as Array<Exercise>
  },
}

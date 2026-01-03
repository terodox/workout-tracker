/**
 * Mock KV namespace for testing.
 */
export function createMockKV(): KVNamespace {
  const store = new Map<string, { value: string; expiration?: number }>()

  return {
    get: async (key: string) => {
      const entry = store.get(key)
      if (!entry) return null
      if (entry.expiration && Date.now() / 1000 > entry.expiration) {
        store.delete(key)
        return null
      }
      return entry.value
    },
    put: async (key: string, value: string, options?: { expirationTtl?: number }) => {
      const expiration = options?.expirationTtl
        ? Date.now() / 1000 + options.expirationTtl
        : undefined
      store.set(key, { value, expiration })
    },
    delete: async (key: string) => {
      store.delete(key)
    },
    list: async (options?: { prefix?: string }) => {
      const keys = Array.from(store.keys())
        .filter((k) => !options?.prefix || k.startsWith(options.prefix))
        .map((name) => ({ name }))
      return { keys, list_complete: true, cacheStatus: null }
    },
  } as KVNamespace
}

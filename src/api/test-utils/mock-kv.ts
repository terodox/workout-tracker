/**
 * Mock KV namespace for testing.
 */
export function createMockKV(): KVNamespace {
  const store = new Map<string, { value: string; expiration?: number }>()

  return {
    get: (key: string) => {
      const entry = store.get(key)
      if (!entry) return Promise.resolve(null)
      if (entry.expiration && Date.now() / 1000 > entry.expiration) {
        store.delete(key)
        return Promise.resolve(null)
      }
      return Promise.resolve(entry.value)
    },
    put: (key: string, value: string, options?: { expirationTtl?: number }) => {
      const expiration = options?.expirationTtl
        ? Date.now() / 1000 + options.expirationTtl
        : undefined
      store.set(key, { value, expiration })
      return Promise.resolve()
    },
    delete: (key: string) => {
      store.delete(key)
      return Promise.resolve()
    },
    list: (options?: { prefix?: string }) => {
      const keys = Array.from(store.keys())
        .filter((k) => !options?.prefix || k.startsWith(options.prefix))
        .map((name) => ({ name }))
      return Promise.resolve({ keys, list_complete: true, cacheStatus: null })
    },
  } as KVNamespace
}

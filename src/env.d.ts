declare module 'cloudflare:workers' {
  interface Env {
    WORKOUT_KV: KVNamespace
    AUTH_PASSWORD: string
  }
  const env: Env
  export { env, Env }
}

declare namespace Cloudflare {
  interface Env {
    WORKOUT_KV: KVNamespace
    AUTH_PASSWORD: string
  }
}

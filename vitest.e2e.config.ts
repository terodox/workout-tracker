import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => ({
  test: {
    include: ['src/**/*.e2e.test.ts'],
    testTimeout: 30000,
    env: loadEnv(mode, process.cwd(), ''),
  },
}))

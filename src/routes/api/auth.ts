import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { handleAuth } from '../../api/handlers/auth'

export const Route = createFileRoute('/api/auth')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        return handleAuth(request, {
          WORKOUT_KV: env.WORKOUT_KV,
          AUTH_PASSWORD: env.AUTH_PASSWORD,
        })
      },
    },
  },
})

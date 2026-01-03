import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { getWorkout, updateWorkout } from '../../../api/handlers/workouts'
import { withAuth } from '../../../api/middleware/auth'

export const Route = createFileRoute('/api/workouts/$id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        return withAuth(request, env, () =>
          getWorkout(params.id, env.WORKOUT_KV),
        )
      },
      PUT: async ({ request, params }) => {
        return withAuth(request, env, () =>
          updateWorkout(params.id, request, env.WORKOUT_KV),
        )
      },
    },
  },
})

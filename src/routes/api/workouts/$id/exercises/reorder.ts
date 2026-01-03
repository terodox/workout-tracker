import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { reorderExercises } from '../../../../../api/handlers/workout-exercises'
import { withAuth } from '../../../../../api/middleware/auth'

export const Route = createFileRoute('/api/workouts/$id/exercises/reorder')({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        return withAuth(request, env, () =>
          reorderExercises(params.id, request, env.WORKOUT_KV),
        )
      },
    },
  },
})

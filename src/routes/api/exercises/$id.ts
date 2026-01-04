import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import {
  deleteExercise,
  getExercise,
  updateExercise,
} from '../../../api/handlers/exercises'
import { withAuth } from '../../../api/middleware/auth'

export const Route = createFileRoute('/api/exercises/$id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        return withAuth(request, env, () =>
          getExercise(request, env.WORKOUT_KV, params.id),
        )
      },
      PUT: async ({ request, params }) => {
        return withAuth(request, env, () =>
          updateExercise(request, env.WORKOUT_KV, params.id),
        )
      },
      DELETE: async ({ request, params }) => {
        return withAuth(request, env, () =>
          deleteExercise(env.WORKOUT_KV, params.id),
        )
      },
    },
  },
})

import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { createExercise, listExercises, getExercise, updateExercise } from '../../api/handlers/exercises'
import { withAuth } from '../../api/middleware/auth'

export const Route = createFileRoute('/api/exercises')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return withAuth(request, env, () => listExercises(request, env.WORKOUT_KV))
      },
      POST: async ({ request }) => {
        return withAuth(request, env, () => createExercise(request, env.WORKOUT_KV))
      },
    },
  },
})

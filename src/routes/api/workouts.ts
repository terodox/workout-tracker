import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { createWorkout, getWorkouts } from '../../api/handlers/workouts'
import { withAuth } from '../../api/middleware/auth'

export const Route = createFileRoute('/api/workouts')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return withAuth(request, env, () => getWorkouts(env.WORKOUT_KV))
      },
      POST: async ({ request }) => {
        return withAuth(request, env, () => createWorkout(request, env.WORKOUT_KV))
      },
    },
  },
})

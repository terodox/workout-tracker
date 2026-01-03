import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { addExerciseToWorkout } from '../../../../api/handlers/workout-exercises'
import { withAuth } from '../../../../api/middleware/auth'

export const Route = createFileRoute('/api/workouts/$id/exercises')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        return withAuth(request, env, () =>
          addExerciseToWorkout(params.id, request, env.WORKOUT_KV),
        )
      },
    },
  },
})

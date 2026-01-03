import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { removeExerciseFromWorkout } from '../../../../../api/handlers/workout-exercises'
import { withAuth } from '../../../../../api/middleware/auth'

export const Route = createFileRoute('/api/workouts/$id/exercises/$exerciseId')(
  {
    server: {
      handlers: {
        DELETE: async ({ request, params }) => {
          return withAuth(request, env, () =>
            removeExerciseFromWorkout(
              params.id,
              params.exerciseId,
              env.WORKOUT_KV,
            ),
          )
        },
      },
    },
  },
)

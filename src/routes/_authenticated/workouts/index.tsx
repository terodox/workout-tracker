import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/workouts/')({
  component: WorkoutsPage,
})

/**
 * Workouts list page placeholder.
 */
function WorkoutsPage() {
  return (
    <div style={{ padding: 'var(--wa-space-m)' }}>
      <h1>Workouts</h1>
      <p>Coming soon...</p>
    </div>
  )
}

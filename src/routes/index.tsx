import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

/**
 * Home page placeholder for Workout Tracker.
 */
function App() {
  return (
    <div className="home">
      <h1>Workout Tracker</h1>
      <p>Coming soon...</p>
    </div>
  )
}

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import './start.server-funcs.css'

const getCurrentServerTime = createServerFn({
  method: 'GET',
}).handler(async () => await new Date().toISOString())

export const Route = createFileRoute('/demo/start/server-funcs')({
  component: Home,
  loader: async () => await getCurrentServerTime(),
})

/**
 * Demo page showing server functions with live time updates.
 */
function Home() {
  const originalTime = Route.useLoaderData()
  const [time, setTime] = useState(originalTime)

  return (
    <div className="server-funcs">
      <div className="server-funcs__card">
        <h1 className="server-funcs__title">
          Start Server Functions - Server Time
        </h1>
        <div className="server-funcs__content">
          <div className="server-funcs__time">Starting Time: {originalTime}</div>
          <div className="server-funcs__time">Current Time: {time}</div>
          <button
            className="server-funcs__btn"
            onClick={async () => setTime(await getCurrentServerTime())}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}

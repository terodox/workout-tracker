import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getPunkSongs } from '@/data/demo.punk-songs'
import './start.ssr.spa-mode.css'

export const Route = createFileRoute('/demo/start/ssr/spa-mode')({
  ssr: false,
  component: RouteComponent,
})

/**
 * Demo page showing SPA mode (no SSR) with punk songs.
 */
function RouteComponent() {
  const [punkSongs, setPunkSongs] = useState<
    Awaited<ReturnType<typeof getPunkSongs>>
  >([])

  useEffect(() => {
    getPunkSongs().then(setPunkSongs)
  }, [])

  return (
    <div className="spa-mode">
      <div className="spa-mode__card">
        <h1 className="spa-mode__title">SPA Mode - Punk Songs</h1>
        <ul className="spa-mode__list">
          {punkSongs.map((song) => (
            <li key={song.id} className="spa-mode__item">
              <span className="spa-mode__song">{song.name}</span>
              <span className="spa-mode__artist"> - {song.artist}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

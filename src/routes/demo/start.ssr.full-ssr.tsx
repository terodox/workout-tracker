import { createFileRoute } from '@tanstack/react-router'
import { getPunkSongs } from '@/data/demo.punk-songs'
import './start.ssr.full-ssr.css'

export const Route = createFileRoute('/demo/start/ssr/full-ssr')({
  component: RouteComponent,
  loader: async () => await getPunkSongs(),
})

/**
 * Demo page showing full SSR mode with punk songs.
 */
function RouteComponent() {
  const punkSongs = Route.useLoaderData()

  return (
    <div className="full-ssr">
      <div className="full-ssr__card">
        <h1 className="full-ssr__title">Full SSR - Punk Songs</h1>
        <ul className="full-ssr__list">
          {punkSongs.map((song) => (
            <li key={song.id} className="full-ssr__item">
              <span className="full-ssr__song">{song.name}</span>
              <span className="full-ssr__artist"> - {song.artist}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

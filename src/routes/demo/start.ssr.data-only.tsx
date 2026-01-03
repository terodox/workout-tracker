import { createFileRoute } from '@tanstack/react-router'
import { getPunkSongs } from '@/data/demo.punk-songs'
import './start.ssr.data-only.css'

export const Route = createFileRoute('/demo/start/ssr/data-only')({
  ssr: 'data-only',
  component: RouteComponent,
  loader: async () => await getPunkSongs(),
})

/**
 * Demo page showing data-only SSR mode with punk songs.
 */
function RouteComponent() {
  const punkSongs = Route.useLoaderData()

  return (
    <div className="data-only">
      <div className="data-only__card">
        <h1 className="data-only__title">Data Only SSR - Punk Songs</h1>
        <ul className="data-only__list">
          {punkSongs.map((song) => (
            <li key={song.id} className="data-only__item">
              <span className="data-only__song">{song.name}</span>
              <span className="data-only__artist"> - {song.artist}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

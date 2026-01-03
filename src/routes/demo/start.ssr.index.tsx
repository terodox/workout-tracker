import { createFileRoute, Link } from '@tanstack/react-router'
import './start.ssr.index.css'

export const Route = createFileRoute('/demo/start/ssr/')({
  component: RouteComponent,
})

/**
 * SSR demos index page with links to different SSR modes.
 */
function RouteComponent() {
  return (
    <div className="ssr-index">
      <div className="ssr-index__card">
        <h1 className="ssr-index__title">SSR Demos</h1>
        <div className="ssr-index__links">
          <Link
            to="/demo/start/ssr/spa-mode"
            className="ssr-index__link ssr-index__link--pink"
          >
            SPA Mode
          </Link>
          <Link
            to="/demo/start/ssr/full-ssr"
            className="ssr-index__link ssr-index__link--purple"
          >
            Full SSR
          </Link>
          <Link
            to="/demo/start/ssr/data-only"
            className="ssr-index__link ssr-index__link--green"
          >
            Data Only
          </Link>
        </div>
      </div>
    </div>
  )
}

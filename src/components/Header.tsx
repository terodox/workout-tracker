import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Home,
  Menu,
  Network,
  SquareFunction,
  StickyNote,
  X,
} from 'lucide-react'
import './Header.css'

/**
 * Main application header with navigation sidebar.
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [groupedExpanded, setGroupedExpanded] = useState<
    Record<string, boolean>
  >({})

  const linkClass = 'nav-link'
  const activeLinkClass = 'nav-link nav-link--active'

  return (
    <>
      <header className="header">
        <button
          onClick={() => setIsOpen(true)}
          className="header__menu-btn"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="header__title">
          <Link to="/">
            <img
              src="/tanstack-word-logo-white.svg"
              alt="TanStack Logo"
              className="header__logo"
            />
          </Link>
        </h1>
      </header>

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <h2 className="sidebar__title">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="sidebar__close-btn"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar__nav">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={linkClass}
            activeProps={{ className: activeLinkClass }}
          >
            <Home size={20} />
            <span className="nav-link__text">Home</span>
          </Link>

          <Link
            to="/demo/start/server-funcs"
            onClick={() => setIsOpen(false)}
            className={linkClass}
            activeProps={{ className: activeLinkClass }}
          >
            <SquareFunction size={20} />
            <span className="nav-link__text">Start - Server Functions</span>
          </Link>

          <Link
            to="/demo/start/api-request"
            onClick={() => setIsOpen(false)}
            className={linkClass}
            activeProps={{ className: activeLinkClass }}
          >
            <Network size={20} />
            <span className="nav-link__text">Start - API Request</span>
          </Link>

          <div className="nav-group">
            <Link
              to="/demo/start/ssr"
              onClick={() => setIsOpen(false)}
              className={`${linkClass} nav-group__link`}
              activeProps={{ className: `${activeLinkClass} nav-group__link` }}
            >
              <StickyNote size={20} />
              <span className="nav-link__text">Start - SSR Demos</span>
            </Link>
            <button
              className="nav-group__toggle"
              onClick={() =>
                setGroupedExpanded((prev) => ({
                  ...prev,
                  StartSSRDemo: !prev.StartSSRDemo,
                }))
              }
            >
              {groupedExpanded.StartSSRDemo ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
          </div>

          {groupedExpanded.StartSSRDemo && (
            <div className="nav-group__children">
              <Link
                to="/demo/start/ssr/spa-mode"
                onClick={() => setIsOpen(false)}
                className={linkClass}
                activeProps={{ className: activeLinkClass }}
              >
                <StickyNote size={20} />
                <span className="nav-link__text">SPA Mode</span>
              </Link>

              <Link
                to="/demo/start/ssr/full-ssr"
                onClick={() => setIsOpen(false)}
                className={linkClass}
                activeProps={{ className: activeLinkClass }}
              >
                <StickyNote size={20} />
                <span className="nav-link__text">Full SSR</span>
              </Link>

              <Link
                to="/demo/start/ssr/data-only"
                onClick={() => setIsOpen(false)}
                className={linkClass}
                activeProps={{ className: activeLinkClass }}
              >
                <StickyNote size={20} />
                <span className="nav-link__text">Data Only</span>
              </Link>
            </div>
          )}

          <Link
            to="/demo/storybook"
            onClick={() => setIsOpen(false)}
            className={linkClass}
            activeProps={{ className: activeLinkClass }}
          >
            <BookOpen size={20} />
            <span className="nav-link__text">Storybook</span>
          </Link>

          <Link
            to="/demo/tanstack-query"
            onClick={() => setIsOpen(false)}
            className={linkClass}
            activeProps={{ className: activeLinkClass }}
          >
            <Network size={20} />
            <span className="nav-link__text">TanStack Query</span>
          </Link>
        </nav>
      </aside>
    </>
  )
}

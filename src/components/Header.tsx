import { Link } from '@tanstack/react-router'
import './Header.css'

/**
 * Main application header.
 */
export default function Header() {
  return (
    <header className="header">
      <h1 className="header__title">
        <Link to="/">Workout Tracker</Link>
      </h1>
    </header>
  )
}

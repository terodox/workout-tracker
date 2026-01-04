import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getStoredToken } from '../lib/api'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const token = getStoredToken()
    if (!token) {
      throw redirect({ to: '/' })
    }
  },
  component: AuthenticatedLayout,
})

/**
 * Layout wrapper for authenticated routes.
 * Redirects to login if not authenticated.
 */
function AuthenticatedLayout() {
  return <Outlet />
}

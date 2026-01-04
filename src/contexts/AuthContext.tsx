import { createContext, useCallback, useEffect, useState } from 'react'
import {
  ApiClientError,
  login as apiLogin,
  clearStoredToken,
  getStoredToken,
} from '../lib/api'
import type { ReactNode } from 'react'

interface AuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  login: (password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Provides authentication state and methods to the app.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getStoredToken()
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  const login = useCallback(async (password: string) => {
    await apiLogin(password)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    clearStoredToken()
    setIsAuthenticated(false)
  }, [])

  // Listen for 401 errors to auto-logout
  useEffect(() => {
    const handleUnauthorized = (event: PromiseRejectionEvent) => {
      if (
        event.reason instanceof ApiClientError &&
        event.reason.status === 401
      ) {
        logout()
      }
    }
    window.addEventListener('unhandledrejection', handleUnauthorized)
    return () =>
      window.removeEventListener('unhandledrejection', handleUnauthorized)
  }, [logout])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

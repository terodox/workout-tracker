import { useNavigate } from '@tanstack/react-router'
import { memo, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { ApiClientError } from '../lib/api'
import type { FormEvent } from 'react'

/**
 * Login page component for Workout Tracker authentication.
 */
export const LoginPage = memo(function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/workouts' })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password.trim()) {
      setError('Password is required')
      return
    }

    setIsSubmitting(true)
    try {
      await login(password)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="login">
        <wa-spinner style={{ fontSize: '2rem' }}></wa-spinner>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="login">
      <div className="login__card">
        <h1 className="login__title">
          <wa-icon name="dumbbell"></wa-icon>
          Workout Tracker
        </h1>

        <form className="login__form" onSubmit={handleSubmit}>
          {error && (
            <wa-callout variant="danger">
              <wa-icon slot="icon" name="circle-exclamation"></wa-icon>
              {error}
            </wa-callout>
          )}

          <wa-input
            type="password"
            label="Password"
            placeholder="Enter your password"
            password-toggle
            value={password}
            oninput={(e: Event) =>
              setPassword((e.target as HTMLInputElement).value)
            }
            {...(isSubmitting ? { disabled: true } : {})}
          ></wa-input>

          <wa-button
            type="submit"
            variant="brand"
            style={{ width: '100%' }}
            {...(isSubmitting ? { loading: true, disabled: true } : {})}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </wa-button>
        </form>
      </div>
    </div>
  )
})

LoginPage.displayName = 'LoginPage'

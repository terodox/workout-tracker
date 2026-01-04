import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AuthContext } from '../contexts/AuthContext'
import { ApiClientError } from '../lib/api'

// Import component after mocks
import { LoginPage } from './LoginPage'
import type { ReactNode } from 'react'

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

// Mock CSS import
vi.mock('./LoginPage.css', () => ({}))

interface AuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  login: (password: string) => Promise<void>
  logout: () => void
}

function TestWrapper({
  children,
  authValue,
}: {
  children: ReactNode
  authValue: AuthContextValue
}) {
  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  )
}

describe('LoginPage', () => {
  const mockLogin = vi.fn()
  const mockLogout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Define custom elements if not defined
    if (!customElements.get('wa-input')) {
      customElements.define(
        'wa-input',
        class extends HTMLElement {
          static get observedAttributes() {
            return ['value', 'disabled']
          }
          get value() {
            return this.getAttribute('value') || ''
          }
          set value(v) {
            this.setAttribute('value', v)
          }
        },
      )
    }
    if (!customElements.get('wa-button')) {
      customElements.define('wa-button', class extends HTMLElement {})
    }
    if (!customElements.get('wa-icon')) {
      customElements.define('wa-icon', class extends HTMLElement {})
    }
    if (!customElements.get('wa-callout')) {
      customElements.define('wa-callout', class extends HTMLElement {})
    }
    if (!customElements.get('wa-spinner')) {
      customElements.define('wa-spinner', class extends HTMLElement {})
    }
  })

  it('Given empty password, when submit clicked, then shows validation error', async () => {
    render(
      <TestWrapper
        authValue={{
          isAuthenticated: false,
          isLoading: false,
          login: mockLogin,
          logout: mockLogout,
        }}
      >
        <LoginPage />
      </TestWrapper>,
    )

    const form = document.querySelector('form')
    expect(form).not.toBeNull()
    fireEvent.submit(form!)

    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeTruthy()
    })
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('Given invalid password, when submitted, then shows error callout', async () => {
    mockLogin.mockRejectedValue(new ApiClientError('Invalid password', 401))

    render(
      <TestWrapper
        authValue={{
          isAuthenticated: false,
          isLoading: false,
          login: mockLogin,
          logout: mockLogout,
        }}
      >
        <LoginPage />
      </TestWrapper>,
    )

    const input = document.querySelector('wa-input')
    expect(input).not.toBeNull()
    fireEvent.input(input!, { target: { value: 'wrongpassword' } })

    const form = document.querySelector('form')
    fireEvent.submit(form!)

    await waitFor(() => {
      expect(screen.getByText('Invalid password')).toBeTruthy()
    })
  })

  it('Given valid password, when submitted, then calls login', async () => {
    mockLogin.mockResolvedValue(undefined)

    render(
      <TestWrapper
        authValue={{
          isAuthenticated: false,
          isLoading: false,
          login: mockLogin,
          logout: mockLogout,
        }}
      >
        <LoginPage />
      </TestWrapper>,
    )

    const input = document.querySelector('wa-input')
    fireEvent.input(input!, { target: { value: 'correctpassword' } })

    const form = document.querySelector('form')
    fireEvent.submit(form!)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('correctpassword')
    })
  })

  it('Given loading state, when page renders, then shows spinner', () => {
    render(
      <TestWrapper
        authValue={{
          isAuthenticated: false,
          isLoading: true,
          login: mockLogin,
          logout: mockLogout,
        }}
      >
        <LoginPage />
      </TestWrapper>,
    )

    expect(document.querySelector('wa-spinner')).not.toBeNull()
  })

  it('Given authenticated user, when page loads, then navigates to workouts', async () => {
    render(
      <TestWrapper
        authValue={{
          isAuthenticated: true,
          isLoading: false,
          login: mockLogin,
          logout: mockLogout,
        }}
      >
        <LoginPage />
      </TestWrapper>,
    )

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/workouts' })
    })
  })
})

import { describe, it, expect } from 'vitest'

const BASE_URL = process.env.API_BASE_URL || 'https://workout-tracker.terodox.workers.dev'
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || ''

describe('Auth E2E', () => {
  it('Given valid credentials, when POST /api/auth, then returns 200 with token', async () => {
    const response = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: AUTH_PASSWORD }),
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.token).toBeDefined()
    expect(data.expiresAt).toBeDefined()
    expect(new Date(data.expiresAt).getTime()).toBeGreaterThan(Date.now())
  })

  it('Given invalid credentials, when POST /api/auth, then returns 401', async () => {
    const response = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong-password' }),
    })

    expect(response.status).toBe(401)
  })

  it('Given missing password, when POST /api/auth, then returns 400', async () => {
    const response = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    expect(response.status).toBe(400)
  })
})

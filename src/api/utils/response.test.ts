import { describe, expect, it } from 'vitest'
import { errorResponse, jsonResponse } from './response'
import { ApiError } from './errors'

describe('jsonResponse', () => {
  it('Given data, when called, then returns JSON response with 200', async () => {
    const response = jsonResponse({ foo: 'bar' })
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/json')
    expect(await response.json()).toEqual({ foo: 'bar' })
  })

  it('Given data and status, when called, then returns response with status', () => {
    const response = jsonResponse({ id: '123' }, 201)
    expect(response.status).toBe(201)
  })
})

describe('errorResponse', () => {
  it('Given ApiError, when called, then returns error response', async () => {
    const error = new ApiError(400, 'Bad request')
    const response = errorResponse(error)
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'Bad request' })
  })

  it('Given unknown error, when called, then returns 500', async () => {
    const response = errorResponse(new Error('oops'))
    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: 'Internal server error' })
  })
})

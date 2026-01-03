import { describe, it, expect } from 'vitest'
import { ApiError, badRequest, unauthorized, notFound, conflict } from './errors'

describe('ApiError', () => {
  it('Given status and message, when created, then stores both', () => {
    const error = new ApiError(400, 'Bad request')
    expect(error.statusCode).toBe(400)
    expect(error.message).toBe('Bad request')
  })

  it('Given ApiError, when toJSON called, then returns error object', () => {
    const error = new ApiError(404, 'Not found')
    expect(error.toJSON()).toEqual({ error: 'Not found' })
  })
})

describe('error factories', () => {
  it('Given message, when badRequest called, then returns 400 error', () => {
    const error = badRequest('Invalid input')
    expect(error.statusCode).toBe(400)
    expect(error.message).toBe('Invalid input')
  })

  it('Given no message, when unauthorized called, then returns 401 with default', () => {
    const error = unauthorized()
    expect(error.statusCode).toBe(401)
    expect(error.message).toBe('Unauthorized')
  })

  it('Given no message, when notFound called, then returns 404 with default', () => {
    const error = notFound()
    expect(error.statusCode).toBe(404)
    expect(error.message).toBe('Not found')
  })

  it('Given message, when conflict called, then returns 409 error', () => {
    const error = conflict('Already exists')
    expect(error.statusCode).toBe(409)
    expect(error.message).toBe('Already exists')
  })
})

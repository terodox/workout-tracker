import { ApiError } from './errors'

/**
 * Creates a JSON response with the given data and status.
 */
export function jsonResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Creates an error response from an ApiError or unknown error.
 */
export function errorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    return jsonResponse(error.toJSON(), error.statusCode)
  }
  return jsonResponse({ error: 'Internal server error' }, 500)
}

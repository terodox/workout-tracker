/**
 * API error with status code and message.
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }

  toJSON() {
    return { error: this.message }
  }
}

export const badRequest = (message: string) => new ApiError(400, message)
export const unauthorized = (message = 'Unauthorized') => new ApiError(401, message)
export const notFound = (message = 'Not found') => new ApiError(404, message)
export const conflict = (message: string) => new ApiError(409, message)

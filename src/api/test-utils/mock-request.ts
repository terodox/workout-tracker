/**
 * Creates a mock Request for testing.
 */
export function createMockRequest(
  method: string,
  path: string,
  options?: { body?: unknown; headers?: Record<string, string> },
): Request {
  const url = `http://localhost${path}`
  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  }
  if (options?.body) {
    init.body = JSON.stringify(options.body)
  }
  return new Request(url, init)
}

/**
 * Parses JSON from a Response with type safety for tests.
 */
export function parseJson<T>(response: Response): Promise<T> {
  return response.json()
}

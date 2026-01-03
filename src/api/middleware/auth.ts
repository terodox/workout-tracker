import { TokenStore } from '../storage'
import { unauthorized } from '../utils/errors'
import { errorResponse } from '../utils/response'

interface Env {
  WORKOUT_KV: KVNamespace
}

/**
 * Extracts Bearer token from Authorization header.
 */
function extractToken(request: Request): string | null {
  const header = request.headers.get('Authorization')
  if (!header?.startsWith('Bearer ')) return null
  const token = header.slice(7)
  return token || null
}

/**
 * Auth middleware - validates Bearer token and calls handler if valid.
 */
export async function withAuth(
  request: Request,
  env: Env,
  handler: (request: Request, env: Env) => Promise<Response>,
): Promise<Response> {
  try {
    const token = extractToken(request)
    if (!token) {
      throw unauthorized()
    }

    const authToken = await TokenStore.get(env.WORKOUT_KV, token)
    if (!authToken) {
      throw unauthorized()
    }

    return handler(request, env)
  } catch (error) {
    return errorResponse(error)
  }
}

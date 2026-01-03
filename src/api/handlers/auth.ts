import { TokenStore } from '../storage'
import { badRequest, unauthorized } from '../utils/errors'
import { errorResponse, jsonResponse } from '../utils/response'
import { TOKEN_TTL_SECONDS, generateToken } from '../utils/token'
import type { AuthToken } from '../types'

interface AuthRequest {
  password?: string
}

interface Env {
  WORKOUT_KV: KVNamespace
  AUTH_PASSWORD: string
}

/**
 * Handles POST /api/auth - validates password and returns token.
 */
export async function handleAuth(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    let body: AuthRequest
    try {
      body = await request.json()
    } catch {
      throw badRequest('Invalid JSON body')
    }

    if (typeof body.password !== 'string' || body.password === '') {
      throw badRequest('Password is required')
    }

    if (body.password !== env.AUTH_PASSWORD) {
      throw unauthorized()
    }

    const token = generateToken()
    const expiresAt = new Date(
      Date.now() + TOKEN_TTL_SECONDS * 1000,
    ).toISOString()
    const authToken: AuthToken = { token, expiresAt }

    await TokenStore.save(env.WORKOUT_KV, authToken, TOKEN_TTL_SECONDS)

    return jsonResponse(authToken, 200)
  } catch (error) {
    return errorResponse(error)
  }
}

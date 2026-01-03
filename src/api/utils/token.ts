/**
 * Generates a cryptographically random token.
 */
export function generateToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Token TTL in seconds (2 hours). */
export const TOKEN_TTL_SECONDS = 2 * 60 * 60

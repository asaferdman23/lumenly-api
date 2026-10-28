import { randomBytes } from 'node:crypto'

const TTL_MS = 15 * 60 * 1000
const tokens = new Map()

/** A one-time reset token for this email, valid for 15 minutes. */
export function createResetToken(email, now = Date.now()) {
  const token = randomBytes(24).toString('hex')
  tokens.set(token, { email, expiresAt: now + TTL_MS })
  return token
}

/** The email the token belongs to, once. Null when unknown, used or expired. */
export function consumeResetToken(token, now = Date.now()) {
  const entry = tokens.get(token)
  tokens.delete(token)
  if (!entry || entry.expiresAt < now) return null
  return entry.email
}

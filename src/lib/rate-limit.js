// Fixed-window rate limiter keyed by client IP + email. In-memory for now;
// swap the Map for Redis before we run more than one instance.
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5
const hits = new Map()

export function loginRateLimit(req, res, next) {
  const key = `${req.ip}:${(req.body?.email ?? '').toLowerCase()}`
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(key, { start: now, count: 1 })
    return next()
  }
  entry.count += 1
  if (entry.count > MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((entry.start + WINDOW_MS - now) / 1000)
    res.set('Retry-After', String(retryAfter))
    return res.status(429).json({ error: 'too many login attempts, try again later' })
  }
  next()
}

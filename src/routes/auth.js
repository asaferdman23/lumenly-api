import { Router } from 'express'
import { verifyPassword, issueSession } from '../lib/session.js'
import { loginRateLimit } from '../lib/rate-limit.js'

export const authRouter = Router()

authRouter.post('/login', loginRateLimit, async (req, res) => {
  const { email, password } = req.body ?? {}
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' })
  const user = await verifyPassword(email, password)
  if (!user) return res.status(401).json({ error: 'invalid credentials' })
  res.json({ token: issueSession(user) })
})

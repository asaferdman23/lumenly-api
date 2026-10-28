import { Router } from 'express'
import { verifyPassword, issueSession, setPassword } from '../lib/session.js'
import { createResetToken, consumeResetToken } from '../lib/password-reset.js'
import { sendResetEmail } from '../lib/mailer.js'

export const authRouter = Router()

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {}
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' })
  const user = await verifyPassword(email, password)
  if (!user) return res.status(401).json({ error: 'invalid credentials' })
  res.json({ token: issueSession(user) })
})

authRouter.post('/reset', async (req, res) => {
  const { email } = req.body ?? {}
  if (!email) return res.status(400).json({ error: 'email is required' })
  const normalisedEmail = email.trim().toLowerCase()
  const token = createResetToken(normalisedEmail)
  await sendResetEmail(normalisedEmail, `https://app.lumenly.io/reset?token=${token}`)
  // Same answer whether or not the account exists, so the endpoint can't be used to find users.
  res.status(202).json({ ok: true })
})

authRouter.post('/reset/confirm', async (req, res) => {
  const { token, password } = req.body ?? {}
  if (!token) return res.status(400).json({ error: 'invalid or expired link' })
  if (!password || password.length < 8) return res.status(400).json({ error: 'password must be at least 8 characters' })
  const email = consumeResetToken(token)
  if (!email) return res.status(400).json({ error: 'invalid or expired link' })
  await setPassword(email, password)
  res.json({ ok: true })
})

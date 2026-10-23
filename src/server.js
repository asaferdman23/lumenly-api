import express from 'express'
import { authRouter } from './routes/auth.js'

const app = express()
app.use(express.json())
app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/auth', authRouter)

const port = process.env.PORT ?? 3000
app.listen(port, () => console.log(`lumenly-api on :${port}`))

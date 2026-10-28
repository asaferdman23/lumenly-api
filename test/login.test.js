import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { startApp } from './helpers.js'

const api = await startApp()
after(() => api.close())

test('login with the right password returns a session token', async () => {
  const r = await api.post('/auth/login', { email: 'dana@lumenly.io', password: 'demo' })
  assert.equal(r.status, 200)
  assert.match(r.body.token, /^u1\./)
})

test('login with a wrong password is refused', async () => {
  const r = await api.post('/auth/login', { email: 'dana@lumenly.io', password: 'nope' })
  assert.equal(r.status, 401)
})

test('login without a password is a bad request', async () => {
  const r = await api.post('/auth/login', { email: 'dana@lumenly.io' })
  assert.equal(r.status, 400)
})

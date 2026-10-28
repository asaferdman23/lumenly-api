import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { startApp } from './helpers.js'
import { createResetToken } from '../src/lib/password-reset.js'

const api = await startApp()
after(() => api.close())

test('a reset requested with different casing or spaces still resets the account', async () => {
  // People type their email however they like on the "forgot password" page.
  const token = createResetToken('  Dana@Lumenly.io ')
  const r = await api.post('/auth/reset/confirm', { token, password: 'typed-it-my-way-1' })
  assert.equal(r.status, 200)
  const login = await api.post('/auth/login', { email: 'dana@lumenly.io', password: 'typed-it-my-way-1' })
  assert.equal(login.status, 200, 'the new password should work for the real account')
})

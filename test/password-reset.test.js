import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { startApp } from './helpers.js'
import { createResetToken } from '../src/lib/password-reset.js'

const api = await startApp()
after(() => api.close())

test('requesting a reset answers the same for any email', async () => {
  const r = await api.post('/auth/reset', { email: 'nobody@lumenly.io' })
  assert.equal(r.status, 202)
})

test('a valid reset link sets the new password', async () => {
  const token = createResetToken('dana@lumenly.io')
  const r = await api.post('/auth/reset/confirm', { token, password: 'correct-horse-1' })
  assert.equal(r.status, 200)
  const login = await api.post('/auth/login', { email: 'dana@lumenly.io', password: 'correct-horse-1' })
  assert.equal(login.status, 200)
})

test('a reset link works only once', async () => {
  const token = createResetToken('dana@lumenly.io')
  assert.equal((await api.post('/auth/reset/confirm', { token, password: 'first-pass-123' })).status, 200)
  assert.equal((await api.post('/auth/reset/confirm', { token, password: 'second-pass-123' })).status, 400)
})

test('an expired reset link is refused', async () => {
  const token = createResetToken('dana@lumenly.io', Date.now() - 16 * 60 * 1000)
  const r = await api.post('/auth/reset/confirm', { token, password: 'late-pass-123' })
  assert.equal(r.status, 400)
})

test('a too-short password does not burn the reset link', async () => {
  const token = createResetToken('dana@lumenly.io')
  const short = await api.post('/auth/reset/confirm', { token, password: 'short' })
  assert.equal(short.status, 400)
  // The user fixes the typo and retries with the same link from their email.
  const retry = await api.post('/auth/reset/confirm', { token, password: 'long-enough-123' })
  assert.equal(retry.status, 200, 'the link should still work after a rejected password')
})

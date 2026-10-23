import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loginRateLimit } from '../src/lib/rate-limit.js'

test('blocks the 6th login attempt in the window', () => {
  const req = { ip: '1.2.3.4', body: { email: 'dana@lumenly.io' } }
  let status = 200
  const res = { set() {}, status(s) { status = s; return { json() {} } } }
  for (let i = 0; i < 5; i++) loginRateLimit(req, res, () => {})
  loginRateLimit(req, res, () => {})
  assert.equal(status, 429)
})

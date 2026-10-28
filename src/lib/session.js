import { randomUUID } from 'node:crypto'

const users = new Map([['dana@lumenly.io', { id: 'u1', email: 'dana@lumenly.io', password: 'demo' }]])

export async function verifyPassword(email, password) {
  const u = users.get(email)
  return u && u.password === password ? u : null
}

export async function setPassword(email, password) {
  const u = users.get(email)
  if (u) u.password = password
}

export function issueSession(user) {
  return `${user.id}.${randomUUID()}`
}

import { app } from '../src/app.js'

/** Starts the app on a free port; returns a post() helper and close(). */
export async function startApp() {
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s))
  })
  const base = `http://127.0.0.1:${server.address().port}`
  const post = async (path, body) => {
    const res = await fetch(base + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
    return { status: res.status, body: await res.json() }
  }
  return { post, close: () => new Promise((r) => server.close(r)) }
}

import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { logger } from 'hono/logger'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { games } from './schema'

const app = new Hono()

app.use('*', logger())

app.post('/api/games', async (c) => {
  const [game] = await db
    .insert(games)
    .values({ startedAt: new Date() })
    .returning({ id: games.id })
  return c.json({ id: game.id }, 201)
})

app.post('/api/games/:id/end', async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) return c.json({ error: 'invalid id' }, 400)

  const body = await c.req.json().catch(() => null)
  if (!body) return c.json({ error: 'invalid body' }, 400)

  const { won, moveCount } = body as { won?: boolean; moveCount?: number }

  await db
    .update(games)
    .set({
      endedAt: new Date(),
      won: won ?? false,
      moveCount: typeof moveCount === 'number' ? moveCount : null,
    })
    .where(eq(games.id, id))

  return c.json({ ok: true })
})

app.get('/api/stats', async (c) => {
  const all = await db.select().from(games)
  const total = all.length
  const won = all.filter((g) => g.won).length
  const finished = all.filter((g) => g.moveCount !== null)
  const avgMoves =
    finished.length > 0
      ? Math.round(finished.reduce((s, g) => s + (g.moveCount ?? 0), 0) / finished.length)
      : null

  return c.json({ total, won, avgMoves })
})

app.use('/*', async (c, next) => {
  if (c.req.path.startsWith('/api/')) return next()
  return serveStatic({ root: './' })(c, next)
})

const port = Number(process.env.PORT ?? 3000)
console.log(`Listening on http://localhost:${port}`)

export default { port, fetch: app.fetch }

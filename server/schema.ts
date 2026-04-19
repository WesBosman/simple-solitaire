import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const games = sqliteTable('games', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
  endedAt: integer('ended_at', { mode: 'timestamp' }),
  won: integer('won', { mode: 'boolean' }),
  moveCount: integer('move_count'),
})

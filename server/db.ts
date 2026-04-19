import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as schema from './schema'

const dbPath = process.env.DATABASE_PATH ?? './data/dev.db'

const sqlite = new Database(dbPath, { create: true })
sqlite.exec('PRAGMA journal_mode=WAL;')
sqlite.exec('PRAGMA foreign_keys=ON;')
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at INTEGER NOT NULL,
    ended_at   INTEGER,
    won        INTEGER,
    move_count INTEGER
  );
`)

export const db = drizzle(sqlite, { schema })

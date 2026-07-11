import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'gm')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS characters (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  archetype  TEXT NOT NULL,
  backstory  TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  gm_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  genre       TEXT NOT NULL,
  description TEXT NOT NULL,
  venue       TEXT NOT NULL,
  region      TEXT NOT NULL,
  starts_on   TEXT NOT NULL,
  ends_on     TEXT NOT NULL,
  capacity    INTEGER NOT NULL CHECK (capacity > 0),
  price       INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0),
  amenities   TEXT NOT NULL DEFAULT '[]',
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS signups (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id     INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  note         TEXT NOT NULL DEFAULT '',
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_events_starts_on ON events(starts_on);
CREATE INDEX IF NOT EXISTS idx_signups_event ON signups(event_id);
CREATE INDEX IF NOT EXISTS idx_characters_user ON characters(user_id);
`;

function open(): Database.Database {
  const file =
    process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "guildhall.sqlite");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  return db;
}

// Reuse one connection across hot reloads in dev and across route modules in prod.
const globalForDb = globalThis as unknown as { __guildhallDb?: Database.Database };

export function getDb(): Database.Database {
  globalForDb.__guildhallDb ??= open();
  return globalForDb.__guildhallDb;
}

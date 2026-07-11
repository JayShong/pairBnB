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
  core_class TEXT NOT NULL,
  attunement TEXT NOT NULL DEFAULT '',
  race       TEXT NOT NULL DEFAULT 'Human',
  faction    TEXT NOT NULL DEFAULT 'Independent / Own Faction',
  status     TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'fallen')),
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
  migrateLegacyCharacters(db);
  db.exec(SCHEMA);
  return db;
}

// Pre-release databases (before the Maelstrom rulebook integration) used an
// `archetype` column on characters. Those dev databases carry only seed/demo
// data, so rebuild the affected tables instead of migrating rows.
function migrateLegacyCharacters(db: Database.Database): void {
  const table = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'characters'")
    .get();
  if (!table) return;
  const columns = db.prepare("PRAGMA table_info(characters)").all() as { name: string }[];
  if (columns.some((column) => column.name === "archetype")) {
    console.warn("guildhall: rebuilding pre-release characters/signups tables for the Maelstrom schema");
    db.exec("DROP TABLE IF EXISTS signups; DROP TABLE IF EXISTS characters;");
  }
}

// Reuse one connection across hot reloads in dev and across route modules in prod.
const globalForDb = globalThis as unknown as { __guildhallDb?: Database.Database };

export function getDb(): Database.Database {
  globalForDb.__guildhallDb ??= open();
  return globalForDb.__guildhallDb;
}

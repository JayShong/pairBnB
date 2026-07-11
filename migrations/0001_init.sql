-- Guildhall schema for Cloudflare D1
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

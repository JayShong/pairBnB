// Seeds the database with demo members, characters, and events so a fresh
// deployment has something to explore. Safe to re-run: it exits if any user
// already exists.
//
// Usage: npm run seed
import Database from "better-sqlite3";
import { randomBytes, scryptSync } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const file = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "guildhall.sqlite");
fs.mkdirSync(path.dirname(file), { recursive: true });
const db = new Database(file);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Keep in sync with src/lib/db.ts (the app also creates the schema on boot).
db.exec(`
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
`);

const existing = db.prepare("SELECT COUNT(*) AS n FROM users").get();
if (existing.n > 0) {
  console.log("Database already has members — skipping seed.");
  process.exit(0);
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

const insertUser = db.prepare(
  "INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)"
);
const insertCharacter = db.prepare(
  `INSERT INTO characters (user_id, name, core_class, attunement, race, faction, status, backstory)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);
const insertEvent = db.prepare(
  `INSERT INTO events (gm_id, title, genre, description, venue, region, starts_on, ends_on, capacity, price, amenities)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);
const insertSignup = db.prepare(
  "INSERT INTO signups (event_id, user_id, character_id, note) VALUES (?, ?, ?, ?)"
);

const password = hashPassword("guildhall-demo");
const gm = insertUser.run("morgan@guildhall.example", "Morgan the Chronicler", password, "gm");
const player1 = insertUser.run("ash@guildhall.example", "Ash Winters", password, "player");
const player2 = insertUser.run("rowan@guildhall.example", "Rowan Vale", password, "player");

const char1 = insertCharacter.run(
  player1.lastInsertRowid,
  "Seraphine of the Ember Vale",
  "Arcane Caster",
  "Arcane: Fire",
  "Elf",
  "Cottontail League",
  "active",
  "A court pyromancer of old Armis. She woke on a burning Shard with mundane trinkets, three silver, and fire in her veins."
);
const char2 = insertCharacter.run(
  player2.lastInsertRowid,
  "Krag Ironjaw",
  "Fighter",
  "",
  "Orc",
  "He Guo",
  "active",
  "A retired pit fighter turned caravan guard for a He Guo trade province. Swore off violence — the Maelstrom had other plans."
);
insertCharacter.run(
  player2.lastInsertRowid,
  "Willem the Unlucky",
  "Rogue",
  "",
  "Human",
  "Tuscan Empire",
  "fallen",
  "A Second Son who picked the wrong pocket on the wrong Shard. His bleedout timer ran its ten minutes. Remember him."
);

const inDays = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

const blackwood = insertEvent.run(
  gm.lastInsertRowid,
  "The Blackwood Chronicles",
  "Main Campaign",
  "A weekend on a forest Shard where the trees whisper in green lightning. Feuding clans, forest spirits, and a Cottontail cell that needs help. Check in at the Info Desk from 4pm Friday; weapon and costume inspection before TIME IN.",
  "Blackwood Forest Campground, Trail 7",
  "Blackwood Shard",
  inDays(21),
  inDays(23),
  30,
  45,
  JSON.stringify([
    "Props provided",
    "Weapon & costume inspection",
    "On-site camping",
    "Meals included",
    "First aiders on site",
  ])
);

insertEvent.run(
  gm.lastInsertRowid,
  "Court of the Second Sons",
  "One-Shot Adventure",
  "A Tuscan governor hosts a masquerade to root out Cottontail sympathisers — and everyone is invited. Political intrigue in a real castle; formal garb required, the costume desk can outfit you.",
  "Ravenhurst Castle, 12 Keep Road",
  "Ravenhurst Shard",
  inDays(45),
  inDays(46),
  40,
  80,
  JSON.stringify(["Costume rental", "Meals included", "First aiders on site"])
);

insertEvent.run(
  gm.lastInsertRowid,
  "Skirmish at the Quarry",
  "Skirmish Night",
  "An evening of battle games at the old quarry: capture the banner, hold the ridge, last warband standing. Loaner boffers available; all weapons pass inspection at the gate. Spell packets provided for casters.",
  "Old Quarry Field, Gate B",
  "Stonehaven Shard",
  inDays(60),
  inDays(60),
  50,
  15,
  JSON.stringify([
    "Loaner weapons",
    "Weapon & costume inspection",
    "Spell packets provided",
    "First aiders on site",
  ])
);

insertSignup.run(
  blackwood.lastInsertRowid,
  player1.lastInsertRowid,
  char1.lastInsertRowid,
  "Arriving Friday evening."
);
insertSignup.run(
  blackwood.lastInsertRowid,
  player2.lastInsertRowid,
  char2.lastInsertRowid,
  "Vegetarian meals please."
);

console.log("Seeded demo data. Sign in as morgan@guildhall.example / guildhall-demo (game master).");

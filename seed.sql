-- Demo data for a fresh Guildhall deployment (optional).
-- Apply with:  npm run db:seed:remote   (or db:seed:local for dev)
-- All demo accounts share the password: guildhall-demo
-- Re-running is safe: INSERT OR IGNORE keyed on unique emails.

INSERT OR IGNORE INTO users (id, email, name, password_hash, role) VALUES
  (1, 'morgan@guildhall.example', 'Morgan the Chronicler', '100000:6775696c6468616c6c2d64656d6f2d73:968d989bf4b414cbef8de4eb5ef70f63f30f7bd20dc83aa119d723ad1490d457', 'gm'),
  (2, 'ash@guildhall.example', 'Ash Winters', '100000:6775696c6468616c6c2d64656d6f2d73:968d989bf4b414cbef8de4eb5ef70f63f30f7bd20dc83aa119d723ad1490d457', 'player'),
  (3, 'rowan@guildhall.example', 'Rowan Vale', '100000:6775696c6468616c6c2d64656d6f2d73:968d989bf4b414cbef8de4eb5ef70f63f30f7bd20dc83aa119d723ad1490d457', 'player');

INSERT OR IGNORE INTO characters (id, user_id, name, core_class, attunement, race, faction, status, backstory) VALUES
  (1, 2, 'Seraphine of the Ember Vale', 'Arcane Caster', 'Arcane: Fire', 'Elf', 'Cottontail League', 'active',
   'A court pyromancer of old Armis. She woke on a burning Shard with mundane trinkets, three silver, and fire in her veins.'),
  (2, 3, 'Krag Ironjaw', 'Fighter', '', 'Orc', 'He Guo', 'active',
   'A retired pit fighter turned caravan guard for a He Guo trade province. Swore off violence — the Maelstrom had other plans.'),
  (3, 3, 'Willem the Unlucky', 'Rogue', '', 'Human', 'Tuscan Empire', 'fallen',
   'A Second Son who picked the wrong pocket on the wrong Shard. His bleedout timer ran its ten minutes. Remember him.');

INSERT OR IGNORE INTO events (id, gm_id, title, genre, description, venue, region, starts_on, ends_on, capacity, price, amenities) VALUES
  (1, 1, 'The Blackwood Chronicles', 'Main Campaign',
   'A weekend on a forest Shard where the trees whisper in green lightning. Feuding clans, forest spirits, and a Cottontail cell that needs help. Check in at the Info Desk from 4pm Friday; weapon and costume inspection before TIME IN.',
   'Blackwood Forest Campground, Trail 7', 'Blackwood Shard',
   date('now', '+21 days'), date('now', '+23 days'), 30, 45,
   '["Props provided","Weapon & costume inspection","On-site camping","Meals included","First aiders on site"]'),
  (2, 1, 'Court of the Second Sons', 'One-Shot Adventure',
   'A Tuscan governor hosts a masquerade to root out Cottontail sympathisers — and everyone is invited. Political intrigue in a real castle; formal garb required, the costume desk can outfit you.',
   'Ravenhurst Castle, 12 Keep Road', 'Ravenhurst Shard',
   date('now', '+45 days'), date('now', '+46 days'), 40, 80,
   '["Costume rental","Meals included","First aiders on site"]'),
  (3, 1, 'Skirmish at the Quarry', 'Skirmish Night',
   'An evening of battle games at the old quarry: capture the banner, hold the ridge, last warband standing. Loaner boffers available; all weapons pass inspection at the gate. Spell packets provided for casters.',
   'Old Quarry Field, Gate B', 'Stonehaven Shard',
   date('now', '+60 days'), date('now', '+60 days'), 50, 15,
   '["Loaner weapons","Weapon & costume inspection","Spell packets provided","First aiders on site"]');

INSERT OR IGNORE INTO signups (id, event_id, user_id, character_id, note) VALUES
  (1, 1, 2, 1, 'Arriving Friday evening.'),
  (2, 1, 3, 2, 'Vegetarian meals please.');

# ⚔ Guildhall

**The gathering place for the Maelstrom LARP community.**

Guildhall is the community hub for [Maelstrom LARP](https://drive.google.com/file/d/1fbMmv-Vlq7oAdTAY4lks5p9B35ra8PPH/view)
(a high-fantasy live action role-playing experience by MyLARP, General Rules
2.5th Edition). Game masters post the next adventures on the Shards of
shattered Armis; players create rulebook-legal characters and book a spot in
character.

## Features

- **Events** — game masters post events with venue, region, dates, capacity,
  price per player, an event type (main campaign, one-shot, skirmish night,
  tavern social, training & weapon check), and what the event provides
  (props, costume rental, loaner weapons, weapon & costume inspection, spell
  packets, camping, meals, first aiders). Everyone can browse and search.
- **Characters** — built to the Maelstrom rulebook: a Core Class (Fighter,
  Rogue, Arcane Caster, Divine Caster, Trader), an attunement for casters
  (the six Arcane elements or eight Divine Spheres), a humanoid race, and a
  faction (Tuscan Empire, Cottontail League, He Guo, or your own). Death is
  permanent — fallen characters move to the **Hall of the Fallen** and can
  never be played again.
- **Bookings** — players book a spot at an event *as* one of their living
  characters, with an optional note for the game master. Capacity is
  enforced atomically; the event page shows the live roster (character,
  class, faction, player), and only the GM sees players' private notes.
- **Rules & Lore** — `/rules` is a condensed in-app reference of the
  Maelstrom General Rules (safety, combat, calls, spellcasting, items,
  character creation); `/lore` covers Armis, the Maelstrom, the Shards, and
  the established factions. Both link to the full rulebook.
- **Roles** — join as a player or a game master, and switch any time from
  your profile.
- **Accounts** — email/password auth with scrypt hashing and signed,
  http-only session cookies. No third-party auth service required.

## Stack

- [Next.js 15](https://nextjs.org) (App Router, server components, server
  actions) with TypeScript and React 19
- SQLite via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) —
  zero-ops persistence; the schema is created automatically on boot
- No other runtime dependencies: sessions and password hashing use
  `node:crypto`

## Local development

```bash
npm install
npm run seed     # optional: demo members, characters, and events
npm run dev      # http://localhost:3000
```

The seed prints demo credentials (`morgan@guildhall.example` /
`guildhall-demo` is a game master). The SQLite database lives in
`data/guildhall.sqlite` (git-ignored).

## Production build

```bash
npm run build
SESSION_SECRET=<long random string> npm start
```

## Deploying to the cloud

The app ships as a self-contained Docker image (Next.js standalone output):

```bash
docker build -t guildhall .
docker run -p 3000:3000 \
  -e SESSION_SECRET=$(openssl rand -hex 32) \
  -v guildhall-data:/data \
  guildhall
```

Works as-is on any container platform (Fly.io, Render, Railway, Cloud Run,
a VPS). Two things to configure:

| Env var | Purpose |
| --- | --- |
| `SESSION_SECRET` | **Required in production.** Signs session cookies — use a long random value and keep it stable across deploys. |
| `DATABASE_PATH` | Where the SQLite file lives (the Docker image defaults to `/data/guildhall.sqlite`). Mount a persistent volume there. |

`GET /api/health` is the health/readiness probe (checks the database).

To seed a fresh deployment with demo data, run `node scripts/seed.mjs`
inside the container once.

## Project layout

```
src/lib/          database, auth, and data-access modules
src/app/          App Router pages and server actions
  events/         browse, search, post, event detail + booking
  characters/     directory + character creation
  profile/        role switching, my bookings, my events, my characters
  api/health/     cloud health probe
scripts/seed.mjs  demo data
```

---

*This repository previously hosted pairBnB, a Rails Airbnb-style clone. It
has been replaced by Guildhall; the old code remains in git history.*

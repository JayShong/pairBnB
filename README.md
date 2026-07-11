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
npm run db:migrate:local   # create the local D1 schema
npm run db:seed:local      # optional: demo members, characters, and events
npm run dev                # http://localhost:3000
```

`next dev` gets a local D1 database (via the OpenNext Cloudflare dev
initializer + miniflare), so the same code runs in dev and production.
Demo accounts all use the password `guildhall-demo`
(`morgan@guildhall.example` is a game master).

To test in the real Workers runtime locally:

```bash
npm run preview            # builds the Worker and serves it with wrangler
```

## Hosting at larp.jasonshong.com (Cloudflare Workers + D1)

The production site lives at **https://larp.jasonshong.com**, hosted on
Cloudflare Workers with a D1 (serverless SQLite) database — the same
Cloudflare account that holds the `jasonshong.com` zone, so deploying
creates the DNS record and TLS certificate for the subdomain
automatically.

### Deploying from GitHub (no CLI needed)

`.github/workflows/deploy.yml` is fully self-bootstrapping: on every push
to `master` (or a manual run) it creates the `guildhall` D1 database if it
doesn't exist, injects its id, applies migrations, deploys the Worker —
which auto-provisions the `larp.jasonshong.com` DNS record and certificate
— and sets `SESSION_SECRET` on the first run. A manual run can optionally
load the demo data.

One-time setup, all doable from a phone:

1. **Cloudflare dashboard** → My Profile → API Tokens → Create Token →
   use the **"Edit Cloudflare Workers"** template and *add* the permission
   **Account → D1 → Edit**. Copy the token.
2. Copy your **Account ID** (Workers & Pages overview, right sidebar).
3. **GitHub** → repo Settings → Secrets and variables → Actions → add:
   `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `SESSION_SECRET`
   (any long random string, 40+ characters).
4. Merge to `master` (or run the workflow manually from the Actions tab).

### Deploying from a machine with the CLI (alternative)

```bash
npx wrangler login
npx wrangler d1 create guildhall            # copy the printed id into wrangler.jsonc
npm run db:migrate:remote
npm run db:seed:remote                      # optional demo data
npx wrangler secret put SESSION_SECRET
npm run deploy
```

Either way, the `routes` entry in `wrangler.jsonc` registers
`larp.jasonshong.com` as a Workers custom domain, which provisions the
DNS record and certificate in your zone automatically.

### Configuration

| Setting | Purpose |
| --- | --- |
| `SESSION_SECRET` (Workers secret) | **Required in production.** Signs session cookies — keep it stable across deploys. Locally, set it in `.dev.vars`. |
| `NEXT_PUBLIC_SITE_URL` (var in wrangler.jsonc) | Canonical site origin. Defaults to `https://larp.jasonshong.com`. |
| `DB` (D1 binding) | The `guildhall` database; schema lives in `migrations/`. |

`GET /api/health` is the health probe (checks the database).
`/robots.txt` and `/sitemap.xml` are generated against the site URL.

Passwords are hashed with PBKDF2-SHA256 (600k iterations, the OWASP
recommendation) via Web Crypto and sessions are HMAC-signed cookies, so
no native modules or external auth service are needed on Workers. The
hashing work factor assumes the Workers paid plan's CPU allowance
(login/register exceed the free tier's 10ms CPU cap).

## Project layout

```
src/lib/          D1 data access, auth, rulebook data (maelstrom.ts)
src/app/          App Router pages and server actions
  events/         browse, search, post, event detail + booking
  characters/     directory + rulebook character creation
  rules/, lore/   Maelstrom quick reference and setting
  profile/        role switching, bookings, characters, hosted events
  api/health/     health probe
migrations/       D1 schema migrations
seed.sql          optional demo data
```

---

*This repository previously hosted pairBnB, a Rails Airbnb-style clone. It
has been replaced by Guildhall; the old code remains in git history.*

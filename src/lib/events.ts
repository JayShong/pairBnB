import { getDb } from "@/lib/db";

export const GENRES = [
  "Fantasy",
  "Post-apocalyptic",
  "Horror",
  "Sci-fi",
  "Historical",
  "Mystery",
  "Other",
] as const;

export const AMENITIES = [
  "Props provided",
  "Costume rental",
  "Weapons armory",
  "On-site camping",
  "Meals included",
  "Safety marshal",
] as const;

export interface Event {
  id: number;
  gm_id: number;
  title: string;
  genre: string;
  description: string;
  venue: string;
  region: string;
  starts_on: string;
  ends_on: string;
  capacity: number;
  price: number;
  amenities: string; // JSON array of strings
  created_at: string;
}

export interface EventSummary extends Event {
  gm_name: string;
  signup_count: number;
}

export interface RosterEntry {
  signup_id: number;
  user_id: number;
  player_name: string;
  character_name: string;
  archetype: string;
  note: string;
}

export function amenityList(event: Event): string[] {
  try {
    const parsed = JSON.parse(event.amenities);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const SUMMARY_SELECT = `
  SELECT e.*, u.name AS gm_name,
         (SELECT COUNT(*) FROM signups s WHERE s.event_id = e.id) AS signup_count
  FROM events e JOIN users u ON u.id = e.gm_id
`;

export function listEvents(filter: { q?: string; genre?: string } = {}): EventSummary[] {
  const clauses: string[] = [];
  const args: unknown[] = [];
  if (filter.q) {
    clauses.push("(e.title LIKE ? OR e.venue LIKE ? OR e.region LIKE ? OR e.description LIKE ?)");
    const like = `%${filter.q}%`;
    args.push(like, like, like, like);
  }
  if (filter.genre) {
    clauses.push("e.genre = ?");
    args.push(filter.genre);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return getDb()
    .prepare(`${SUMMARY_SELECT} ${where} ORDER BY e.starts_on ASC`)
    .all(...args) as EventSummary[];
}

export function upcomingEvents(limit: number): EventSummary[] {
  return getDb()
    .prepare(`${SUMMARY_SELECT} WHERE e.ends_on >= date('now') ORDER BY e.starts_on ASC LIMIT ?`)
    .all(limit) as EventSummary[];
}

export function getEvent(id: number): EventSummary | null {
  return (
    (getDb().prepare(`${SUMMARY_SELECT} WHERE e.id = ?`).get(id) as EventSummary | undefined) ??
    null
  );
}

export function listEventsForGm(gmId: number): EventSummary[] {
  return getDb()
    .prepare(`${SUMMARY_SELECT} WHERE e.gm_id = ? ORDER BY e.starts_on ASC`)
    .all(gmId) as EventSummary[];
}

export function createEvent(input: {
  gmId: number;
  title: string;
  genre: string;
  description: string;
  venue: string;
  region: string;
  startsOn: string;
  endsOn: string;
  capacity: number;
  price: number;
  amenities: string[];
}): EventSummary {
  const result = getDb()
    .prepare(
      `INSERT INTO events (gm_id, title, genre, description, venue, region, starts_on, ends_on, capacity, price, amenities)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.gmId,
      input.title,
      input.genre,
      input.description,
      input.venue,
      input.region,
      input.startsOn,
      input.endsOn,
      input.capacity,
      input.price,
      JSON.stringify(input.amenities)
    );
  return getEvent(Number(result.lastInsertRowid))!;
}

export function rosterForEvent(eventId: number): RosterEntry[] {
  return getDb()
    .prepare(
      `SELECT s.id AS signup_id, s.user_id, u.name AS player_name,
              c.name AS character_name, c.archetype, s.note
       FROM signups s
       JOIN users u ON u.id = s.user_id
       JOIN characters c ON c.id = s.character_id
       WHERE s.event_id = ?
       ORDER BY s.created_at ASC`
    )
    .all(eventId) as RosterEntry[];
}

export function getSignupForUser(eventId: number, userId: number): { id: number } | null {
  return (
    (getDb()
      .prepare("SELECT id FROM signups WHERE event_id = ? AND user_id = ?")
      .get(eventId, userId) as { id: number } | undefined) ?? null
  );
}

export interface BookingRow {
  signup_id: number;
  event_id: number;
  title: string;
  venue: string;
  starts_on: string;
  ends_on: string;
  character_name: string;
}

export function listBookingsForUser(userId: number): BookingRow[] {
  return getDb()
    .prepare(
      `SELECT s.id AS signup_id, e.id AS event_id, e.title, e.venue, e.starts_on, e.ends_on,
              c.name AS character_name
       FROM signups s
       JOIN events e ON e.id = s.event_id
       JOIN characters c ON c.id = s.character_id
       WHERE s.user_id = ?
       ORDER BY e.starts_on ASC`
    )
    .all(userId) as BookingRow[];
}

/**
 * Books a spot on an event. Runs in a transaction so the capacity check and
 * the insert are atomic. Throws Error with a human-readable message on
 * business-rule violations.
 */
export function createSignup(input: {
  eventId: number;
  userId: number;
  characterId: number;
  note: string;
}): void {
  const db = getDb();
  db.transaction(() => {
    const event = db.prepare("SELECT id, gm_id, capacity FROM events WHERE id = ?").get(input.eventId) as
      | { id: number; gm_id: number; capacity: number }
      | undefined;
    if (!event) throw new Error("This event no longer exists.");
    if (event.gm_id === input.userId) throw new Error("You are running this event — no need to book a spot.");

    const character = db
      .prepare("SELECT user_id FROM characters WHERE id = ?")
      .get(input.characterId) as { user_id: number } | undefined;
    if (!character || character.user_id !== input.userId) {
      throw new Error("Pick one of your own characters.");
    }

    const taken = db
      .prepare("SELECT COUNT(*) AS n FROM signups WHERE event_id = ?")
      .get(input.eventId) as { n: number };
    if (taken.n >= event.capacity) throw new Error("This event is fully booked.");

    const existing = db
      .prepare("SELECT id FROM signups WHERE event_id = ? AND user_id = ?")
      .get(input.eventId, input.userId);
    if (existing) throw new Error("You already have a spot at this event.");

    db.prepare("INSERT INTO signups (event_id, user_id, character_id, note) VALUES (?, ?, ?, ?)").run(
      input.eventId,
      input.userId,
      input.characterId,
      input.note
    );
  })();
}

export function cancelSignup(eventId: number, userId: number): void {
  getDb().prepare("DELETE FROM signups WHERE event_id = ? AND user_id = ?").run(eventId, userId);
}

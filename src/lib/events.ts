import { getDb } from "@/lib/db";
import { EVENT_AMENITIES, EVENT_TYPES } from "@/lib/maelstrom";

// Kept as named re-exports so event code reads naturally; the underlying
// `genre` column now stores the Maelstrom event type.
export const GENRES = EVENT_TYPES;
export const AMENITIES = EVENT_AMENITIES;

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
  core_class: string;
  faction: string;
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

export async function listEvents(
  filter: { q?: string; genre?: string } = {}
): Promise<EventSummary[]> {
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
  const { results } = await getDb()
    .prepare(`${SUMMARY_SELECT} ${where} ORDER BY e.starts_on ASC`)
    .bind(...args)
    .all<EventSummary>();
  return results;
}

export async function upcomingEvents(limit: number): Promise<EventSummary[]> {
  const { results } = await getDb()
    .prepare(`${SUMMARY_SELECT} WHERE e.ends_on >= date('now') ORDER BY e.starts_on ASC LIMIT ?`)
    .bind(limit)
    .all<EventSummary>();
  return results;
}

export async function getEvent(id: number): Promise<EventSummary | null> {
  return getDb().prepare(`${SUMMARY_SELECT} WHERE e.id = ?`).bind(id).first<EventSummary>();
}

export async function listEventsForGm(gmId: number): Promise<EventSummary[]> {
  const { results } = await getDb()
    .prepare(`${SUMMARY_SELECT} WHERE e.gm_id = ? ORDER BY e.starts_on ASC`)
    .bind(gmId)
    .all<EventSummary>();
  return results;
}

export async function createEvent(input: {
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
}): Promise<EventSummary> {
  const result = await getDb()
    .prepare(
      `INSERT INTO events (gm_id, title, genre, description, venue, region, starts_on, ends_on, capacity, price, amenities)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
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
    )
    .run();
  return (await getEvent(Number(result.meta.last_row_id)))!;
}

export async function rosterForEvent(eventId: number): Promise<RosterEntry[]> {
  const { results } = await getDb()
    .prepare(
      `SELECT s.id AS signup_id, s.user_id, u.name AS player_name,
              c.name AS character_name, c.core_class, c.faction, s.note
       FROM signups s
       JOIN users u ON u.id = s.user_id
       JOIN characters c ON c.id = s.character_id
       WHERE s.event_id = ?
       ORDER BY s.created_at ASC`
    )
    .bind(eventId)
    .all<RosterEntry>();
  return results;
}

export async function getSignupForUser(
  eventId: number,
  userId: number
): Promise<{ id: number } | null> {
  return getDb()
    .prepare("SELECT id FROM signups WHERE event_id = ? AND user_id = ?")
    .bind(eventId, userId)
    .first<{ id: number }>();
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

export async function listBookingsForUser(userId: number): Promise<BookingRow[]> {
  const { results } = await getDb()
    .prepare(
      `SELECT s.id AS signup_id, e.id AS event_id, e.title, e.venue, e.starts_on, e.ends_on,
              c.name AS character_name
       FROM signups s
       JOIN events e ON e.id = s.event_id
       JOIN characters c ON c.id = s.character_id
       WHERE s.user_id = ?
       ORDER BY e.starts_on ASC`
    )
    .bind(userId)
    .all<BookingRow>();
  return results;
}

/**
 * Books a spot on an event. D1 has no interactive transactions, so the
 * capacity check happens inside a single conditional INSERT — the insert
 * only succeeds while spots remain, which keeps overbooking impossible
 * even under concurrent requests. The friendlier business-rule checks
 * run first and throw human-readable errors.
 */
export async function createSignup(input: {
  eventId: number;
  userId: number;
  characterId: number;
  note: string;
}): Promise<void> {
  const db = getDb();

  const event = await db
    .prepare("SELECT id, gm_id, capacity FROM events WHERE id = ?")
    .bind(input.eventId)
    .first<{ id: number; gm_id: number; capacity: number }>();
  if (!event) throw new Error("This event no longer exists.");
  if (event.gm_id === input.userId) {
    throw new Error("You are running this event — no need to book a spot.");
  }

  const character = await db
    .prepare("SELECT user_id, status FROM characters WHERE id = ?")
    .bind(input.characterId)
    .first<{ user_id: number; status: string }>();
  if (!character || character.user_id !== input.userId) {
    throw new Error("Pick one of your own characters.");
  }
  if (character.status !== "active") {
    throw new Error(
      "That character has fallen — death is permanent in the Maelstrom. Create a new character."
    );
  }

  const existing = await getSignupForUser(input.eventId, input.userId);
  if (existing) throw new Error("You already have a spot at this event.");

  let result;
  try {
    result = await db
      .prepare(
        `INSERT INTO signups (event_id, user_id, character_id, note)
         SELECT ?1, ?2, ?3, ?4
         WHERE (SELECT COUNT(*) FROM signups WHERE event_id = ?1)
             < (SELECT capacity FROM events WHERE id = ?1)`
      )
      .bind(input.eventId, input.userId, input.characterId, input.note)
      .run();
  } catch (error) {
    // The UNIQUE(event_id, user_id) constraint catches a double-submit race.
    if (String(error).includes("UNIQUE")) {
      throw new Error("You already have a spot at this event.");
    }
    throw error;
  }
  if (result.meta.changes === 0) throw new Error("This event is fully booked.");
}

export async function cancelSignup(eventId: number, userId: number): Promise<void> {
  await getDb()
    .prepare("DELETE FROM signups WHERE event_id = ? AND user_id = ?")
    .bind(eventId, userId)
    .run();
}

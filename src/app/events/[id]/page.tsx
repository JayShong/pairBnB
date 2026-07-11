import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { listLivingCharactersForUser } from "@/lib/characters";
import { amenityList, getEvent, getSignupForUser, rosterForEvent } from "@/lib/events";
import { bookSpotAction, cancelSpotAction } from "./actions";

export default async function EventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const event = await getEvent(Number(id));
  if (!event) notFound();

  const user = await currentUser();
  const roster = await rosterForEvent(event.id);
  const amenities = amenityList(event);
  const full = event.signup_count >= event.capacity;
  const mySignup = user ? await getSignupForUser(event.id, user.id) : null;
  const myCharacters = user ? await listLivingCharactersForUser(user.id) : [];
  const isGm = user?.id === event.gm_id;

  return (
    <>
      <p>
        <Link href="/events">← All events</Link>
      </p>
      <div className="page-head">
        <h1>{event.title}</h1>
        <span className="badge">{event.genre}</span>
      </div>
      <p className="muted">
        {event.venue} · {event.region} · run by {event.gm_name}
      </p>
      <p>
        <strong>{event.starts_on} → {event.ends_on}</strong> · {event.signup_count}/{event.capacity}{" "}
        spots taken · ${event.price}/player
      </p>
      {amenities.length > 0 && <p className="muted">Provided: {amenities.join(" · ")}</p>}
      <p className="prose">{event.description}</p>

      {error && <p className="error">{error}</p>}

      <section>
        <h2>Your spot</h2>
        {!user && (
          <p>
            <Link href="/login">Sign in</Link> or <Link href="/register">join the guild</Link> to
            book a spot.
          </p>
        )}
        {user && isGm && <p className="muted">You are running this event. The roster is below.</p>}
        {user && !isGm && mySignup && (
          <form action={cancelSpotAction} className="stack">
            <p>You have a spot at this event. We&apos;ll see you in character!</p>
            <input type="hidden" name="event_id" value={event.id} />
            <button type="submit" className="button secondary">
              Cancel my spot
            </button>
          </form>
        )}
        {user && !isGm && !mySignup && full && (
          <p className="muted">This event is fully booked.</p>
        )}
        {user && !isGm && !mySignup && !full && (
          myCharacters.length === 0 ? (
            <p>
              You need a living character first — <Link href="/characters/new">create one</Link>,
              then come back to book your spot.
            </p>
          ) : (
            <form action={bookSpotAction} className="stack">
              <input type="hidden" name="event_id" value={event.id} />
              <label>
                Play as
                <select name="character_id" required>
                  {myCharacters.map((character) => (
                    <option key={character.id} value={character.id}>
                      {character.name} — {character.core_class}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Note for the game master (optional)
                <input
                  type="text"
                  name="note"
                  placeholder="Dietary needs, arrival time, non-combatant (red/white ribbon)…"
                />
              </label>
              <button type="submit" className="button">
                Book my spot
              </button>
            </form>
          )
        )}
      </section>

      <section>
        <h2>Roster ({roster.length})</h2>
        {roster.length === 0 ? (
          <p className="muted">No one has booked a spot yet. Be the first!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Character</th>
                <th>Core Class</th>
                <th>Faction</th>
                <th>Player</th>
                {isGm && <th>Note</th>}
              </tr>
            </thead>
            <tbody>
              {roster.map((entry) => (
                <tr key={entry.signup_id}>
                  <td>{entry.character_name}</td>
                  <td>{entry.core_class}</td>
                  <td>{entry.faction}</td>
                  <td>{entry.player_name}</td>
                  {isGm && <td>{entry.note}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

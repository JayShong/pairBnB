import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { listCharactersForUser } from "@/lib/characters";
import { listBookingsForUser, listEventsForGm } from "@/lib/events";
import { markFallenAction, switchRoleAction } from "./actions";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const user = await currentUser();
  if (!user) redirect("/login");

  const bookings = listBookingsForUser(user.id);
  const characters = listCharactersForUser(user.id);
  const myEvents = user.role === "gm" ? listEventsForGm(user.id) : [];

  return (
    <>
      <h1>{user.name}</h1>
      <p className="muted">
        {user.email} · {user.role === "gm" ? "game master" : "player"}
      </p>
      {error && <p className="error">{error}</p>}

      <form action={switchRoleAction}>
        <button type="submit" className="button secondary">
          {user.role === "gm" ? "Switch to playing" : "Become a game master"}
        </button>
      </form>

      {user.role === "gm" && (
        <section>
          <h2>Events I run</h2>
          {myEvents.length === 0 ? (
            <p className="muted">
              You haven&apos;t posted any events yet. <Link href="/events/new">Post one now</Link>.
            </p>
          ) : (
            <ul className="list">
              {myEvents.map((event) => (
                <li key={event.id}>
                  <Link href={`/events/${event.id}`}>{event.title}</Link> — {event.starts_on},{" "}
                  {event.signup_count}/{event.capacity} spots taken
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section>
        <h2>My bookings</h2>
        {bookings.length === 0 ? (
          <p className="muted">
            No bookings yet. <Link href="/events">Find your next adventure</Link>.
          </p>
        ) : (
          <ul className="list">
            {bookings.map((booking) => (
              <li key={booking.signup_id}>
                <Link href={`/events/${booking.event_id}`}>{booking.title}</Link> at {booking.venue},{" "}
                {booking.starts_on} → {booking.ends_on}, as <strong>{booking.character_name}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>My characters</h2>
        {characters.length === 0 ? (
          <p className="muted">
            None yet. <Link href="/characters/new">Create your first character</Link>.
          </p>
        ) : (
          <ul className="list">
            {characters.map((character) => (
              <li key={character.id}>
                <strong>{character.name}</strong> — {character.core_class}
                {character.attunement ? ` (${character.attunement})` : ""} · {character.faction}
                {character.status === "fallen" ? (
                  <span className="muted"> · ☠ fallen</span>
                ) : (
                  <form action={markFallenAction} className="inline-form">
                    <input type="hidden" name="character_id" value={character.id} />{" "}
                    <button type="submit" className="link-button danger">
                      Mark as fallen (permanent)
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="muted">
          Per the rulebook, death is permanent — no clones, twins, descendants, or resurrections of
          a fallen character.
        </p>
      </section>
    </>
  );
}

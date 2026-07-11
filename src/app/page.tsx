import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { upcomingEvents, amenityList } from "@/lib/events";

export default async function HomePage() {
  const user = await currentUser();
  const events = await upcomingEvents(4);

  return (
    <>
      <section className="hero">
        <h1>The gathering place for the Maelstrom LARP community</h1>
        <p>
          The world of Armis shattered, and we play in the pieces. Game masters post the next
          adventures on the Shards — campaigns, one-shots, skirmish nights, tavern socials — and
          players book a spot in character: 3 Hit Points, 3 Silver, and a story worth telling.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/events">
            Browse events
          </Link>
          {!user && (
            <Link className="button secondary" href="/register">
              Join the guild
            </Link>
          )}
          {user?.role === "gm" && (
            <Link className="button secondary" href="/events/new">
              Post an event
            </Link>
          )}
          <Link className="button secondary" href="/lore">
            Read the lore
          </Link>
        </div>
        <p className="muted">
          New to Maelstrom? Start with the <Link href="/rules">quick rules reference</Link>, then{" "}
          <Link href="/characters/new">create your first character</Link>.
        </p>
      </section>

      <section>
        <h2>Next adventures</h2>
        {events.length === 0 ? (
          <p className="muted">
            No upcoming events yet. {user?.role === "gm" ? "Post the first one!" : "Check back soon."}
          </p>
        ) : (
          <div className="card-grid">
            {events.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="card">
                <span className="badge">{event.genre}</span>
                <h3>{event.title}</h3>
                <p className="muted">
                  {event.venue} · {event.region}
                </p>
                <p>
                  {event.starts_on} → {event.ends_on}
                </p>
                <p className="muted">{amenityList(event).join(" · ")}</p>
                <p>
                  {event.signup_count}/{event.capacity} spots taken · ${event.price}/player
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

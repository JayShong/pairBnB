import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { upcomingEvents, amenityList } from "@/lib/events";

export default async function HomePage() {
  const user = await currentUser();
  const events = upcomingEvents(4);

  return (
    <>
      <section className="hero">
        <h1>The gathering place for your LARP community</h1>
        <p>
          Game masters post their upcoming adventures — weekend-long fantasy campaigns, one-night
          murder mysteries, wasteland survival runs. Players pick an event, book a spot in
          character, and show up ready to play.
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
        </div>
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

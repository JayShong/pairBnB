import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { GENRES, amenityList, listEvents } from "@/lib/events";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string }>;
}) {
  const { q, genre } = await searchParams;
  const user = await currentUser();
  const events = await listEvents({ q, genre });

  return (
    <>
      <div className="page-head">
        <h1>LARP events</h1>
        {user?.role === "gm" && (
          <Link className="button" href="/events/new">
            Post an event
          </Link>
        )}
      </div>

      <form method="get" className="filter-bar">
        <input
          type="search"
          name="q"
          placeholder="Search title, venue, region…"
          defaultValue={q ?? ""}
        />
        <select name="genre" defaultValue={genre ?? ""}>
          <option value="">All event types</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <button type="submit" className="button secondary">
          Search
        </button>
      </form>

      {events.length === 0 ? (
        <p className="muted">No events match. Try widening your search.</p>
      ) : (
        <div className="card-grid">
          {events.map((event) => {
            const full = event.signup_count >= event.capacity;
            return (
              <Link key={event.id} href={`/events/${event.id}`} className="card">
                <span className="badge">{event.genre}</span>
                {full && <span className="badge full">Fully booked</span>}
                <h3>{event.title}</h3>
                <p className="muted">
                  {event.venue} · {event.region} · run by {event.gm_name}
                </p>
                <p>
                  {event.starts_on} → {event.ends_on}
                </p>
                <p className="muted">{amenityList(event).join(" · ")}</p>
                <p>
                  {event.signup_count}/{event.capacity} spots taken · ${event.price}/player
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

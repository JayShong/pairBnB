import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { AMENITIES, GENRES } from "@/lib/events";
import { createEventAction } from "./actions";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role !== "gm") redirect("/profile");

  return (
    <div className="narrow">
      <h1>Post a LARP event</h1>
      {error && <p className="error">{error}</p>}
      <form action={createEventAction} className="stack">
        <label>
          Title
          <input type="text" name="title" required placeholder="The Blackwood Chronicles" />
        </label>
        <label>
          Event type
          <select name="genre" required defaultValue="Main Campaign">
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <label>
          Pitch the adventure
          <textarea
            name="description"
            rows={5}
            required
            placeholder="What awaits the players on this Shard? Tone, plot hooks, what to bring, check-in time at the Info Desk…"
          />
        </label>
        <label>
          Venue
          <input type="text" name="venue" required placeholder="Blackwood Forest Campground" />
        </label>
        <label>
          Region
          <input type="text" name="region" required placeholder="Blackwood" />
        </label>
        <div className="field-row">
          <label>
            Starts on
            <input type="date" name="starts_on" required />
          </label>
          <label>
            Ends on
            <input type="date" name="ends_on" required />
          </label>
        </div>
        <div className="field-row">
          <label>
            Capacity (players)
            <input type="number" name="capacity" min={1} required defaultValue={20} />
          </label>
          <label>
            Price per player ($)
            <input type="number" name="price" min={0} defaultValue={0} />
          </label>
        </div>
        <fieldset>
          <legend>What does your event provide?</legend>
          {AMENITIES.map((amenity) => (
            <label key={amenity} className="radio">
              <input type="checkbox" name="amenities" value={amenity} /> {amenity}
            </label>
          ))}
        </fieldset>
        <button type="submit" className="button">
          Post this event
        </button>
      </form>
    </div>
  );
}

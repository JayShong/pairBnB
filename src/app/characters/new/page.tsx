import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { ARCHETYPES } from "@/lib/characters";
import { createCharacterAction } from "./actions";

export default async function NewCharacterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; return_to?: string }>;
}) {
  const { error, return_to } = await searchParams;
  const user = await currentUser();
  if (!user) redirect("/login");

  return (
    <div className="narrow">
      <h1>Create a character</h1>
      {error && <p className="error">{error}</p>}
      <form action={createCharacterAction} className="stack">
        {return_to && <input type="hidden" name="return_to" value={return_to} />}
        <label>
          Character name
          <input type="text" name="name" required placeholder="Seraphine of the Ember Vale" />
        </label>
        <label>
          Archetype
          <select name="archetype" required defaultValue="Warrior">
            {ARCHETYPES.map((archetype) => (
              <option key={archetype} value={archetype}>
                {archetype}
              </option>
            ))}
          </select>
        </label>
        <label>
          Backstory (optional)
          <textarea
            name="backstory"
            rows={5}
            placeholder="Where do they come from? What do they want?"
          />
        </label>
        <button type="submit" className="button">
          Bring them to life
        </button>
      </form>
    </div>
  );
}

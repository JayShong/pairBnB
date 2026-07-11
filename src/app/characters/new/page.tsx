import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import {
  ARCANE_ATTUNEMENTS,
  CORE_CLASSES,
  CORE_CLASS_DESCRIPTIONS,
  DIVINE_ATTUNEMENTS,
  FACTIONS,
} from "@/lib/maelstrom";
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
      <p className="muted">
        Every character enters the Maelstrom with 3 Hit Points, 3 Silver Pieces, basic gear, and
        one Core Class skill. Humanoid races only — and remember, your costume must show it. See
        the <Link href="/rules">rules</Link> and <Link href="/lore">lore</Link> before you begin.
      </p>
      {error && <p className="error">{error}</p>}
      <form action={createCharacterAction} className="stack">
        {return_to && <input type="hidden" name="return_to" value={return_to} />}
        <label>
          Character name
          <input type="text" name="name" required placeholder="Seraphine of the Ember Vale" />
        </label>
        <label>
          Race (humanoid only — no dragons, demons, angels, fae, or undead)
          <input type="text" name="race" placeholder="Human, Elf, Dwarf, Orc…" defaultValue="Human" />
        </label>
        <fieldset>
          <legend>Core Class</legend>
          {CORE_CLASSES.map((coreClass) => (
            <label key={coreClass} className="radio">
              <input
                type="radio"
                name="core_class"
                value={coreClass}
                defaultChecked={coreClass === "Fighter"}
                required
              />{" "}
              <span>
                <strong>{coreClass}</strong> — {CORE_CLASS_DESCRIPTIONS[coreClass]}
              </span>
            </label>
          ))}
        </fieldset>
        <label>
          Attunement (Arcane and Divine Casters only)
          <select name="attunement" defaultValue="">
            <option value="">None — I am not a caster</option>
            <optgroup label="Arcane elements (Arcane Caster)">
              {ARCANE_ATTUNEMENTS.map((attunement) => (
                <option key={attunement} value={attunement}>
                  {attunement}
                </option>
              ))}
            </optgroup>
            <optgroup label="Divine Spheres (Divine Caster)">
              {DIVINE_ATTUNEMENTS.map((attunement) => (
                <option key={attunement} value={attunement}>
                  {attunement}
                </option>
              ))}
            </optgroup>
          </select>
        </label>
        <label>
          Faction
          <select name="faction" required defaultValue="Independent / Own Faction">
            {FACTIONS.map((faction) => (
              <option key={faction} value={faction}>
                {faction}
              </option>
            ))}
          </select>
        </label>
        <label>
          Backstory (optional — it grants no powers, and keep it high fantasy)
          <textarea
            name="backstory"
            rows={5}
            placeholder="Who were you before the Maelstrom? What do you want now that the world is Shards?"
          />
        </label>
        <button type="submit" className="button">
          Bring them to life
        </button>
      </form>
    </div>
  );
}

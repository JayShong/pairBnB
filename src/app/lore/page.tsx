import Link from "next/link";
import { FACTION_LORE, RULEBOOK_URL } from "@/lib/maelstrom";

export const metadata = { title: "Lore — Guildhall" };

export default function LorePage() {
  return (
    <>
      <h1>The world of the Maelstrom</h1>
      <p className="muted">
        The setting of Maelstrom LARP, from the General Rules 2.5th Edition (MyLARP).{" "}
        <a href={RULEBOOK_URL}>Read the full rulebook</a>.
      </p>

      <section>
        <h2>Armis, shattered</h2>
        <p className="prose">
          Maelstrom takes place on an earth-like planet known historically as Armis — a vast world
          of diverse cultures that may call it by other names. It is a high-fantasy world: magic
          and monsters are relatively commonplace, technology has taken a backseat, and most of
          what passes for machinery is powered by magic. There are no guns and no electricity.
        </p>
        <p className="prose">
          Then came the calamity called the Maelstrom. The planet shattered, and its people were
          displaced onto the Shards left behind — islands bordered by chaotic forces. Travel
          between the Shards is possible, in various ways.
        </p>
      </section>

      <section>
        <h2>Waking up</h2>
        <p className="prose">
          When the Maelstrom occurred, the last thing you remember was thunder and green lightning
          before the world faded to black. Then you awoke in a strange place to see the world torn
          asunder. You do not know how much time has passed. You awoke with what you carried —
          though every magical trinket is now mundane, and your coin pouch holds only 3 silver.
          Those who lived without magic now feel a strange tingling in their veins.
        </p>
        <p className="muted">
          New players are advised to make Waking Up the first chapter of their story. Experienced
          role-players may wake earlier and explore before reaching the main play area — with a
          GM&apos;s blessing.
        </p>
      </section>

      <section>
        <h2>Factions of the Shards</h2>
        <div className="card-grid">
          {FACTION_LORE.map((faction) => (
            <div key={faction.name} className="card">
              <span className="badge">{faction.motto}</span>
              <h3>{faction.name}</h3>
              <p className="prose">{faction.description}</p>
            </div>
          ))}
        </div>
        <p className="prose">
          You can always create your own lore and faction, as long as it fits the character
          creation boundaries — you are empowered to tell a unique story about where you came from
          and how you ended up in the Maelstrom.{" "}
          <Link href="/characters/new">Create your character</Link> when you&apos;re ready.
        </p>
      </section>
    </>
  );
}

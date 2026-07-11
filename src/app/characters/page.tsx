import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { listCharacters } from "@/lib/characters";

export default async function CharactersPage() {
  const user = await currentUser();
  const characters = listCharacters();
  const living = characters.filter((character) => character.status === "active");
  const fallen = characters.filter((character) => character.status === "fallen");

  return (
    <>
      <div className="page-head">
        <h1>Character directory</h1>
        {user && (
          <Link className="button" href="/characters/new">
            Create a character
          </Link>
        )}
      </div>
      {living.length === 0 ? (
        <p className="muted">No characters yet — be the first to bring one to life.</p>
      ) : (
        <div className="card-grid">
          {living.map((character) => (
            <div key={character.id} className="card">
              <span className="badge">{character.core_class}</span>
              {character.attunement && <span className="badge">{character.attunement}</span>}
              <h3>{character.name}</h3>
              <p className="muted">
                {character.race} · {character.faction} · played by {character.player_name}
              </p>
              {character.backstory && <p className="prose">{character.backstory}</p>}
            </div>
          ))}
        </div>
      )}

      {fallen.length > 0 && (
        <section>
          <h2>Hall of the Fallen</h2>
          <p className="muted">
            In the Maelstrom, death is permanent. Their stories have ended, but their legacies live
            on.
          </p>
          <div className="card-grid">
            {fallen.map((character) => (
              <div key={character.id} className="card fallen">
                <span className="badge">{character.core_class}</span>
                <h3>☠ {character.name}</h3>
                <p className="muted">
                  {character.race} · {character.faction} · played by {character.player_name}
                </p>
                {character.backstory && <p className="prose">{character.backstory}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

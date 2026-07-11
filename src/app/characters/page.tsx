import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { listCharacters } from "@/lib/characters";

export default async function CharactersPage() {
  const user = await currentUser();
  const characters = listCharacters();

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
      {characters.length === 0 ? (
        <p className="muted">No characters yet — be the first to bring one to life.</p>
      ) : (
        <div className="card-grid">
          {characters.map((character) => (
            <div key={character.id} className="card">
              <span className="badge">{character.archetype}</span>
              <h3>{character.name}</h3>
              <p className="muted">played by {character.player_name}</p>
              {character.backstory && <p className="prose">{character.backstory}</p>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

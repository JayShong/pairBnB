import { getDb } from "@/lib/db";

export interface Character {
  id: number;
  user_id: number;
  name: string;
  core_class: string;
  attunement: string;
  race: string;
  faction: string;
  status: "active" | "fallen";
  backstory: string;
  created_at: string;
}

export interface CharacterWithPlayer extends Character {
  player_name: string;
}

export async function listCharacters(): Promise<CharacterWithPlayer[]> {
  const { results } = await getDb()
    .prepare(
      `SELECT c.*, u.name AS player_name
       FROM characters c JOIN users u ON u.id = c.user_id
       ORDER BY c.status ASC, c.created_at DESC`
    )
    .all<CharacterWithPlayer>();
  return results;
}

export async function listCharactersForUser(userId: number): Promise<Character[]> {
  const { results } = await getDb()
    .prepare("SELECT * FROM characters WHERE user_id = ? ORDER BY created_at DESC")
    .bind(userId)
    .all<Character>();
  return results;
}

// Death is permanent in the Maelstrom — only living characters can be
// played at events.
export async function listLivingCharactersForUser(userId: number): Promise<Character[]> {
  const { results } = await getDb()
    .prepare(
      "SELECT * FROM characters WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC"
    )
    .bind(userId)
    .all<Character>();
  return results;
}

export async function getCharacter(id: number): Promise<Character | null> {
  return getDb().prepare("SELECT * FROM characters WHERE id = ?").bind(id).first<Character>();
}

export async function createCharacter(input: {
  userId: number;
  name: string;
  coreClass: string;
  attunement: string;
  race: string;
  faction: string;
  backstory: string;
}): Promise<Character> {
  const result = await getDb()
    .prepare(
      `INSERT INTO characters (user_id, name, core_class, attunement, race, faction, backstory)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      input.userId,
      input.name,
      input.coreClass,
      input.attunement,
      input.race,
      input.faction,
      input.backstory
    )
    .run();
  return (await getCharacter(Number(result.meta.last_row_id)))!;
}

// Permanent death, per the rulebook: the story ends here. This cannot be
// undone, and the character keeps their place in the Hall of the Fallen.
export async function markCharacterFallen(id: number, userId: number): Promise<void> {
  await getDb()
    .prepare("UPDATE characters SET status = 'fallen' WHERE id = ? AND user_id = ?")
    .bind(id, userId)
    .run();
}

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

export function listCharacters(): CharacterWithPlayer[] {
  return getDb()
    .prepare(
      `SELECT c.*, u.name AS player_name
       FROM characters c JOIN users u ON u.id = c.user_id
       ORDER BY c.status ASC, c.created_at DESC`
    )
    .all() as CharacterWithPlayer[];
}

export function listCharactersForUser(userId: number): Character[] {
  return getDb()
    .prepare("SELECT * FROM characters WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as Character[];
}

// Death is permanent in the Maelstrom — only living characters can be
// played at events.
export function listLivingCharactersForUser(userId: number): Character[] {
  return getDb()
    .prepare(
      "SELECT * FROM characters WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC"
    )
    .all(userId) as Character[];
}

export function getCharacter(id: number): Character | null {
  return (
    (getDb().prepare("SELECT * FROM characters WHERE id = ?").get(id) as Character | undefined) ??
    null
  );
}

export function createCharacter(input: {
  userId: number;
  name: string;
  coreClass: string;
  attunement: string;
  race: string;
  faction: string;
  backstory: string;
}): Character {
  const result = getDb()
    .prepare(
      `INSERT INTO characters (user_id, name, core_class, attunement, race, faction, backstory)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.userId,
      input.name,
      input.coreClass,
      input.attunement,
      input.race,
      input.faction,
      input.backstory
    );
  return getCharacter(Number(result.lastInsertRowid))!;
}

// Permanent death, per the rulebook: the story ends here. This cannot be
// undone, and the character keeps their place in the Hall of the Fallen.
export function markCharacterFallen(id: number, userId: number): void {
  getDb()
    .prepare("UPDATE characters SET status = 'fallen' WHERE id = ? AND user_id = ?")
    .run(id, userId);
}

import { getDb } from "@/lib/db";

export const ARCHETYPES = [
  "Warrior",
  "Mage",
  "Rogue",
  "Healer",
  "Bard",
  "Ranger",
  "Merchant",
  "Noble",
  "Scavenger",
  "Investigator",
] as const;

export interface Character {
  id: number;
  user_id: number;
  name: string;
  archetype: string;
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
       ORDER BY c.created_at DESC`
    )
    .all() as CharacterWithPlayer[];
}

export function listCharactersForUser(userId: number): Character[] {
  return getDb()
    .prepare("SELECT * FROM characters WHERE user_id = ? ORDER BY created_at DESC")
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
  archetype: string;
  backstory: string;
}): Character {
  const result = getDb()
    .prepare("INSERT INTO characters (user_id, name, archetype, backstory) VALUES (?, ?, ?, ?)")
    .run(input.userId, input.name, input.archetype, input.backstory);
  return getCharacter(Number(result.lastInsertRowid))!;
}

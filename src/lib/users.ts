import { getDb } from "@/lib/db";

export type Role = "player" | "gm";

export interface User {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  role: Role;
  created_at: string;
}

export function getUserById(id: number): User | null {
  return (getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined) ?? null;
}

export function getUserByEmail(email: string): User | null {
  return (
    (getDb().prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined) ?? null
  );
}

export function createUser(input: {
  email: string;
  name: string;
  passwordHash: string;
  role: Role;
}): User {
  const result = getDb()
    .prepare("INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)")
    .run(input.email, input.name, input.passwordHash, input.role);
  return getUserById(Number(result.lastInsertRowid))!;
}

export function setUserRole(id: number, role: Role): void {
  getDb().prepare("UPDATE users SET role = ? WHERE id = ?").run(role, id);
}

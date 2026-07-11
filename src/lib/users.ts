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

export async function getUserById(id: number): Promise<User | null> {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").bind(id).first<User>();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return getDb().prepare("SELECT * FROM users WHERE email = ?").bind(email).first<User>();
}

export async function createUser(input: {
  email: string;
  name: string;
  passwordHash: string;
  role: Role;
}): Promise<User> {
  const result = await getDb()
    .prepare("INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)")
    .bind(input.email, input.name, input.passwordHash, input.role)
    .run();
  return (await getUserById(Number(result.meta.last_row_id)))!;
}

export async function setUserRole(id: number, role: Role): Promise<void> {
  await getDb().prepare("UPDATE users SET role = ? WHERE id = ?").bind(role, id).run();
}

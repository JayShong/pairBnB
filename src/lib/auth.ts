import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getUserById, type User } from "@/lib/users";

const SESSION_COOKIE = "guildhall_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14; // two weeks

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_INSECURE_SESSION_SECRET !== "1") {
    throw new Error("SESSION_SECRET must be set in production");
  }
  return "guildhall-dev-secret-do-not-use-in-production";
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function makeToken(userId: number): string {
  const payload = `${userId}.${Date.now() + SESSION_TTL_MS}`;
  return `${payload}.${sign(payload)}`;
}

function userIdFromToken(token: string): number | null {
  const [id, expires, signature] = token.split(".");
  if (!id || !expires || !signature) return null;
  const payload = `${id}.${expires}`;
  const expected = sign(payload);
  const given = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) return null;
  if (Number(expires) < Date.now()) return null;
  return Number(id);
}

export async function startSession(userId: number): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, makeToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS / 1000,
    path: "/",
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function currentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const userId = userIdFromToken(token);
  if (userId === null) return null;
  return getUserById(userId);
}

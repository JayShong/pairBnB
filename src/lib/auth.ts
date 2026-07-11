import "server-only";
import { cookies } from "next/headers";
import { getEnv } from "@/lib/db";
import { getUserById, type User } from "@/lib/users";

// Auth built entirely on Web Crypto so it runs on Cloudflare Workers:
// PBKDF2-SHA256 for passwords, HMAC-SHA256 for session cookie signatures.

const SESSION_COOKIE = "guildhall_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14; // two weeks
// OWASP-recommended work factor for PBKDF2-SHA256. Needs the Workers paid
// plan's CPU allowance (login/register exceed the free tier's 10ms cap).
// Verification reads the iteration count from the stored hash, so changing
// this never invalidates existing passwords.
const PBKDF2_ITERATIONS = 600_000;

function secret(): string {
  const env = getEnv();
  const value = env.SESSION_SECRET ?? process.env.SESSION_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set (npx wrangler secret put SESSION_SECRET)");
  }
  return "guildhall-dev-secret-do-not-use-in-production";
}

const encoder = new TextEncoder();

function toHex(bytes: ArrayBuffer | Uint8Array): string {
  return Array.from(new Uint8Array(bytes as ArrayBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0 || /[^0-9a-f]/i.test(hex)) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    key,
    256
  );
  return new Uint8Array(bits);
}

// Stored as "iterations:salthex:hashhex".
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `${PBKDF2_ITERATIONS}:${toHex(salt)}:${toHex(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [iterationsRaw, saltHex, hashHex] = stored.split(":");
  const iterations = Number(iterationsRaw);
  const salt = saltHex ? fromHex(saltHex) : null;
  const expected = hashHex ? fromHex(hashHex) : null;
  if (!Number.isInteger(iterations) || iterations < 1 || !salt || !expected) return false;
  const candidate = await pbkdf2(password, salt, iterations);
  return constantTimeEqual(candidate, expected);
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toHex(signature);
}

async function makeToken(userId: number): Promise<string> {
  const payload = `${userId}.${Date.now() + SESSION_TTL_MS}`;
  return `${payload}.${await hmac(payload)}`;
}

async function userIdFromToken(token: string): Promise<number | null> {
  const [id, expires, signature] = token.split(".");
  if (!id || !expires || !signature) return null;
  const expected = await hmac(`${id}.${expires}`);
  if (!constantTimeEqual(encoder.encode(signature), encoder.encode(expected))) return null;
  if (Number(expires) < Date.now()) return null;
  return Number(id);
}

export async function startSession(userId: number): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, await makeToken(userId), {
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
  const userId = await userIdFromToken(token);
  if (userId === null) return null;
  return getUserById(userId);
}

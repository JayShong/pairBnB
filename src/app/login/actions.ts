"use server";

import { redirect } from "next/navigation";
import { endSession, hashPassword, startSession, verifyPassword } from "@/lib/auth";
import { createUser, getUserByEmail, type Role } from "@/lib/users";

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAction(form: FormData): Promise<void> {
  const email = text(form, "email");
  const password = typeof form.get("password") === "string" ? (form.get("password") as string) : "";

  const user = email ? getUserByEmail(email) : null;
  if (!user || !verifyPassword(password, user.password_hash)) {
    redirect(`/login?error=${encodeURIComponent("Wrong email or password.")}`);
  }

  await startSession(user.id);
  redirect("/events");
}

export async function registerAction(form: FormData): Promise<void> {
  const name = text(form, "name");
  const email = text(form, "email");
  const password = typeof form.get("password") === "string" ? (form.get("password") as string) : "";
  const role: Role = form.get("role") === "gm" ? "gm" : "player";

  const back = (message: string) =>
    redirect(`/register?error=${encodeURIComponent(message)}`);

  if (!name || !email || !email.includes("@")) back("Please fill in your name and a valid email.");
  if (password.length < 8) back("Password must be at least 8 characters.");
  if (getUserByEmail(email)) back("There is already a member with that email.");

  const user = createUser({ email, name, passwordHash: hashPassword(password), role });
  await startSession(user.id);
  redirect("/events");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/");
}

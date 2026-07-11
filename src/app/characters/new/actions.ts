"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { ARCHETYPES, createCharacter } from "@/lib/characters";

export async function createCharacterAction(form: FormData): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/login");

  const text = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" ? value.trim() : "";
  };

  const name = text("name");
  const archetype = text("archetype");
  const backstory = text("backstory");
  const returnTo = text("return_to");

  const back = (message: string) =>
    redirect(`/characters/new?error=${encodeURIComponent(message)}`);

  if (!name) back("Your character needs a name.");
  if (!(ARCHETYPES as readonly string[]).includes(archetype)) back("Pick an archetype from the list.");

  createCharacter({ userId: user.id, name, archetype, backstory });

  revalidatePath("/characters");
  redirect(returnTo.startsWith("/") ? returnTo : "/characters");
}

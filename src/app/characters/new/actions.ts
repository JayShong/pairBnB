"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { createCharacter } from "@/lib/characters";
import { CORE_CLASSES, FACTIONS, attunementsForClass } from "@/lib/maelstrom";

export async function createCharacterAction(form: FormData): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/login");

  const text = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" ? value.trim() : "";
  };

  const name = text("name");
  const coreClass = text("core_class");
  const attunement = text("attunement");
  const race = text("race") || "Human";
  const faction = text("faction");
  const backstory = text("backstory");
  const returnTo = text("return_to");

  const back = (message: string) =>
    redirect(`/characters/new?error=${encodeURIComponent(message)}`);

  if (!name) back("Your character needs a name.");
  if (!(CORE_CLASSES as readonly string[]).includes(coreClass)) {
    back("Pick a Core Class from the rulebook.");
  }
  if (!(FACTIONS as readonly string[]).includes(faction)) back("Pick a faction.");

  // Casters must choose an attunement of the matching alignment; everyone
  // else has none (Rules 7.3 / 7.4).
  const allowed = attunementsForClass(coreClass);
  if (allowed.length > 0 && !allowed.includes(attunement)) {
    back(
      coreClass === "Arcane Caster"
        ? "An Arcane Caster must attune to one of the six elements."
        : "A Divine Caster must attune to one of the Divine Spheres."
    );
  }

  await createCharacter({
    userId: user.id,
    name,
    coreClass,
    attunement: allowed.length > 0 ? attunement : "",
    race,
    faction,
    backstory,
  });

  revalidatePath("/characters");
  redirect(returnTo.startsWith("/") ? returnTo : "/characters");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { markCharacterFallen } from "@/lib/characters";
import { setUserRole } from "@/lib/users";

export async function switchRoleAction(): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/login");

  setUserRole(user.id, user.role === "gm" ? "player" : "gm");
  revalidatePath("/profile");
  redirect("/profile");
}

// Death is permanent in the Maelstrom (Rules 2.7) — there is no undo.
export async function markFallenAction(form: FormData): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/login");

  const characterId = Number(form.get("character_id"));
  if (Number.isInteger(characterId)) {
    markCharacterFallen(characterId, user.id);
    revalidatePath("/characters");
    revalidatePath("/profile");
  }
  redirect("/profile");
}

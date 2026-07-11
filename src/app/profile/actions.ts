"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { setUserRole } from "@/lib/users";

export async function switchRoleAction(): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/login");

  setUserRole(user.id, user.role === "gm" ? "player" : "gm");
  revalidatePath("/profile");
  redirect("/profile");
}

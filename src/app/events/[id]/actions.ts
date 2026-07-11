"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { cancelSignup, createSignup } from "@/lib/events";

export async function bookSpotAction(form: FormData): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/login");

  const eventId = Number(form.get("event_id"));
  const characterId = Number(form.get("character_id"));
  const noteValue = form.get("note");
  const note = typeof noteValue === "string" ? noteValue.trim() : "";

  if (!Number.isInteger(eventId)) redirect("/events");
  if (!Number.isInteger(characterId) || characterId < 1) {
    redirect(`/events/${eventId}?error=${encodeURIComponent("Pick a character to play.")}`);
  }

  try {
    await createSignup({ eventId, userId: user.id, characterId, note });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not book your spot.";
    redirect(`/events/${eventId}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath(`/events/${eventId}`);
  redirect(`/events/${eventId}`);
}

export async function cancelSpotAction(form: FormData): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/login");

  const eventId = Number(form.get("event_id"));
  if (Number.isInteger(eventId)) {
    await cancelSignup(eventId, user.id);
    revalidatePath(`/events/${eventId}`);
    redirect(`/events/${eventId}`);
  }
  redirect("/events");
}

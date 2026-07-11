"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { AMENITIES, GENRES, createEvent } from "@/lib/events";

export async function createEventAction(form: FormData): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role !== "gm") redirect("/profile?error=" + encodeURIComponent("Switch to the game master role to post events."));

  const back = (message: string) => redirect(`/events/new?error=${encodeURIComponent(message)}`);

  const text = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" ? value.trim() : "";
  };

  const title = text("title");
  const genre = text("genre");
  const description = text("description");
  const venue = text("venue");
  const region = text("region");
  const startsOn = text("starts_on");
  const endsOn = text("ends_on");
  const capacity = Number(text("capacity"));
  const price = Number(text("price") || "0");
  const amenities = form
    .getAll("amenities")
    .filter((a): a is string => typeof a === "string" && (AMENITIES as readonly string[]).includes(a));

  if (!title || !description || !venue || !region) back("Please fill in every field.");
  if (!(GENRES as readonly string[]).includes(genre)) back("Pick a genre from the list.");
  if (!startsOn || !endsOn || endsOn < startsOn) back("The end date can't be before the start date.");
  if (!Number.isInteger(capacity) || capacity < 1) back("Capacity must be at least 1 player.");
  if (!Number.isFinite(price) || price < 0) back("Price can't be negative.");

  const event = createEvent({
    gmId: user.id,
    title,
    genre,
    description,
    venue,
    region,
    startsOn,
    endsOn,
    capacity,
    price: Math.round(price),
    amenities,
  });

  revalidatePath("/events");
  redirect(`/events/${event.id}`);
}

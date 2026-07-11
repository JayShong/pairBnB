import type { MetadataRoute } from "next";
import { listEvents } from "@/lib/events";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/events", "/characters", "/rules", "/lore"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "daily" as const,
  }));

  const eventPages = listEvents().map((event) => ({
    url: `${SITE_URL}/events/${event.id}`,
    changeFrequency: "daily" as const,
  }));

  return [...staticPages, ...eventPages];
}

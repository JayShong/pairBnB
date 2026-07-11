import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// The D1 database bound in wrangler.jsonc. In `next dev` the OpenNext
// dev initializer provides a local miniflare-backed D1 with the same
// binding name.
export function getDb(): D1Database {
  const { env } = getCloudflareContext();
  return env.DB;
}

export function getEnv(): CloudflareEnv {
  return getCloudflareContext().env;
}

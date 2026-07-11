// Bindings available on the Cloudflare Workers environment.
// Keep in sync with wrangler.jsonc.
interface CloudflareEnv {
  DB: D1Database;
  ASSETS: Fetcher;
  SESSION_SECRET?: string;
  NEXT_PUBLIC_SITE_URL?: string;
}

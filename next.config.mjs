import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Gives `next dev` access to the Cloudflare bindings (local D1 via
// miniflare) so the same code runs in dev and on Workers.
initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

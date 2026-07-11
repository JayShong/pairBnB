import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export function GET() {
  try {
    getDb().prepare("SELECT 1").get();
    return Response.json({ status: "ok" });
  } catch {
    return Response.json({ status: "degraded" }, { status: 503 });
  }
}

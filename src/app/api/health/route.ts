import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Public lightweight health check endpoint for uptime monitors.
 * Exposes minimal safe information only (no internal topology, secrets, or metrics).
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}

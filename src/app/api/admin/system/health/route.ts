import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { getFullSystemHealthDashboard } from "@/lib/system-health/queries";
import type { TimeRange } from "@/lib/system-health/types";

export const dynamic = "force-dynamic";

/**
 * Admin-only system health polling endpoint.
 * Protected by requireAdmin() verification.
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const rangeParam = (searchParams.get("range") || "24h") as TimeRange;
    const validRange: TimeRange = ["1h", "6h", "24h", "7d"].includes(rangeParam)
      ? rangeParam
      : "24h";

    const data = await getFullSystemHealthDashboard(validRange);

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized or failed to retrieve system health",
      },
      {
        status: 401,
      },
    );
  }
}


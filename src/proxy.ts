import { NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/session";

/**
 * Next.js 16 proxy (renamed from `middleware`). Runs before the request is
 * completed to refresh the Supabase auth session. Public content is readable
 * without auth, so this only maintains session cookies — it never gates the
 * landing page.
 */
export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  return updateSession(request, response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and images so auth refresh
     * does not interfere with CSS, JS or image delivery.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

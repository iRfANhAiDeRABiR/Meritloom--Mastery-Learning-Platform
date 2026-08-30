import { NextResponse, type NextRequest } from "next/server";
import { getSafeNextUrl } from "@/lib/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * OAuth & Email verification callback handler.
 * Exchanges the authorization code for a Supabase session and redirects
 * to the intended safe internal application route.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const safeNext = getSafeNextUrl(next);

  if (code) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${safeNext}`);
      }
    }
  }

  // If code is missing or exchange failed, redirect to sign-in
  return NextResponse.redirect(`${origin}/auth/sign-in`);
}


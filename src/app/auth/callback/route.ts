import { NextResponse, type NextRequest } from "next/server";
import { getRequestOrigin, getSafeNextUrl } from "@/lib/auth-helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * OAuth & Email verification callback handler.
 * Exchanges the authorization code for a Supabase session, ensures profile
 * records are synchronized with OAuth metadata, and redirects to the safe destination.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = getRequestOrigin(request);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const next = requestUrl.searchParams.get("next");
  const safeNext = getSafeNextUrl(next, "/learn");

  // 1. Handle OAuth cancellation or provider-returned errors
  if (error) {
    console.warn("[auth/callback] OAuth provider error:", error, errorDescription);
    const errorCode =
      error === "access_denied" ? "oauth_cancelled" : "oauth_callback_failed";
    return NextResponse.redirect(
      new URL(`/auth/sign-in?error=${errorCode}`, origin),
    );
  }

  // 2. Exchange authorization code for session
  if (code) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { data, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError && data?.user) {
        // Ensure profile row exists with Google metadata (name, avatar) without overwriting custom data
        try {
          const user = data.user;
          const meta = user.user_metadata || {};
          const fullName = meta.full_name || meta.name || null;
          const avatarUrl = meta.avatar_url || meta.picture || null;

          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .eq("id", user.id)
            .maybeSingle();

          if (!existingProfile) {
            await supabase.from("profiles").insert({
              id: user.id,
              full_name: fullName,
              avatar_url: avatarUrl,
            });
          } else if (!existingProfile.full_name && fullName) {
            await supabase
              .from("profiles")
              .update({ full_name: fullName })
              .eq("id", user.id);
          }
        } catch (syncErr) {
          console.warn("[auth/callback] Non-critical profile sync warning:", syncErr);
        }

        return NextResponse.redirect(new URL(safeNext, origin));
      }

      if (exchangeError) {
        console.error(
          "[auth/callback] exchangeCodeForSession failed:",
          exchangeError.message,
        );
        return NextResponse.redirect(
          new URL("/auth/sign-in?error=oauth_callback_failed", origin),
        );
      }
    }
  }

  // If code is missing or service unavailable, redirect to sign-in
  return NextResponse.redirect(
    new URL("/auth/sign-in?error=oauth_callback_failed", origin),
  );
}


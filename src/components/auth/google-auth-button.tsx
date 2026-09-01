"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { formatAuthError, getSafeNextUrl } from "@/lib/auth-helpers";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { notify } from "@/lib/notifications/toast";
import { cn } from "@/lib/utils";

interface GoogleAuthButtonProps {
  nextUrl?: string;
  onError?: (msg: string) => void;
  className?: string;
}

export function GoogleAuthButton({
  nextUrl = "/learn",
  onError,
  className,
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      const supabase = createSupabaseBrowserClient();

      const safeNext = getSafeNextUrl(nextUrl, "/learn");
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        safeNext,
      )}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      });

      if (error) {
        setIsLoading(false);
        const rawMsg = error.message || "";
        const lower = rawMsg.toLowerCase();

        if (
          lower.includes("unsupported provider") ||
          lower.includes("provider is not enabled") ||
          lower.includes("provider is disabled")
        ) {
          console.warn("[GoogleAuthButton] Supabase Google OAuth provider is disabled:", rawMsg);
          const title = "Google sign-in isn't available right now";
          const description = "Please continue with email or try again later.";
          onError?.(title);
          notify.error({ title, description });
          return;
        }

        const friendly = formatAuthError(error);
        onError?.(friendly);
        notify.error({ title: friendly });
      }
    } catch (err) {
      setIsLoading(false);
      const msg = "Google sign-in could not be completed. Please try again.";
      onError?.(msg);
      notify.error({ title: msg });
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={isLoading}
      aria-busy={isLoading}
      aria-label="Continue with Google"
      className={cn(
        "group relative flex h-[50px] w-full items-center justify-center gap-3 rounded-[13px] border border-line bg-card px-4 text-sm font-semibold text-ink shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-60 cursor-pointer",
        className,
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4.5 animate-spin text-primary" aria-hidden="true" />
          <span>Connecting to Google...</span>
        </>
      ) : (
        <>
          <svg className="size-4.5 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </>
      )}
    </button>
  );
}

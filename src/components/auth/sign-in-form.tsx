"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthErrorAlert } from "@/components/auth/auth-error-alert";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { formatAuthError, getSafeNextUrl } from "@/lib/auth-helpers";
import { routes } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const safeNext = getSafeNextUrl(nextParam);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    try {
      setIsLoading(true);
      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setIsLoading(false);
        setErrorMessage(formatAuthError(error));
        return;
      }

      router.push(safeNext);
      router.refresh();
    } catch {
      setIsLoading(false);
      setErrorMessage("Unable to sign in right now. Please try again.");
    }
  };

  const signUpLink = nextParam
    ? `${routes.auth.signUp}?next=${encodeURIComponent(nextParam)}`
    : routes.auth.signUp;

  return (
    <div className="flex flex-col">
      {/* Heading & Subtitle */}
      <div className="text-left">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Sign in and continue learning.
        </p>
      </div>

      {/* Google OAuth Button */}
      <div className="mt-6">
        <GoogleAuthButton
          nextUrl={safeNext}
          onError={(msg) => setErrorMessage(msg)}
        />
      </div>

      {/* Divider */}
      <AuthDivider />

      {/* Error Alert */}
      <AuthErrorAlert message={errorMessage} className="mb-4" />

      {/* Email Sign In Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Address */}
        <div className="flex flex-col gap-1.5 text-left">
          <label
            htmlFor="signin-email"
            className="text-xs font-bold text-ink"
          >
            Email address
          </label>
          <input
            id="signin-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 w-full rounded-xl border border-line bg-card px-4 text-sm text-ink placeholder:text-muted transition-colors shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5 text-left">
          <div className="flex items-center justify-between">
            <label
              htmlFor="signin-password"
              className="text-xs font-bold text-ink"
            >
              Password
            </label>
            <Link
              href={routes.auth.forgotPassword}
              className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="signin-password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="mt-2 w-full text-base font-bold shadow-soft"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      {/* Switch to Sign Up */}
      <div className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href={signUpLink}
          className="font-bold text-primary underline-offset-4 hover:underline"
        >
          Start learning free
        </Link>
      </div>
    </div>
  );
}


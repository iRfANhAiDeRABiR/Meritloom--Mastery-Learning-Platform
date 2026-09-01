"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Mail } from "lucide-react";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthErrorAlert } from "@/components/auth/auth-error-alert";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { PasswordInput } from "@/components/auth/password-input";
import {
  formatAuthError,
  getSafeAuthErrorFromCode,
  getSafeNextUrl,
} from "@/lib/auth-helpers";
import { getUserFacingError } from "@/lib/errors/user-facing-errors";
import { notify } from "@/lib/notifications/toast";
import { routes } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const errorParam = searchParams.get("error");
  const safeNext = getSafeNextUrl(nextParam, "/learn");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isEmailFocused, setIsEmailFocused] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (errorParam) {
      const err = getSafeAuthErrorFromCode(errorParam);
      if (err) {
        setErrorMessage(err.title);
        notify.error({ title: err.title, description: err.description });
      }
    }
  }, [errorParam]);

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
        const { title, description } = getUserFacingError(error, formatAuthError(error));
        setErrorMessage(title);
        notify.error({ title, description });
        return;
      }

      notify.success({ title: "Signed in", description: "Welcome back!" });
      router.push(safeNext);
      router.refresh();
    } catch (err) {
      setIsLoading(false);
      const { title, description } = getUserFacingError(err);
      setErrorMessage(title);
      notify.error({ title, description });
    }
  };

  const signUpLink = nextParam
    ? `${routes.auth.signUp}?next=${encodeURIComponent(nextParam)}`
    : routes.auth.signUp;

  return (
    <div className="flex flex-col">
      {/* Heading & Subtitle */}
      <div className="text-left">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-[34px]">
          Welcome back
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Sign in and continue learning.
        </p>
      </div>

      {/* Google OAuth Button */}
      <div className="mt-7">
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
        {/* Email Address */}
        <div className="flex flex-col gap-1.5 text-left">
          <label
            htmlFor="signin-email"
            className="text-xs font-bold text-ink"
          >
            Email address
          </label>
          <div
            className={cn(
              "relative flex h-[50px] w-full items-center rounded-[13px] border bg-card transition-all duration-200 shadow-xs",
              isEmailFocused
                ? "border-primary ring-2 ring-primary/15"
                : "border-line hover:border-line/80",
            )}
          >
            <span
              className={cn(
                "pointer-events-none absolute left-4 flex items-center transition-colors duration-200",
                isEmailFocused ? "text-primary" : "text-muted",
              )}
              aria-hidden="true"
            >
              <Mail className="size-[18px]" />
            </span>
            <input
              id="signin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              placeholder="you@example.com"
              className="h-full w-full bg-transparent pl-11 pr-4 text-sm text-ink placeholder:text-muted focus:outline-none"
            />
          </div>
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
              className="text-xs font-semibold text-primary underline-offset-4 hover:underline transition-colors"
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
        <button
          type="submit"
          disabled={isLoading}
          className="group mt-2 flex h-[50px] w-full items-center justify-center gap-2.5 rounded-[13px] bg-gradient-to-r from-[#7357FF] via-[#7C5CFF] to-[#6847F5] px-6 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(109,74,255,0.35)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4.5 animate-spin" aria-hidden="true" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight
                className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </form>

      {/* Switch to Sign Up */}
      <div className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href={signUpLink}
          className="font-bold text-primary underline-offset-4 hover:underline transition-colors"
        >
          Start learning free
        </Link>
      </div>
    </div>
  );
}

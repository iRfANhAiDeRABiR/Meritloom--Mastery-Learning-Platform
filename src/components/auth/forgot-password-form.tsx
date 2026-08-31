"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, Mail } from "lucide-react";

import { AuthErrorAlert } from "@/components/auth/auth-error-alert";
import { Button } from "@/components/ui/button";
import { formatAuthError } from "@/lib/auth-helpers";
import { getUserFacingError } from "@/lib/errors/user-facing-errors";
import { notify } from "@/lib/notifications/toast";
import { routes } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [isEmailFocused, setIsEmailFocused] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    try {
      setIsLoading(true);
      const supabase = createSupabaseBrowserClient();

      const redirectTo = `${window.location.origin}${routes.auth.resetPassword}`;

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo,
      });

      if (error) {
        setIsLoading(false);
        const { title, description } = getUserFacingError(error, formatAuthError(error));
        setErrorMessage(title);
        notify.error({ title, description });
        return;
      }

      setIsLoading(false);
      setIsSuccess(true);
      notify.success({
        title: "Reset link sent",
        description: "Check your email for a password reset link.",
      });
    } catch (err) {
      setIsLoading(false);
      const { title, description } = getUserFacingError(err);
      setErrorMessage(title);
      notify.error({ title, description });
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-lavender text-primary">
          <Mail className="size-7" aria-hidden="true" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-ink sm:text-3xl">
          Check your email
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted max-w-sm">
          We sent a password reset link to{" "}
          <span className="font-semibold text-ink">{email}</span>. Click the
          link in the email to set a new password.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <Button asChild variant="outline" className="w-full h-[48px]">
            <Link href={routes.auth.signIn}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              <span>Back to Sign In</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="text-left">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-[34px]">
          Reset your password
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Enter your email and we&apos;ll send you a password reset link.
        </p>
      </div>

      <AuthErrorAlert message={errorMessage} className="my-4" />

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 text-left">
          <label
            htmlFor="forgot-email"
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
              id="forgot-email"
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

        <button
          type="submit"
          disabled={isLoading}
          className="group mt-2 flex h-[50px] w-full items-center justify-center gap-2.5 rounded-[13px] bg-gradient-to-r from-[#7357FF] via-[#7C5CFF] to-[#6847F5] px-6 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(109,74,255,0.35)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4.5 animate-spin" aria-hidden="true" />
              <span>Sending reset link...</span>
            </>
          ) : (
            <>
              <span>Send reset link</span>
              <ArrowRight
                className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted">
        Remember your password?{" "}
        <Link
          href={routes.auth.signIn}
          className="font-bold text-primary underline-offset-4 hover:underline transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

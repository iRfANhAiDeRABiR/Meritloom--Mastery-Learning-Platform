"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, Mail } from "lucide-react";

import { AuthErrorAlert } from "@/components/auth/auth-error-alert";
import { Button } from "@/components/ui/button";
import { formatAuthError } from "@/lib/auth-helpers";
import { routes } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
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
        setErrorMessage(formatAuthError(error));
        return;
      }

      setIsLoading(false);
      setIsSuccess(true);
    } catch {
      setIsLoading(false);
      setErrorMessage("Unable to send reset link right now. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-lavender text-primary">
          <Mail className="size-7" aria-hidden="true" />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold text-ink sm:text-3xl">
          Check your email
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted max-w-sm">
          We sent a password reset link to{" "}
          <span className="font-semibold text-ink">{email}</span>. Click the
          link in the email to set a new password.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <Button asChild variant="outline" className="w-full">
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
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Reset your password
        </h1>
        <p className="mt-1.5 text-sm text-muted">
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
          <input
            id="forgot-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 w-full rounded-xl border border-line bg-card px-4 text-sm text-ink placeholder:text-muted transition-colors shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="mt-2 w-full text-base font-bold shadow-soft"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              <span>Sending reset link...</span>
            </>
          ) : (
            <>
              <span>Send reset link</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted">
        Remember your password?{" "}
        <Link
          href={routes.auth.signIn}
          className="font-bold text-primary underline-offset-4 hover:underline"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}


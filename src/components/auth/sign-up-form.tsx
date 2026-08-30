"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Mail, RotateCcw } from "lucide-react";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthErrorAlert } from "@/components/auth/auth-error-alert";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { formatAuthError, getSafeNextUrl } from "@/lib/auth-helpers";
import { routes } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const safeNext = getSafeNextUrl(nextParam);

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Email verification confirmation state
  const [needsVerification, setNeedsVerification] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const [resendMessage, setResendMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!cleanEmail) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      setIsLoading(true);
      const supabase = createSupabaseBrowserClient();

      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        safeNext,
      )}`;

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
          },
          emailRedirectTo: callbackUrl,
        },
      });

      if (error) {
        setIsLoading(false);
        setErrorMessage(formatAuthError(error));
        return;
      }

      // Check if session was created directly or if email confirmation is pending
      if (data?.session) {
        router.push(safeNext);
        router.refresh();
      } else if (data?.user && !data.user.confirmed_at) {
        setIsLoading(false);
        setNeedsVerification(true);
        setResendCooldown(60);
      } else {
        router.push(safeNext);
        router.refresh();
      }
    } catch {
      setIsLoading(false);
      setErrorMessage("Unable to create account right now. Please try again.");
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || !email) return;
    setResendMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        safeNext,
      )}`;

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: callbackUrl,
        },
      });

      if (error) {
        setResendMessage(formatAuthError(error));
      } else {
        setResendMessage("Verification email resent. Please check your inbox.");
        setResendCooldown(60);
      }
    } catch {
      setResendMessage("Could not resend email. Please try again later.");
    }
  };

  // Verification Pending Screen
  if (needsVerification) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-lavender text-primary">
          <Mail className="size-7" aria-hidden="true" />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold text-ink sm:text-3xl">
          Check your email
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted max-w-sm">
          We sent a verification link to{" "}
          <span className="font-semibold text-ink">{email}</span>. Open it to
          finish creating your Meritloom account.
        </p>

        {resendMessage && (
          <div className="mt-4 rounded-xl border border-line bg-surface p-3 text-xs font-medium text-ink">
            {resendMessage}
          </div>
        )}

        <div className="mt-8 flex w-full flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleResendVerification}
            disabled={resendCooldown > 0}
            className="w-full gap-2"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            <span>
              {resendCooldown > 0
                ? `Resend email in ${resendCooldown}s`
                : "Resend verification email"}
            </span>
          </Button>

          <Button asChild variant="ghost" className="w-full">
            <Link
              href={`${routes.auth.signIn}?next=${encodeURIComponent(safeNext)}`}
            >
              Back to Sign In
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const signInLink = nextParam
    ? `${routes.auth.signIn}?next=${encodeURIComponent(nextParam)}`
    : routes.auth.signIn;

  return (
    <div className="flex flex-col">
      {/* Heading & Subtitle */}
      <div className="text-left">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Create a free account and start learning at your own pace.
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

      {/* Email Registration Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5 text-left">
          <label
            htmlFor="signup-name"
            className="text-xs font-bold text-ink"
          >
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your name"
            className="h-11 w-full rounded-xl border border-line bg-card px-4 text-sm text-ink placeholder:text-muted transition-colors shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1.5 text-left">
          <label
            htmlFor="signup-email"
            className="text-xs font-bold text-ink"
          >
            Email address
          </label>
          <input
            id="signup-email"
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
              htmlFor="signup-password"
              className="text-xs font-bold text-ink"
            >
              Password
            </label>
            <span className="text-[11px] text-muted">Min. 8 characters</span>
          </div>
          <PasswordInput
            id="signup-password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5 text-left">
          <label
            htmlFor="signup-confirm-password"
            className="text-xs font-bold text-ink"
          >
            Confirm password
          </label>
          <PasswordInput
            id="signup-confirm-password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
        </div>

        {/* Legal notice */}
        <p className="text-xs leading-relaxed text-muted text-left pt-1">
          By creating an account, you agree to the{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-ink font-medium"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-ink font-medium"
          >
            Privacy Policy
          </Link>
          .
        </p>

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
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create free account</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      {/* Switch to Sign In */}
      <div className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={signInLink}
          className="font-bold text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}


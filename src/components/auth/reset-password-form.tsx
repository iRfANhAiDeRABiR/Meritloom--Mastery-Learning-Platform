"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { AuthErrorAlert } from "@/components/auth/auth-error-alert";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { formatAuthError } from "@/lib/auth-helpers";
import { routes } from "@/lib/routes";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

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

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setIsLoading(false);
        setErrorMessage(formatAuthError(error));
        return;
      }

      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push(routes.courses.index);
        router.refresh();
      }, 2000);
    } catch {
      setIsLoading(false);
      setErrorMessage("Unable to update password right now. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-mint text-mint-ink">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-ink sm:text-3xl">
          Password updated!
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted max-w-sm">
          Your password has been successfully reset. Redirecting you to courses...
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <Button asChild size="lg" className="w-full h-[50px]">
            <Link href={routes.courses.index}>
              <span>Explore Courses</span>
              <ArrowRight className="size-4" aria-hidden="true" />
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
          Update your password
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Choose a new password for your Meritloom account.
        </p>
      </div>

      <AuthErrorAlert message={errorMessage} className="my-4" />

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 text-left">
          <div className="flex items-center justify-between">
            <label
              htmlFor="reset-password"
              className="text-xs font-bold text-ink"
            >
              New password
            </label>
            <span className="text-[11px] text-muted">Min. 8 characters</span>
          </div>
          <PasswordInput
            id="reset-password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <label
            htmlFor="reset-confirm-password"
            className="text-xs font-bold text-ink"
          >
            Confirm new password
          </label>
          <PasswordInput
            id="reset-confirm-password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group mt-2 flex h-[50px] w-full items-center justify-center gap-2.5 rounded-[13px] bg-gradient-to-r from-[#7357FF] via-[#7C5CFF] to-[#6847F5] px-6 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(109,74,255,0.35)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4.5 animate-spin" aria-hidden="true" />
              <span>Updating password...</span>
            </>
          ) : (
            <>
              <span>Update password</span>
              <ArrowRight
                className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

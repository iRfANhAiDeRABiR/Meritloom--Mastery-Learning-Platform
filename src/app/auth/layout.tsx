import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getCurrentUser } from "@/lib/auth";
import { routes } from "@/lib/routes";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If user is already logged in, redirect them to /courses
  const user = await getCurrentUser();
  if (user) {
    redirect(routes.courses.index);
  }

  return (
    <div className="flex min-h-dvh bg-background text-ink transition-colors">
      {/* Left visual panel (Desktop only, 46% width) */}
      <div className="hidden lg:block lg:w-[46%] xl:w-[45%] shrink-0">
        <div className="sticky top-0 h-screen w-full">
          <AuthBrandPanel />
        </div>
      </div>

      {/* Right form panel (Full width on mobile/tablet, 54% width on desktop) */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <div className="lg:hidden">
            <Link
              href={routes.home}
              aria-label="Meritloom home"
              className="shrink-0 rounded-[10px]"
            >
              <Logo />
            </Link>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {/* Centered Form Body */}
        <main
          id="auth-main"
          className="mx-auto my-auto flex w-full max-w-[430px] flex-col justify-center py-8"
        >
          {children}
        </main>

        {/* Legal Footer Links */}
        <footer className="mt-auto pt-6 text-center text-xs text-muted">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link
              href="/terms"
              className="underline-offset-4 hover:underline hover:text-ink"
            >
              Terms of Service
            </Link>
            <span className="text-line" aria-hidden="true">
              •
            </span>
            <Link
              href="/privacy"
              className="underline-offset-4 hover:underline hover:text-ink"
            >
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}


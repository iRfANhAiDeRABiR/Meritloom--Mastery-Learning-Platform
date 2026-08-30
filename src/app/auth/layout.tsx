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
    <div className="flex min-h-dvh bg-background text-ink transition-colors duration-300">
      {/* Left visual panel (Desktop only, 48% width) */}
      <div className="hidden lg:block lg:w-[48%] xl:w-[48%] shrink-0">
        <div className="sticky top-0 h-screen w-full">
          <AuthBrandPanel />
        </div>
      </div>

      {/* Right form panel (52% width on desktop, full width on mobile/tablet) */}
      <div className="relative flex flex-1 flex-col justify-between overflow-hidden p-6 sm:p-10 lg:p-12 xl:p-16">
        {/* Subtle Ambient Right-Side Background Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 85% 15%, rgba(124, 92, 255, 0.05), transparent 40%),
              radial-gradient(circle at 15% 85%, rgba(109, 74, 255, 0.03), transparent 35%)
            `,
          }}
        />

        {/* 3 Calm Faint Particles on the form side */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <span className="absolute top-[18%] right-[12%] size-1.5 rounded-full bg-primary/20 animate-particle-1" />
          <span className="absolute top-[65%] right-[25%] size-2 rounded-full bg-[#8B6CFF]/15 animate-particle-2" />
          <span className="absolute bottom-[15%] left-[10%] size-1.5 rounded-full bg-mint/20 animate-particle-3" />
        </div>

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
          className="mx-auto my-auto flex w-full max-w-[450px] flex-col justify-center py-8"
        >
          {/* Mobile Welcome Header */}
          <div className="mb-6 text-center lg:hidden">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Mastery-Based Learning
            </p>
            <p className="text-sm font-medium text-muted mt-0.5">
              Learn freely. Build real understanding.
            </p>
          </div>

          {children}
        </main>

        {/* Legal Footer Links */}
        <footer className="mt-auto pt-6 text-center text-xs text-muted">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link
              href="/terms"
              className="underline-offset-4 hover:underline hover:text-ink transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-line" aria-hidden="true">
              •
            </span>
            <Link
              href="/privacy"
              className="underline-offset-4 hover:underline hover:text-ink transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

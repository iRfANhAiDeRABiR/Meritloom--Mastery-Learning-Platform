import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface ErrorShellProps {
  children: React.ReactNode;
  className?: string;
  showNavigation?: boolean;
}

export function ErrorShell({
  children,
  className,
  showNavigation = true,
}: ErrorShellProps) {
  return (
    <div className="relative flex min-h-dvh flex-col justify-between bg-background text-ink overflow-x-hidden selection:bg-primary/20">
      {/* Background Ambient Radial Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 20%, rgba(124, 92, 255, 0.07), transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.04), transparent 45%)
          `,
        }}
      />

      {/* Top Header */}
      {showNavigation && (
        <header className="w-full border-b border-line/60 bg-surface/80 backdrop-blur-md">
          <div className="container-page flex h-16 items-center justify-between">
            <Link
              href={routes.home}
              aria-label="Meritloom home"
              className="shrink-0 rounded-[10px] transition-opacity hover:opacity-90"
            >
              <Logo />
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </header>
      )}

      {/* Centered Error Content Card */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-10">
        <div
          className={cn(
            "w-full max-w-xl rounded-3xl border border-line bg-card p-6 sm:p-10 text-center shadow-xl backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-200",
            className,
          )}
        >
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-line/60 py-4 text-center text-xs text-ink-muted">
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Meritloom. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href={routes.help} className="hover:text-ink transition-colors">
              Help Center
            </Link>
            <Link href={routes.contact} className="hover:text-ink transition-colors">
              Contact Support
            </Link>
            <Link href={routes.terms} className="hover:text-ink transition-colors">
              Terms
            </Link>
            <Link href={routes.privacy} className="hover:text-ink transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


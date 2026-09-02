import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Home } from "lucide-react";

import { ErrorIllustration } from "@/components/errors/error-illustration";
import { ErrorShell } from "@/components/errors/error-shell";
import { GoBackButton } from "@/components/errors/go-back-button";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Page Not Found | Meritloom",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <ErrorShell>
      <div className="flex flex-col items-center gap-6">
        {/* Decorative 404 Illustration */}
        <ErrorIllustration type="404" />

        {/* Header Text */}
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Page not found
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
            We couldn&apos;t find the page you&apos;re looking for. It may have moved, been removed, or the link may be incorrect.
          </p>
        </div>

        {/* Primary & Secondary Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button asChild size="lg" className="w-full sm:w-auto gap-2">
            <Link href={routes.home}>
              <Home className="size-4" aria-hidden="true" />
              <span>Go to home</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto gap-2">
            <Link href={routes.courses.index}>
              <BookOpen className="size-4 text-primary" aria-hidden="true" />
              <span>Explore courses</span>
            </Link>
          </Button>
        </div>

        {/* Go Back & Safe Reference */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <GoBackButton fallbackHref="/" label="Go back to previous page" />

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-ink-muted">
            <span>Reference:</span>
            <span className="font-bold text-ink">PAGE_NOT_FOUND</span>
          </div>
        </div>
      </div>
    </ErrorShell>
  );
}


"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LifeBuoy, RotateCcw } from "lucide-react";

import { ErrorDetailsDisclosure } from "@/components/errors/error-details-disclosure";
import { ErrorIllustration } from "@/components/errors/error-illustration";
import { ErrorShell } from "@/components/errors/error-shell";
import { GoBackButton } from "@/components/errors/go-back-button";
import { Button } from "@/components/ui/button";
import { sanitizeRuntimeError } from "@/lib/errors/sanitize";
import { routes } from "@/lib/routes";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalRouteError({
  error,
  reset,
}: ErrorBoundaryProps) {
  const pathname = usePathname();

  const details = React.useMemo(() => {
    return sanitizeRuntimeError(error, pathname);
  }, [error, pathname]);

  React.useEffect(() => {
    // Log safe error telemetry
    if (process.env.NODE_ENV !== "production") {
      console.error("[Runtime Error Boundary caught]", {
        reference: details.errorReference,
        category: details.category,
        route: pathname,
        digest: error?.digest,
      });
    }
  }, [error, details, pathname]);

  return (
    <ErrorShell>
      <div className="flex flex-col items-center gap-6">
        {/* Decorative Error Illustration */}
        <ErrorIllustration type="error" />

        {/* Header Text */}
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            {details.title}
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
            {details.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {details.retryable && (
            <Button
              onClick={() => reset()}
              size="lg"
              className="w-full sm:w-auto gap-2 shadow-soft"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              <span>Try again</span>
            </Button>
          )}

          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto gap-2">
            <Link href={routes.home}>
              <Home className="size-4" aria-hidden="true" />
              <span>Go to home</span>
            </Link>
          </Button>
        </div>

        {/* Safe Error Details & Support Link */}
        <div className="w-full flex flex-col items-center gap-4 pt-2">
          <ErrorDetailsDisclosure details={details} />

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <GoBackButton fallbackHref="/" />

            <span className="text-line" aria-hidden="true">|</span>

            <Link
              href={`${routes.contact}?ref=${encodeURIComponent(details.errorReference)}`}
              className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
            >
              <LifeBuoy className="size-3.5" aria-hidden="true" />
              <span>Contact support</span>
            </Link>
          </div>
        </div>
      </div>
    </ErrorShell>
  );
}


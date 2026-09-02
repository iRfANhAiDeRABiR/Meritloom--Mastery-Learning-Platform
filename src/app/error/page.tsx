import type { Metadata } from "next";
import Link from "next/link";
import { Home, LifeBuoy, RotateCcw, ShieldAlert } from "lucide-react";

import { ErrorDetailsDisclosure } from "@/components/errors/error-details-disclosure";
import { ErrorIllustration } from "@/components/errors/error-illustration";
import { ErrorShell } from "@/components/errors/error-shell";
import { GoBackButton } from "@/components/errors/go-back-button";
import { Button } from "@/components/ui/button";
import { getCatalogEntry } from "@/lib/errors/catalog";
import { isValidErrorReference } from "@/lib/errors/reference";
import type { SafeErrorDetails } from "@/lib/errors/types";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Error | Meritloom",
  robots: {
    index: false,
    follow: false,
  },
};

interface ErrorPageProps {
  searchParams: Promise<{
    code?: string;
    ref?: string;
  }>;
}

export default async function DedicatedErrorPage({
  searchParams,
}: ErrorPageProps) {
  const { code, ref } = await searchParams;

  const catalogEntry = getCatalogEntry(code);
  const safeRef = isValidErrorReference(ref) ? (ref as string) : "ERR-SYSTEM";

  const details: SafeErrorDetails = {
    errorReference: safeRef,
    safeCode: catalogEntry.code,
    category: catalogEntry.category,
    title: catalogEntry.title,
    description: catalogEntry.description,
    statusCode: catalogEntry.status,
    timestamp: new Date().toISOString(),
    retryable: catalogEntry.recommendedAction === "retry",
  };

  const illustrationType =
    catalogEntry.status === 404
      ? "404"
      : catalogEntry.status === 403
        ? "forbidden"
        : "error";

  return (
    <ErrorShell>
      <div className="flex flex-col items-center gap-6">
        <ErrorIllustration type={illustrationType} />

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            {catalogEntry.title}
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
            {catalogEntry.description}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {catalogEntry.recommendedAction === "sign_in" ? (
            <Button asChild size="lg" className="w-full sm:w-auto gap-2">
              <Link href={routes.auth.signIn}>
                <ShieldAlert className="size-4" aria-hidden="true" />
                <span>Sign in to continue</span>
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="w-full sm:w-auto gap-2">
              <Link href={routes.home}>
                <Home className="size-4" aria-hidden="true" />
                <span>Go to home</span>
              </Link>
            </Button>
          )}

          {catalogEntry.recommendedAction === "retry" && (
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto gap-2">
              <Link href={routes.home}>
                <RotateCcw className="size-4 text-primary" aria-hidden="true" />
                <span>Return to home</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Safe Error Details & Support Link */}
        <div className="w-full flex flex-col items-center gap-4 pt-2">
          <ErrorDetailsDisclosure details={details} />

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <GoBackButton fallbackHref="/" />

            <span className="text-line" aria-hidden="true">|</span>

            <Link
              href={`${routes.contact}?ref=${encodeURIComponent(safeRef)}`}
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


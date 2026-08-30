"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AlertCircle, BookOpen, RotateCcw, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CourseEmptyStateProps {
  type?: "no-results" | "empty-catalog" | "error";
  error?: string;
}

export function CourseEmptyState({
  type = "no-results",
  error,
}: CourseEmptyStateProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleResetFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const handleRetry = () => {
    router.refresh();
  };

  if (type === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-container border border-dashed border-rose-500/30 bg-card px-6 py-16 text-center shadow-soft">
        <span className="grid size-14 place-items-center rounded-2xl bg-rose-500/10 text-rose-500">
          <AlertCircle className="size-7" aria-hidden="true" />
        </span>
        <div className="max-w-md">
          <h3 className="text-xl font-bold text-ink">
            Unable to load courses
          </h3>
          <p className="mt-1.5 text-sm text-muted">
            {error || "We encountered a temporary issue while fetching the course catalog. Please try again."}
          </p>
        </div>
        <Button onClick={handleRetry} variant="default" className="mt-2 gap-2">
          <RotateCcw className="size-4" aria-hidden="true" />
          Try Again
        </Button>
      </div>
    );
  }

  if (type === "empty-catalog") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-container border border-dashed border-line bg-card px-6 py-16 text-center shadow-soft">
        <span className="grid size-14 place-items-center rounded-2xl bg-lavender text-primary">
          <BookOpen className="size-7" aria-hidden="true" />
        </span>
        <div className="max-w-md">
          <h3 className="text-xl font-bold text-ink">
            Free courses are coming soon
          </h3>
          <p className="mt-1.5 text-sm text-muted">
            We’re preparing structured courses to help you learn useful skills. Check back soon for new additions.
          </p>
        </div>
        <Button asChild variant="secondary" className="mt-2">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-container border border-dashed border-line bg-card px-6 py-16 text-center shadow-soft">
      <span className="grid size-14 place-items-center rounded-2xl bg-lavender text-primary">
        <SearchX className="size-7" aria-hidden="true" />
      </span>
      <div className="max-w-md">
        <h3 className="text-xl font-bold text-ink">
          No courses found
        </h3>
        <p className="mt-1.5 text-sm text-muted">
          Try another search term or remove some filters.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <Button onClick={handleResetFilters} variant="default" size="sm" className="gap-2">
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Reset All Filters
        </Button>
      </div>
    </div>
  );
}


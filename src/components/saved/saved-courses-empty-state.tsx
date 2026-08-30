import Link from "next/link";
import { Bookmark, Compass, RotateCcw, SearchX } from "lucide-react";

import { routes } from "@/lib/routes";

interface SavedCoursesEmptyStateProps {
  isSearchEmpty: boolean;
  onClearFilters?: () => void;
}

export function SavedCoursesEmptyState({
  isSearchEmpty,
  onClearFilters,
}: SavedCoursesEmptyStateProps) {
  if (isSearchEmpty) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-[24px] border border-line bg-card shadow-soft gap-4">
        <div className="grid size-14 place-items-center rounded-2xl bg-surface text-muted border border-line shadow-2xs">
          <SearchX className="size-7 text-muted" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-1 max-w-sm">
          <h3 className="text-lg font-bold text-ink">
            No matching saved courses
          </h3>
          <p className="text-xs sm:text-sm text-muted">
            Try adjusting your search terms or clearing your selected filters.
          </p>
        </div>

        {onClearFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-surface px-4 text-xs font-bold text-ink border border-line hover:border-primary/40 hover:text-primary transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            <span>Clear filters</span>
          </button>
        ) : (
          <Link
            href="/learn/saved"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-surface px-4 text-xs font-bold text-ink border border-line hover:border-primary/40 hover:text-primary transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            <span>Clear filters</span>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-16 rounded-[24px] border border-line bg-card shadow-soft gap-4">
      <div className="grid size-16 place-items-center rounded-2xl bg-lavender text-primary shadow-soft">
        <Bookmark className="size-8 text-primary" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-1 max-w-md">
        <h3 className="text-xl sm:text-2xl font-bold text-ink">
          No saved courses yet
        </h3>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          Save courses you&apos;re interested in while browsing and they&apos;ll appear here for easy access.
        </p>
      </div>

      <Link
        href={routes.courses.index}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 mt-2"
      >
        <Compass className="size-4" aria-hidden="true" />
        <span>Explore courses</span>
      </Link>
    </div>
  );
}


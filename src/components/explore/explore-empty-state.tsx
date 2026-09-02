"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Filter, Search } from "lucide-react";

interface ExploreEmptyStateProps {
  type: "no-results" | "empty-catalog";
}

export function ExploreEmptyState({ type }: ExploreEmptyStateProps) {
  const router = useRouter();

  if (type === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-container border border-dashed border-line bg-card/60 p-10 text-center sm:p-14">
        <span className="grid size-12 place-items-center rounded-2xl bg-surface text-muted border border-line">
          <Search className="size-6" aria-hidden="true" />
        </span>

        <div className="flex flex-col gap-1 max-w-sm">
          <h2 className="text-base font-bold text-ink">
            No courses found
          </h2>
          <p className="text-xs text-muted leading-relaxed">
            Try changing your search or filters to discover other available courses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/learn/explore")}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover cursor-pointer"
        >
          <Filter className="size-3.5" aria-hidden="true" />
          <span>Clear filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-container border border-dashed border-line bg-card/60 p-10 text-center sm:p-14">
      <span className="grid size-12 place-items-center rounded-2xl bg-surface text-primary border border-line">
        <BookOpen className="size-6" aria-hidden="true" />
      </span>

      <div className="flex flex-col gap-1 max-w-sm">
        <h2 className="text-base font-bold text-ink">
          Courses are being prepared
        </h2>
        <p className="text-xs text-muted leading-relaxed">
          Check back later for available courses.
        </p>
      </div>
    </div>
  );
}


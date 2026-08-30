"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  Compass,
  Filter,
  Search,
} from "lucide-react";

import { routes } from "@/lib/routes";
import type { LearnerTabStatus } from "@/lib/types";

interface MyLearningEmptyStateProps {
  status: LearnerTabStatus;
  isSearchEmpty?: boolean;
}

export function MyLearningEmptyState({
  status,
  isSearchEmpty = false,
}: MyLearningEmptyStateProps) {
  const router = useRouter();

  if (isSearchEmpty) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-container border border-dashed border-line bg-card/60 p-10 text-center sm:p-14">
        <span className="grid size-12 place-items-center rounded-2xl bg-surface text-muted border border-line">
          <Search className="size-6" aria-hidden="true" />
        </span>

        <div className="flex flex-col gap-1 max-w-sm">
          <h2 className="text-base font-bold text-ink">
            No matching courses
          </h2>
          <p className="text-xs text-muted leading-relaxed">
            Try a different search or clear your filters to view all courses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push(`/learn/courses?status=${status}`)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover cursor-pointer"
        >
          <Filter className="size-3.5" aria-hidden="true" />
          <span>Clear filters</span>
        </button>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-container border border-dashed border-line bg-card/60 p-10 text-center sm:p-14">
        <span className="grid size-12 place-items-center rounded-2xl bg-mint text-mint-ink border border-mint-ink/20">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </span>

        <div className="flex flex-col gap-1 max-w-sm">
          <h2 className="text-base font-bold text-ink">
            No completed courses yet
          </h2>
          <p className="text-xs text-muted leading-relaxed">
            As you finish lessons and complete courses, they will be tracked here for review.
          </p>
        </div>

        <Link
          href={routes.courses.index}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover"
        >
          <Compass className="size-4" aria-hidden="true" />
          <span>Explore courses</span>
        </Link>
      </div>
    );
  }

  if (status === "saved") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-container border border-dashed border-line bg-card/60 p-10 text-center sm:p-14">
        <span className="grid size-12 place-items-center rounded-2xl bg-surface text-primary border border-line">
          <Bookmark className="size-6" aria-hidden="true" />
        </span>

        <div className="flex flex-col gap-1 max-w-sm">
          <h2 className="text-base font-bold text-ink">
            Nothing saved yet
          </h2>
          <p className="text-xs text-muted leading-relaxed">
            Save interesting free courses from the catalog and come back to start them anytime.
          </p>
        </div>

        <Link
          href={routes.courses.index}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover"
        >
          <Compass className="size-4" aria-hidden="true" />
          <span>Explore courses</span>
        </Link>
      </div>
    );
  }

  // Active Empty State (Default)
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-container border border-dashed border-line bg-card/60 p-10 text-center sm:p-14">
      <span className="grid size-12 place-items-center rounded-2xl bg-surface text-primary border border-line">
        <BookOpen className="size-6" aria-hidden="true" />
      </span>

      <div className="flex flex-col gap-1 max-w-sm">
        <h2 className="text-base font-bold text-ink">
          No active courses yet
        </h2>
        <p className="text-xs text-muted leading-relaxed">
          Start a free course and it will appear here so you can continue right where you left off.
        </p>
      </div>

      <Link
        href={routes.courses.index}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover"
      >
        <Compass className="size-4" aria-hidden="true" />
        <span>Explore courses</span>
      </Link>
    </div>
  );
}


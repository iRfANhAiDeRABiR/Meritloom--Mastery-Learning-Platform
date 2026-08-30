import Link from "next/link";
import { Compass } from "lucide-react";

import { routes } from "@/lib/routes";

export function SavedCoursesHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-ink">
          Saved courses
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Courses you&apos;ve bookmarked to explore or learn later.
        </p>
      </div>

      <Link
        href={routes.courses.index}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 self-start sm:self-auto shrink-0"
      >
        <Compass className="size-4" aria-hidden="true" />
        <span>Explore courses</span>
      </Link>
    </header>
  );
}


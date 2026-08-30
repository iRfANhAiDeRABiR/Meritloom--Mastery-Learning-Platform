import Link from "next/link";
import { Compass } from "lucide-react";

import { routes } from "@/lib/routes";

export function MyLearningHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[32px]">
          My learning
        </h1>
        <p className="text-sm text-muted">
          Keep track of the courses you&apos;ve started, completed, or saved for later.
        </p>
      </div>

      <div className="shrink-0">
        <Link
          href={routes.courses.index}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover"
        >
          <Compass className="size-4" aria-hidden="true" />
          <span>Explore courses</span>
        </Link>
      </div>
    </div>
  );
}


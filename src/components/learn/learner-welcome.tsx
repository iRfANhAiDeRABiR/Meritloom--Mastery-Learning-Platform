import Link from "next/link";
import { BookOpen, Compass } from "lucide-react";

import { routes } from "@/lib/routes";

interface LearnerWelcomeProps {
  name: string;
  activeCourseCount?: number;
}

function formatDisplayName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "Learner";

  const firstWord = trimmed.split(/\s+/)[0];
  // If user entered all-uppercase (e.g. "IRFAN"), normalize to "Irfan"
  if (firstWord === firstWord.toUpperCase() && firstWord.length > 1) {
    return firstWord.charAt(0) + firstWord.slice(1).toLowerCase();
  }
  return firstWord;
}

export function LearnerWelcome({ name, activeCourseCount }: LearnerWelcomeProps) {
  const firstName = formatDisplayName(name);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line/60 pb-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[32px]">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-muted">
          Pick up where you left off and keep making progress.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {typeof activeCourseCount === "number" && activeCourseCount > 0 && (
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/70 px-3 py-1 text-xs font-semibold text-muted">
            <BookOpen className="size-3.5 text-primary" aria-hidden="true" />
            <span>
              {activeCourseCount} {activeCourseCount === 1 ? "course" : "courses"} in progress
            </span>
          </span>
        )}

        <Link
          href={routes.learnExplore}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-2 text-xs font-bold text-ink shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface hover:text-primary"
        >
          <Compass className="size-4 text-primary" aria-hidden="true" />
          <span>Explore courses</span>
        </Link>
      </div>
    </div>
  );
}

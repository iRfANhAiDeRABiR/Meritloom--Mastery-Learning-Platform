import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { CourseCard } from "@/components/courses/course-card";
import { routes } from "@/lib/routes";
import type { CourseSummary } from "@/lib/types";

interface SavedRecommendationsProps {
  recommendations: CourseSummary[];
}

export function SavedRecommendations({
  recommendations,
}: SavedRecommendationsProps) {
  if (recommendations.length === 0) return null;

  return (
    <section
      aria-label="Recommended courses"
      className="flex flex-col gap-5 pt-8 border-t border-line"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="grid size-5 place-items-center rounded-md bg-lavender text-primary">
              <Sparkles className="size-3" aria-hidden="true" />
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
              Suggested For You
            </span>
          </div>
          <h3 className="text-xl font-bold text-ink">
            Looking for something new?
          </h3>
          <p className="text-xs sm:text-sm text-muted">
            Explore more free courses and save anything you&apos;d like to revisit.
          </p>
        </div>

        <Link
          href={routes.courses.index}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors self-start sm:self-auto"
        >
          <span>View all courses</span>
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}

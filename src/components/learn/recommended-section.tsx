import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { CourseCard } from "@/components/courses/course-card";
import { routes } from "@/lib/routes";
import type { CourseSummary } from "@/lib/types";

interface RecommendedSectionProps {
  courses: CourseSummary[];
  hasInterests?: boolean;
}

export function RecommendedSection({
  courses,
  hasInterests = true,
}: RecommendedSectionProps) {
  if (courses.length === 0) return null;

  return (
    <section aria-labelledby="recommended-heading" className="flex flex-col gap-5 pt-2">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-5 place-items-center rounded-full bg-lavender text-primary">
              <Sparkles className="size-3" aria-hidden="true" />
            </span>
            <h2
              id="recommended-heading"
              className="text-xl font-bold tracking-tight text-ink sm:text-2xl"
            >
              Recommended for you
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted">
            {hasInterests
              ? "Based on your interests and learning preferences."
              : "Courses you might like to explore."}
          </p>
        </div>

        <Link
          href={routes.learnExplore}
          className="group mt-2 flex items-center gap-1.5 text-xs font-bold text-primary hover:underline sm:mt-0"
        >
          <span>Explore all courses</span>
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((course, idx) => (
          <CourseCard key={course.id} course={course} priority={idx < 2} />
        ))}
      </div>
    </section>
  );
}


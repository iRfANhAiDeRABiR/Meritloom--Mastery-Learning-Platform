import Link from "next/link";
import { ArrowRight, BookOpen, Compass } from "lucide-react";

import { ActiveCourseCard } from "@/components/learn/active-course-card";
import { routes } from "@/lib/routes";
import type { ActiveEnrollmentDetail } from "@/lib/types";

interface MyLearningSectionProps {
  courses: ActiveEnrollmentDetail[];
}

export function MyLearningSection({ courses }: MyLearningSectionProps) {
  if (courses.length === 0) {
    return (
      <section aria-labelledby="my-learning-heading" className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2
            id="my-learning-heading"
            className="text-xl font-bold tracking-tight text-ink sm:text-2xl"
          >
            My learning
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 rounded-container border border-dashed border-line bg-card/60 p-8 text-center sm:p-12">
          <span className="grid size-12 place-items-center rounded-2xl bg-surface text-primary border border-line">
            <BookOpen className="size-6" aria-hidden="true" />
          </span>

          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className="text-base font-bold text-ink">
              No courses started yet
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Find a free course and start learning whenever you&apos;re ready.
              Your progress will appear here automatically.
            </p>
          </div>

          <Link
            href={routes.learnExplore}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover"
          >
            <Compass className="size-4" aria-hidden="true" />
            <span>Browse courses</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="my-learning-heading" className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2
          id="my-learning-heading"
          className="text-xl font-bold tracking-tight text-ink sm:text-2xl"
        >
          My learning
        </h2>

        <Link
          href={routes.learnCourses}
          className="group flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <span>View all</span>
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.slice(0, 3).map((enrollment) => (
          <ActiveCourseCard key={enrollment.id} enrollment={enrollment} />
        ))}
      </div>
    </section>
  );
}


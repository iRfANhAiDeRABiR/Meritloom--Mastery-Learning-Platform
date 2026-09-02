import Link from "next/link";
import { ArrowRight, BookOpen, Compass, ExternalLink, Sparkles } from "lucide-react";

import { routes } from "@/lib/routes";
import type { ActiveEnrollmentDetail } from "@/lib/types";

interface ContinueLearningHeroProps {
  course: ActiveEnrollmentDetail | null;
}

export function ContinueLearningHero({ course }: ContinueLearningHeroProps) {
  if (!course) {
    return (
      <div
        className="relative overflow-hidden rounded-container p-6 sm:p-8 text-white shadow-lift"
        style={{
          background:
            "linear-gradient(135deg, #6847F5 0%, #7655FF 50%, #6543ED 100%)",
        }}
      >
        {/* Ambient decorative lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl animate-ambient-glow"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-mint/15 blur-2xl animate-ambient-glow"
          style={{ animationDelay: "3s" }}
        />

        <div className="relative z-10 flex max-w-2xl flex-col items-start gap-3.5">
          <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-mint">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Ready to start
          </span>

          <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold tracking-tight text-white leading-tight">
            Start learning something new
          </h2>

          <p className="text-sm leading-relaxed text-white/90 max-w-xl">
            Explore Meritloom&apos;s free structured courses and build real mastery step by step. Zero paywalls, zero ads.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={routes.learnExplore}
              className="group inline-flex h-10 items-center gap-2 rounded-xl bg-white px-5 text-xs sm:text-sm font-bold text-[#172033] shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/95 cursor-pointer"
            >
              <span>Explore free courses</span>
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>

            <Link
              href={routes.courses.index}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 text-xs sm:text-sm font-bold text-white transition-all duration-200 hover:bg-white/20 hover:border-white/40 cursor-pointer"
            >
              <Compass className="size-4" aria-hidden="true" />
              <span>Browse catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const lessonHref = course.nextLessonSlug
    ? `/learn/courses/${course.courseSlug}/lessons/${course.nextLessonSlug}`
    : `/learn/courses/${course.courseSlug}`;
  const courseOverviewHref = `/learn/courses/${course.courseSlug}`;

  return (
    <div
      className="relative overflow-hidden rounded-container p-6 sm:p-8 text-white shadow-lift flex flex-col justify-between"
      style={{
        background:
          "linear-gradient(135deg, #6847F5 0%, #7655FF 50%, #6543ED 100%)",
      }}
    >
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-2xl animate-ambient-glow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-mint/15 blur-2xl animate-ambient-glow"
        style={{ animationDelay: "4s" }}
      />

      {/* Faint Book Icon on desktop only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 text-white/10 xl:block"
      >
        <BookOpen className="size-40 stroke-[1]" />
      </div>

      <div className="relative z-10 flex max-w-2xl flex-col items-start gap-3">
        {/* Category & Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-md bg-mint/20 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-mint border border-mint/30">
            <span className="size-1.5 rounded-full bg-mint shadow-[0_0_6px_#67e8d2]" />
            Continue Learning
          </span>

          {course.categoryName && (
            <span className="rounded-md bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white/90">
              {course.categoryName}
            </span>
          )}
        </div>

        {/* Course Title */}
        <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold tracking-tight text-white leading-tight">
          {course.courseTitle}
        </h2>

        {/* Module & Next Lesson Info */}
        <div className="flex flex-col gap-0.5 text-xs sm:text-sm text-white/90">
          {course.currentModuleName && (
            <span className="text-white/75 font-medium text-xs">
              {course.currentModuleName}
            </span>
          )}
          {course.nextLessonTitle ? (
            <p className="font-medium">
              Next: <span className="font-bold text-white">{course.nextLessonTitle}</span>
            </p>
          ) : (
            <p className="font-medium">Continue where you left off</p>
          )}
        </div>

        {/* Real Progress Bar & Count */}
        {course.totalLessons > 0 && (
          <div className="flex w-full max-w-lg flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-semibold text-white/80">
              <span>
                {course.completedLessons} of {course.totalLessons} lessons completed
              </span>
              <span>{course.progressPercent}%</span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-white/20"
              role="progressbar"
              aria-valuenow={course.progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Course completion progress"
            >
              <div
                className="h-full rounded-full bg-mint transition-all duration-500 shadow-[0_0_8px_#67e8d2]"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={lessonHref}
            className="group inline-flex h-10 items-center gap-2 rounded-xl bg-white px-5 text-xs sm:text-sm font-bold text-[#172033] shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/95 cursor-pointer"
          >
            <span>Continue lesson</span>
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>

          <Link
            href={courseOverviewHref}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 text-xs sm:text-sm font-bold text-white transition-all duration-200 hover:bg-white/20 hover:border-white/40 cursor-pointer"
          >
            <span>View course</span>
            <ExternalLink className="size-3.5 opacity-80" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

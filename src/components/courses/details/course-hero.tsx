import * as React from "react";
import { BookOpen, Clock, Globe, Layers, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CourseBreadcrumb } from "@/components/courses/details/course-breadcrumb";
import { CourseCover } from "@/components/courses/course-cover";
import type { CourseDetail } from "@/lib/types";
import { formatDifficulty, formatDuration } from "@/lib/utils";

interface CourseHeroProps {
  course: CourseDetail;
}

export function CourseHero({ course }: CourseHeroProps) {
  const categoryName = course.category?.name ?? "Course";
  const badgeLabel = `${categoryName} · ${formatDifficulty(course.difficulty)}`;

  return (
    <section
      aria-labelledby="course-title"
      className="relative overflow-hidden bg-[#0B1020] pb-12 pt-6 text-white sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10"
    >
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/4 h-[440px] w-[600px] rounded-full bg-primary/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-10 h-[360px] w-[500px] rounded-full bg-mint/10 blur-[100px]"
      />

      <div className="container-page relative flex flex-col gap-6">
        {/* Breadcrumb Navigation */}
        <CourseBreadcrumb
          courseTitle={course.title}
          category={course.category}
          variant="dark"
        />

        {/* Hero Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] lg:gap-12 lg:items-center">
          {/* Main Info */}
          <div className="flex flex-col items-start gap-5">
            {/* Category + Difficulty Badge */}
            <Badge
              variant="default"
              className="gap-1.5 border border-primary/30 bg-primary/20 px-3.5 py-1 text-xs font-bold text-white shadow-soft"
            >
              <Sparkles className="size-3.5 text-mint" aria-hidden="true" />
              {badgeLabel}
            </Badge>

            {/* Course Title */}
            <h1
              id="course-title"
              className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
            >
              {course.title}
            </h1>

            {/* Course Summary */}
            {course.summary && (
              <p className="lead-text max-w-2xl text-white/80 sm:text-lg">
                {course.summary}
              </p>
            )}

            {/* Course Metadata Bar */}
            <ul
              aria-label="Course details metadata"
              className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs font-medium text-white/70 sm:text-sm"
            >
              <li className="flex items-center gap-1.5">
                <span className="font-semibold text-white">
                  {formatDifficulty(course.difficulty)}
                </span>
              </li>

              {course.moduleCount > 0 && (
                <li className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-white/40" aria-hidden="true" />
                  <Layers className="size-4 text-primary" aria-hidden="true" />
                  <span>
                    {course.moduleCount} {course.moduleCount === 1 ? "module" : "modules"}
                  </span>
                </li>
              )}

              {course.lessonCount > 0 && (
                <li className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-white/40" aria-hidden="true" />
                  <BookOpen className="size-4 text-primary" aria-hidden="true" />
                  <span>
                    {course.lessonCount} {course.lessonCount === 1 ? "lesson" : "lessons"}
                  </span>
                </li>
              )}

              {course.estimatedMinutes > 0 && (
                <li className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-white/40" aria-hidden="true" />
                  <Clock className="size-4 text-primary" aria-hidden="true" />
                  <span>{formatDuration(course.estimatedMinutes)}</span>
                </li>
              )}

              {course.language && (
                <li className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-white/40" aria-hidden="true" />
                  <Globe className="size-4 text-primary" aria-hidden="true" />
                  <span>{course.language}</span>
                </li>
              )}
            </ul>

            {/* Instructor Block (Rendered only when real instructor data exists) */}
            {course.instructor && (
              <div className="flex items-center gap-3.5 pt-2 border-t border-white/10 w-full">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-white/20 bg-primary text-sm font-bold text-white flex items-center justify-center">
                  {course.instructor.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.instructor.avatarUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <span>{course.instructor.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white/60">Created by</span>
                  <span className="text-sm font-bold text-white">
                    {course.instructor.name}
                  </span>
                  {course.instructor.title && (
                    <span className="text-xs text-white/70">
                      {course.instructor.title}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Visual Cover Preview */}
          <div className="hidden lg:block">
            <div className="overflow-hidden rounded-container border border-white/15 shadow-lift">
              <CourseCover
                src={course.thumbnailUrl}
                title={course.title}
                categorySlug={course.category?.slug}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


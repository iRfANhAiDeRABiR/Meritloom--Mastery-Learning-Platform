import * as React from "react";
import { CourseCard } from "@/components/courses/course-card";
import type { CourseSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RelatedCoursesProps {
  courses: CourseSummary[];
  className?: string;
}

export function RelatedCourses({ courses, className }: RelatedCoursesProps) {
  if (!courses || courses.length === 0) return null;

  return (
    <section
      aria-labelledby="related-courses-heading"
      className={cn("flex flex-col gap-6 pt-12 border-t border-line", className)}
    >
      <div>
        <h2
          id="related-courses-heading"
          className="text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          Continue exploring
        </h2>
        <p className="lead-text mt-1 text-sm text-muted">
          Find another free course to build your skills.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}


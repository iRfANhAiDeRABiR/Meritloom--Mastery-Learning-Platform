import * as React from "react";
import { CourseCard } from "@/components/courses/course-card";
import type { CourseSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CourseGridProps {
  courses: CourseSummary[];
  className?: string;
}

export function CourseGrid({ courses, className }: CourseGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8",
        className,
      )}
    >
      {courses.map((course, index) => (
        <CourseCard
          key={course.id}
          course={course}
          priority={index < 6}
        />
      ))}
    </div>
  );
}


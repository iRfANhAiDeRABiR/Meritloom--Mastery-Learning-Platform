import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CourseCard } from "@/components/landing/course-card";
import { EmptyState } from "@/components/landing/empty-state";
import { SectionHeading } from "@/components/landing/section-heading";
import { featuredCoursesContent } from "@/lib/content/landing";
import { routes } from "@/lib/routes";
import type { CourseSummary } from "@/lib/types";

/**
 * Featured free courses section.
 * Renders 3 published free courses on desktop with real Supabase data.
 */
export function FeaturedCourses({ courses }: { courses: CourseSummary[] }) {
  // Show up to 3 courses on desktop as specified
  const displayCourses = courses.slice(0, 3);

  return (
    <section
      id="courses"
      aria-labelledby="courses-heading"
      className="section-py bg-surface transition-colors"
    >
      <div className="container-page">
        <SectionHeading
          id="courses-heading"
          eyebrow="Free Catalog"
          title={featuredCoursesContent.heading}
          description={featuredCoursesContent.support}
          align="left"
          action={
            <Link
              href={routes.courses.index}
              className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-bold text-primary transition-colors hover:text-primary-hover"
            >
              {featuredCoursesContent.viewAll}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        {displayCourses.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {displayCourses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              title="New courses are on the way"
              description="We are publishing fresh free courses all the time. Check back soon to explore our latest additions."
            />
          </div>
        )}
      </div>
    </section>
  );
}

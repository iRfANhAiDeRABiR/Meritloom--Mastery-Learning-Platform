import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ExploreCourseCard } from "@/components/explore/explore-course-card";
import { ExploreCoursesFilters } from "@/components/explore/explore-courses-filters";
import { ExploreCoursesHeader } from "@/components/explore/explore-courses-header";
import { ExploreEmptyState } from "@/components/explore/explore-empty-state";
import { LearnerLayout } from "@/components/learn/learner-layout";
import { getCurrentUser } from "@/lib/auth";
import { getLearnerExploreData } from "@/lib/queries/explore";
import { routes } from "@/lib/routes";
import type { ExploreCourseItem, LearnerExploreSearchParams } from "@/lib/types";

export const metadata: Metadata = {
  title: "Explore Courses | Meritloom",
  description: "Discover free courses and continue building your skills on Meritloom.",
  robots: {
    index: false,
    follow: false,
  },
};

interface ExploreCoursesPageProps {
  searchParams: Promise<LearnerExploreSearchParams>;
}

/**
 * Meritloom Learner Course Explorer.
 * Route: /learn/explore
 *
 * Authenticated learner catalog that keeps the learner inside the LearnerLayout
 * dashboard shell with full enrollment, progress, and saved-course integration.
 */
export default async function ExploreCoursesPage({
  searchParams,
}: ExploreCoursesPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`${routes.auth.signIn}?next=${encodeURIComponent(routes.learnExplore)}`);
  }

  const resolvedParams = await searchParams;
  const data = await getLearnerExploreData(user.id, resolvedParams);

  const hasActiveFilters = Boolean(
    resolvedParams.q ||
      (resolvedParams.level && resolvedParams.level !== "all") ||
      (resolvedParams.category && resolvedParams.category !== "all") ||
      (resolvedParams.status && resolvedParams.status !== "all"),
  );

  return (
    <LearnerLayout user={user}>
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <ExploreCoursesHeader />

        {/* Search & Filters */}
        <ExploreCoursesFilters categories={data.categories} />

        {/* Course Grid or Empty State */}
        {data.courses.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {data.courses.map((course: ExploreCourseItem) => (
              <ExploreCourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : hasActiveFilters ? (
          <ExploreEmptyState type="no-results" />
        ) : (
          <ExploreEmptyState type="empty-catalog" />
        )}
      </div>
    </LearnerLayout>
  );
}

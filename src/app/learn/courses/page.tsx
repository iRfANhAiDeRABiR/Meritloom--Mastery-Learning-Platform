import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LearnerLayout } from "@/components/learn/learner-layout";
import { CourseStatusTabs } from "@/components/my-learning/course-status-tabs";
import { LearnerCourseCard } from "@/components/my-learning/learner-course-card";
import { MyLearningEmptyState } from "@/components/my-learning/my-learning-empty-state";
import { MyLearningFilters } from "@/components/my-learning/my-learning-filters";
import { MyLearningHeader } from "@/components/my-learning/my-learning-header";
import { getCurrentUser } from "@/lib/auth";
import { getMyLearningCoursesData } from "@/lib/queries/learner";
import { routes } from "@/lib/routes";
import type { LearnerCourseItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "My Learning | Meritloom",
  description: "Track your active, completed, and saved courses on Meritloom.",
  robots: {
    index: false,
    follow: false,
  },
};

interface MyLearningPageProps {
  searchParams: Promise<{
    status?: string;
    q?: string;
    level?: string;
    category?: string;
  }>;
}

/**
 * Meritloom My Learning / My Courses — Page 7.
 * Route: /learn/courses
 *
 * Implements Figma Frame 4:123 — 08 My Courses:
 * - In Progress, Completed, and Saved tabs with real counts
 * - Live search & level/category filters
 * - 2-column horizontal cards with cover, real progress, and contextual actions
 * - Empty states for each tab
 *
 * Protected route: requires authenticated session.
 */
export default async function MyLearningCoursesPage({
  searchParams,
}: MyLearningPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`${routes.auth.signIn}?next=/learn/courses`);
  }

  const resolvedParams = await searchParams;
  const data = await getMyLearningCoursesData(user.id, resolvedParams);

  const hasSearchOrFilters = Boolean(
    resolvedParams.q ||
      (resolvedParams.level && resolvedParams.level !== "all") ||
      (resolvedParams.category && resolvedParams.category !== "all"),
  );

  return (
    <LearnerLayout user={user}>
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Header & Explore CTA */}
        <MyLearningHeader />

        {/* Status Tabs (In progress, Completed, Saved) */}
        <CourseStatusTabs currentTab={data.status} counts={data.counts} />

        {/* Search & Filters */}
        <MyLearningFilters categories={data.categories} />

        {/* Course Grid or Empty State */}
        {data.courses.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {data.courses.map((course: LearnerCourseItem) => (
              <LearnerCourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <MyLearningEmptyState
            status={data.status}
            isSearchEmpty={hasSearchOrFilters}
          />
        )}
      </div>
    </LearnerLayout>
  );
}


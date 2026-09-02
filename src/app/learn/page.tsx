import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ContinueLearningHero } from "@/components/learn/continue-learning-hero";
import { DashboardNotesCard } from "@/components/learn/dashboard-notes-card";
import { DashboardSavedCard } from "@/components/learn/dashboard-saved-card";
import { LearnerPathCard } from "@/components/learn/learner-path-card";
import { LearnerWelcome } from "@/components/learn/learner-welcome";
import { MyLearningSection } from "@/components/learn/my-learning-section";
import { RecentActivityCard } from "@/components/learn/recent-activity-card";
import { RecommendedSection } from "@/components/learn/recommended-section";
import { WeeklyLearningSummary } from "@/components/learn/weekly-learning-summary";
import { getCurrentUser } from "@/lib/auth";
import { getLearnerDashboardData } from "@/lib/queries/learner";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Learning Dashboard | Meritloom",
  description: "Your personalized learning workspace on Meritloom.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

/**
 * Meritloom Modern Learner Home / Dashboard.
 * Route: /learn
 *
 * Rich, structured, non-gamified learner home:
 * 1. Personalized welcome with active course count & Explore CTA
 * 2. Continue Learning primary hero + This Week compact summary
 * 3. My Learning active courses grid (up to 3 courses with accurate progress)
 * 4. Learning Path roadmap + Recent Activity (latest meaningful events)
 * 5. Saved for Later + Recent Study Notes (when available)
 * 6. Recommended courses discovery section (when applicable)
 */
export default async function LearnerHomePage() {
  // 1. SSR Route Protection
  const user = await getCurrentUser();
  if (!user) {
    redirect(`${routes.auth.signIn}?next=/learn`);
  }

  // 2. Query Unified Dashboard Data Layer
  const data = await getLearnerDashboardData(user.id);

  // 3. Onboarding Guard
  if (!data.onboardingCompleted) {
    redirect(routes.onboarding);
  }

  const hasSavedOrNotes = data.savedCourses.length > 0 || data.recentNotes.length > 0;

  return (
    <div className="flex flex-col gap-8 sm:gap-10 pb-12">
      {/* 1. Welcome Header */}
      <LearnerWelcome
        name={data.user.name}
        activeCourseCount={data.totalActiveCoursesCount}
      />

      {/* 2. Primary Focus: Continue Learning + This Week Compact Card */}
      <section aria-label="Current Learning Focus" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px] items-stretch">
        <ContinueLearningHero course={data.continueCourse} />
        <WeeklyLearningSummary metrics={data.weeklyMetrics} />
      </section>

      {/* 3. My Learning Section (Up to 3 Active Courses) */}
      <MyLearningSection courses={data.activeCourses} />

      {/* 4. Two-Column Row: Your Learning Path + Recent Activity */}
      <section aria-label="Path and Activity" className="grid gap-6 lg:grid-cols-2 items-stretch">
        <LearnerPathCard path={data.learningPath} />
        <RecentActivityCard activity={data.recentActivity} />
      </section>

      {/* 5. Two-Column Row: Saved for Later + Recent Notes (Conditional) */}
      {hasSavedOrNotes && (
        <section aria-label="Saved and Notes" className="grid gap-6 lg:grid-cols-2 items-stretch">
          {data.savedCourses.length > 0 && (
            <DashboardSavedCard savedCourses={data.savedCourses} />
          )}
          {data.recentNotes.length > 0 && (
            <DashboardNotesCard recentNotes={data.recentNotes} />
          )}
        </section>
      )}

      {/* 6. Recommended Courses Discovery (shown when learner has fewer than 2 active courses) */}
      {data.totalActiveCoursesCount < 2 && data.recommendedCourses.length > 0 && (
        <RecommendedSection
          courses={data.recommendedCourses}
          hasInterests={data.onboardingCompleted}
        />
      )}
    </div>
  );
}

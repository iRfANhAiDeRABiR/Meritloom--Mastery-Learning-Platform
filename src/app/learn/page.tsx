import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ContinueLearningHero } from "@/components/learn/continue-learning-hero";
import { LearnerLayout } from "@/components/learn/learner-layout";
import { LearnerWelcome } from "@/components/learn/learner-welcome";
import { MyLearningSection } from "@/components/learn/my-learning-section";
import { RecommendedSection } from "@/components/learn/recommended-section";
import { getCurrentUser } from "@/lib/auth";
import { getLearnerDashboardData } from "@/lib/queries/learner";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "My Learning | Meritloom",
  description: "Your personalized learning space on Meritloom.",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Meritloom Learner Home / Dashboard — Page 6.
 * Route: /learn
 *
 * Implements Figma Frame 4:63 as a focused, non-gamified learner home:
 * 1. Personalized welcome & quick actions
 * 2. Continue Learning hero (most recent course + next lesson)
 * 3. My Learning active courses grid with real progress
 * 4. Recommended for you (based on onboarding interests/level)
 *
 * Protected route: requires authenticated session + completed/skipped onboarding.
 */
export default async function LearnerHomePage() {
  // 1. SSR Route Protection
  const user = await getCurrentUser();
  if (!user) {
    redirect(`${routes.auth.signIn}?next=/learn`);
  }

  // 2. Query Dashboard Data
  const dashboardData = await getLearnerDashboardData(user.id);

  // 3. Onboarding Guard: if learner has never completed or skipped onboarding, send to onboarding
  if (!dashboardData.onboardingCompleted) {
    redirect(routes.onboarding);
  }

  return (
    <LearnerLayout user={dashboardData.user}>
      <div className="flex flex-col gap-8 sm:gap-10">
        {/* Welcome Section */}
        <LearnerWelcome name={dashboardData.user.name} />

        {/* Continue Learning Hero */}
        <ContinueLearningHero course={dashboardData.continueCourse} />

        {/* My Learning Section */}
        <MyLearningSection courses={dashboardData.activeCourses} />

        {/* Recommended for You */}
        <RecommendedSection
          courses={dashboardData.recommendedCourses}
          hasInterests={dashboardData.onboardingCompleted}
        />
      </div>
    </LearnerLayout>
  );
}


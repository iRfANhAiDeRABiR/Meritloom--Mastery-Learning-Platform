import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ContinueLearningCard } from "@/components/course-learning/continue-learning-card";
import { CourseLearningHeader } from "@/components/course-learning/course-learning-header";
import { CourseOverviewCard } from "@/components/course-learning/course-overview-card";
import { CourseTimeline } from "@/components/course-learning/course-timeline";
import { getCurrentUser } from "@/lib/auth";
import { getCourseLearningOverviewData } from "@/lib/queries/learner";
import { routes } from "@/lib/routes";

interface CourseLearningPageProps {
  params: Promise<{
    courseSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CourseLearningPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const user = await getCurrentUser();

  if (!user) {
    return {
      title: "Course Overview | Meritloom",
      robots: { index: false, follow: false },
    };
  }

  const data = await getCourseLearningOverviewData(
    user.id,
    resolvedParams.courseSlug,
  );

  if (!data) {
    return {
      title: "Course Not Found | Meritloom",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${data.course.title} | My Learning | Meritloom`,
    description: data.course.summary,
    robots: {
      index: false,
      follow: false,
    },
  };
}

/**
 * Meritloom Course Learning Overview — Page 8.
 * Route: /learn/courses/[courseSlug]
 *
 * Implements Figma Frame 4:202 — 09 Course Roadmap:
 * - Authenticated workspace for an enrolled course
 * - Vertical module timeline with numbered & completed node indicators
 * - Expandable module accordions with published lessons & type icons
 * - Right-side Continue Learning action & Course Overview summary
 * - Self-enrollment support for free courses
 *
 * Protected route: requires authenticated session.
 */
export default async function CourseLearningOverviewPage({
  params,
}: CourseLearningPageProps) {
  const user = await getCurrentUser();
  const resolvedParams = await params;

  if (!user) {
    redirect(
      `${routes.auth.signIn}?next=/learn/courses/${resolvedParams.courseSlug}`,
    );
  }

  const data = await getCourseLearningOverviewData(
    user.id,
    resolvedParams.courseSlug,
  );

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Course Breadcrumbs, Title & Overall Progress */}
      <CourseLearningHeader data={data} />

      {/* 2-Column Workspace: Timeline (70%) + Right Column (30%) */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
        {/* Main Course Content & Vertical Timeline */}
        <div className="flex flex-col gap-6">
          <CourseTimeline data={data} />
        </div>

        {/* Right Supporting Sidebar (Sticky on Desktop) */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-6">
          <ContinueLearningCard data={data} />
          <CourseOverviewCard data={data} />
        </aside>
      </div>
    </div>
  );
}


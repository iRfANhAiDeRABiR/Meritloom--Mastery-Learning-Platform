import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getAllPublishedLearningPaths } from "@/lib/queries/learning-paths";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { LearningPathsHero } from "@/components/learning-paths/explorer/learning-paths-hero";
import { FeaturedLearningPath } from "@/components/learning-paths/explorer/featured-learning-path";
import { LearningPathsGrid } from "@/components/learning-paths/explorer/learning-paths-grid";
import { HowLearningPathsWork } from "@/components/learning-paths/explorer/how-learning-paths-work";
import { CourseVsPath } from "@/components/learning-paths/explorer/course-vs-path";
import { LearningPathsCTA } from "@/components/learning-paths/explorer/learning-paths-cta";
import { LearningPathsEmptyState } from "@/components/learning-paths/explorer/learning-paths-empty-state";

export const metadata: Metadata = {
  title: "Learning Paths | Meritloom",
  description:
    "Explore free guided learning paths that combine Meritloom courses into clear step-by-step journeys.",
  openGraph: {
    title: "Guided Learning Paths | Meritloom",
    description:
      "Explore free guided learning paths that combine Meritloom courses into clear step-by-step journeys.",
    type: "website",
  },
  alternates: {
    canonical: "/learning-paths",
  },
};

export default async function LearningPathsPage() {
  const user = await getCurrentUser();
  const paths = await getAllPublishedLearningPaths(user?.id);

  const featuredPath =
    paths.find((p) => p.slug === "web-development-foundations") ||
    paths[0] ||
    null;

  return (
    <div className="flex min-h-dvh flex-col bg-background text-ink transition-colors">
      <SiteHeader user={user} />

      <main id="main" className="flex-1">
        {/* 1. Hero Section */}
        <LearningPathsHero />

        {/* 2. Featured Learning Path Card */}
        {featuredPath && (
          <FeaturedLearningPath path={featuredPath} user={user} />
        )}

        {/* 3. All Learning Paths Grid & Coming Soon */}
        {paths.length > 0 ? (
          <LearningPathsGrid paths={paths} user={user} />
        ) : (
          <LearningPathsEmptyState />
        )}

        {/* 4. How Learning Paths Work */}
        <HowLearningPathsWork />

        {/* 5. Course vs Learning Path Comparison */}
        <CourseVsPath />

        {/* 6. Bottom CTA */}
        <LearningPathsCTA />
      </main>

      <SiteFooter />
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getLearningPathBySlug } from "@/lib/queries/learning-paths";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { LearningPathBreadcrumb } from "@/components/learning-paths/learning-path-breadcrumb";
import { LearningPathHero } from "@/components/learning-paths/learning-path-hero";
import { LearningPathMetadata } from "@/components/learning-paths/learning-path-metadata";
import { LearningPathRoadmap } from "@/components/learning-paths/learning-path-roadmap";
import { LearningPathCapabilities } from "@/components/learning-paths/learning-path-capabilities";
import { LearningPathSkills } from "@/components/learning-paths/learning-path-skills";
import { LearningPathCTA } from "@/components/learning-paths/learning-path-cta";

interface LearningPathPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: LearningPathPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pathData = await getLearningPathBySlug(slug);

  if (!pathData || !pathData.isPublished) {
    return {
      title: "Learning Path Not Found | Meritloom",
      description: "The requested guided learning path could not be found.",
    };
  }

  return {
    title: `${pathData.title} | Meritloom`,
    description:
      pathData.description ||
      "Learn HTML, CSS, and JavaScript through a guided free web development learning path.",
    openGraph: {
      title: `${pathData.title} — Free Learning Path | Meritloom`,
      description:
        pathData.subtitle ||
        "Build the core skills you need to create modern interactive websites.",
      type: "website",
    },
    alternates: {
      canonical: `/learning-paths/${pathData.slug}`,
    },
  };
}

export default async function LearningPathDetailPage({
  params,
}: LearningPathPageProps) {
  const [{ slug }, user] = await Promise.all([
    params,
    getCurrentUser(),
  ]);

  const pathData = await getLearningPathBySlug(slug, user?.id);

  if (!pathData || !pathData.isPublished) {
    notFound();
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-ink transition-colors">
      <SiteHeader user={user} />

      <main id="main" className="flex-1">
        {/* Semantic Breadcrumb */}
        <LearningPathBreadcrumb title={pathData.title} />

        {/* Hero Section */}
        <LearningPathHero path={pathData} user={user} />

        {/* Metadata Strip */}
        <LearningPathMetadata path={pathData} />

        {/* Large Interactive Vertical Roadmap */}
        <LearningPathRoadmap path={pathData} isAuthenticated={Boolean(user)} />

        {/* What You'll Be Able to Build Section */}
        <LearningPathCapabilities capabilities={pathData.capabilities} />

        {/* Skills Cloud */}
        <LearningPathSkills skills={pathData.skills} />

        {/* Bottom Call to Action */}
        <LearningPathCTA path={pathData} user={user} />
      </main>

      <SiteFooter />
    </div>
  );
}

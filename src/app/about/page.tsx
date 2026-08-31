import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { AboutHero } from "@/components/about/about-hero";
import { WhyMeritloom } from "@/components/about/why-meritloom";
import { LearningProblemCards } from "@/components/about/learning-problem-cards";
import { MeritloomApproach } from "@/components/about/meritloom-approach";
import { MeritloomComparison } from "@/components/about/meritloom-comparison";
import { LearningPhilosophy } from "@/components/about/learning-philosophy";
import { FreeLearningModel } from "@/components/about/free-learning-model";
import { ContentTransparency } from "@/components/about/content-transparency";
import { AboutLearningJourney } from "@/components/about/about-learning-journey";
import { MeritloomPrinciples } from "@/components/about/meritloom-principles";
import { SimpleByDesign } from "@/components/about/simple-by-design";
import { MeritloomFuture } from "@/components/about/meritloom-future";
import { AboutCTA } from "@/components/about/about-cta";

export const metadata: Metadata = {
  title: "About Meritloom | Free Structured Learning",
  description:
    "Learn why Meritloom organizes free educational content into structured courses, practical lessons, progress tracking, and guided Learning Paths.",
  openGraph: {
    title: "About Meritloom — Free Structured Learning",
    description:
      "Meritloom organizes free learning into structured courses, practical lessons, and guided paths so you can focus on understanding what matters.",
    type: "website",
  },
  alternates: {
    canonical: "/about",
  },
};

export default async function AboutPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-dvh flex-col bg-background text-ink transition-colors">
      <SiteHeader user={user} />

      <main id="main" className="flex-1">
        {/* 1. Hero Section */}
        <AboutHero />

        {/* 2. Why Meritloom Exists */}
        <WhyMeritloom />

        {/* 3. The Problem with Online Learning */}
        <LearningProblemCards />

        {/* 4. Meritloom's Approach */}
        <MeritloomApproach />

        {/* 5. What Makes Meritloom Different */}
        <MeritloomComparison />

        {/* 6. Learning Philosophy */}
        <LearningPhilosophy />

        {/* 7. Free Learning Model */}
        <FreeLearningModel />

        {/* 8. Open Educational Content Transparency */}
        <ContentTransparency />

        {/* 9. The Learning Journey */}
        <AboutLearningJourney />

        {/* 10. Core Principles */}
        <MeritloomPrinciples />

        {/* 11. Simple by Design */}
        <SimpleByDesign />

        {/* 12. What's Next */}
        <MeritloomFuture />

        {/* 13. Final Call to Action */}
        <AboutCTA />
      </main>

      <SiteFooter />
    </div>
  );
}

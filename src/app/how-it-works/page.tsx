import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { HowItWorksHero } from "@/components/how-it-works/how-it-works-hero";
import { LearningJourney } from "@/components/how-it-works/learning-journey";
import { ProductExperienceTabs } from "@/components/how-it-works/product-experience-tabs";
import { CourseVsPathSection } from "@/components/how-it-works/course-vs-path-section";
import { CourseFeatures } from "@/components/how-it-works/course-features";
import { ProgressWithoutPressure } from "@/components/how-it-works/progress-without-pressure";
import { FreeLearningPromise } from "@/components/how-it-works/free-learning-promise";
import { HowItWorksFAQ } from "@/components/how-it-works/how-it-works-faq";
import { HowItWorksCTA } from "@/components/how-it-works/how-it-works-cta";

export const metadata: Metadata = {
  title: "How Meritloom Works | Free Structured Learning",
  description:
    "Learn how Meritloom combines free courses, structured lessons, hands-on practice, progress tracking, and guided Learning Paths.",
  openGraph: {
    title: "How Meritloom Works — Free Structured Learning",
    description:
      "Find a skill, follow structured lessons, practice what you learn, and continue at your own pace — all for free.",
    type: "website",
  },
  alternates: {
    canonical: "/how-it-works",
  },
};

export default async function HowItWorksPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-dvh flex-col bg-background text-ink transition-colors">
      <SiteHeader user={user} />

      <main id="main" className="flex-1">
        {/* 1. Hero Section */}
        <HowItWorksHero user={user} />

        {/* 2. Main 5-Step Learner Journey */}
        <LearningJourney />

        {/* 3. Interactive Product Preview Tabbed Showcase */}
        <ProductExperienceTabs />

        {/* 4. Course vs Learning Path Comparison */}
        <CourseVsPathSection />

        {/* 5. What's Inside a Course */}
        <CourseFeatures />

        {/* 6. Progress Tracking Without Pressure */}
        <ProgressWithoutPressure />

        {/* 7. Free Learning Guarantee */}
        <FreeLearningPromise />

        {/* 8. Frequently Asked Questions Accordion */}
        <HowItWorksFAQ />

        {/* 9. Final Call to Action */}
        <HowItWorksCTA user={user} />
      </main>

      <SiteFooter />
    </div>
  );
}

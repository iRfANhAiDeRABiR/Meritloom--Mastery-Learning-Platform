import { FeaturedCourses } from "@/components/landing/featured-courses";
import { FinalCTA } from "@/components/landing/final-cta";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LearnerFeatures } from "@/components/landing/learner-features";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { TestimonialsSection } from "@/components/home/testimonials/testimonials-section";
import { FormalModernBackground } from "@/components/home/background/formal-modern-background";
import { getCurrentUser } from "@/lib/auth";
import { getFeaturedCourses } from "@/lib/queries";

/**
 * Meritloom Public Landing Page — Page 1.
 *
 * Server Component orchestration.
 * Fetches published featured courses and optional auth session state.
 * Uses CSS variables for all light and dark theme styling.
 */
export default async function LandingPage() {
  const [user, courses] = await Promise.all([
    getCurrentUser(),
    getFeaturedCourses(3),
  ]);

  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-ink transition-colors overflow-x-hidden">
      {/* Formal Modern Architectural & Aurora Background Animation */}
      <FormalModernBackground />
      
      <SiteHeader user={user} />
      <main id="main" className="relative z-10 flex-1">
        <HeroSection user={user} />
        <LearnerFeatures />
        <FeaturedCourses courses={courses} />
        <HowItWorks />
        <TestimonialsSection />
        <FinalCTA user={user} />
      </main>
      <SiteFooter />
    </div>
  );
}

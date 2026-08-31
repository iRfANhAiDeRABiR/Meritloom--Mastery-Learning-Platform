import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CourseFinalCTA } from "@/components/courses/details/course-final-cta";
import { CourseHero } from "@/components/courses/details/course-hero";
import { CourseLearningOutcomes } from "@/components/courses/details/course-learning-outcomes";
import { CourseMetaSections } from "@/components/courses/details/course-meta-sections";
import { CourseOverview } from "@/components/courses/details/course-overview";
import { CourseStartCard } from "@/components/courses/details/course-start-card";
import { CourseSyllabus } from "@/components/courses/details/course-syllabus";
import { RelatedCourses } from "@/components/courses/details/related-courses";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { getCurrentUser } from "@/lib/auth";
import {
  checkCourseEnrollment,
  getCourseDetailBySlug,
  getRelatedCourses,
} from "@/lib/queries";
import type { CourseEnrollmentStatus } from "@/lib/types";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseDetailBySlug(slug);

  if (!course || !course.isPublished) {
    return {
      title: "Course Not Found · Meritloom",
      description: "The requested course could not be found.",
    };
  }

  const title = `${course.title} · Meritloom`;
  const description =
    course.summary ||
    "Explore this free, structured course on Meritloom to master practical concepts at your own pace.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Meritloom",
      images: course.thumbnailUrl ? [{ url: course.thumbnailUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: course.thumbnailUrl ? [course.thumbnailUrl] : undefined,
    },
  };
}

/**
 * Meritloom Course Details Page — Page 3.
 * Route: /courses/[slug]
 *
 * Translates Figma Frame 3:133 with free mastery-learning direction:
 * - Shared sticky header with Courses active
 * - Large dark course hero with real metadata, breadcrumbs, instructor
 * - Right-side 100% Free course enrollment card (sticky desktop, in-flow mobile)
 * - Structured course overview (About this course)
 * - What you'll learn checklist
 * - Neutral public course syllabus with expandable module accordions & lesson preview badges
 * - Prerequisites, skills covered, and target audience
 * - Related free courses from same category
 * - Final CTA banner & SiteFooter
 * - Dynamic SEO & JSON-LD Course structured data
 */
export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { slug } = await params;

  // 1. Fetch course details
  const course = await getCourseDetailBySlug(slug);
  if (!course || !course.isPublished) {
    notFound();
  }

  // 2. Fetch authenticated user session
  const user = await getCurrentUser();

  // 3. Parallel fetch: Enrollment status & Related courses
  const [enrollment, relatedCourses] = await Promise.all([
    user
      ? checkCourseEnrollment(user.id, course.id)
      : Promise.resolve<CourseEnrollmentStatus>({ isEnrolled: false }),
    getRelatedCourses(course.id, course.category?.slug, 3),
  ]);

  // 4. JSON-LD Course Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.summary || course.description,
    provider: {
      "@type": "Organization",
      name: "Meritloom",
      sameAs: "https://meritloom.com",
    },
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      category: "Free",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: course.estimatedMinutes
        ? `PT${Math.round(course.estimatedMinutes)}M`
        : undefined,
    },
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background text-ink transition-colors">
      {/* Course Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader user={user} />

      <main id="main" className="flex-1">
        {/* Dark Course Hero Section */}
        <CourseHero course={course} />

        {/* Main Details Body */}
        <div className="container-page py-10 sm:py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 lg:items-start">
            {/* Left Main Content Column */}
            <div className="flex flex-col gap-10 sm:gap-12 min-w-0">
              {/* Overview / About */}
              <CourseOverview description={course.description} />

              {/* What you'll learn */}
              <CourseLearningOutcomes outcomes={course.learningOutcomes} />

              {/* Course Syllabus & Accordions */}
              <CourseSyllabus modules={course.modules} />

              {/* Prerequisites, Skills, Learning Sequence & Audience */}
              <CourseMetaSections
                courseSlug={course.slug}
                prerequisites={course.prerequisites}
                skills={course.skills}
                targetAudience={course.targetAudience}
              />

              {/* Related Free Courses */}
              <RelatedCourses courses={relatedCourses} />
            </div>

            {/* Right Information & Enrollment Card (Sticky on desktop, in-flow mobile) */}
            <div className="lg:sticky lg:top-24">
              <CourseStartCard
                course={course}
                user={user}
                enrollment={enrollment}
              />
            </div>
          </div>
        </div>

        {/* Final Course CTA Banner */}
        <CourseFinalCTA
          course={course}
          user={user}
          enrollment={enrollment}
        />
      </main>

      <SiteFooter />
    </div>
  );
}


import * as React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import type { CourseDetail, CourseEnrollmentStatus, LearnerProfile } from "@/lib/types";

interface CourseFinalCTAProps {
  course: CourseDetail;
  user: LearnerProfile | null;
  enrollment: CourseEnrollmentStatus;
}

export function CourseFinalCTA({
  course,
  user,
  enrollment,
}: CourseFinalCTAProps) {
  const isEnrolled = enrollment.isEnrolled;

  return (
    <section aria-labelledby="detail-cta-heading" className="section-py bg-surface transition-colors">
      <div className="container-page">
        <div className="relative overflow-hidden flex flex-col items-center gap-6 rounded-container bg-primary px-6 py-12 text-center text-white shadow-lift sm:px-12 sm:py-16">
          {/* Subtle background ambient blur */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-white/10 blur-2xl"
          />

          <h2 id="detail-cta-heading" className="heading-2 max-w-2xl text-white">
            {isEnrolled
              ? "Continue your learning journey"
              : "Ready to start learning?"}
          </h2>
          <p className="lead-text max-w-xl text-white/90">
            {isEnrolled
              ? "Pick up right where you left off and master every concept step-by-step."
              : "Create a free account and begin this course at your own pace — no paywall ever."}
          </p>

          <div className="relative z-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {!user ? (
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 hover:text-primary active:bg-white/80 shadow-soft font-bold">
                <Link
                  href={`/auth/sign-up?next=${encodeURIComponent(
                    `/courses/${course.slug}`,
                  )}`}
                >
                  <span>Start Course Free</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : isEnrolled ? (
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 hover:text-primary active:bg-white/80 shadow-soft font-bold">
                <Link href={routes.myLearning}>
                  <span>Continue Learning</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 hover:text-primary active:bg-white/80 shadow-soft font-bold">
                <Link href={`/learn/courses/${course.slug}`}>
                  <span>Start Course</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            )}

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50"
            >
              <Link href={routes.courses.index}>
                <Compass className="size-4" aria-hidden="true" />
                Browse Courses
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


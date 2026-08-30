"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Layers,
  ListChecks,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { enrollInCourseAction } from "@/lib/actions/enroll";
import { routes } from "@/lib/routes";
import type { CourseDetail, CourseEnrollmentStatus, LearnerProfile } from "@/lib/types";
import { cn, formatDifficulty, formatDuration } from "@/lib/utils";

interface CourseStartCardProps {
  course: CourseDetail;
  user: LearnerProfile | null;
  enrollment: CourseEnrollmentStatus;
  className?: string;
}

const FREE_FEATURES = [
  "Structured, step-by-step lessons",
  "Practical exercises & examples",
  "Concept mastery checks",
  "Learn at your own pace, anytime",
] as const;

export function CourseStartCard({
  course,
  user,
  enrollment,
  className,
}: CourseStartCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const isEnrolled = enrollment.isEnrolled;

  const handleStartCourse = async () => {
    if (!user) {
      router.push(`/auth/sign-in?next=${encodeURIComponent(`/courses/${course.slug}`)}`);
      return;
    }

    setErrorMsg(null);
    startTransition(async () => {
      const res = await enrollInCourseAction(course.id, course.slug);
      if (res.success) {
        router.refresh();
      } else if (res.error) {
        setErrorMsg(res.error);
      }
    });
  };

  return (
    <aside
      aria-label="Course enrollment and details card"
      className={cn(
        "rounded-container border border-line bg-card p-6 shadow-lift transition-all lg:p-7",
        className,
      )}
    >
      <div className="flex flex-col gap-5">
        {/* Top Free Badge */}
        <div className="flex items-center justify-between">
          <Badge variant="mint" className="py-1 px-3 text-xs font-extrabold tracking-wide">
            <Sparkles className="size-3.5" aria-hidden="true" />
            100% Free
          </Badge>
          <span className="text-xs font-semibold text-muted">
            No credit card needed
          </span>
        </div>

        {/* Heading & Value Proposition */}
        <div>
          <h2 className="text-xl font-extrabold text-ink sm:text-2xl">
            {isEnrolled ? "You're enrolled!" : "Start learning today"}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Access every published lesson in this course without a subscription
            or paywall.
          </p>
        </div>

        {/* Error message feedback */}
        {errorMsg && (
          <div
            role="alert"
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-600 dark:text-rose-400"
          >
            {errorMsg}
          </div>
        )}

        {/* Main CTA Button */}
        <div>
          {!user ? (
            /* Anonymous visitor */
            <Button asChild size="lg" className="w-full text-base font-bold shadow-soft">
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
            /* Enrolled learner */
            <Button
              asChild
              size="lg"
              className="w-full bg-mint text-mint-ink hover:bg-mint/80 text-base font-bold shadow-soft"
            >
              <Link href={routes.myLearning}>
                <span>Continue Learning</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            /* Authenticated but not enrolled */
            <Button
              size="lg"
              onClick={handleStartCourse}
              disabled={isPending}
              className="w-full text-base font-bold shadow-soft"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  <span>Enrolling...</span>
                </>
              ) : (
                <>
                  <span>Start Course</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
          )}

          <p className="mt-2 text-center text-xs text-muted">
            {user ? "Free lifetime access" : "Sign in or create a free account to track progress"}
          </p>
        </div>

        {/* Course Fast Facts */}
        <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-surface p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted font-medium">
              <Layers className="size-3.5 text-primary" aria-hidden="true" />
              Modules
            </span>
            <span className="font-bold text-ink">
              {course.moduleCount || course.modules.length}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-line/60 pt-2">
            <span className="flex items-center gap-2 text-muted font-medium">
              <BookOpen className="size-3.5 text-primary" aria-hidden="true" />
              Lessons
            </span>
            <span className="font-bold text-ink">{course.lessonCount}</span>
          </div>

          <div className="flex items-center justify-between border-t border-line/60 pt-2">
            <span className="flex items-center gap-2 text-muted font-medium">
              <Clock className="size-3.5 text-primary" aria-hidden="true" />
              Estimated Duration
            </span>
            <span className="font-bold text-ink">
              {formatDuration(course.estimatedMinutes)}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-line/60 pt-2">
            <span className="flex items-center gap-2 text-muted font-medium">
              <ListChecks className="size-3.5 text-primary" aria-hidden="true" />
              Difficulty
            </span>
            <span className="font-bold text-ink">
              {formatDifficulty(course.difficulty)}
            </span>
          </div>
        </div>

        {/* What's included checklist */}
        <div className="flex flex-col gap-3 pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            What is included:
          </p>
          <ul className="flex flex-col gap-2.5 text-xs text-ink/90 sm:text-sm">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-mint text-mint-ink mt-0.5">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}


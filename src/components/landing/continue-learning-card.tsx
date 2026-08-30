import Link from "next/link";
import { ArrowRight, Clock, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { routes } from "@/lib/routes";
import type { ActiveEnrollment } from "@/lib/types";

/**
 * Personalised "Continue learning" card shown directly below the hero when a
 * signed-in learner has an active enrollment.
 */
export function ContinueLearningCard({
  enrollment,
}: {
  enrollment: ActiveEnrollment;
}) {
  const courseHref = routes.courses.detail(enrollment.courseSlug);

  return (
    <section aria-labelledby="continue-heading" className="container-page">
      <div className="-mt-10 rounded-container border border-line bg-white p-5 shadow-lift sm:-mt-14 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">
                <Clock className="size-3" aria-hidden="true" />
                Continue where you left off
              </Badge>
            </div>
            <div>
              <h2
                id="continue-heading"
                className="text-lg font-bold text-ink sm:text-xl"
              >
                {enrollment.courseTitle}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {enrollment.currentModuleTitle
                  ? `Current module: ${enrollment.currentModuleTitle}`
                  : "Jump back into your latest lesson."}
                {enrollment.lastLessonTitle ? (
                  <>
                    {" "}
                    · Last lesson:{" "}
                    <span className="font-medium text-ink">
                      {enrollment.lastLessonTitle}
                    </span>
                  </>
                ) : null}
              </p>
            </div>
            <div className="flex w-full max-w-sm flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted">Course progress</span>
                <span className="text-primary">
                  {enrollment.progressPercent}%
                </span>
              </div>
              <Progress
                value={enrollment.progressPercent}
                aria-label={`Course progress: ${enrollment.progressPercent} percent`}
              />
            </div>
          </div>

          <Button asChild size="lg" className="shrink-0">
            <Link href={courseHref}>
              <Play className="size-4" aria-hidden="true" />
              Continue learning
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

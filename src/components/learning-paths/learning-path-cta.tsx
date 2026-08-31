import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import type { LearnerProfile, LearningPathDetail } from "@/lib/types";

interface LearningPathCTAProps {
  path: LearningPathDetail;
  user: LearnerProfile | null;
}

export function LearningPathCTA({ path, user }: LearningPathCTAProps) {
  const learnerProgress = path.learnerProgress;

  let heading = "Ready to build your first website?";
  let text = "Start with HTML and follow the guided path at your own pace without paywalls.";
  let primaryHref = "/courses/html-fundamentals";
  let primaryLabel = "Start learning free";

  if (!user) {
    heading = "Ready to build your first website?";
    text = "Start with HTML and follow the guided path at your own pace without paywalls.";
    primaryHref = "/courses/html-fundamentals";
    primaryLabel = "Start learning free";
  } else if (!learnerProgress || learnerProgress.pathStatus === "not_started") {
    heading = "Start your Web Development journey";
    text = "Master HTML structure first, then level up to CSS styling and JavaScript interactivity.";
    primaryHref = "/courses/html-fundamentals";
    primaryLabel = "Start with HTML";
  } else if (learnerProgress.pathStatus === "completed") {
    heading = "All foundations completed!";
    text = "You have completed HTML, CSS, and JavaScript. Explore the catalog to deepen your skills.";
    primaryHref = routes.courses.index;
    primaryLabel = "Explore more courses";
  } else {
    heading = "Keep up the momentum!";
    text = `You have completed ${learnerProgress.completedCourses} of ${learnerProgress.totalCourses} courses. Continue where you left off.`;
    const currentItem = path.items.find((i) => i.isCurrentStep && i.itemType === "course");
    if (currentItem && currentItem.itemType === "course") {
      primaryHref = `/learn/courses/${currentItem.courseSlug}`;
      primaryLabel = `Continue ${currentItem.title.replace(" Fundamentals", "")}`;
    } else {
      primaryHref = "/learn";
      primaryLabel = "Continue your path";
    }
  }

  return (
    <section aria-labelledby="path-cta-heading" className="section-py bg-surface/40 transition-colors">
      <div className="container-page">
        <div className="relative overflow-hidden flex flex-col items-center gap-6 rounded-container bg-gradient-to-br from-primary via-primary-700 to-indigo-950 px-6 py-12 text-center text-white shadow-lift sm:px-12 sm:py-16">
          {/* Subtle Background Glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-white/10 blur-3xl animate-ambient-glow"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -bottom-24 size-80 rounded-full bg-mint/10 blur-3xl animate-ambient-glow"
            style={{ animationDelay: "3s" }}
          />

          <h2 id="path-cta-heading" className="heading-2 max-w-xl text-white">
            {heading}
          </h2>
          <p className="lead-text max-w-lg text-white/90 text-sm sm:text-base">
            {text}
          </p>

          <div className="relative z-10 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 hover:text-primary active:bg-white/80 shadow-soft hover:-translate-y-0.5 transition-all font-bold"
            >
              <Link href={primaryHref}>
                <span>{primaryLabel}</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 hover:-translate-y-0.5 transition-transform"
            >
              <Link href={routes.courses.index}>
                <Compass className="size-4" aria-hidden="true" />
                <span>Explore all courses</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, Compass, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import type { LearnerProfile, LearningPathDetail } from "@/lib/types";

interface LearningPathHeroProps {
  path: LearningPathDetail;
  user: LearnerProfile | null;
}

export function LearningPathHero({ path, user }: LearningPathHeroProps) {
  const learnerProgress = path.learnerProgress;

  // Determine dynamic CTA destination and label
  let primaryHref = "/courses/html-fundamentals";
  let primaryLabel = "Start this path free";

  if (!user) {
    primaryHref = "/courses/html-fundamentals";
    primaryLabel = "Start this path free";
  } else if (!learnerProgress || learnerProgress.pathStatus === "not_started") {
    primaryHref = "/courses/html-fundamentals";
    primaryLabel = "Start learning";
  } else if (learnerProgress.pathStatus === "completed") {
    primaryHref = `/learn/learning-paths/${path.slug}/complete`;
    primaryLabel = "View your summary";
  } else {
    // In progress: route to current step course
    const currentItem = path.items.find((i) => i.isCurrentStep && i.itemType === "course");
    if (currentItem && currentItem.itemType === "course") {
      primaryHref = `/learn/courses/${currentItem.courseSlug}`;
      primaryLabel = `Continue ${currentItem.title.replace(" Fundamentals", "")}`;
    } else {
      primaryHref = "/learn";
      primaryLabel = "Continue learning";
    }
  }

  return (
    <section aria-labelledby="path-hero-heading" className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 transition-colors">
      {/* Background Decorative Lighting & Tech Mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[420px] w-[820px] rounded-full bg-gradient-to-b from-primary/18 via-[#8B5CF6]/12 to-transparent blur-[120px] dark:from-primary/22 dark:via-[#7C3AED]/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-20 size-[320px] rounded-full bg-mint/15 blur-[100px] dark:bg-mint/10"
      />

      {/* Floating Code Symbols & Orbit Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden font-mono text-xs select-none opacity-30 dark:opacity-40"
      >
        <span className="absolute top-[20%] left-[6%] font-bold text-primary/70 animate-particle-1">&lt;&gt;</span>
        <span className="absolute top-[35%] right-[10%] font-bold text-mint-ink animate-particle-2">&#123;&#125;</span>
        <span className="absolute top-[65%] left-[12%] font-bold text-[#8B5CF6] animate-particle-3">(&nbsp;)</span>
        <span className="absolute top-[75%] right-[15%] font-bold text-primary/80 animate-particle-4">&lt;/&gt;</span>
      </div>

      <div className="container-page relative flex flex-col items-center text-center">
        {/* Top Eyebrow Badge */}
        <Badge
          variant="default"
          className="gap-2 border border-primary/25 bg-primary/10 dark:border-primary/30 dark:bg-primary/20 px-3.5 py-1.5 text-xs font-bold text-primary dark:text-white shadow-soft"
        >
          <Route className="size-3.5 text-primary dark:text-mint" aria-hidden="true" />
          <span>GUIDED LEARNING PATH</span>
        </Badge>

        {/* Path Heading */}
        <h1
          id="path-hero-heading"
          className="mt-5 max-w-3xl text-3xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-[3.25rem] leading-[1.12]"
        >
          {path.title}
        </h1>

        {/* Subtitle / Supporting Copy */}
        <p className="lead-text mt-4 max-w-2xl text-muted text-base sm:text-lg">
          Master the foundations of frontend development through a clear sequence of free courses and hands-on practice.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex w-full flex-col sm:w-auto sm:flex-row items-center gap-3.5">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto gap-2 shadow-lift hover:-translate-y-0.5 transition-transform font-bold"
          >
            <Link href={primaryHref}>
              <span>{primaryLabel}</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2 hover:-translate-y-0.5 transition-transform"
          >
            <Link href={routes.courses.index}>
              <Compass className="size-4 text-muted" aria-hidden="true" />
              <span>Explore courses</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

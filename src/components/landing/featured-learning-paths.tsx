import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EmptyState } from "@/components/landing/empty-state";
import { LearningPathCard } from "@/components/landing/learning-path-card";
import { SectionHeading } from "@/components/landing/section-heading";
import { routes } from "@/lib/routes";
import type { LearningPathSummary } from "@/lib/types";

/**
 * "Follow a path, not random tutorials" — featured learning paths ordered for
 * the learner. Empty results fall back to a polished state.
 */
export function FeaturedLearningPaths({
  paths,
}: {
  paths: LearningPathSummary[];
}) {
  return (
    <section
      id="learning-paths"
      aria-labelledby="paths-heading"
      className="section-py bg-white"
    >
      <div className="container-page">
        <SectionHeading
          id="paths-heading"
          eyebrow="Guided learning"
          title="Follow a path, not random tutorials"
          description="Learning paths arrange courses and lessons in the right order, so every concept builds on the last and you always know what to learn next."
          align="left"
          action={
            <Link
              href={routes.learningPaths.index}
              className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-bold text-primary hover:text-primary-600"
            >
              View all learning paths
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        {paths.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {paths.map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              icon={ArrowRight}
              title="Structured paths are coming soon"
              description="We are building guided learning paths that arrange courses in the right order. Until then, start with a free course."
              actionLabel="Browse free courses"
            />
          </div>
        )}
      </div>
    </section>
  );
}

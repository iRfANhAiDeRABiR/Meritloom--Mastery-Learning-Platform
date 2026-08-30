import Link from "next/link";
import { ArrowRight, Clock, GraduationCap, Layers } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import type { LearningPathSummary } from "@/lib/types";
import { cn, formatDifficulty, formatDuration } from "@/lib/utils";

/**
 * Featured learning-path card with a compact numbered roadmap strip built
 * from the first course titles stored in Supabase.
 */
export function LearningPathCard({
  path,
  className,
}: {
  path: LearningPathSummary;
  className?: string;
}) {
  const href = routes.learningPaths.detail(path.slug);
  const roadmap = path.roadmapPreview.slice(0, 3);

  return (
    <article
      className={cn(
        "flex h-full flex-col gap-4 rounded-[18px] border border-line bg-white p-6 shadow-soft transition-shadow hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="grid size-10 place-items-center rounded-2xl bg-lavender text-primary">
          <Layers className="size-5" aria-hidden="true" />
        </span>
        <Badge variant="neutral">{formatDifficulty(path.difficulty)}</Badge>
      </div>

      <div>
        <h3 className="text-lg font-bold leading-snug text-ink">
          <Link href={href}>{path.title}</Link>
        </h3>
        {path.outcome ? (
          <p className="mt-1.5 text-sm text-muted">{path.outcome}</p>
        ) : null}
      </div>

      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        {path.courseCount > 0 ? (
          <li className="flex items-center gap-1.5">
            <GraduationCap className="size-3.5" aria-hidden="true" />
            {path.courseCount} {path.courseCount === 1 ? "course" : "courses"}
          </li>
        ) : null}
        {path.estimatedMinutes > 0 ? (
          <li className="flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {formatDuration(path.estimatedMinutes)}
          </li>
        ) : null}
      </ul>

      {roadmap.length > 0 ? (
        <div className="rounded-[14px] border border-line bg-surface p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            Roadmap
          </p>
          <ol className="mt-2 flex flex-col gap-2">
            {roadmap.map((title, index) => (
              <li
                key={`${title}-${index}`}
                className="flex items-center gap-2 text-xs text-ink"
              >
                <span
                  className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-white"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span className="truncate">{title}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <Button asChild variant="secondary" className="mt-auto w-full">
        <Link href={href} aria-label={`View learning path: ${path.title}`}>
          View learning path
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Button>
    </article>
  );
}

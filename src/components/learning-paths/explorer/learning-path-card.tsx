"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LearningPathCover } from "./learning-path-cover";
import type { LearnerProfile, LearningPathDetail } from "@/lib/types";

interface LearningPathCardProps {
  path: LearningPathDetail;
  user: LearnerProfile | null;
}

export function LearningPathCard({ path, user }: LearningPathCardProps) {
  const learnerProgress = path.learnerProgress;
  const isCompleted = learnerProgress?.pathStatus === "completed";
  const isInProgress = learnerProgress?.pathStatus === "in_progress";

  const totalMinutes = path.estimatedMinutes || 305;
  const hours = Math.round((totalMinutes / 60) * 10) / 10;

  return (
    <div className="group relative flex flex-col rounded-[24px] border border-line bg-card shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift">
      {/* Custom Learning Path Multi-Node Cover Graphic */}
      <LearningPathCover slug={path.slug} />

      <div className="flex flex-1 flex-col p-6">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="default"
            className="border-primary/20 bg-primary/10 text-primary font-bold px-2.5 py-0.5 text-[11px]"
          >
            <Sparkles className="size-3" aria-hidden="true" />
            <span className="uppercase">{path.difficulty}</span>
          </Badge>

          {user && (
            <>
              {isCompleted ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-mint-ink">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  <span>Completed</span>
                </span>
              ) : isInProgress ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                  <span>In progress</span>
                </span>
              ) : null}
            </>
          )}
        </div>

        {/* Title & Summary */}
        <h3 className="mt-3 text-xl font-bold tracking-tight text-ink group-hover:text-primary transition-colors">
          <Link href={`/learning-paths/${path.slug}`}>
            {path.title}
          </Link>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
          {path.description || path.subtitle}
        </p>

        {/* Tech Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted">
            HTML
          </span>
          <span className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted">
            CSS
          </span>
          <span className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted">
            JavaScript
          </span>
        </div>

        <div className="flex-1" />

        {/* Metadata & CTA Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-line/70 pt-4">
          <div className="flex items-center gap-3 text-xs font-semibold text-muted">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="size-3.5 text-primary" aria-hidden="true" />
              <span>{path.courseCount} Courses</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5 text-[#8B5CF6]" aria-hidden="true" />
              <span>~{hours}h</span>
            </span>
          </div>

          <Button
            asChild
            size="sm"
            className="gap-1 font-bold shadow-xs group-hover:shadow-soft"
          >
            <Link href={`/learning-paths/${path.slug}`}>
              <span>View path</span>
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

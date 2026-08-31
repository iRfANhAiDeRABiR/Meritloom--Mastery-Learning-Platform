"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  FileCode2,
  Palette,
  Braces,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LearningPathCourseItem } from "@/lib/types";

interface LearningPathMilestoneCardProps {
  item: LearningPathCourseItem;
  isLeft?: boolean;
  isAuthenticated: boolean;
}

export function LearningPathMilestoneCard({
  item,
  isAuthenticated,
}: LearningPathMilestoneCardProps) {
  // Icon selector based on iconName
  const getIcon = () => {
    switch (item.iconName) {
      case "Code2":
        return <Code2 className="size-6 text-amber-500" aria-hidden="true" />;
      case "Palette":
        return <Palette className="size-6 text-cyan-500" aria-hidden="true" />;
      case "Braces":
        return <Braces className="size-6 text-yellow-500" aria-hidden="true" />;
      default:
        return <FileCode2 className="size-6 text-primary" aria-hidden="true" />;
    }
  };

  // Accent styling for icon floating container
  const getIconBg = () => {
    switch (item.accentColor) {
      case "amber":
        return "bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/20 text-amber-500";
      case "cyan":
        return "bg-cyan-500/10 dark:bg-cyan-500/15 border-cyan-500/20 text-cyan-500";
      case "gold":
        return "bg-amber-400/10 dark:bg-amber-400/15 border-amber-400/20 text-amber-400";
      default:
        return "bg-primary/10 border-primary/20 text-primary";
    }
  };

  // Dynamic status & CTA logic
  const status = item.status ?? "not_started";
  const isCompleted = status === "completed";
  const isInProgress = status === "in_progress";
  const isCurrent = item.isCurrentStep;

  let ctaLabel = `Start ${item.title.replace(" Fundamentals", "")}`;
  let ctaHref = `/courses/${item.courseSlug}`;

  if (isAuthenticated) {
    if (isCompleted) {
      ctaLabel = `Review ${item.title.replace(" Fundamentals", "")}`;
      ctaHref = `/learn/courses/${item.courseSlug}`;
    } else if (isInProgress) {
      ctaLabel = `Continue ${item.title.replace(" Fundamentals", "")}`;
      ctaHref = `/learn/courses/${item.courseSlug}`;
    } else {
      ctaLabel = `Start ${item.title.replace(" Fundamentals", "")}`;
      ctaHref = `/courses/${item.courseSlug}`;
    }
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-[22px] border bg-card p-6 sm:p-8 transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-lift",
        isCurrent
          ? "border-primary/50 shadow-glow ring-1 ring-primary/30 dark:border-primary/60"
          : "border-line shadow-soft hover:border-primary/30",
      )}
    >
      {/* Top Header Row with Floating Icon & Status */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Floating Course Icon */}
          <div
            className={cn(
              "grid size-12 sm:size-14 place-items-center rounded-[16px] border shadow-xs transition-transform duration-200 group-hover:-translate-y-0.5",
              getIconBg(),
            )}
          >
            {getIcon()}
          </div>

          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-muted">
              {item.stepLabel}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              {item.title}
            </h3>
          </div>
        </div>

        {/* Current Step / Completed Badge */}
        {isAuthenticated && (
          <div>
            {isCompleted ? (
              <Badge
                variant="outline"
                className="gap-1.5 border-mint-ink/30 bg-mint/50 dark:bg-mint/20 text-mint-ink font-semibold px-2.5 py-1 text-xs"
              >
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                <span>Completed</span>
              </Badge>
            ) : isInProgress ? (
              <Badge
                variant="outline"
                className="gap-1.5 border-primary/30 bg-primary/10 text-primary font-semibold px-2.5 py-1 text-xs"
              >
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                <span>In progress</span>
              </Badge>
            ) : isCurrent ? (
              <Badge
                variant="default"
                className="bg-primary text-white font-bold px-2.5 py-1 text-xs shadow-xs"
              >
                <span>CURRENT STEP</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-line bg-surface text-muted text-xs font-medium px-2.5 py-1"
              >
                <span>Not started</span>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-muted">
        {item.description}
      </p>

      {/* Progress Bar (if in progress) */}
      {isAuthenticated && isInProgress && item.totalLessons && (
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-muted">
            <span>{item.completedLessons ?? 0} of {item.totalLessons} lessons</span>
            <span className="text-primary">{item.progressPercent ?? 0}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${item.progressPercent ?? 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Row: Metadata Chips & Action Button */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line/70 pt-5">
        <div className="flex items-center gap-3 text-xs text-muted font-medium">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="size-3.5 text-muted" aria-hidden="true" />
            <span>{item.lessonCount} lessons</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5 text-muted" aria-hidden="true" />
            <span>~{Math.round(item.estimatedMinutes / 60 * 10) / 10}h</span>
          </span>
          <span className="rounded-md bg-surface px-2 py-0.5 capitalize font-semibold text-muted text-[11px]">
            {item.difficulty}
          </span>
        </div>

        <Button
          asChild
          size="sm"
          variant={isCompleted ? "outline" : "default"}
          className="gap-1.5 font-bold shadow-xs group-hover:shadow-soft"
        >
          <Link href={ctaHref}>
            <span>{ctaLabel}</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

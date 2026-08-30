"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  CircleHelp,
  Clock,
  Code2,
  FileText,
  PencilLine,
  Play,
  PlayCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import type {
  CourseLearningOverviewData,
  LessonType,
} from "@/lib/types";
import { cn, formatDuration } from "@/lib/utils";

interface CourseTimelineProps {
  data: CourseLearningOverviewData;
}

export function CourseTimeline({ data }: CourseTimelineProps) {
  const { course, modules, totalLessons } = data;

  // Track expanded modules: by default expand the in-progress module or the first module
  const [expandedModuleIds, setExpandedModuleIds] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    let hasExpanded = false;

    // Expand first in-progress module
    for (const mod of modules) {
      if (mod.state === "in_progress") {
        initial[mod.id] = true;
        hasExpanded = true;
        break;
      }
    }

    // If none in progress, expand the first module
    if (!hasExpanded && modules.length > 0) {
      initial[modules[0].id] = true;
    }

    return initial;
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModuleIds((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const getLessonTypeIcon = (type: LessonType) => {
    switch (type) {
      case "video":
        return PlayCircle;
      case "article":
        return FileText;
      case "exercise":
        return PencilLine;
      case "practice":
        return Code2;
      case "quiz":
      case "knowledge_check":
        return CircleHelp;
      default:
        return PlayCircle;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Outline Section Heading */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">Course content</h2>
          <span className="text-xs font-semibold text-muted">
            {modules.length} {modules.length === 1 ? "module" : "modules"} • {totalLessons}{" "}
            {totalLessons === 1 ? "lesson" : "lessons"}
          </span>
        </div>
        <p className="text-xs text-muted">
          Follow the course in order or open any lesson you would like to study.
        </p>
      </div>

      {/* Empty Module Fallback */}
      {modules.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-container border border-dashed border-line bg-card p-10 text-center">
          <h3 className="text-sm font-bold text-ink">Course content is being prepared</h3>
          <p className="text-xs text-muted max-w-sm">
            Lessons for this course will appear here as soon as they are published.
          </p>
        </div>
      )}

      {/* Vertical Timeline */}
      <div className="relative flex flex-col">
        {modules.map((mod, index) => {
          const isExpanded = Boolean(expandedModuleIds[mod.id]);
          const isLast = index === modules.length - 1;
          const formattedModNum = String(index + 1).padStart(2, "0");

          // Destination for module action button
          const actionLessonSlug =
            mod.nextLesson?.slug ||
            (mod.lessons.length > 0 ? mod.lessons[0].slug : "");
          const actionHref = actionLessonSlug
            ? `/learn/courses/${course.slug}/lessons/${actionLessonSlug}`
            : `/learn/courses/${course.slug}`;

          return (
            <div key={mod.id} className="relative flex gap-4 sm:gap-6">
              {/* Left Timeline Node & Connecting Line */}
              <div className="flex flex-col items-center shrink-0">
                {/* Timeline Node Badge */}
                <div
                  className={cn(
                    "grid size-9 sm:size-10 place-items-center rounded-full text-xs font-extrabold shadow-xs transition-all duration-200 z-10 select-none",
                    mod.state === "completed" &&
                      "bg-mint text-mint-ink border border-mint-ink/30 ring-4 ring-mint/20",
                    mod.state === "in_progress" &&
                      "bg-primary text-white border border-primary shadow-soft ring-4 ring-primary/20",
                    mod.state === "not_started" &&
                      "bg-card text-muted border border-line",
                  )}
                  aria-label={`Module ${index + 1}: ${mod.state.replace("_", " ")}`}
                >
                  {mod.state === "completed" ? (
                    <Check className="size-4 stroke-[3]" aria-hidden="true" />
                  ) : (
                    <span>{formattedModNum}</span>
                  )}
                </div>

                {/* Connecting Vertical Line */}
                {!isLast && (
                  <div
                    className={cn(
                      "w-[2px] flex-1 my-1 transition-colors",
                      mod.state === "completed"
                        ? "bg-[#19B99A]/40"
                        : "bg-line",
                    )}
                  />
                )}
              </div>

              {/* Right Module Card (Accordion) */}
              <div className="flex-1 pb-6 sm:pb-8">
                <div
                  className={cn(
                    "overflow-hidden rounded-[18px] border bg-card shadow-soft transition-all duration-200",
                    mod.state === "in_progress"
                      ? "border-primary/40 ring-1 ring-primary/20"
                      : "border-line hover:border-line-hover",
                  )}
                >
                  {/* Module Header / Trigger Bar */}
                  <div
                    onClick={() => toggleModule(mod.id)}
                    className="flex flex-col gap-3.5 p-4 sm:p-5 cursor-pointer select-none transition-colors hover:bg-surface/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-col gap-1.5 flex-1 pr-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
                          Module {index + 1}
                        </span>
                        {mod.state === "completed" && (
                          <span className="rounded bg-mint px-2 py-0.5 text-[10px] font-bold text-mint-ink">
                            Completed
                          </span>
                        )}
                        {mod.state === "in_progress" && (
                          <span className="rounded bg-lavender px-2 py-0.5 text-[10px] font-bold text-primary">
                            In progress
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-ink sm:text-lg">
                        {mod.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                        <span>
                          {mod.lessonCount} {mod.lessonCount === 1 ? "lesson" : "lessons"}
                        </span>
                        {mod.estimatedMinutes > 0 && (
                          <>
                            <span className="text-line">•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" aria-hidden="true" />
                              {formatDuration(mod.estimatedMinutes)}
                            </span>
                          </>
                        )}
                        {mod.lessonCount > 0 && (
                          <>
                            <span className="text-line">•</span>
                            <span className="font-medium text-ink">
                              {mod.completedLessonsCount} of {mod.lessonCount} completed
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Module Actions & Chevron */}
                    <div className="flex items-center justify-between gap-3 sm:justify-end shrink-0 pt-2 sm:pt-0 border-t border-line/60 sm:border-0">
                      {mod.state === "completed" && (
                        <Link
                          href={actionHref}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 py-1.5 text-xs font-bold text-ink hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
                        >
                          <RotateCcw className="size-3" aria-hidden="true" />
                          <span>Review</span>
                        </Link>
                      )}

                      {mod.state === "in_progress" && (
                        <Link
                          href={actionHref}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-soft hover:bg-primary-hover transition-colors cursor-pointer"
                        >
                          <span>Continue</span>
                          <ArrowRight className="size-3" aria-hidden="true" />
                        </Link>
                      )}

                      {mod.state === "not_started" && (
                        <Link
                          href={actionHref}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 py-1.5 text-xs font-bold text-muted hover:border-primary/40 hover:text-ink transition-colors cursor-pointer"
                        >
                          <span>Start module</span>
                          <ArrowRight className="size-3" aria-hidden="true" />
                        </Link>
                      )}

                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? "Collapse module" : "Expand module"}
                        className="grid size-8 place-items-center rounded-lg text-muted hover:bg-surface hover:text-ink transition-colors"
                      >
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-200",
                            isExpanded && "rotate-180",
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Lesson List */}
                  {isExpanded && (
                    <div className="border-t border-line bg-surface/30 px-3 py-2 sm:px-4 sm:py-3">
                      {mod.description && (
                        <p className="px-3 py-2 text-xs text-muted leading-relaxed border-b border-line/60 mb-1">
                          {mod.description}
                        </p>
                      )}

                      <div className="flex flex-col divide-y divide-line/60">
                        {mod.lessons.map((lesson, lIdx) => {
                          const TypeIcon = getLessonTypeIcon(lesson.lessonType);
                          const lessonHref = `/learn/courses/${course.slug}/lessons/${lesson.slug}`;

                          return (
                            <Link
                              key={lesson.id}
                              href={lessonHref}
                              className={cn(
                                "group/lesson flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-all duration-150",
                                lesson.isNext
                                  ? "bg-lavender/50 border border-primary/30 text-primary shadow-xs"
                                  : "hover:bg-card text-ink",
                              )}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {/* State Indicator Icon */}
                                <div className="shrink-0">
                                  {lesson.isCompleted ? (
                                    <CheckCircle2
                                      className="size-4 text-[#19B99A]"
                                      aria-hidden="true"
                                    />
                                  ) : lesson.isNext ? (
                                    <span className="grid size-4 place-items-center rounded-full bg-primary text-white">
                                      <Play className="size-2.5 fill-current ml-0.5" aria-hidden="true" />
                                    </span>
                                  ) : (
                                    <Circle
                                      className="size-4 text-muted/60"
                                      aria-hidden="true"
                                    />
                                  )}
                                </div>

                                {/* Lesson Number & Type Icon */}
                                <span className="text-xs font-semibold text-muted">
                                  {index + 1}.{lIdx + 1}
                                </span>

                                <TypeIcon
                                  className={cn(
                                    "size-3.5 shrink-0",
                                    lesson.isNext ? "text-primary" : "text-muted",
                                  )}
                                  aria-hidden="true"
                                />

                                {/* Title & Next Highlight Badge */}
                                <span className="truncate text-xs font-semibold group-hover/lesson:text-primary transition-colors">
                                  {lesson.title}
                                </span>

                                {lesson.isNext && (
                                  <span className="hidden sm:inline-flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                                    <Sparkles className="size-2.5" aria-hidden="true" />
                                    <span>Continue here</span>
                                  </span>
                                )}
                              </div>

                              {/* Lesson Duration & Arrow */}
                              <div className="flex items-center gap-2 shrink-0 text-xs text-muted">
                                {lesson.estimatedMinutes > 0 && (
                                  <span>{lesson.estimatedMinutes} min</span>
                                )}
                                <ArrowRight
                                  className="size-3 text-muted/60 group-hover/lesson:text-primary group-hover/lesson:translate-x-0.5 transition-all"
                                  aria-hidden="true"
                                />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

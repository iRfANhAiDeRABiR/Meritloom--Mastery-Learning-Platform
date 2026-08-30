"use client";

import * as React from "react";
import Link from "next/link";
import {
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
} from "lucide-react";

import type {
  LearnerModuleDetail,
  LessonType,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface LessonCourseOutlineProps {
  courseSlug: string;
  currentLessonSlug: string;
  modules: LearnerModuleDetail[];
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  className?: string;
  onSelectLesson?: () => void;
}

export function LessonCourseOutline({
  courseSlug,
  currentLessonSlug,
  modules,
  totalLessons,
  completedLessons,
  progressPercent,
  className,
  onSelectLesson,
}: LessonCourseOutlineProps) {
  // Automatically expand module containing current lesson
  const [expandedModules, setExpandedModules] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const mod of modules) {
      const hasCurrent = mod.lessons.some((l) => l.slug === currentLessonSlug);
      if (hasCurrent) {
        initial[mod.id] = true;
      }
    }
    // If none matched, expand first module
    if (Object.keys(initial).length === 0 && modules.length > 0) {
      initial[modules[0].id] = true;
    }
    return initial;
  });

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
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
    <nav
      aria-label="Course outline"
      className={cn(
        "flex flex-col border-r border-line bg-card shrink-0 transition-all",
        className,
      )}
    >
      {/* Outline Progress Header */}
      <div className="flex flex-col gap-2.5 border-b border-line p-4 sm:p-5">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
          Course Outline
        </span>
        <div className="flex items-center justify-between text-xs font-semibold text-muted">
          <span>
            {completedLessons} of {totalLessons} completed
          </span>
          <span className="font-bold text-ink">{progressPercent}%</span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Course progress"
        >
          <div
            className="h-full rounded-full bg-[#19B99A] transition-all duration-300 shadow-[0_0_6px_rgba(25,185,154,0.3)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Modules & Lessons Scrollable Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-line/60">
        {modules.map((mod, modIdx) => {
          const isExpanded = Boolean(expandedModules[mod.id]);

          return (
            <div key={mod.id} className="flex flex-col">
              {/* Module Header Trigger */}
              <button
                type="button"
                onClick={() => toggleModule(mod.id)}
                aria-expanded={isExpanded}
                className="flex items-center justify-between gap-2.5 p-3.5 sm:px-4 text-left hover:bg-surface transition-colors cursor-pointer"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                    Module {modIdx + 1}
                  </span>
                  <h3 className="truncate text-xs font-bold text-ink">
                    {mod.title}
                  </h3>
                  <span className="text-[11px] text-muted">
                    {mod.completedLessonsCount} / {mod.lessonCount} completed
                  </span>
                </div>

                <ChevronDown
                  className={cn(
                    "size-4 text-muted shrink-0 transition-transform duration-200",
                    isExpanded && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>

              {/* Module Lessons List */}
              {isExpanded && (
                <div className="flex flex-col bg-surface/40 pb-1.5">
                  {mod.lessons.map((les, lesIdx) => {
                    const isCurrent = les.slug === currentLessonSlug;
                    const TypeIcon = getLessonTypeIcon(les.lessonType);
                    const lessonHref = `/learn/courses/${courseSlug}/lessons/${les.slug}`;

                    return (
                      <Link
                        key={les.id}
                        href={lessonHref}
                        onClick={onSelectLesson}
                        aria-current={isCurrent ? "page" : undefined}
                        className={cn(
                          "group flex items-center justify-between gap-2.5 px-4 py-2.5 text-xs transition-all",
                          isCurrent
                            ? "bg-lavender font-bold text-primary border-l-3 border-primary shadow-xs"
                            : "text-muted hover:bg-surface hover:text-ink",
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* State Icon */}
                          <div className="shrink-0">
                            {les.isCompleted ? (
                              <CheckCircle2
                                className="size-3.5 text-[#19B99A]"
                                aria-hidden="true"
                              />
                            ) : isCurrent ? (
                              <span className="grid size-3.5 place-items-center rounded-full bg-primary text-white">
                                <Play className="size-2 fill-current ml-0.5" aria-hidden="true" />
                              </span>
                            ) : (
                              <Circle
                                className="size-3.5 text-muted/60"
                                aria-hidden="true"
                              />
                            )}
                          </div>

                          {/* Lesson Position */}
                          <span className="text-[11px] font-semibold text-muted shrink-0">
                            {modIdx + 1}.{lesIdx + 1}
                          </span>

                          <TypeIcon
                            className={cn(
                              "size-3.5 shrink-0",
                              isCurrent ? "text-primary" : "text-muted",
                            )}
                            aria-hidden="true"
                          />

                          {/* Lesson Title */}
                          <span className="truncate group-hover:text-ink transition-colors">
                            {les.title}
                          </span>
                        </div>

                        {/* Estimated Duration */}
                        {les.estimatedMinutes > 0 && (
                          <span className="shrink-0 text-[10px] text-muted/80 flex items-center gap-0.5">
                            <Clock className="size-2.5" aria-hidden="true" />
                            {les.estimatedMinutes}m
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}


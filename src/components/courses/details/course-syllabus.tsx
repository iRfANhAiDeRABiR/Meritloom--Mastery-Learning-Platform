import * as React from "react";
import {
  BookOpen,
  CheckSquare,
  Clock,
  Code2,
  FileText,
  HelpCircle,
  PlayCircle,
  Sparkles,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { CourseModule, LessonType } from "@/lib/types";
import { cn, formatDuration } from "@/lib/utils";

interface CourseSyllabusProps {
  modules: CourseModule[];
  className?: string;
}

function LessonTypeIcon({ type }: { type: LessonType }) {
  switch (type) {
    case "video":
      return <PlayCircle className="size-4 text-primary" aria-hidden="true" />;
    case "article":
      return <FileText className="size-4 text-emerald-500" aria-hidden="true" />;
    case "exercise":
    case "practice":
      return <Code2 className="size-4 text-amber-500" aria-hidden="true" />;
    case "quiz":
    case "knowledge_check":
      return <CheckSquare className="size-4 text-purple-500" aria-hidden="true" />;
    default:
      return <BookOpen className="size-4 text-primary" aria-hidden="true" />;
  }
}

export function CourseSyllabus({ modules, className }: CourseSyllabusProps) {
  const hasModules = modules && modules.length > 0;
  const totalLessons = modules.reduce((acc, m) => acc + m.lessonCount, 0);

  if (!hasModules) {
    return (
      <section
        aria-labelledby="course-syllabus-heading"
        className={cn("flex flex-col gap-4", className)}
      >
        <div>
          <h2
            id="course-syllabus-heading"
            className="text-2xl font-bold tracking-tight text-ink sm:text-3xl"
          >
            Course syllabus
          </h2>
          <p className="lead-text mt-1 text-sm text-muted">
            See what you&apos;ll learn before starting the course.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-line bg-card p-10 text-center">
          <HelpCircle className="size-8 text-primary/60" aria-hidden="true" />
          <div>
            <h3 className="text-base font-bold text-ink">
              Course content is being prepared
            </h3>
            <p className="mt-1 text-sm text-muted">
              Lessons for this course will be published soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Default to opening the first module for immediate preview
  const defaultOpen = modules[0]?.id ? [modules[0].id] : undefined;

  return (
    <section
      aria-labelledby="course-syllabus-heading"
      className={cn("flex flex-col gap-5", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2
            id="course-syllabus-heading"
            className="text-2xl font-bold tracking-tight text-ink sm:text-3xl"
          >
            Course syllabus
          </h2>
          <p className="lead-text mt-1 text-sm text-muted">
            See what you&apos;ll learn before starting the course.
          </p>
        </div>

        <p className="text-xs font-semibold text-muted">
          {modules.length} {modules.length === 1 ? "module" : "modules"} · {totalLessons} {totalLessons === 1 ? "lesson" : "lessons"}
        </p>
      </div>

      <Accordion
        type="multiple"
        defaultValue={defaultOpen}
        className="flex flex-col gap-3"
      >
        {modules.map((module, idx) => (
          <AccordionItem key={module.id} value={module.id}>
            <AccordionTrigger>
              <div className="flex flex-1 flex-col items-start gap-1 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-4 pr-2">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                    {module.isBonus ? "Bonus Module" : `Module ${idx + 1}`}
                  </span>
                  <p className="text-base font-bold text-ink mt-0.5">
                    {module.title}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-medium text-muted">
                  <span>
                    {module.isBonus
                      ? `${module.lessonCount} bonus ${module.lessonCount === 1 ? "lesson" : "lessons"}`
                      : `${module.lessonCount} ${module.lessonCount === 1 ? "lesson" : "lessons"}`}
                  </span>
                  {module.estimatedMinutes > 0 && (
                    <>
                      <span className="size-1 rounded-full bg-line" aria-hidden="true" />
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-muted" aria-hidden="true" />
                        {formatDuration(module.estimatedMinutes)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              {module.description && (
                <p className="mb-4 text-xs leading-relaxed text-muted/90 sm:text-sm">
                  {module.description}
                </p>
              )}

              {module.lessons.length > 0 ? (
                <ul className="flex flex-col gap-2 pt-1">
                  {module.lessons.map((lesson, lIdx) => (
                    <li
                      key={lesson.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-surface/70 px-4 py-3 text-sm transition-colors hover:bg-surface"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-bold text-muted w-5 shrink-0 text-right">
                          {lesson.isBonus ? "★" : `${lIdx + 1}.`}
                        </span>
                        <LessonTypeIcon type={lesson.lessonType} />
                        <span className="truncate font-semibold text-ink">
                          {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 text-xs text-muted">
                        {lesson.isBonus && (
                          <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-extrabold text-amber-500">
                            Bonus
                          </span>
                        )}
                        {lesson.isPreview && !lesson.isBonus && (
                          <Badge
                            variant="mint"
                            className="py-0.5 px-2 text-[10px] font-bold"
                          >
                            <Sparkles className="size-2.5" aria-hidden="true" />
                            Preview
                          </Badge>
                        )}
                        {lesson.estimatedMinutes > 0 && (
                          <span>{formatDuration(lesson.estimatedMinutes)}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted italic">
                  Lessons in this module are currently being drafted.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}


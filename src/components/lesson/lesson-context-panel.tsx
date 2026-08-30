import {
  Clock,
  Code2,
  Download,
  ExternalLink,
  FileDown,
  FileText,
  Layers,
  Sparkles,
  Target,
} from "lucide-react";

import type { FullLessonDetail, LessonResourceType } from "@/lib/types";

interface LessonContextPanelProps {
  lesson: FullLessonDetail;
}

export function LessonContextPanel({ lesson }: LessonContextPanelProps) {
  const getResourceIcon = (type: LessonResourceType) => {
    switch (type) {
      case "transcript":
        return FileText;
      case "pdf":
        return FileDown;
      case "code":
        return Code2;
      case "external":
        return ExternalLink;
      case "download":
        return Download;
      default:
        return FileText;
    }
  };

  return (
    <aside
      aria-label="Lesson details and resources"
      className="flex flex-col gap-5 shrink-0"
    >
      {/* Learning Objectives Card */}
      {lesson.objectives.length > 0 && (
        <div className="flex flex-col gap-3 rounded-[18px] border border-line bg-card p-4 sm:p-5 shadow-soft">
          <div className="flex items-center gap-2 border-b border-line pb-2.5">
            <Target className="size-4 text-primary" aria-hidden="true" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
              Learning objectives
            </h2>
          </div>

          <ul className="flex flex-col gap-2.5 pt-1">
            {lesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-ink/85">
                <span className="grid size-4 place-items-center rounded-full bg-lavender text-primary shrink-0 mt-0.5 text-[10px] font-extrabold">
                  {i + 1}
                </span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lesson Resources Card */}
      {lesson.resources.length > 0 && (
        <div className="flex flex-col gap-3 rounded-[18px] border border-line bg-card p-4 sm:p-5 shadow-soft">
          <div className="flex items-center gap-2 border-b border-line pb-2.5">
            <FileText className="size-4 text-primary" aria-hidden="true" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
              Resources
            </h2>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {lesson.resources.map((res) => {
              const Icon = getResourceIcon(res.resourceType);
              const isExternal = res.resourceType === "external" || res.url.startsWith("http");

              return (
                <a
                  key={res.id}
                  href={res.url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="group flex items-center justify-between gap-2.5 rounded-xl border border-line bg-surface p-3 text-xs font-semibold text-ink hover:border-primary/40 hover:text-primary transition-all shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="size-4 text-muted group-hover:text-primary shrink-0 transition-colors" aria-hidden="true" />
                    <span className="truncate">{res.title}</span>
                  </div>

                  {res.size && (
                    <span className="shrink-0 text-[10px] font-normal text-muted">
                      {res.size}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Lesson Metadata Info Card */}
      <div className="flex flex-col gap-3 rounded-[18px] border border-line bg-card p-4 sm:p-5 shadow-soft">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink border-b border-line pb-2.5">
          Lesson overview
        </h2>

        <div className="flex flex-col gap-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted flex items-center gap-1.5">
              <Layers className="size-3.5 text-primary" aria-hidden="true" />
              <span>Module</span>
            </span>
            <span className="font-bold text-ink">
              {lesson.module.position} of {lesson.module.totalLessons}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" aria-hidden="true" />
              <span>Est. time</span>
            </span>
            <span className="font-bold text-ink">{lesson.estimatedMinutes} minutes</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
              <span>Format</span>
            </span>
            <span className="font-bold text-ink capitalize">{lesson.lessonType}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}


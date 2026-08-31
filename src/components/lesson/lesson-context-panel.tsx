"use client";

import * as React from "react";
import {
  Clock,
  Code2,
  Download,
  ExternalLink,
  FileDown,
  FileText,
  Layers,
  Sparkles,
  StickyNote,
  Target,
} from "lucide-react";
import { LessonNotesEditor } from "@/components/lesson/lesson-notes-editor";
import type { FullLessonDetail, LessonResourceType } from "@/lib/types";

interface LessonContextPanelProps {
  lesson: FullLessonDetail;
  courseTitle: string;
  initialNote?: string;
}

export function LessonContextPanel({
  lesson,
  courseTitle,
  initialNote = "",
}: LessonContextPanelProps) {
  const [activeTab, setActiveTab] = React.useState<"overview" | "notes">("overview");
  const [hasNote, setHasNote] = React.useState(Boolean(initialNote.trim()));

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
    <div
      aria-label="Lesson details, resources, and notes"
      className="flex flex-col gap-4 w-full min-w-0"
    >
      {/* Tab Switcher */}
      <div className="flex items-center rounded-2xl border border-line bg-surface p-1">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex-1 rounded-xl py-1.5 text-xs font-bold transition ${
            activeTab === "overview"
              ? "bg-primary text-white shadow-sm"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Overview & Resources
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-bold transition ${
            activeTab === "notes"
              ? "bg-primary text-white shadow-sm"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          <StickyNote className="size-3.5" aria-hidden="true" />
          <span>Notes</span>
          {hasNote && (
            <span className="size-2 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>

      {activeTab === "notes" ? (
        <LessonNotesEditor
          lessonId={lesson.id}
          lessonTitle={lesson.title}
          courseTitle={courseTitle}
          moduleTitle={lesson.module.title}
          initialContent={initialNote}
          onNoteCountChange={(noted) => setHasNote(noted)}
        />
      ) : (
        <>
          {/* Learning Objectives Card */}
          {lesson.objectives.length > 0 && (
            <div className="flex flex-col gap-3 rounded-[16px] border border-line bg-card p-4 shadow-soft min-w-0">
              <div className="flex items-center gap-2 border-b border-line pb-2.5">
                <Target className="size-4 text-primary shrink-0" aria-hidden="true" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-ink truncate">
                  Learning objectives
                </h2>
              </div>

              <ul className="flex flex-col gap-2.5 pt-0.5">
                {lesson.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed text-ink/90 min-w-0">
                    <span className="grid size-4.5 place-items-center rounded-full bg-lavender text-primary shrink-0 mt-0.5 text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 break-words">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lesson Resources Card */}
          {lesson.resources.length > 0 && (
            <div className="flex flex-col gap-3 rounded-[16px] border border-line bg-card p-4 shadow-soft min-w-0">
              <div className="flex items-center gap-2 border-b border-line pb-2.5">
                <FileText className="size-4 text-primary shrink-0" aria-hidden="true" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-ink truncate">
                  Resources
                </h2>
              </div>

              <div className="flex flex-col gap-2 pt-0.5">
                {lesson.resources.map((res) => {
                  const Icon = getResourceIcon(res.resourceType);
                  const isExternal = res.resourceType === "external" || res.url.startsWith("http");

                  return (
                    <a
                      key={res.id}
                      href={res.url}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="group flex items-center justify-between gap-2 rounded-xl border border-line bg-surface p-2.5 text-xs font-semibold text-ink hover:border-primary/40 hover:text-primary transition-all shadow-xs min-w-0 w-full"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Icon className="size-3.5 text-muted group-hover:text-primary shrink-0 transition-colors" aria-hidden="true" />
                        <span className="truncate text-xs">{res.title}</span>
                      </div>

                      {res.size ? (
                        <span className="shrink-0 text-[10px] font-normal text-muted">
                          {res.size}
                        </span>
                      ) : isExternal ? (
                        <ExternalLink className="size-3 text-muted/60 shrink-0 group-hover:text-primary" aria-hidden="true" />
                      ) : null}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lesson Metadata Info Card */}
          <div className="flex flex-col gap-3 rounded-[16px] border border-line bg-card p-4 shadow-soft min-w-0">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink border-b border-line pb-2.5">
              Lesson overview
            </h2>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted flex items-center gap-1.5 shrink-0">
                  <Layers className="size-3.5 text-primary" aria-hidden="true" />
                  <span>Module</span>
                </span>
                <span className="font-bold text-ink truncate text-right">
                  {lesson.module.position} of {lesson.module.totalLessons}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted flex items-center gap-1.5 shrink-0">
                  <Clock className="size-3.5 text-primary" aria-hidden="true" />
                  <span>Est. time</span>
                </span>
                <span className="font-bold text-ink">{lesson.estimatedMinutes} min</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted flex items-center gap-1.5 shrink-0">
                  <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
                  <span>Format</span>
                </span>
                <span className="font-bold text-ink capitalize">{lesson.lessonType}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

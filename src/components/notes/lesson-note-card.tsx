"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock, FileText, StickyNote, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LearnerLessonNoteItem } from "@/lib/types";

interface LessonNoteCardProps {
  note: LearnerLessonNoteItem;
}

export function LessonNoteCard({ note }: LessonNoteCardProps) {
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Updated today";
      if (diffDays === 1) return "Updated yesterday";
      if (diffDays < 7) return `Updated ${diffDays} days ago`;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "Recently updated";
    }
  };

  return (
    <div className="group flex flex-col justify-between rounded-3xl border border-line bg-surface p-5 sm:p-6 shadow-sm transition hover:border-primary/40 hover:-translate-y-0.5">
      <div className="space-y-3">
        {/* Course & Module Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-display text-xs font-bold text-primary truncate">
              {note.courseTitle}
            </span>
            <span className="text-ink-muted text-xs">•</span>
            <span className="text-[11px] text-ink-muted truncate max-w-[140px] sm:max-w-[200px]">
              {note.moduleTitle}
            </span>
          </div>

          <Badge variant="outline" className="text-[10px] capitalize border-line bg-surface-elevated">
            {note.lessonType === "video" ? (
              <Video className="mr-1 h-3 w-3 text-primary" />
            ) : (
              <FileText className="mr-1 h-3 w-3 text-primary" />
            )}
            <span>{note.lessonType}</span>
          </Badge>
        </div>

        {/* Lesson Title */}
        <Link
          href={`/learn/courses/${note.courseSlug}/lessons/${note.lessonSlug}`}
          className="font-display text-base font-bold text-ink hover:text-primary transition line-clamp-1"
        >
          {note.lessonTitle}
        </Link>

        {/* Note Content Preview (3-4 lines clamp) */}
        <div className="rounded-2xl border border-line bg-surface-elevated/40 p-3.5">
          <p className="text-xs leading-relaxed text-ink/90 whitespace-pre-wrap line-clamp-4 font-sans">
            {note.content}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs">
        <span className="text-[11px] text-ink-muted">
          {formatDate(note.updatedAt)}
        </span>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-8 rounded-xl border-line text-xs font-semibold hover:border-primary/40 hover:text-primary"
        >
          <Link href={`/learn/courses/${note.courseSlug}/lessons/${note.lessonSlug}`}>
            <span>Open lesson</span>
            <ArrowRight className="ml-1.5 h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, CheckCircle2, Clock, FileText, StickyNote, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleLessonBookmarkAction } from "@/lib/actions/notes-and-bookmarks";
import type { LearnerLessonBookmarkItem } from "@/lib/types";

interface BookmarkedLessonCardProps {
  bookmark: LearnerLessonBookmarkItem;
  onRemove: (lessonId: string) => void;
}

export function BookmarkedLessonCard({ bookmark, onRemove }: BookmarkedLessonCardProps) {
  const [isRemoving, setIsRemoving] = React.useState(false);

  const handleRemoveBookmark = async () => {
    if (isRemoving) return;
    setIsRemoving(true);
    try {
      await toggleLessonBookmarkAction(bookmark.lessonId);
      onRemove(bookmark.lessonId);
    } finally {
      setIsRemoving(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="group flex flex-col justify-between rounded-3xl border border-line bg-surface p-5 sm:p-6 shadow-sm transition hover:border-primary/40 hover:-translate-y-0.5">
      <div className="space-y-3">
        {/* Header with course & bookmark badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-display text-xs font-bold text-primary truncate">
              {bookmark.courseTitle}
            </span>
            <span className="text-ink-muted text-xs">•</span>
            <span className="text-[11px] text-ink-muted truncate max-w-[140px] sm:max-w-[200px]">
              {bookmark.moduleTitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {bookmark.hasNote && (
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                <StickyNote className="mr-1 h-3 w-3" />
                <span>Note</span>
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px] capitalize border-line bg-surface-elevated">
              {bookmark.lessonType === "video" ? (
                <Video className="mr-1 h-3 w-3 text-primary" />
              ) : (
                <FileText className="mr-1 h-3 w-3 text-primary" />
              )}
              <span>{bookmark.lessonType}</span>
            </Badge>
          </div>
        </div>

        {/* Lesson Title */}
        <Link
          href={`/learn/courses/${bookmark.courseSlug}/lessons/${bookmark.lessonSlug}`}
          className="font-display text-base font-bold text-ink hover:text-primary transition line-clamp-1"
        >
          {bookmark.lessonTitle}
        </Link>

        {/* Details Strip */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
          {bookmark.estimatedMinutes && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{bookmark.estimatedMinutes} min</span>
            </span>
          )}

          {bookmark.isCompleted ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Completed</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-ink-muted">
              <span>In progress</span>
            </span>
          )}

          <span>•</span>
          <span className="text-[11px]">Bookmarked {formatDate(bookmark.bookmarkedAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <button
          type="button"
          disabled={isRemoving}
          onClick={handleRemoveBookmark}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-muted hover:text-rose-500 transition"
          title="Remove bookmark"
        >
          <Bookmark className="h-3.5 w-3.5 fill-primary text-primary hover:fill-none" />
          <span>Remove</span>
        </button>

        <Button
          asChild
          size="sm"
          className="h-8 rounded-xl bg-primary px-3 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
        >
          <Link href={`/learn/courses/${bookmark.courseSlug}/lessons/${bookmark.lessonSlug}`}>
            <span>{bookmark.isCompleted ? "Review lesson" : "Continue lesson"}</span>
            <ArrowRight className="ml-1.5 h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

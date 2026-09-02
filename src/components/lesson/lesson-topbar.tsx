"use client";

import Link from "next/link";
import { ArrowLeft, List, Maximize2, Minimize2 } from "lucide-react";

interface LessonTopbarProps {
  courseTitle: string;
  courseSlug: string;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  onOpenMobileOutline: () => void;
}

export function LessonTopbar({
  courseTitle,
  courseSlug,
  isFocusMode,
  onToggleFocusMode,
  onOpenMobileOutline,
}: LessonTopbarProps) {
  return (
    <header className="sticky top-16 z-20 flex h-14 w-full items-center justify-between border-b border-line bg-card/95 px-4 backdrop-blur-md transition-colors sm:px-6">
      {/* Left side: Back to Course + Titles */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href={`/learn/courses/${courseSlug}`}
          className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-bold text-ink hover:border-primary/40 hover:text-primary transition-all shadow-xs shrink-0 cursor-pointer"
          title="Return to course overview"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Back to course</span>
        </Link>

        <span className="hidden sm:inline text-line font-light">•</span>

        <h1 className="truncate text-xs sm:text-sm font-bold text-ink" title={courseTitle}>
          {courseTitle}
        </h1>
      </div>

      {/* Right side: Mobile Outline Trigger + Focus Mode */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile Outline Button (Only visible < 1024px) */}
        <button
          type="button"
          onClick={onOpenMobileOutline}
          aria-label="Open course content outline"
          className="flex lg:hidden items-center gap-1.5 rounded-xl border border-line bg-surface px-2.5 py-1.5 text-xs font-bold text-ink hover:text-primary transition-colors cursor-pointer"
        >
          <List className="size-4" aria-hidden="true" />
          <span className="hidden xs:inline">Outline</span>
        </button>

        {/* Focus Mode Toggle */}
        <button
          type="button"
          onClick={onToggleFocusMode}
          aria-label={isFocusMode ? "Exit focus mode" : "Enter focus mode"}
          title={isFocusMode ? "Exit focus mode" : "Enter focus mode"}
          className="grid size-9 place-items-center rounded-xl border border-line bg-surface text-muted hover:border-primary/40 hover:text-primary transition-all cursor-pointer shadow-xs"
        >
          {isFocusMode ? (
            <Minimize2 className="size-4" aria-hidden="true" />
          ) : (
            <Maximize2 className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
}

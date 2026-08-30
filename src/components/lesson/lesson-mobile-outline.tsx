"use client";

import * as React from "react";
import { X } from "lucide-react";

import { LessonCourseOutline } from "@/components/lesson/lesson-course-outline";
import type { LearnerModuleDetail } from "@/lib/types";

interface LessonMobileOutlineProps {
  isOpen: boolean;
  onClose: () => void;
  courseSlug: string;
  currentLessonSlug: string;
  modules: LearnerModuleDetail[];
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
}

export function LessonMobileOutline({
  isOpen,
  onClose,
  courseSlug,
  currentLessonSlug,
  modules,
  totalLessons,
  completedLessons,
  progressPercent,
}: LessonMobileOutlineProps) {
  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative z-10 flex h-full w-[300px] max-w-[85vw] flex-col border-r border-line bg-card shadow-lift animate-in slide-in-from-left duration-250">
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <h2 className="text-sm font-bold text-ink">Course Content</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close outline drawer"
            className="grid size-8 place-items-center rounded-lg text-muted hover:bg-surface hover:text-ink transition-colors cursor-pointer"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {/* Outline Content */}
        <div className="flex-1 overflow-y-auto">
          <LessonCourseOutline
            courseSlug={courseSlug}
            currentLessonSlug={currentLessonSlug}
            modules={modules}
            totalLessons={totalLessons}
            completedLessons={completedLessons}
            progressPercent={progressPercent}
            className="border-r-0"
            onSelectLesson={onClose}
          />
        </div>
      </div>
    </div>
  );
}


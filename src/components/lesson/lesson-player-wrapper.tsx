"use client";

import * as React from "react";

import { LessonBottomNav } from "@/components/lesson/lesson-bottom-nav";
import { LessonContentRenderer } from "@/components/lesson/lesson-content-renderer";
import { LessonContextPanel } from "@/components/lesson/lesson-context-panel";
import { LessonCourseOutline } from "@/components/lesson/lesson-course-outline";
import { LessonMobileOutline } from "@/components/lesson/lesson-mobile-outline";
import { LessonTopbar } from "@/components/lesson/lesson-topbar";
import { LessonVideoPlayer } from "@/components/lesson/lesson-video-player";
import { LearnerSidebar } from "@/components/learn/learner-sidebar";
import type {
  LearnerProfile,
  LessonPlayerData,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface LessonPlayerWrapperProps {
  data: LessonPlayerData;
  user: LearnerProfile;
}

export function LessonPlayerWrapper({ data, user }: LessonPlayerWrapperProps) {
  const {
    course,
    currentLesson,
    modules,
    totalLessons,
    completedLessons: initialCompletedCount,
    progressPercent: initialProgressPercent,
    previousLesson,
    nextLesson,
    isLastLesson,
  } = data;

  const [isFocusMode, setIsFocusMode] = React.useState(false);
  const [isMobileOutlineOpen, setIsMobileOutlineOpen] = React.useState(false);

  // Optimistic completion tracking for immediate outline updates
  const [completedLessonState, setCompletedLessonState] = React.useState(
    currentLesson.isCompleted,
  );
  const [completedCount, setCompletedCount] = React.useState(
    initialCompletedCount,
  );

  const handleCompletionChanged = (isCompleted: boolean) => {
    setCompletedLessonState(isCompleted);
    setCompletedCount((prev) =>
      isCompleted ? prev + 1 : Math.max(0, prev - 1),
    );
  };

  const progressPercent =
    totalLessons > 0
      ? Math.min(100, Math.round((completedCount / totalLessons) * 100))
      : initialProgressPercent;

  return (
    <div className="flex min-h-dvh bg-background text-ink antialiased">
      {/* 1. Global Learner Sidebar (Hidden in Focus Mode or on Mobile) */}
      {!isFocusMode && (
        <div className="hidden xl:block">
          <LearnerSidebar user={user} />
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* 2. Topbar */}
        <LessonTopbar
          courseTitle={course.title}
          courseSlug={course.slug}
          user={user}
          isFocusMode={isFocusMode}
          onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
          onOpenMobileOutline={() => setIsMobileOutlineOpen(true)}
        />

        {/* 3. Multi-Column Learning Workspace */}
        <div className="flex flex-1 min-w-0 overflow-x-hidden">
          {/* Secondary Course Outline Sidebar (Desktop only, hidden in Focus Mode) */}
          {!isFocusMode && (
            <aside className="hidden lg:flex w-[270px] xl:w-[290px] sticky top-16 h-[calc(100vh-4rem)]">
              <LessonCourseOutline
                courseSlug={course.slug}
                currentLessonSlug={currentLesson.slug}
                modules={modules}
                totalLessons={totalLessons}
                completedLessons={completedCount}
                progressPercent={progressPercent}
                className="w-full h-full"
              />
            </aside>
          )}

          {/* Center Column: Video + Content + Bottom Nav */}
          <main className="flex flex-1 flex-col items-center justify-start p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div
              className={cn(
                "w-full flex flex-col gap-6 sm:gap-8",
                isFocusMode ? "max-w-4xl" : "max-w-3xl",
              )}
            >
              {/* Video Player (If Video Lesson) */}
              {currentLesson.lessonType === "video" && (
                <LessonVideoPlayer
                  videoUrl={currentLesson.videoUrl}
                  title={currentLesson.title}
                />
              )}

              {/* Lesson Text / Article / Code Content */}
              <LessonContentRenderer lesson={currentLesson} />

              {/* Stacked Objectives & Resources on smaller screens / mobile */}
              <div className="flex flex-col gap-6 lg:hidden pt-4 border-t border-line">
                <LessonContextPanel lesson={currentLesson} />
              </div>

              {/* Lesson Bottom Navigation & Completion CTA */}
              <LessonBottomNav
                courseSlug={course.slug}
                lessonSlug={currentLesson.slug}
                isCompleted={completedLessonState}
                previousLesson={previousLesson}
                nextLesson={nextLesson}
                isLastLesson={isLastLesson}
                onCompletionChanged={handleCompletionChanged}
              />
            </div>
          </main>

          {/* Right Context Panel: Objectives & Resources (Desktop only, hidden in Focus Mode) */}
          {!isFocusMode && (
            <aside className="hidden 2xl:flex w-[300px] sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-l border-line p-5 bg-card/40">
              <LessonContextPanel lesson={currentLesson} />
            </aside>
          )}
        </div>
      </div>

      {/* Mobile Slide-Out Course Outline Drawer */}
      <LessonMobileOutline
        isOpen={isMobileOutlineOpen}
        onClose={() => setIsMobileOutlineOpen(false)}
        courseSlug={course.slug}
        currentLessonSlug={currentLesson.slug}
        modules={modules}
        totalLessons={totalLessons}
        completedLessons={completedCount}
        progressPercent={progressPercent}
      />
    </div>
  );
}


"use client";

import * as React from "react";
import { getPracticeConfigForLesson } from "@/lib/practice/defaults";
import { LessonBottomNav } from "@/components/lesson/lesson-bottom-nav";
import { LessonContentRenderer } from "@/components/lesson/lesson-content-renderer";
import { LessonContextPanel } from "@/components/lesson/lesson-context-panel";
import { LessonCourseOutline } from "@/components/lesson/lesson-course-outline";
import { LessonMobileOutline } from "@/components/lesson/lesson-mobile-outline";
import { LessonTopbar } from "@/components/lesson/lesson-topbar";
import { LessonVideoPlayer } from "@/components/lesson/lesson-video-player";
import { CodingPracticeWorkspace } from "@/components/practice/coding-practice-workspace";
import type { LessonPlayerData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LessonPlayerWrapperProps {
  data: LessonPlayerData;
}

export function LessonPlayerWrapper({ data }: LessonPlayerWrapperProps) {
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

  // Check if this lesson is a coding practice exercise
  const isPractice = Boolean(
    data.practiceData ||
      currentLesson.lessonType === "practice" ||
      currentLesson.lessonType === "exercise" ||
      currentLesson.title.toLowerCase().includes("practice") ||
      currentLesson.slug.toLowerCase().includes("practice"),
  );

  const practiceConfig =
    data.practiceData?.config ||
    getPracticeConfigForLesson(
      course.slug,
      currentLesson.slug,
      currentLesson.title,
      currentLesson.content,
    );
  const practiceInitialCode =
    data.practiceData?.initialCode || practiceConfig.starterCode;

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
    <div className="flex flex-col flex-1 min-w-0 w-full">
      {/* 1. Lesson Sub-Header / Topbar */}
      <LessonTopbar
        courseTitle={course.title}
        courseSlug={course.slug}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
        onOpenMobileOutline={() => setIsMobileOutlineOpen(true)}
      />

      {/* 2. Multi-Column Learning Workspace */}
      <div className="flex flex-1 min-w-0 w-full">
        {/* Course Outline Sidebar (Desktop only, hidden in Focus Mode) */}
        {!isFocusMode && (
          <aside className="hidden lg:flex w-[270px] xl:w-[290px] shrink-0 sticky top-[7.5rem] h-[calc(100vh-7.5rem)]">
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
        <div className="flex flex-1 flex-col items-center justify-start p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          <div
            className={cn(
              "w-full flex flex-col gap-6 sm:gap-8",
              isFocusMode ? "max-w-5xl" : "max-w-3xl xl:max-w-4xl",
            )}
          >
            {/* Practice Workspace (If Practice Lesson) */}
            {isPractice ? (
              <CodingPracticeWorkspace
                lessonId={currentLesson.id}
                lessonTitle={currentLesson.title}
                config={practiceConfig}
                initialCode={practiceInitialCode}
              />
            ) : (
              <>
                {/* Video Player (If Video Lesson) */}
                {currentLesson.lessonType === "video" && (
                  <LessonVideoPlayer
                    videoId={currentLesson.youtubeVideoId}
                    videoUrl={currentLesson.videoUrl}
                    title={currentLesson.title}
                    sourceChannel={currentLesson.sourceChannel}
                    sourceUrl={currentLesson.sourceUrl}
                  />
                )}

                {/* Lesson Text / Article / Code Content */}
                <LessonContentRenderer
                  lesson={currentLesson}
                  isBookmarked={data.isBookmarked}
                />
              </>
            )}

            {/* Stacked Objectives & Resources on smaller screens / mobile (< xl) */}
            <div className="flex flex-col gap-6 xl:hidden pt-4 border-t border-line">
              <LessonContextPanel
                lesson={currentLesson}
                courseTitle={course.title}
                initialNote={data.initialNote || ""}
              />
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
        </div>

        {/* Right Context Panel: Objectives & Resources (Desktop only, hidden in Focus Mode) */}
        {!isFocusMode && (
          <aside className="hidden xl:flex w-[290px] 2xl:w-[320px] shrink-0 sticky top-[7.5rem] h-[calc(100vh-7.5rem)] overflow-y-auto overflow-x-hidden border-l border-line p-4 lg:p-5 bg-card/30">
            <LessonContextPanel
              lesson={currentLesson}
              courseTitle={course.title}
              initialNote={data.initialNote || ""}
            />
          </aside>
        )}
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

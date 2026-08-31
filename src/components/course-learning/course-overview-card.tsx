import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  Gauge,
  Layers,
} from "lucide-react";

import type { CourseLearningOverviewData } from "@/lib/types";
import { formatDifficulty, formatDuration } from "@/lib/utils";

interface CourseOverviewCardProps {
  data: CourseLearningOverviewData;
}

export function CourseOverviewCard({ data }: CourseOverviewCardProps) {
  const { course, modules, totalLessons, studyPaceLabel, estimatedWeeksRemaining } = data;

  return (
    <div className="flex flex-col gap-4 rounded-[20px] border border-line bg-card p-5 sm:p-6 shadow-soft">
      <h2 className="text-sm font-bold uppercase tracking-wider text-ink border-b border-line pb-3">
        Course overview
      </h2>

      <div className="flex flex-col gap-3">
        {/* Modules Count */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 text-muted">
            <Layers className="size-3.5 text-primary" aria-hidden="true" />
            <span>Modules</span>
          </span>
          <span className="font-bold text-ink">{modules.length}</span>
        </div>

        {/* Lessons Count */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 text-muted">
            <BookOpen className="size-3.5 text-primary" aria-hidden="true" />
            <span>Total lessons</span>
          </span>
          <span className="font-bold text-ink">{totalLessons}</span>
        </div>

        {/* Total Duration */}
        {course.estimatedMinutes > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-muted">
              <Clock className="size-3.5 text-primary" aria-hidden="true" />
              <span>Total duration</span>
            </span>
            <span className="font-bold text-ink">
              {formatDuration(course.estimatedMinutes)}
            </span>
          </div>
        )}

        {/* Difficulty */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 text-muted">
            <Gauge className="size-3.5 text-primary" aria-hidden="true" />
            <span>Difficulty</span>
          </span>
          <span className="font-bold text-ink">
            {formatDifficulty(course.difficulty)}
          </span>
        </div>
      </div>

      {/* Realistic Pace-Based Estimation (Only when study pace was set) */}
      {studyPaceLabel && estimatedWeeksRemaining && (
        <div className="mt-1 flex flex-col gap-1 rounded-xl bg-surface p-3 border border-line text-xs">
          <div className="flex items-center gap-1.5 font-bold text-ink">
            <Calendar className="size-3.5 text-primary" aria-hidden="true" />
            <span>Est. {estimatedWeeksRemaining} {estimatedWeeksRemaining === 1 ? "week" : "weeks"} remaining</span>
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            Based on your preferred study pace of {studyPaceLabel}.
          </p>
        </div>
      )}

      {/* Web Development Learning Sequence */}
      <div className="mt-1 flex flex-col gap-2.5 rounded-xl border border-line bg-surface/50 p-3 text-xs">
        <span className="font-bold text-ink text-[11px] uppercase tracking-wider text-muted">
          Learning sequence
        </span>
        <div className="flex flex-col gap-2">
          {course.slug === "html-fundamentals" ? (
            <>
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-lavender/40 border border-primary/30">
                <span className="font-bold text-ink text-xs flex items-center gap-1.5">
                  <span className="grid size-4 place-items-center rounded-full bg-primary text-white text-[10px]">1</span>
                  HTML Fundamentals
                </span>
                <span className="text-[10px] font-bold text-primary">Current</span>
              </div>
              <Link href="/courses/css-fundamentals" className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-card border border-line text-muted hover:text-ink transition-colors">
                <span className="text-xs flex items-center gap-1.5">
                  <span className="grid size-4 place-items-center rounded-full bg-surface text-muted text-[10px] border border-line">2</span>
                  CSS Fundamentals
                </span>
                <span className="text-[10px] text-primary font-semibold">Next</span>
              </Link>
              <Link href="/courses/javascript-fundamentals" className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-card border border-line text-muted hover:text-ink transition-colors">
                <span className="text-xs flex items-center gap-1.5">
                  <span className="grid size-4 place-items-center rounded-full bg-surface text-muted text-[10px] border border-line">3</span>
                  JavaScript Fundamentals
                </span>
                <span className="text-[10px] text-muted font-medium">Course 3</span>
              </Link>
            </>
          ) : course.slug === "css-fundamentals" ? (
            <>
              <Link href="/courses/html-fundamentals" className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-card border border-line text-muted hover:text-ink transition-colors">
                <span className="text-xs flex items-center gap-1.5">
                  <span className="grid size-4 place-items-center rounded-full bg-surface text-muted text-[10px] border border-line">1</span>
                  HTML Fundamentals
                </span>
                <span className="text-[10px] text-muted font-medium">Prereq</span>
              </Link>
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-lavender/40 border border-primary/30">
                <span className="font-bold text-ink text-xs flex items-center gap-1.5">
                  <span className="grid size-4 place-items-center rounded-full bg-primary text-white text-[10px]">2</span>
                  CSS Fundamentals
                </span>
                <span className="text-[10px] font-bold text-primary">Current</span>
              </div>
              <Link href="/courses/javascript-fundamentals" className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-card border border-line text-muted hover:text-ink transition-colors">
                <span className="text-xs flex items-center gap-1.5">
                  <span className="grid size-4 place-items-center rounded-full bg-surface text-muted text-[10px] border border-line">3</span>
                  JavaScript Fundamentals
                </span>
                <span className="text-[10px] text-primary font-semibold">Next</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/courses/html-fundamentals" className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-card border border-line text-muted hover:text-ink transition-colors">
                <span className="text-xs flex items-center gap-1.5">
                  <span className="grid size-4 place-items-center rounded-full bg-surface text-muted text-[10px] border border-line">1</span>
                  HTML Fundamentals
                </span>
                <span className="text-[10px] text-muted font-medium">Prereq</span>
              </Link>
              <Link href="/courses/css-fundamentals" className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-card border border-line text-muted hover:text-ink transition-colors">
                <span className="text-xs flex items-center gap-1.5">
                  <span className="grid size-4 place-items-center rounded-full bg-surface text-muted text-[10px] border border-line">2</span>
                  CSS Fundamentals
                </span>
                <span className="text-[10px] text-muted font-medium">Prereq</span>
              </Link>
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-lavender/40 border border-primary/30">
                <span className="font-bold text-ink text-xs flex items-center gap-1.5">
                  <span className="grid size-4 place-items-center rounded-full bg-primary text-white text-[10px]">3</span>
                  JavaScript Fundamentals
                </span>
                <span className="text-[10px] font-bold text-primary">Current</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


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
        <div className="mt-2 flex flex-col gap-1 rounded-xl bg-surface p-3 border border-line text-xs">
          <div className="flex items-center gap-1.5 font-bold text-ink">
            <Calendar className="size-3.5 text-primary" aria-hidden="true" />
            <span>Est. {estimatedWeeksRemaining} {estimatedWeeksRemaining === 1 ? "week" : "weeks"} remaining</span>
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            Based on your preferred study pace of {studyPaceLabel}.
          </p>
        </div>
      )}
    </div>
  );
}


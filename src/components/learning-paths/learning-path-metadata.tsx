import { BarChart, BookOpen, Clock, Sparkles } from "lucide-react";
import type { LearningPathDetail } from "@/lib/types";

interface LearningPathMetadataProps {
  path: LearningPathDetail;
}

export function LearningPathMetadata({ path }: LearningPathMetadataProps) {
  // Format total estimated hours (~10-12 hours total study for 305 min video/practice)
  const totalMinutes = path.estimatedMinutes || 305;
  const hours = Math.round(totalMinutes / 60);

  return (
    <div className="container-page pb-12">
      <div className="mx-auto max-w-4xl rounded-2xl border border-line bg-card/80 backdrop-blur-md p-4 sm:p-5 shadow-soft">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 text-center">
          {/* 1. Courses count */}
          <div className="flex flex-col items-center justify-center gap-1.5 p-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              <BookOpen className="size-3.5 text-primary" aria-hidden="true" />
              <span>Structure</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-ink">
              {path.courseCount} Courses + Project
            </p>
          </div>

          {/* 2. Difficulty */}
          <div className="flex flex-col items-center justify-center gap-1.5 p-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              <BarChart className="size-3.5 text-mint-ink" aria-hidden="true" />
              <span>Level</span>
            </div>
            <p className="text-base sm:text-lg font-bold capitalize text-ink">
              {path.difficulty} Friendly
            </p>
          </div>

          {/* 3. Pace & Hours */}
          <div className="flex flex-col items-center justify-center gap-1.5 p-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              <Clock className="size-3.5 text-[#8B5CF6]" aria-hidden="true" />
              <span>Pace</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-ink">
              Self-paced (~{hours}h study)
            </p>
          </div>

          {/* 4. Pricing */}
          <div className="flex flex-col items-center justify-center gap-1.5 p-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              <Sparkles className="size-3.5 text-amber-500" aria-hidden="true" />
              <span>Access</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-mint-ink">
              100% Free Forever
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

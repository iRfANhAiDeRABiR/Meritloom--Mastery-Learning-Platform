import * as React from "react";
import { cn } from "@/lib/utils";

export function CourseGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8",
        className,
      )}
      aria-label="Loading courses"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-card border border-line bg-card shadow-soft animate-pulse"
        >
          {/* Cover Skeleton */}
          <div className="aspect-[16/9] w-full bg-surface" />

          {/* Body Skeleton */}
          <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded-full bg-line" />
              <div className="h-3 w-16 rounded-full bg-line" />
            </div>

            <div className="h-5 w-3/4 rounded-md bg-line" />
            <div className="space-y-1.5 pt-1">
              <div className="h-3.5 w-full rounded bg-line/80" />
              <div className="h-3.5 w-5/6 rounded bg-line/80" />
            </div>

            <div className="mt-auto flex items-center gap-4 pt-3 border-t border-line/60">
              <div className="h-3 w-16 rounded bg-line" />
              <div className="h-3 w-20 rounded bg-line" />
            </div>

            <div className="mt-3 h-9 w-full rounded-full bg-line" />
          </div>
        </div>
      ))}
    </div>
  );
}


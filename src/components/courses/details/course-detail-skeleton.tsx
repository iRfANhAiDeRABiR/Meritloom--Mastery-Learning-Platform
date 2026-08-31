import * as React from "react";

export function CourseDetailSkeleton() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-ink">
      {/* Header Placeholder */}
      <div className="h-16 w-full border-b border-line bg-background/80 lg:h-[72px]" />

      <main className="flex-1">
        {/* Hero Skeleton */}
        <div className="relative overflow-hidden bg-surface dark:bg-[#0B1020] border-b border-line pb-12 pt-6 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10">
          <div className="container-page flex flex-col gap-6">
            {/* Breadcrumb Skeleton */}
            <div className="h-4 w-48 rounded bg-line/60 dark:bg-white/10 animate-pulse" />

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] lg:gap-12 lg:items-center">
              <div className="flex flex-col gap-4">
                <div className="h-6 w-36 rounded-full bg-line/60 dark:bg-white/10 animate-pulse" />
                <div className="h-12 w-4/5 rounded-xl bg-line/60 dark:bg-white/10 animate-pulse" />
                <div className="h-5 w-full max-w-lg rounded bg-line/60 dark:bg-white/10 animate-pulse" />
                <div className="h-5 w-3/4 max-w-md rounded bg-line/60 dark:bg-white/10 animate-pulse" />
                <div className="flex gap-4 pt-2">
                  <div className="h-4 w-20 rounded bg-line/60 dark:bg-white/10 animate-pulse" />
                  <div className="h-4 w-24 rounded bg-line/60 dark:bg-white/10 animate-pulse" />
                  <div className="h-4 w-20 rounded bg-line/60 dark:bg-white/10 animate-pulse" />
                </div>
              </div>

              <div className="hidden lg:block aspect-[16/9] w-full rounded-container bg-line/40 dark:bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container-page py-10 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
            {/* Left Content Column */}
            <div className="flex flex-col gap-10">
              {/* Overview Skeleton */}
              <div className="flex flex-col gap-3">
                <div className="h-8 w-48 rounded-lg bg-line animate-pulse" />
                <div className="h-4 w-full rounded bg-line animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-line animate-pulse" />
                <div className="h-4 w-4/5 rounded bg-line animate-pulse" />
              </div>

              {/* Outcomes Skeleton */}
              <div className="rounded-container border border-line bg-card p-6 sm:p-8">
                <div className="h-7 w-40 rounded-lg bg-line animate-pulse mb-4" />
                <div className="grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="size-5 rounded-full bg-line animate-pulse shrink-0" />
                      <div className="h-4 w-full rounded bg-line animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Syllabus Skeleton */}
              <div className="flex flex-col gap-3">
                <div className="h-8 w-44 rounded-lg bg-line animate-pulse" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-card border border-line bg-card animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Right Card Skeleton */}
            <div className="h-[420px] rounded-container border border-line bg-card animate-pulse" />
          </div>
        </div>
      </main>

      {/* Footer Placeholder */}
      <div className="h-48 w-full border-t border-line bg-card" />
    </div>
  );
}


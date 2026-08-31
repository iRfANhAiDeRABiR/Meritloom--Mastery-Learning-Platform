import * as React from "react";

export default function CourseDetailLoading() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-ink">
      {/* Header Placeholder */}
      <div className="h-16 w-full shrink-0 border-b border-line bg-background/80 lg:h-[72px]" />

      <main className="flex-1">
        {/* Course Hero Placeholder */}
        <div className="relative overflow-hidden bg-surface dark:bg-[#0B1020] border-b border-line py-12 sm:py-16">
          <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="flex flex-col gap-4">
              <div className="h-4 w-40 rounded bg-line/60 dark:bg-white/10 animate-pulse" />
              <div className="h-10 w-3/4 max-w-lg rounded-xl bg-line/60 dark:bg-white/10 animate-pulse" />
              <div className="mt-1 h-4 w-2/3 max-w-md rounded bg-line/60 dark:bg-white/10 animate-pulse" />
              <div className="mt-4 flex items-center gap-3">
                <div className="size-12 rounded-full bg-line/60 dark:bg-white/10 animate-pulse" />
                <div className="h-4 w-32 rounded bg-line/60 dark:bg-white/10 animate-pulse" />
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <div className="h-9 w-24 rounded-full bg-line/60 dark:bg-white/10 animate-pulse" />
                <div className="h-9 w-28 rounded-full bg-line/60 dark:bg-white/10 animate-pulse" />
              </div>
            </div>
            <div className="hidden h-56 rounded-[20px] bg-line/40 dark:bg-white/[0.06] animate-pulse lg:block" />
          </div>
        </div>

        {/* Main Details Body Placeholder */}
        <div className="container-page py-10 sm:py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 lg:items-start">
            <div className="flex min-w-0 flex-col gap-10 sm:gap-12">
              <div className="flex flex-col gap-4">
                <div className="h-6 w-44 rounded bg-line animate-pulse" />
                <div className="flex flex-col gap-3">
                  <div className="h-4 w-full rounded bg-line animate-pulse" />
                  <div className="h-4 w-11/12 rounded bg-line animate-pulse" />
                  <div className="h-4 w-4/5 rounded bg-line animate-pulse" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="h-6 w-52 rounded bg-line animate-pulse" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="size-5 shrink-0 rounded-full bg-line animate-pulse" />
                      <div className="h-4 w-full rounded bg-line animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="h-6 w-40 rounded bg-line animate-pulse" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 w-full rounded-[18px] border border-line bg-card animate-pulse"
                  />
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <div className="h-6 w-44 rounded bg-line animate-pulse" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-64 w-full rounded-[20px] border border-line bg-card animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="h-96 w-full rounded-[20px] border border-line bg-card animate-pulse" />
            </div>
          </div>
        </div>

        <div className="container-page pb-12">
          <div className="h-44 w-full rounded-[24px] bg-[#0B1020] animate-pulse" />
        </div>
      </main>

      <div className="h-48 w-full shrink-0 border-t border-line bg-card" />
    </div>
  );
}

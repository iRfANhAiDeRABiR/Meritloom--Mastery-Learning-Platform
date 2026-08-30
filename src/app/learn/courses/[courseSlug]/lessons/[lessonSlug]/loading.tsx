export default function LessonPlayerLoading() {
  return (
    <div className="flex min-h-dvh bg-background text-ink antialiased">
      {/* Main Container */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar Skeleton */}
        <div className="flex h-16 w-full items-center justify-between border-b border-line px-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-28 rounded-xl bg-line animate-pulse" />
            <div className="h-4 w-40 rounded bg-line animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-line animate-pulse" />
            <div className="size-9 rounded-full bg-line animate-pulse" />
          </div>
        </div>

        {/* Multi-Column Skeleton */}
        <div className="flex flex-1 min-w-0">
          {/* Secondary Course Outline Skeleton (Desktop) */}
          <aside className="hidden lg:flex w-[270px] xl:w-[290px] flex-col border-r border-line p-4 gap-4">
            <div className="h-5 w-28 rounded bg-line animate-pulse" />
            <div className="h-2 w-full rounded-full bg-line animate-pulse" />
            <div className="flex flex-col gap-2 pt-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-10 w-full rounded-lg bg-card border border-line animate-pulse" />
              ))}
            </div>
          </aside>

          {/* Main Lesson Center Skeleton */}
          <main className="flex flex-1 flex-col items-center p-6 sm:p-8">
            <div className="w-full max-w-3xl flex flex-col gap-6">
              {/* Video Player Skeleton */}
              <div className="w-full aspect-video rounded-[18px] bg-card border border-line animate-pulse" />

              {/* Title & Badges Skeleton */}
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <div className="h-5 w-24 rounded bg-line animate-pulse" />
                  <div className="h-5 w-20 rounded bg-line animate-pulse" />
                </div>
                <div className="h-8 w-72 rounded-xl bg-line animate-pulse" />
                <div className="h-4 w-full max-w-md rounded bg-line animate-pulse" />
              </div>

              {/* Key Idea Skeleton */}
              <div className="h-20 w-full rounded-[16px] bg-card border border-line animate-pulse" />

              {/* Content Skeleton */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="h-4 w-full rounded bg-line animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-line animate-pulse" />
                <div className="h-4 w-4/6 rounded bg-line animate-pulse" />
              </div>
            </div>
          </main>

          {/* Right Context Panel Skeleton (2XL) */}
          <aside className="hidden 2xl:flex w-[300px] flex-col border-l border-line p-5 gap-5">
            <div className="h-40 w-full rounded-[18px] bg-card border border-line animate-pulse" />
            <div className="h-48 w-full rounded-[18px] bg-card border border-line animate-pulse" />
          </aside>
        </div>
      </div>
    </div>
  );
}


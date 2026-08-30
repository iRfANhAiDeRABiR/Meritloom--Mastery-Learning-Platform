export default function CourseLearningLoading() {
  return (
    <div className="flex min-h-dvh bg-background text-ink">
      {/* Sidebar Skeleton (Desktop only) */}
      <div className="hidden lg:block lg:w-[250px] shrink-0 bg-[#10172A] p-5 border-r border-[#1E293B]">
        <div className="h-9 w-28 rounded-xl bg-white/10 animate-pulse" />
        <div className="mt-12 flex flex-col gap-3">
          <div className="h-10 w-full rounded-xl bg-white/10 animate-pulse" />
          <div className="h-10 w-full rounded-xl bg-white/10 animate-pulse" />
          <div className="h-10 w-full rounded-xl bg-white/10 animate-pulse" />
          <div className="h-10 w-full rounded-xl bg-white/10 animate-pulse" />
          <div className="h-10 w-full rounded-xl bg-white/10 animate-pulse" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Topbar Skeleton */}
        <div className="flex h-16 w-full items-center justify-between border-b border-line px-6">
          <div className="h-5 w-28 rounded bg-line animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-32 rounded-full bg-line animate-pulse" />
            <div className="size-9 rounded-full bg-line animate-pulse" />
            <div className="size-9 rounded-full bg-line animate-pulse" />
          </div>
        </div>

        {/* Workspace Skeleton */}
        <div className="mx-auto w-full max-w-[1400px] flex-1 p-5 sm:p-8 lg:p-10 flex flex-col gap-6 sm:gap-8">
          {/* Header Skeleton */}
          <div className="flex flex-col gap-4 border-b border-line pb-6">
            <div className="h-4 w-48 rounded bg-line animate-pulse" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <div className="h-8 w-72 sm:w-96 rounded-xl bg-line animate-pulse" />
                <div className="h-4 w-60 rounded bg-line animate-pulse" />
              </div>
              <div className="h-10 w-36 rounded-xl bg-line animate-pulse" />
            </div>
            <div className="h-2 w-full rounded-full bg-line animate-pulse mt-2" />
          </div>

          {/* Grid Layout Skeleton */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
            {/* Timeline Skeleton */}
            <div className="flex flex-col gap-6">
              <div className="h-6 w-36 rounded bg-line animate-pulse" />
              <div className="flex flex-col gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="size-10 rounded-full bg-line animate-pulse shrink-0" />
                    <div className="h-28 flex-1 rounded-[18px] bg-card border border-line animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="flex flex-col gap-6">
              <div className="h-44 rounded-[20px] bg-card border border-line animate-pulse" />
              <div className="h-56 rounded-[20px] bg-card border border-line animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


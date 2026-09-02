export default function ExploreCoursesLoading() {
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

        {/* Content Skeleton */}
        <div className="mx-auto w-full max-w-[1400px] flex-1 p-5 sm:p-8 lg:p-10 flex flex-col gap-6 sm:gap-8">
          {/* Header Skeleton */}
          <div className="flex flex-col gap-2">
            <div className="h-8 w-52 rounded-xl bg-line animate-pulse" />
            <div className="h-4 w-72 rounded bg-line animate-pulse" />
          </div>

          {/* Filters Skeleton */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="h-11 w-full max-w-md rounded-xl bg-line animate-pulse" />
            <div className="flex items-center gap-2.5">
              <div className="h-11 w-28 rounded-xl bg-line animate-pulse" />
              <div className="h-11 w-36 rounded-xl bg-line animate-pulse" />
              <div className="h-11 w-32 rounded-xl bg-line animate-pulse" />
            </div>
          </div>

          {/* Course Grid Skeletons (6 cards) */}
          <div className="grid gap-6 lg:grid-cols-2 pt-2">
            <div className="h-56 rounded-[20px] bg-card border border-line animate-pulse" />
            <div className="h-56 rounded-[20px] bg-card border border-line animate-pulse" />
            <div className="h-56 rounded-[20px] bg-card border border-line animate-pulse" />
            <div className="h-56 rounded-[20px] bg-card border border-line animate-pulse" />
            <div className="h-56 rounded-[20px] bg-card border border-line animate-pulse" />
            <div className="h-56 rounded-[20px] bg-card border border-line animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

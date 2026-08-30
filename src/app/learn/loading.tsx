export default function LearnerLoading() {
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

        {/* Dashboard Body Skeleton */}
        <div className="mx-auto w-full max-w-[1400px] flex-1 p-5 sm:p-8 lg:p-10 flex flex-col gap-8">
          {/* Welcome Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-8 w-48 rounded-xl bg-line animate-pulse" />
              <div className="h-4 w-32 rounded bg-line animate-pulse" />
            </div>
            <div className="h-9 w-32 rounded-xl bg-line animate-pulse" />
          </div>

          {/* Continue Learning Hero Skeleton */}
          <div className="h-64 rounded-container bg-primary/20 animate-pulse border border-primary/20" />

          {/* My Learning Cards Skeleton */}
          <div className="flex flex-col gap-4">
            <div className="h-6 w-36 rounded bg-line animate-pulse" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="h-72 rounded-card bg-card border border-line animate-pulse" />
              <div className="h-72 rounded-card bg-card border border-line animate-pulse" />
              <div className="h-72 rounded-card bg-card border border-line animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


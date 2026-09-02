export default function LearnerLoading() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10 pb-12">
      {/* 1. Welcome Skeleton */}
      <div className="flex items-center justify-between border-b border-line/60 pb-6">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-56 rounded-xl bg-line animate-pulse" />
          <div className="h-4 w-72 rounded bg-line animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block h-8 w-36 rounded-full bg-line animate-pulse" />
          <div className="h-9 w-32 rounded-xl bg-line animate-pulse" />
        </div>
      </div>

      {/* 2. Continue Hero + This Week Skeleton */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px] items-stretch">
        <div className="h-64 sm:h-72 rounded-container bg-primary/20 animate-pulse border border-primary/20" />
        <div className="h-64 sm:h-72 rounded-card bg-card border border-line animate-pulse" />
      </div>

      {/* 3. My Learning Cards Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-36 rounded bg-line animate-pulse" />
          <div className="h-4 w-20 rounded bg-line animate-pulse" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-64 rounded-card bg-card border border-line animate-pulse" />
          <div className="h-64 rounded-card bg-card border border-line animate-pulse" />
          <div className="h-64 rounded-card bg-card border border-line animate-pulse" />
        </div>
      </div>

      {/* 4. Path + Activity Grid Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2 items-stretch">
        <div className="h-64 rounded-card bg-card border border-line animate-pulse" />
        <div className="h-64 rounded-card bg-card border border-line animate-pulse" />
      </div>
    </div>
  );
}

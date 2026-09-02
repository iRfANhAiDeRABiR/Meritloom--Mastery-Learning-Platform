export default function ExploreCoursesLoading() {
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
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

      {/* Course Grid Skeletons */}
      <div className="grid gap-6 lg:grid-cols-2 pt-2">
        <div className="h-56 rounded-[20px] bg-card border border-line animate-pulse" />
        <div className="h-56 rounded-[20px] bg-card border border-line animate-pulse" />
        <div className="h-56 rounded-[20px] bg-card border border-line animate-pulse" />
        <div className="h-56 rounded-[20px] bg-card border border-line animate-pulse" />
        <div className="h-56 rounded-[20px] bg-card border border-line animate-pulse" />
        <div className="h-56 rounded-[20px] bg-card border border-line animate-pulse" />
      </div>
    </div>
  );
}

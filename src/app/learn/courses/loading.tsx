export default function MyLearningLoading() {
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-44 rounded-xl bg-line animate-pulse" />
          <div className="h-4 w-64 rounded bg-line animate-pulse" />
        </div>
        <div className="h-9 w-32 rounded-xl bg-line animate-pulse" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex items-center gap-2 border-b border-line pb-4">
        <div className="h-9 w-28 rounded-xl bg-line animate-pulse" />
        <div className="h-9 w-28 rounded-xl bg-line animate-pulse" />
        <div className="h-9 w-24 rounded-xl bg-line animate-pulse" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="h-10 w-full max-w-md rounded-xl bg-line animate-pulse" />
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-28 rounded-xl bg-line animate-pulse" />
          <div className="h-10 w-32 rounded-xl bg-line animate-pulse" />
        </div>
      </div>

      {/* Course Grid Skeletons */}
      <div className="grid gap-6 lg:grid-cols-2 pt-2">
        <div className="h-52 rounded-[20px] bg-card border border-line animate-pulse" />
        <div className="h-52 rounded-[20px] bg-card border border-line animate-pulse" />
        <div className="h-52 rounded-[20px] bg-card border border-line animate-pulse" />
        <div className="h-52 rounded-[20px] bg-card border border-line animate-pulse" />
      </div>
    </div>
  );
}

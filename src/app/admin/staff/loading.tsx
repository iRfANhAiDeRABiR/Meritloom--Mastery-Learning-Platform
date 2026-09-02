export default function AdminStaffLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-56 rounded-lg bg-surface border border-line animate-pulse" />
          <div className="mt-2 h-4 w-80 rounded bg-surface animate-pulse" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-surface border border-line animate-pulse" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex items-center gap-2 border-b border-line pb-4">
        <div className="h-9 w-28 rounded-xl bg-surface animate-pulse" />
        <div className="h-9 w-32 rounded-xl bg-surface animate-pulse" />
        <div className="h-9 w-28 rounded-xl bg-surface animate-pulse" />
      </div>

      {/* Staff Grid Skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-2xl border border-line bg-card p-5 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}


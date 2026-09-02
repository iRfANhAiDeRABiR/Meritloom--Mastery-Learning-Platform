export default function AdminUsersLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-48 rounded-lg bg-surface border border-line animate-pulse" />
          <div className="mt-2 h-4 w-72 rounded bg-surface animate-pulse" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="h-10 flex-1 rounded-xl bg-surface border border-line animate-pulse" />
        <div className="h-10 w-32 rounded-xl bg-surface border border-line animate-pulse" />
        <div className="h-10 w-32 rounded-xl bg-surface border border-line animate-pulse" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-line bg-card overflow-hidden">
        <div className="h-12 border-b border-line bg-surface/50" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border-b border-line/60 last:border-0"
          >
            <div className="size-9 rounded-full bg-surface animate-pulse shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-4 w-40 rounded bg-surface animate-pulse" />
              <div className="h-3 w-28 rounded bg-surface/60 animate-pulse" />
            </div>
            <div className="h-6 w-20 rounded-full bg-surface animate-pulse" />
            <div className="h-6 w-16 rounded-full bg-surface animate-pulse" />
            <div className="size-8 rounded-lg bg-surface animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}


export default function AdminSystemLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-xl bg-line" />
          <div className="h-4 w-96 rounded bg-line" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-32 rounded-xl bg-line" />
          <div className="h-9 w-24 rounded-xl bg-line" />
        </div>
      </div>

      {/* Banner Skeleton */}
      <div className="h-16 w-full rounded-2xl bg-line/60" />

      {/* 4 Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl border border-line bg-surface p-5 space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-20 rounded bg-line" />
              <div className="h-4 w-14 rounded-full bg-line" />
            </div>
            <div className="h-7 w-24 rounded bg-line" />
          </div>
        ))}
      </div>

      {/* Tab bar skeleton */}
      <div className="flex gap-2 border-b border-line pb-2">
        <div className="h-8 w-24 rounded-lg bg-line" />
        <div className="h-8 w-24 rounded-lg bg-line" />
        <div className="h-8 w-24 rounded-lg bg-line" />
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-2xl border border-line bg-surface p-5" />
        <div className="h-64 rounded-2xl border border-line bg-surface p-5" />
      </div>

      {/* Table Skeleton */}
      <div className="h-64 rounded-2xl border border-line bg-surface p-5" />
    </div>
  );
}


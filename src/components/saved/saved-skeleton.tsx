export function SavedSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 pb-16 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-60 rounded-xl bg-line" />
          <div className="h-4 w-96 rounded bg-line" />
        </div>
        <div className="h-11 w-36 rounded-xl bg-line shrink-0" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="h-11 w-full flex-1 rounded-xl bg-line" />
        <div className="flex gap-2">
          <div className="h-11 w-32 rounded-xl bg-line" />
          <div className="h-11 w-28 rounded-xl bg-line" />
          <div className="h-11 w-36 rounded-xl bg-line" />
        </div>
      </div>

      {/* 6 Course Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col rounded-[20px] border border-line bg-card overflow-hidden h-[380px]"
          >
            <div className="h-48 w-full bg-surface" />
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div className="flex flex-col gap-2.5">
                <div className="h-4 w-24 rounded bg-line" />
                <div className="h-6 w-3/4 rounded bg-line" />
                <div className="h-4 w-full rounded bg-line" />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-line">
                <div className="h-4 w-28 rounded bg-line" />
                <div className="h-9 w-24 rounded-xl bg-line" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


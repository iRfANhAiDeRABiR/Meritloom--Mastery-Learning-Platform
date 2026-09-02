export default function InstructorLoading() {
  return (
    <div className="flex flex-col gap-8 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line/60 pb-6">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-64 rounded-xl bg-line" />
          <div className="h-4 w-96 rounded-lg bg-line" />
        </div>
        <div className="h-9 w-32 rounded-xl bg-line" />
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-card border border-line bg-card p-5 shadow-soft h-28"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-line" />
              <div className="size-7 rounded-lg bg-line" />
            </div>
            <div className="h-8 w-16 rounded-lg bg-line" />
          </div>
        ))}
      </div>

      {/* Courses Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 rounded-lg bg-line" />
          <div className="h-4 w-20 rounded bg-line" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-card border border-line bg-card shadow-soft h-72"
            >
              <div className="h-36 w-full bg-line" />
              <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-20 rounded bg-line" />
                  <div className="h-5 w-44 rounded-lg bg-line" />
                </div>
                <div className="h-9 w-full rounded-xl bg-line" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


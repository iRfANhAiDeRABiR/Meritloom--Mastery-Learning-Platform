export function LearningPathSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="container-page pt-6 pb-2">
        <div className="h-4 w-48 rounded bg-line" />
      </div>

      {/* Hero Skeleton */}
      <div className="container-page pt-10 pb-16 flex flex-col items-center">
        <div className="h-6 w-36 rounded-full bg-line" />
        <div className="mt-5 h-12 w-3/4 max-w-xl rounded-xl bg-line" />
        <div className="mt-4 h-6 w-1/2 max-w-md rounded bg-line" />
        <div className="mt-8 flex gap-4">
          <div className="h-11 w-44 rounded-xl bg-line" />
          <div className="h-11 w-36 rounded-xl bg-line" />
        </div>
      </div>

      {/* Metadata Bar Skeleton */}
      <div className="container-page pb-12">
        <div className="mx-auto max-w-4xl h-20 rounded-2xl bg-line" />
      </div>

      {/* Roadmap Skeleton */}
      <div className="container-page py-16 max-w-6xl">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-64 rounded bg-line" />
          <div className="h-5 w-80 rounded bg-line" />
        </div>

        <div className="mt-16 space-y-16">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="h-56 rounded-[22px] bg-line" />
              <div className="hidden md:block h-56 rounded-[22px] bg-line/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

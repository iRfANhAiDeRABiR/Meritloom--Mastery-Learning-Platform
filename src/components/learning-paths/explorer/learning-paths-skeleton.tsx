export function LearningPathsSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Hero Skeleton */}
      <div className="container-page py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <div className="h-6 w-32 rounded-full bg-line" />
          <div className="h-12 w-3/4 rounded-xl bg-line" />
          <div className="h-6 w-full max-w-md rounded bg-line" />
          <div className="h-11 w-48 rounded-xl bg-line" />
        </div>
        <div className="h-72 rounded-[26px] bg-line/60" />
      </div>

      {/* Featured Card Skeleton */}
      <div className="container-page py-12">
        <div className="h-80 rounded-[26px] bg-line/40" />
      </div>

      {/* Grid Skeleton */}
      <div className="container-page py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 rounded-[24px] bg-line/50" />
          ))}
        </div>
      </div>
    </div>
  );
}

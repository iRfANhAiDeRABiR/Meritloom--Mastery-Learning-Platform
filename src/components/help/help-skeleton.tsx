export function HelpSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Hero Skeleton */}
      <div className="container-page py-16 flex flex-col items-center">
        <div className="h-6 w-32 rounded-full bg-line" />
        <div className="mt-4 h-12 w-3/4 max-w-md rounded-xl bg-line" />
        <div className="mt-4 h-6 w-1/2 max-w-sm rounded bg-line" />
        <div className="mt-8 h-14 w-full max-w-2xl rounded-2xl bg-line" />
      </div>

      {/* Grid Skeleton */}
      <div className="container-page py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 rounded-[22px] bg-line/50" />
          ))}
        </div>
      </div>
    </div>
  );
}

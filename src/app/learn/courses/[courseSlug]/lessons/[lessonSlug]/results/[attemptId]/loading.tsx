export default function QuizResultsLoading() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 sm:gap-10 p-4 sm:p-6 lg:p-10 animate-pulse">
      {/* Breadcrumb & Heading Skeleton */}
      <div className="flex flex-col gap-3">
        <div className="h-4 w-64 rounded bg-line" />
        <div className="h-8 w-72 rounded-xl bg-line" />
        <div className="h-4 w-96 rounded bg-line" />
      </div>

      {/* Hero Skeleton */}
      <div className="w-full rounded-[24px] border border-line bg-card p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-4 w-full max-w-lg">
          <div className="h-5 w-36 rounded bg-line" />
          <div className="h-8 w-full rounded-xl bg-line" />
          <div className="h-4 w-5/6 rounded bg-line" />
          <div className="flex gap-3 pt-2">
            <div className="h-11 w-36 rounded-xl bg-line" />
            <div className="h-11 w-32 rounded-xl bg-line" />
          </div>
        </div>
        <div className="size-40 rounded-full bg-line shrink-0" />
      </div>

      {/* 3 Concept Cards Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="h-6 w-44 rounded bg-line" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-[18px] border border-line bg-card" />
          ))}
        </div>
      </div>

      {/* 3 Recommendation Cards Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="h-6 w-48 rounded bg-line" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-[18px] border border-line bg-card" />
          ))}
        </div>
      </div>

      {/* Question Review Skeleton */}
      <div className="flex flex-col gap-4 pt-4 border-t border-line">
        <div className="h-6 w-52 rounded bg-line" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-[18px] border border-line bg-card" />
        ))}
      </div>
    </div>
  );
}


export function QuizSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="h-8 w-28 rounded-xl bg-line" />
        <div className="flex flex-col gap-2">
          <div className="h-5 w-40 rounded bg-line" />
          <div className="h-8 w-72 rounded-xl bg-line" />
          <div className="h-4 w-96 rounded bg-line" />
        </div>
      </div>

      {/* Progress Skeleton */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="h-4 w-28 rounded bg-line" />
          <div className="h-4 w-12 rounded bg-line" />
        </div>
        <div className="h-2 w-full rounded-full bg-line" />
      </div>

      {/* Card Skeleton */}
      <div className="w-full rounded-[20px] border border-line bg-card p-6 sm:p-10 flex flex-col gap-6">
        <div className="h-4 w-36 rounded bg-line" />
        <div className="h-7 w-3/4 rounded-xl bg-line" />
        <div className="h-32 w-full rounded-xl bg-surface" />

        {/* 4 Option rows */}
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 w-full rounded-xl bg-surface border border-line" />
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-end pt-4 border-t border-line">
          <div className="h-11 w-36 rounded-xl bg-line" />
        </div>
      </div>
    </div>
  );
}


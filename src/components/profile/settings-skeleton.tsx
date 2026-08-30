export function SettingsSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 sm:gap-8 pb-16 animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="h-8 w-64 rounded-xl bg-line" />
        <div className="h-4 w-96 rounded bg-line" />
      </div>

      {/* 2-Column */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        {/* Nav Skeleton */}
        <div className="flex md:flex-col gap-2 w-full md:w-56 shrink-0 overflow-x-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-11 w-full rounded-xl bg-surface border border-line" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="w-full flex-1 flex flex-col gap-6">
          <div className="h-32 rounded-[18px] border border-line bg-card" />
          <div className="h-48 rounded-[18px] border border-line bg-card" />
          <div className="flex justify-end">
            <div className="h-11 w-32 rounded-xl bg-line" />
          </div>
        </div>
      </div>
    </div>
  );
}


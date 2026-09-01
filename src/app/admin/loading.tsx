export default function AdminLoading() {
  return (
    <div className="flex min-h-dvh bg-[#0B0F19] text-white">
      {/* Admin Sidebar Skeleton */}
      <div className="hidden lg:block lg:w-64 shrink-0 bg-[#0F172A] p-5 border-r border-[#1E293B]">
        <div className="h-8 w-32 rounded bg-white/10 animate-pulse" />
        <div className="mt-8 flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-9 w-full rounded bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        <div className="flex h-16 w-full items-center justify-between border-b border-[#1E293B] px-6">
          <div className="h-6 w-36 rounded bg-white/10 animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 rounded bg-white/10 animate-pulse" />
            <div className="size-8 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>

        <div className="p-6 lg:p-8 flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-[#1E293B]/40 border border-[#1E293B] animate-pulse" />
            ))}
          </div>

          <div className="h-80 rounded-xl bg-[#1E293B]/40 border border-[#1E293B] animate-pulse" />
        </div>
      </div>
    </div>
  );
}


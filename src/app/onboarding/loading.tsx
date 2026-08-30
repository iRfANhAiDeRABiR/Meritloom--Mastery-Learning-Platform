export default function OnboardingLoading() {
  return (
    <div className="flex min-h-dvh bg-background text-ink">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:block lg:w-[280px] shrink-0 bg-[#10172A] p-7">
        <div className="h-9 w-32 rounded-xl bg-white/10 animate-pulse" />
        <div className="mt-16 flex flex-col gap-8">
          <div className="h-12 w-full rounded-xl bg-white/10 animate-pulse" />
          <div className="h-12 w-full rounded-xl bg-white/10 animate-pulse" />
          <div className="h-12 w-full rounded-xl bg-white/10 animate-pulse" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-10 lg:p-12">
        <div className="flex justify-end">
          <div className="size-10 rounded-full bg-line animate-pulse" />
        </div>

        <div className="mx-auto my-auto flex w-full max-w-3xl flex-col gap-6">
          <div className="h-6 w-24 rounded-full bg-line animate-pulse" />
          <div className="h-10 w-3/4 max-w-md rounded-xl bg-line animate-pulse" />
          <div className="h-5 w-full max-w-lg rounded bg-line animate-pulse" />

          <div className="grid gap-3 sm:grid-cols-3 pt-4">
            <div className="h-36 rounded-2xl bg-card border border-line animate-pulse" />
            <div className="h-36 rounded-2xl bg-card border border-line animate-pulse" />
            <div className="h-36 rounded-2xl bg-card border border-line animate-pulse" />
          </div>
        </div>

        <div className="h-4 w-48 mx-auto rounded bg-line animate-pulse" />
      </div>
    </div>
  );
}


import { CourseGridSkeleton } from "@/components/courses/course-grid-skeleton";

export default function CoursesLoading() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-ink">
      {/* Header Placeholder */}
      <div className="h-16 w-full border-b border-line bg-background/80 lg:h-[72px]" />

      <main className="flex-1">
        {/* Dark Hero Placeholder */}
        <div className="relative overflow-hidden bg-[#0B1020] py-16 text-white sm:py-20 lg:py-24">
          <div className="container-page flex flex-col items-center text-center">
            <div className="h-6 w-36 rounded-full bg-white/10 animate-pulse" />
            <div className="mt-6 h-12 w-3/4 max-w-lg rounded-xl bg-white/10 animate-pulse" />
            <div className="mt-4 h-5 w-2/3 max-w-md rounded-lg bg-white/10 animate-pulse" />
            <div className="mt-8 h-13 w-full max-w-2xl rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container-page py-8 sm:py-10">
          {/* Category Chips Skeleton */}
          <div className="flex gap-2 pb-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-24 rounded-full bg-line/60 animate-pulse shrink-0"
              />
            ))}
          </div>

          {/* Controls Bar Skeleton */}
          <div className="flex items-center justify-between border-b border-line pb-4 pt-2">
            <div className="h-4 w-28 rounded bg-line animate-pulse" />
            <div className="flex gap-2">
              <div className="h-9 w-28 rounded-full bg-line animate-pulse" />
              <div className="h-9 w-28 rounded-full bg-line animate-pulse" />
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="pt-8">
            <CourseGridSkeleton count={6} />
          </div>
        </div>
      </main>

      {/* Footer Placeholder */}
      <div className="h-48 w-full border-t border-line bg-card" />
    </div>
  );
}


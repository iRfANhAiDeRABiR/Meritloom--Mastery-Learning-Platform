export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Hero Skeleton */}
      <div className="container-page py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <div className="h-6 w-36 rounded-full bg-line" />
          <div className="h-12 w-3/4 rounded-xl bg-line" />
          <div className="h-6 w-full max-w-md rounded bg-line" />
          <div className="h-11 w-48 rounded-xl bg-line" />
        </div>
        <div className="h-72 rounded-[26px] bg-line/60" />
      </div>

      {/* Content Skeleton */}
      <div className="container-page py-16 space-y-12">
        <div className="h-56 rounded-[24px] bg-line/40" />
        <div className="h-56 rounded-[24px] bg-line/40" />
      </div>
    </div>
  );
}

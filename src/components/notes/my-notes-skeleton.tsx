export function MyNotesSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-60 rounded-xl bg-surface-elevated" />
          <div className="h-4 w-96 rounded-lg bg-surface-elevated/60" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-surface-elevated" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-11 w-64 rounded-2xl bg-surface-elevated" />
        <div className="h-10 w-64 rounded-xl bg-surface-elevated" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-56 rounded-3xl border border-line bg-surface p-6 space-y-4">
            <div className="flex justify-between">
              <div className="h-4 w-32 rounded bg-surface-elevated" />
              <div className="h-4 w-16 rounded bg-surface-elevated" />
            </div>
            <div className="h-6 w-48 rounded bg-surface-elevated" />
            <div className="h-20 rounded-2xl bg-surface-elevated/40" />
          </div>
        ))}
      </div>
    </div>
  );
}

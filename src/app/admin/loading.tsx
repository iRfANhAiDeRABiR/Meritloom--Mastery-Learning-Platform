export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-[#1E293B]/40 border border-[#1E293B] animate-pulse"
          />
        ))}
      </div>

      <div className="h-80 rounded-xl bg-[#1E293B]/40 border border-[#1E293B] animate-pulse" />
    </div>
  );
}

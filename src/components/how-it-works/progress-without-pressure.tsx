export function ProgressWithoutPressure() {
  const days = [
    { day: "Mon", active: true },
    { day: "Tue", active: false },
    { day: "Wed", active: true },
    { day: "Thu", active: true },
    { day: "Fri", active: false },
    { day: "Sat", active: true },
    { day: "Sun", active: false },
  ];

  return (
    <section aria-labelledby="pressure-heading" className="section-py bg-surface/50 transition-colors border-t border-line/60">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            Calm Learning
          </span>
          <h2 id="pressure-heading" className="heading-2 mt-2 text-ink">
            Progress that helps — not pressures
          </h2>
          <p className="lead-text mt-3 max-w-lg text-muted text-base sm:text-lg">
            See what you&apos;ve completed and where to continue without XP, leaderboards, or artificial learning streak pressure.
          </p>
        </div>

        {/* Clean Dashboard Visual */}
        <div className="mt-12 max-w-3xl mx-auto rounded-[24px] border border-line bg-card p-6 sm:p-8 shadow-soft">
          <div className="grid gap-6 sm:grid-cols-3 text-center border-b border-line pb-6">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-primary">2</p>
              <p className="text-xs font-semibold text-muted mt-1">Courses in progress</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-mint-ink">1</p>
              <p className="text-xs font-semibold text-muted mt-1">Courses completed</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-ink">31</p>
              <p className="text-xs font-semibold text-muted mt-1">Lessons completed</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Weekly Activity</span>
              <span className="text-xs text-muted">Personal reflection</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              {days.map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-1.5 flex-1">
                  <div
                    className={`size-8 sm:size-9 rounded-lg grid place-items-center text-xs font-bold transition-colors ${
                      item.active
                        ? "bg-primary text-white shadow-xs"
                        : "bg-surface text-muted/60 border border-line"
                    }`}
                  >
                    {item.active ? "●" : "○"}
                  </div>
                  <span className="text-[11px] font-semibold text-muted">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

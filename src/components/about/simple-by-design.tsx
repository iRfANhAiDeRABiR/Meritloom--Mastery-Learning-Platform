export function SimpleByDesign() {
  const chips = [
    "No enterprise dashboards",
    "No organization administration",
    "No competitive leaderboards",
    "No learning paywalls",
    "No complicated points systems",
  ];

  return (
    <section aria-labelledby="simple-heading" className="py-14 sm:py-20 transition-colors">
      <div className="container-page max-w-3xl text-center">
        <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
          Our Scope
        </span>
        <h2 id="simple-heading" className="heading-2 mt-2 text-ink">
          Simple by design
        </h2>
        <p className="lead-text mt-3 text-muted text-base sm:text-lg max-w-lg mx-auto">
          Meritloom is not trying to become a complicated corporate LMS.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {chips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-muted"
            >
              {chip}
            </span>
          ))}
        </div>

        <p className="mt-8 text-base font-bold text-ink">
          Just courses, practice, progress, and clear paths forward.
        </p>
      </div>
    </section>
  );
}

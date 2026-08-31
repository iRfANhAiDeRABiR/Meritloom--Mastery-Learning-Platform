export function MeritloomComparison() {
  const rows = [
    {
      typical: "Long unstructured video playlists",
      meritloom: "Lessons organized into clear modules with key takeaways",
    },
    {
      typical: "Passive watching without retention checks",
      meritloom: "Learn, practice, and review with instant feedback",
    },
    {
      typical: "Unsure what to study after finishing a tutorial",
      meritloom: "Guided Learning Paths connecting related skills",
    },
    {
      typical: "Progress tied to points, streaks, and artificial pressure",
      meritloom: "Simple course and lesson progress designed to help you resume",
    },
    {
      typical: "Essential lessons locked behind premium subscriptions",
      meritloom: "Published Meritloom learning content is completely free",
    },
  ];

  return (
    <section aria-labelledby="comparison-heading" className="section-py transition-colors">
      <div className="container-page max-w-4xl">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            The Difference
          </span>
          <h2 id="comparison-heading" className="heading-2 mt-2 text-ink">
            Built around learning, not subscriptions
          </h2>
          <p className="lead-text mt-3 max-w-lg text-muted text-base sm:text-lg">
            We focus on providing clarity and practical capability without artificial friction.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[24px] border border-line bg-card shadow-soft">
          {/* Header Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-line bg-surface/70 p-4 sm:p-5 text-xs font-extrabold uppercase tracking-wider">
            <div className="text-muted">Typical Online Learning</div>
            <div className="text-primary mt-2 sm:mt-0">With Meritloom</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-line">
            {rows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 text-xs sm:text-sm gap-2 sm:gap-6">
                <div className="text-muted flex items-start gap-2">
                  <span className="text-muted/60" aria-hidden="true">•</span>
                  <span>{row.typical}</span>
                </div>
                <div className="text-ink font-semibold flex items-start gap-2">
                  <span className="text-primary font-bold" aria-hidden="true">✓</span>
                  <span>{row.meritloom}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { BookOpen, Compass, Layers3, Rocket } from "lucide-react";

export function MeritloomFuture() {
  const directions = [
    {
      icon: BookOpen,
      title: "More free courses",
      description: "Expanding into additional foundational programming topics and web technologies.",
    },
    {
      icon: Layers3,
      title: "More guided paths",
      description: "Curating end-to-end paths for frontend, backend, and full-stack development.",
    },
    {
      icon: Rocket,
      title: "More practical projects",
      description: "Designing hands-on exercises and portfolio capstones that reinforce core concepts.",
    },
    {
      icon: Compass,
      title: "Better learning tools",
      description: "Refining lesson summaries, key takeaways, and calm progress tracking.",
    },
  ];

  return (
    <section aria-labelledby="future-heading" className="section-py bg-surface/50 transition-colors border-y border-line/60">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            The Roadmap
          </span>
          <h2 id="future-heading" className="heading-2 mt-2 text-ink">
            Meritloom is still growing
          </h2>
          <p className="lead-text mt-3 max-w-xl text-muted text-base sm:text-lg">
            The platform will continue expanding with new free courses, Learning Paths, practice experiences, and tools that make self-paced learning clearer.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {directions.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.title}
                className="flex flex-col gap-3 rounded-container border border-line bg-card p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-lavender text-primary shadow-xs">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-base font-bold text-ink">{d.title}</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {d.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Guiding Question */}
        <div className="mt-12 text-center">
          <p className="text-sm italic text-muted max-w-lg mx-auto">
            Meritloom will continue evolving around one question:
            <br />
            <span className="font-semibold not-italic text-ink">
              &ldquo;How can learning online feel clearer and more useful?&rdquo;
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

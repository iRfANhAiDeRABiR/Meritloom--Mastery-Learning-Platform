import { CircleHelp, ListRestart, MapPinOff, SearchX } from "lucide-react";

export function LearningProblemCards() {
  const problems = [
    {
      icon: SearchX,
      title: "Too much to choose from",
      description: "It can be difficult to know which tutorial to start with or whether it matches your experience level.",
    },
    {
      icon: ListRestart,
      title: "Disconnected learning",
      description: "Videos and articles often live in different places with no logical progression connecting them.",
    },
    {
      icon: CircleHelp,
      title: "Passive watching",
      description: "Watching a video alone doesn't prove whether you actually understood and can apply the concepts.",
    },
    {
      icon: MapPinOff,
      title: "No clear next step",
      description: "After finishing one standalone tutorial, learners are often left wondering where to go next.",
    },
  ];

  return (
    <section aria-labelledby="problem-heading" className="section-py transition-colors">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            The Learning Gap
          </span>
          <h2 id="problem-heading" className="heading-2 mt-2 text-ink">
            Great content can still be hard to learn from
          </h2>
          <p className="lead-text mt-3 max-w-xl text-muted text-base sm:text-lg">
            The internet has excellent educational resources, but learners still need clear structure around them.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="flex flex-col gap-3 rounded-container border border-line bg-card p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-lavender text-primary shadow-xs">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-ink">{p.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

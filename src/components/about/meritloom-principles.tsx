import { Focus, Hammer, Route, Unlock } from "lucide-react";

export function MeritloomPrinciples() {
  const principles = [
    {
      icon: Focus,
      title: "Clarity",
      description: "Learners should always understand what they're learning, why it matters, and what they can do next.",
    },
    {
      icon: Unlock,
      title: "Access",
      description: "Published learning content should be easy to explore without artificial paywalls or trial countdowns.",
    },
    {
      icon: Hammer,
      title: "Practice",
      description: "Understanding grows when learners actively apply concepts instead of only consuming passive video streams.",
    },
    {
      icon: Route,
      title: "Direction without restriction",
      description: "Recommendations should guide learners along structured paths without preventing them from exploring freely.",
    },
  ];

  return (
    <section aria-labelledby="principles-heading" className="section-py bg-surface/50 transition-colors border-t border-line/60">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            Foundations
          </span>
          <h2 id="principles-heading" className="heading-2 mt-2 text-ink">
            What guides Meritloom
          </h2>
          <p className="lead-text mt-3 max-w-lg text-muted text-base sm:text-lg">
            Core principles shaping our platform design and learner experience.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p) => {
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

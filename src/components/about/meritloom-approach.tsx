import {
  ChartNoAxesColumnIncreasing,
  Layers3,
  Lightbulb,
  PencilLine,
  Route,
} from "lucide-react";

export function MeritloomApproach() {
  const steps = [
    {
      icon: Layers3,
      title: "Organized courses",
      description: "Related lessons are grouped into structured modules and presented in an intentional sequence.",
      step: "01",
    },
    {
      icon: Lightbulb,
      title: "Learning context",
      description: "Summaries, objectives, and key ideas help you understand the purpose of each lesson before you start.",
      step: "02",
    },
    {
      icon: PencilLine,
      title: "Practice",
      description: "Hands-on exercises and optional checkpoint questions turn passive watching into active understanding.",
      step: "03",
    },
    {
      icon: ChartNoAxesColumnIncreasing,
      title: "Progress tracking",
      description: "Meritloom remembers completed lessons and helps you easily continue whenever you return.",
      step: "04",
    },
    {
      icon: Route,
      title: "Learning Paths",
      description: "Multiple related courses connect into guided journeys when you want clear direction from start to project.",
      step: "05",
    },
  ];

  return (
    <section aria-labelledby="approach-heading" className="section-py bg-surface/50 transition-colors border-t border-line/60">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
            Our Architecture
          </span>
          <h2 id="approach-heading" className="heading-2 mt-2 text-ink">
            Structure around great learning
          </h2>
          <p className="lead-text mt-3 max-w-xl text-muted text-base sm:text-lg">
            Meritloom combines useful educational resources with a learning experience built around clarity and practice.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="flex flex-col gap-3 rounded-container border border-line bg-card p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-lavender text-primary shadow-xs">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs font-bold text-muted">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-ink">{s.title}</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

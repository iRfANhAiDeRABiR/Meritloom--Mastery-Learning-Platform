import { BookOpenCheck, Rocket, Route, Sparkles } from "lucide-react";

export function HowLearningPathsWork() {
  const steps = [
    {
      icon: Route,
      title: "Follow a clear sequence",
      description:
        "Courses are arranged in a recommended order so you know where to begin and what comes next.",
      badge: "01. Order",
      color: "text-primary bg-primary/10",
    },
    {
      icon: BookOpenCheck,
      title: "Learn through real courses",
      description:
        "Every step opens a complete Meritloom course with videos, practice, and progress tracking.",
      badge: "02. Content",
      color: "text-mint-ink bg-mint/40 dark:bg-mint/20",
    },
    {
      icon: Rocket,
      title: "Build something real",
      description:
        "Finish the path by combining your skills in a practical capstone project.",
      badge: "03. Outcome",
      color: "text-amber-500 bg-amber-500/10",
    },
  ];

  return (
    <section aria-labelledby="how-paths-work-heading" className="section-py bg-surface/60 backdrop-blur-sm transition-colors border-t border-line/60">
      <div className="container-page">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            Guided Philosophy
          </span>
          <h2 id="how-paths-work-heading" className="heading-2 mt-2 text-ink">
            How Learning Paths work
          </h2>
          <p className="lead-text mt-3 max-w-lg text-muted text-base sm:text-lg">
            Structured progression designed to take you from foundational basics to real-world capability.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="flex flex-col gap-4 rounded-container border border-line bg-card p-6 sm:p-8 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <span className={`grid size-12 place-items-center rounded-[14px] ${step.color} shadow-xs`}>
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs font-bold text-muted">
                    {step.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Important Ungated Message Banner */}
        <div className="mt-12 mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-primary/5 dark:bg-primary/10 p-6 sm:p-7 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>Learner Freedom</span>
          </div>
          <h3 className="mt-2 text-lg sm:text-xl font-bold text-ink">
            Follow the path — or learn your own way.
          </h3>
          <p className="mt-2 text-sm text-muted leading-relaxed max-w-xl mx-auto">
            Learning Paths are recommendations, not restrictions. Every published free course remains accessible to you at any time with no locked prerequisites.
          </p>
        </div>
      </div>
    </section>
  );
}

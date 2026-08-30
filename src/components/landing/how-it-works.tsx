import { SectionHeading } from "@/components/landing/section-heading";
import { howItWorksData } from "@/lib/content/landing";

/**
 * Three-step "How Meritloom Works" section.
 * Lightweight, structured steps matching the prompt instructions.
 */
export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="section-py bg-background transition-colors"
    >
      <div className="container-page">
        <SectionHeading
          id="how-heading"
          eyebrow="Simple Process"
          title={howItWorksData.heading}
          description={howItWorksData.support}
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {howItWorksData.steps.map((step, index) => {
            const isLast = index === howItWorksData.steps.length - 1;
            return (
              <div
                key={step.title}
                className="relative flex flex-col gap-5 rounded-container border border-line bg-card p-7 shadow-soft transition-all duration-200 hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-14 place-items-center rounded-[18px] bg-lavender text-primary shadow-xs">
                    <step.icon className="size-7" aria-hidden="true" />
                  </span>
                  <span className="grid size-9 place-items-center rounded-full bg-mint text-sm font-extrabold text-mint-ink">
                    0{step.stepNumber}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>

                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 size-2 rounded-full bg-primary/40"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

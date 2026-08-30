import { SectionHeading } from "@/components/landing/section-heading";
import { mainFeatures } from "@/lib/content/landing";

/**
 * Three-card feature section — Frame 3:2.
 * "A better way to learn for free"
 */
export function LearnerFeatures() {
  return (
    <section
      id="about"
      aria-labelledby="features-heading"
      className="section-py bg-background transition-colors"
    >
      <div className="container-page">
        <SectionHeading
          id="features-heading"
          eyebrow="Mastery Learning"
          title={mainFeatures.heading}
          description={mainFeatures.support}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {mainFeatures.cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-5 rounded-container border border-line bg-card p-7 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="grid size-14 place-items-center rounded-[18px] bg-lavender text-primary shadow-xs">
                <card.icon className="size-7" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-ink">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

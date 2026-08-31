import {
  LayoutTemplate,
  MousePointerClick,
  PanelsTopLeft,
  Rocket,
} from "lucide-react";
import type { LearningPathCapability } from "@/lib/types";

interface LearningPathCapabilitiesProps {
  capabilities: LearningPathCapability[];
}

export function LearningPathCapabilities({
  capabilities,
}: LearningPathCapabilitiesProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "LayoutTemplate":
        return <LayoutTemplate className="size-6 text-primary" aria-hidden="true" />;
      case "PanelsTopLeft":
        return <PanelsTopLeft className="size-6 text-mint-ink" aria-hidden="true" />;
      case "MousePointerClick":
        return <MousePointerClick className="size-6 text-amber-500" aria-hidden="true" />;
      case "Rocket":
        return <Rocket className="size-6 text-[#8B5CF6]" aria-hidden="true" />;
      default:
        return <LayoutTemplate className="size-6 text-primary" aria-hidden="true" />;
    }
  };

  return (
    <section aria-labelledby="capabilities-heading" className="section-py bg-surface/60 backdrop-blur-sm transition-colors border-y border-line/60">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <h2
            id="capabilities-heading"
            className="heading-2 max-w-xl text-ink"
          >
            What you&apos;ll be able to build
          </h2>
          <p className="lead-text mt-3 max-w-xl text-muted text-base sm:text-lg">
            By the end of this path, you&apos;ll have the foundations to create complete interactive websites from scratch.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="flex flex-col gap-4 rounded-container border border-line bg-card p-6 sm:p-7 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="grid size-12 place-items-center rounded-[14px] bg-lavender text-primary shadow-xs">
                {getIcon(cap.iconName)}
              </span>

              <div>
                <h3 className="text-lg font-bold text-ink">{cap.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {cap.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

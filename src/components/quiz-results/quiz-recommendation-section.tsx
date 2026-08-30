import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink, FileText, Sparkles } from "lucide-react";
import type { QuizRecommendation } from "@/lib/types";

interface QuizRecommendationSectionProps {
  recommendations: QuizRecommendation[];
}

export function QuizRecommendationSection({
  recommendations,
}: QuizRecommendationSectionProps) {
  if (recommendations.length === 0) return null;

  const getRecommendationIcon = (type: QuizRecommendation["type"]) => {
    switch (type) {
      case "review":
        return BookOpen;
      case "resource":
        return FileText;
      case "practice":
        return Sparkles;
      default:
        return BookOpen;
    }
  };

  return (
    <section aria-label="Recommended next steps" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
          Suggested Actions
        </span>
        <h3 className="text-xl font-bold text-ink">
          Recommended next
        </h3>
        <p className="text-xs sm:text-sm text-muted">
          Review these resources if you&apos;d like a little more practice.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => {
          const Icon = getRecommendationIcon(rec.type);
          const isExternal = rec.url.startsWith("http");

          return (
            <div
              key={rec.id}
              className="flex flex-col justify-between gap-4 rounded-[18px] border border-line bg-card p-5 shadow-soft hover:border-primary/40 transition-all group"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="grid size-8 place-items-center rounded-xl bg-lavender text-primary shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted border border-line">
                    {rec.badge}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-ink group-hover:text-primary transition-colors">
                  {rec.title}
                </h4>

                <p className="text-xs text-muted leading-relaxed">
                  {rec.description}
                </p>
              </div>

              <div className="pt-2 border-t border-line/60">
                <Link
                  href={rec.url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors"
                >
                  <span>Open {rec.type}</span>
                  {isExternal ? (
                    <ExternalLink className="size-3" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="size-3" aria-hidden="true" />
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


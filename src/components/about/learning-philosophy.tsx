import { CheckCircle2, ShieldCheck, Sparkles, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LearningPhilosophy() {
  const positives = [
    "Know exactly what you've completed",
    "Continue seamlessly where you stopped",
    "Review previous lessons anytime without restrictions",
    "Retry practice checkpoints whenever you want",
    "Learn at your own self-directed pace",
  ];

  const negatives = [
    "No XP pressure",
    "No competitive leaderboards",
    "No mandatory daily streaks",
    "No score-based lesson locking",
  ];

  return (
    <section aria-labelledby="philosophy-heading" className="section-py bg-surface/50 transition-colors border-y border-line/60">
      <div className="container-page max-w-4xl">
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="default"
            className="gap-1.5 border border-primary/20 bg-primary/10 text-primary font-bold px-3 py-1 text-xs"
          >
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>OUR LEARNING PHILOSOPHY</span>
          </Badge>

          <h2 id="philosophy-heading" className="heading-2 mt-3 text-ink">
            Progress should guide you — not pressure you.
          </h2>
          <p className="lead-text mt-3 max-w-lg text-muted text-base sm:text-lg">
            Meritloom keeps progress simple so learners can focus on understanding rather than chasing gamified points.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* Calm Product Features */}
          <div className="rounded-[24px] border border-primary/30 bg-card p-6 sm:p-8 shadow-soft">
            <h3 className="text-lg font-bold text-ink flex items-center gap-2">
              <ShieldCheck className="size-5 text-mint-ink" aria-hidden="true" />
              <span>What progress does:</span>
            </h3>
            <ul className="mt-5 space-y-3 text-xs sm:text-sm text-ink/90 font-medium">
              {positives.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-mint-ink shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Calm Learning Anti-Patterns */}
          <div className="rounded-[24px] border border-line bg-card/60 p-6 sm:p-8 shadow-soft">
            <h3 className="text-lg font-bold text-muted flex items-center gap-2">
              <XCircle className="size-5 text-muted/60" aria-hidden="true" />
              <span>What we avoid:</span>
            </h3>
            <ul className="mt-5 space-y-3 text-xs sm:text-sm text-muted">
              {negatives.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="size-1.5 rounded-full bg-muted/40" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FreeLearningModel() {
  return (
    <section aria-labelledby="free-model-heading" className="section-py transition-colors">
      <div className="container-page">
        <div className="mx-auto max-w-4xl rounded-[26px] border border-mint-ink/30 bg-gradient-to-br from-card via-card to-mint/10 p-6 sm:p-10 shadow-lift">
          <div className="flex flex-col items-center text-center">
            <Badge
              variant="default"
              className="gap-1.5 border border-mint-ink/30 bg-mint/40 text-mint-ink font-bold px-3 py-1 text-xs"
            >
              <Sparkles className="size-3.5" aria-hidden="true" />
              <span>ACCESSIBLE LEARNING</span>
            </Badge>

            <h2 id="free-model-heading" className="heading-2 mt-3 text-ink">
              Why is Meritloom free?
            </h2>
            <p className="lead-text mt-3 max-w-xl text-muted text-base sm:text-lg">
              Meritloom is designed around the belief that structured foundational learning should be accessible without forcing learners through trial countdowns or payment walls.
            </p>
          </div>

          <div className="mt-8 space-y-3 text-sm leading-relaxed text-muted text-center max-w-2xl mx-auto">
            <p>
              Meritloom&apos;s published learning content is free to access. Learners can create an account anytime to save progress, continue courses, and personalize their learning experience.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
            <div className="rounded-xl border border-line bg-surface p-4 shadow-xs">
              <p className="text-base sm:text-lg font-bold text-mint-ink">100% Free</p>
              <p className="text-xs text-muted mt-0.5">Published courses</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4 shadow-xs">
              <p className="text-base sm:text-lg font-bold text-ink">No Credit Card</p>
              <p className="text-xs text-muted mt-0.5">Zero payment barrier</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4 shadow-xs">
              <p className="text-base sm:text-lg font-bold text-primary">No Paywalls</p>
              <p className="text-xs text-muted mt-0.5">Full lesson access</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4 shadow-xs">
              <p className="text-base sm:text-lg font-bold text-ink">Self-Paced</p>
              <p className="text-xs text-muted mt-0.5">Zero countdowns</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

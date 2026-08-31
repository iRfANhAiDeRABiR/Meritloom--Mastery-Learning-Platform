import { BookOpenCheck, CreditCard, Infinity as InfinityIcon, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FreeLearningPromise() {
  const points = [
    {
      icon: CreditCard,
      title: "No payment required",
      description: "Start learning immediately without entering credit card or billing details.",
    },
    {
      icon: BookOpenCheck,
      title: "Full lesson access",
      description: "Published course lessons and checkpoints remain fully accessible without a premium plan.",
    },
    {
      icon: InfinityIcon,
      title: "Learn at your pace",
      description: "Return whenever you want and continue right where you left off with zero expiration countdowns.",
    },
  ];

  return (
    <section aria-labelledby="free-promise-heading" className="section-py transition-colors">
      <div className="container-page">
        <div className="mx-auto max-w-4xl rounded-[26px] border border-mint-ink/30 bg-gradient-to-br from-card via-card to-mint/10 p-6 sm:p-10 shadow-lift">
          <div className="flex flex-col items-center text-center">
            <Badge
              variant="default"
              className="gap-1.5 border border-mint-ink/30 bg-mint/40 text-mint-ink font-bold px-3 py-1 text-xs"
            >
              <Sparkles className="size-3.5" aria-hidden="true" />
              <span>100% FREE</span>
            </Badge>

            <h2 id="free-promise-heading" className="heading-2 mt-3 text-ink">
              Learning shouldn&apos;t be hidden behind a paywall.
            </h2>
            <p className="lead-text mt-3 max-w-xl text-muted text-base sm:text-lg">
              Every published Meritloom course is free to access. No subscriptions, trial countdowns, or payment gates.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {points.map((pt) => {
              const Icon = pt.icon;
              return (
                <div
                  key={pt.title}
                  className="flex flex-col gap-3 rounded-2xl border border-line bg-surface/70 p-5 shadow-xs text-center items-center"
                >
                  <span className="grid size-12 place-items-center rounded-xl bg-mint/30 text-mint-ink shadow-xs">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-bold text-ink">{pt.title}</h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {pt.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

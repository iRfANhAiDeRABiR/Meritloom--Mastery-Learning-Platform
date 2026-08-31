import { RefreshCw, ShieldAlert, Video, Wifi } from "lucide-react";

export function VideoTroubleshooting() {
  const steps = [
    {
      icon: RefreshCw,
      title: "1. Refresh the lesson",
      description: "A quick page refresh usually clears temporary browser caching glitches.",
    },
    {
      icon: Wifi,
      title: "2. Check your connection",
      description: "Ensure your network is stable and allows streaming from YouTube.",
    },
    {
      icon: ShieldAlert,
      title: "3. Check ad-blockers / shields",
      description: "Strict browser privacy shields or extensions may prevent embedded players from loading.",
    },
    {
      icon: Video,
      title: "4. Click 'Watch on YouTube'",
      description: "You can open the official creator video directly on YouTube using the lesson player link.",
    },
  ];

  return (
    <section id="video-troubleshooting" aria-labelledby="trouble-heading" className="section-py bg-surface/50 transition-colors border-t border-line/60">
      <div className="container-page max-w-4xl">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            Quick Diagnostic
          </span>
          <h2 id="trouble-heading" className="heading-2 mt-2 text-ink">
            Video not playing?
          </h2>
          <p className="lead-text mt-3 max-w-md text-muted text-base sm:text-lg">
            Follow these simple steps to resolve common playback problems.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="flex items-start gap-4 rounded-2xl border border-line bg-card p-5 shadow-soft"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-lavender text-primary shrink-0 shadow-xs">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink">{step.title}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

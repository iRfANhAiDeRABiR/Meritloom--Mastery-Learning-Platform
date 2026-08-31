import { CheckCircle2, ExternalLink, Tv } from "lucide-react";

export function ContentTransparency() {
  const additions = [
    "Course organization into progressive modules",
    "Lesson summaries and learning objectives",
    "Concise key takeaways for every concept",
    "Hands-on practice exercises & code starters",
    "Checkpoint knowledge checks with feedback",
    "Automated lesson completion & progress tracking",
    "Guided multi-course Learning Paths",
  ];

  return (
    <section aria-labelledby="transparency-heading" className="section-py bg-surface/50 transition-colors border-t border-line/60">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            Open Resources
          </span>
          <h2 id="transparency-heading" className="heading-2 mt-2 text-ink">
            Built with useful learning resources
          </h2>
          <p className="lead-text mt-3 max-w-xl text-muted text-base sm:text-lg">
            Meritloom may use educational videos from trusted external creators as part of structured, guided courses.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 items-center max-w-5xl mx-auto">
          {/* Transparency Card */}
          <div className="flex flex-col gap-4 rounded-[24px] border border-primary/30 bg-card p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <ExternalLink className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-bold text-ink">Original creators stay credited</h3>
            </div>

            <p className="text-sm leading-relaxed text-muted">
              When a lesson uses an external educational video, Meritloom clearly identifies the original creator and provides a direct link to the original source.
            </p>

            {/* Mock Attribution UI */}
            <div className="mt-2 rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Tv className="size-4 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold text-ink">Video Lesson Attribution</p>
                    <p className="text-[11px] text-muted">Tutorial by W3Schools.com</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
                  Watch on YouTube <ExternalLink className="size-3" />
                </span>
              </div>
            </div>
          </div>

          {/* What Meritloom Adds */}
          <div className="flex flex-col gap-4 rounded-[24px] border border-line bg-card p-6 sm:p-8 shadow-soft">
            <h3 className="text-xl font-bold text-ink">What Meritloom adds:</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-ink/90 font-medium">
              {additions.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-primary shrink-0" aria-hidden="true" />
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

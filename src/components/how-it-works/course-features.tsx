import {
  ChartNoAxesColumnIncreasing,
  CircleHelp,
  Lightbulb,
  ListTree,
  PencilLine,
  Tv,
} from "lucide-react";

export function CourseFeatures() {
  const features = [
    {
      icon: ListTree,
      title: "Structured modules",
      description: "Related lessons are organized into a clear sequence instead of one long unstructured video list.",
    },
    {
      icon: Lightbulb,
      title: "Key ideas",
      description: "Short summaries and learning objectives help you immediately understand core concepts in every lesson.",
    },
    {
      icon: PencilLine,
      title: "Practical exercises",
      description: "Apply concepts through hands-on practice, starter code, and active coding instead of passive viewing.",
    },
    {
      icon: CircleHelp,
      title: "Knowledge checks",
      description: "Optional checkpoint questions help you test your understanding and review detailed explanations.",
    },
    {
      icon: ChartNoAxesColumnIncreasing,
      title: "Progress tracking",
      description: "Meritloom remembers where you stopped and exactly what you've already completed.",
    },
  ];

  return (
    <section aria-labelledby="inside-course-heading" className="section-py transition-colors">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            Enhanced Experience
          </span>
          <h2 id="inside-course-heading" className="heading-2 mt-2 text-ink">
            More than a video playlist
          </h2>
          <p className="lead-text mt-3 max-w-lg text-muted text-base sm:text-lg">
            Meritloom transforms high-quality educational videos into structured, interactive courses.
          </p>
        </div>

        {/* 5 Feature Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="flex flex-col gap-3 rounded-container border border-line bg-card p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-lavender text-primary shadow-xs">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-ink">{feat.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}

          {/* 6th Card: Educational Transparency Note */}
          <div className="flex flex-col gap-3 rounded-container border border-primary/20 bg-primary/5 dark:bg-primary/10 p-6 shadow-soft">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/20 text-primary shadow-xs">
              <Tv className="size-5" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-bold text-ink">Content Transparency</h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Some Meritloom courses use educational videos from trusted external creators such as W3Schools. Meritloom organizes these videos into structured learning experiences with original summaries, practice, and progress tracking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

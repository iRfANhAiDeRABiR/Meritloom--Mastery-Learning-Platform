import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function LearningPathsHomeSection() {
  return (
    <section
      aria-labelledby="home-paths-heading"
      className="section-py bg-surface/60 backdrop-blur-sm transition-colors border-y border-line/60"
    >
      <div className="container-page">
        <div className="mx-auto max-w-5xl rounded-[26px] border border-primary/30 bg-gradient-to-br from-card via-card to-primary/10 p-6 sm:p-10 shadow-lift">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            {/* Left Content */}
            <div className="flex flex-col items-start gap-4">
              <Badge
                variant="default"
                className="gap-1.5 border border-primary/20 bg-primary/10 text-primary font-bold px-3 py-1 text-xs"
              >
                <Route className="size-3.5" aria-hidden="true" />
                <span>GUIDED JOURNEY</span>
              </Badge>

              <div>
                <h2 id="home-paths-heading" className="heading-2 text-ink">
                  Follow a Learning Path
                </h2>
                <p className="lead-text mt-2 text-muted text-sm sm:text-base">
                  Not sure what to learn next? Follow a guided sequence from foundations to a real project.
                </p>
              </div>

              {/* Technology Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-500">
                  HTML5
                </span>
                <span className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-xs font-bold text-cyan-500">
                  CSS3
                </span>
                <span className="rounded-lg bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 text-xs font-bold text-amber-400">
                  JavaScript
                </span>
                <span className="rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-bold text-primary">
                  Interactive Project
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="gap-2 font-bold shadow-soft hover:-translate-y-0.5 transition-transform"
                >
                  <Link href={routes.learningPaths.index}>
                    <span>Explore Learning Paths</span>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="hover:-translate-y-0.5 transition-transform"
                >
                  <Link href="/learning-paths/web-development-foundations">
                    <span>View Web Dev Path</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Card / Mini Highlight */}
            <div className="flex flex-col rounded-2xl border border-line bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Featured Path
                </span>
                <span className="rounded-full bg-mint/40 dark:bg-mint/20 px-2.5 py-0.5 text-[10px] font-bold text-mint-ink">
                  100% Free
                </span>
              </div>

              <h3 className="mt-3 text-lg font-bold text-ink">
                Web Development Foundations
              </h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Progress smoothly through HTML, CSS, and JavaScript with structured lessons and practical checkpoints.
              </p>

              <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-muted pt-3 border-t border-line/60">
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="size-3.5 text-primary" aria-hidden="true" />
                  <span>3 Courses + Project</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5 text-[#8B5CF6]" aria-hidden="true" />
                  <span>Self-paced</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

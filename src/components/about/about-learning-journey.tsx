import Link from "next/link";
import { ArrowRight, Braces, Code2, Palette, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutLearningJourney() {
  return (
    <section aria-labelledby="about-journey-heading" className="section-py transition-colors">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            The Flow
          </span>
          <h2 id="about-journey-heading" className="heading-2 mt-2 text-ink">
            From your first lesson to something you can build
          </h2>
          <p className="lead-text mt-3 max-w-lg text-muted text-base sm:text-lg">
            Meritloom connects foundational concepts into real practical milestones.
          </p>
        </div>

        {/* Real Example: Web Dev Foundations */}
        <div className="mt-12 max-w-4xl mx-auto rounded-[26px] border border-line bg-card p-6 sm:p-10 shadow-soft">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Example Pathway
            </span>
            <span className="text-xs font-semibold text-muted">
              Web Development Foundations
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-center">
              <span className="grid size-10 place-items-center rounded-xl bg-amber-500/15 text-amber-500">
                <Code2 className="size-5" />
              </span>
              <p className="text-xs font-bold text-ink">1. HTML Fundamentals</p>
              <p className="text-[10px] text-muted">Structure & tags</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4 text-center">
              <span className="grid size-10 place-items-center rounded-xl bg-cyan-500/15 text-cyan-500">
                <Palette className="size-5" />
              </span>
              <p className="text-xs font-bold text-ink">2. CSS Fundamentals</p>
              <p className="text-[10px] text-muted">Styling & layouts</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-center">
              <span className="grid size-10 place-items-center rounded-xl bg-amber-400/15 text-amber-500">
                <Braces className="size-5" />
              </span>
              <p className="text-xs font-bold text-ink">3. JS Fundamentals</p>
              <p className="text-[10px] text-muted">Interactivity & DOM</p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 p-4 text-center">
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-white">
                <Rocket className="size-5 text-amber-300" />
              </span>
              <p className="text-xs font-bold text-ink">4. Capstone Project</p>
              <p className="text-[10px] text-muted">Portfolio website</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button asChild size="sm" className="gap-1.5 font-bold shadow-xs">
              <Link href="/learning-paths/web-development-foundations">
                <span>View Web Development Foundations</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

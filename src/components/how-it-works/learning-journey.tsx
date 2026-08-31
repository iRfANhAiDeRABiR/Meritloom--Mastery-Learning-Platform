import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  Code2,
  Compass,
  PlayCircle,
  Rocket,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function LearningJourney() {
  return (
    <section aria-labelledby="journey-heading" className="section-py bg-surface/50 transition-colors border-y border-line/60">
      <div className="container-page max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="default"
            className="border border-primary/20 bg-primary/10 text-primary font-bold px-3 py-1 text-xs"
          >
            STEP-BY-STEP
          </Badge>
          <h2 id="journey-heading" className="heading-2 mt-3 text-ink">
            How learning works
          </h2>
          <p className="lead-text mt-3 max-w-lg text-muted text-base sm:text-lg">
            Meritloom keeps the process simple so you can focus on understanding and building real skills.
          </p>
        </div>

        <div className="mt-16 space-y-16 lg:space-y-24">
          {/* STEP 1 */}
          <div className="grid gap-8 items-center md:grid-cols-2">
            <div className="flex flex-col items-start gap-4">
              <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-primary">
                STEP 01
              </span>
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-[14px] bg-primary/10 text-primary">
                  <Compass className="size-6" aria-hidden="true" />
                </span>
                <h3 className="text-2xl font-bold text-ink">
                  Choose what you want to learn
                </h3>
              </div>
              <p className="text-muted leading-relaxed">
                Browse free courses or follow a Learning Path when you want a guided sequence across several related technologies.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                <Button asChild size="sm" className="font-bold">
                  <Link href={routes.courses.index}>Browse courses</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="font-bold">
                  <Link href={routes.learningPaths.index}>Explore Learning Paths</Link>
                </Button>
              </div>
            </div>

            {/* Step 1 Visual Mockup */}
            <div className="rounded-[22px] border border-line bg-card p-5 sm:p-6 shadow-soft">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Catalog Preview</span>
                <span className="text-[11px] font-bold text-primary">Self-Paced</span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-line bg-surface p-3">
                  <div>
                    <p className="text-xs font-bold text-ink">HTML Fundamentals</p>
                    <p className="text-[10px] text-muted">23 lessons · Beginner</p>
                  </div>
                  <span className="text-[10px] font-bold text-mint-ink bg-mint/30 px-2 py-0.5 rounded">Free</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-line bg-surface p-3">
                  <div>
                    <p className="text-xs font-bold text-ink">Web Development Foundations</p>
                    <p className="text-[10px] text-muted">3 Courses + Final Project</p>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-lavender px-2 py-0.5 rounded">Path</span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="grid gap-8 items-center md:grid-cols-2">
            {/* Step 2 Visual Mockup (Left on Desktop) */}
            <div className="order-2 md:order-1 rounded-[22px] border border-line bg-card p-5 sm:p-6 shadow-soft">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Module 2 — CSS Colors</span>
                <span className="text-[11px] font-medium text-muted">Lesson 3 of 4</span>
              </div>
              <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <PlayCircle className="size-5 text-primary" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-ink">Lesson 3: HEX Color Codes</p>
                      <p className="text-[10px] text-muted">Video lesson + Key Takeaway</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-muted">8 min</span>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 flex flex-col items-start gap-4">
              <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-primary">
                STEP 02
              </span>
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-[14px] bg-amber-500/10 text-amber-500">
                  <PlayCircle className="size-6" aria-hidden="true" />
                </span>
                <h3 className="text-2xl font-bold text-ink">
                  Learn one lesson at a time
                </h3>
              </div>
              <p className="text-muted leading-relaxed">
                Each course is broken into clear modules and concise video lessons accompanied by key takeaways so you never feel lost.
              </p>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="grid gap-8 items-center md:grid-cols-2">
            <div className="flex flex-col items-start gap-4">
              <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-primary">
                STEP 03
              </span>
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-[14px] bg-cyan-500/10 text-cyan-500">
                  <Code2 className="size-6" aria-hidden="true" />
                </span>
                <h3 className="text-2xl font-bold text-ink">
                  Practice what you learn
                </h3>
              </div>
              <p className="text-muted leading-relaxed">
                Use exercises, code walkthroughs, and optional checkpoint knowledge checks to test your understanding without stress or penalties.
              </p>
            </div>

            {/* Step 3 Visual Mockup */}
            <div className="rounded-[22px] border border-line bg-card p-5 sm:p-6 shadow-soft">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-xs font-bold text-cyan-500 uppercase tracking-wider">Quick Knowledge Check</span>
                <span className="text-[11px] font-bold text-muted">Question 4 of 6</span>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-ink">Which CSS property sets the background color?</p>
                <div className="rounded-lg border border-primary/40 bg-primary/10 p-2.5 text-xs font-medium text-primary flex items-center justify-between">
                  <span>background-color</span>
                  <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                </div>
                <div className="rounded-lg border border-line bg-surface p-2.5 text-xs font-medium text-muted">
                  <span>color</span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4 */}
          <div className="grid gap-8 items-center md:grid-cols-2">
            {/* Step 4 Visual Mockup (Left on Desktop) */}
            <div className="order-2 md:order-1 rounded-[22px] border border-line bg-card p-5 sm:p-6 shadow-soft">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Course Progress</span>
                <span className="text-[11px] font-bold text-primary">50% Complete</span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-xs font-semibold text-muted">
                  <span>HTML Fundamentals</span>
                  <span className="text-ink">12 of 24 lessons</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                  <div className="h-full w-1/2 rounded-full bg-primary" />
                </div>
                <div className="pt-2">
                  <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs font-bold">
                    <span>Continue lesson</span>
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 flex flex-col items-start gap-4">
              <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-primary">
                STEP 04
              </span>
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-[14px] bg-mint/30 text-mint-ink">
                  <ChartNoAxesColumnIncreasing className="size-6" aria-hidden="true" />
                </span>
                <h3 className="text-2xl font-bold text-ink">
                  Your progress stays organized
                </h3>
              </div>
              <p className="text-muted leading-relaxed">
                Meritloom automatically remembers where you stopped, tracking completed lessons so you can jump right back in anytime.
              </p>
            </div>
          </div>

          {/* STEP 5 */}
          <div className="grid gap-8 items-center md:grid-cols-2">
            <div className="flex flex-col items-start gap-4">
              <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-primary">
                STEP 05
              </span>
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-[14px] bg-[#8B5CF6]/10 text-[#8B5CF6]">
                  <Rocket className="size-6" aria-hidden="true" />
                </span>
                <h3 className="text-2xl font-bold text-ink">
                  Turn learning into something real
                </h3>
              </div>
              <p className="text-muted leading-relaxed">
                Combine the concepts you&apos;ve learned across HTML, CSS, and JavaScript into a portfolio-worthy capstone project.
              </p>
            </div>

            {/* Step 5 Visual Mockup */}
            <div className="rounded-[22px] border border-primary/40 bg-gradient-to-br from-primary via-primary-700 to-indigo-950 p-5 sm:p-6 text-white shadow-lift">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Capstone Milestone</span>
                <span className="text-[11px] font-bold text-white/90">Portfolio</span>
              </div>
              <div className="mt-4">
                <h4 className="text-base font-bold text-white">Interactive Personal Website</h4>
                <p className="mt-1 text-xs text-white/80">
                  Combine HTML structure, CSS layouts, and JavaScript behavior in one complete project.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-white/90">
                  <span>HTML ✓</span>
                  <span>→</span>
                  <span>CSS ✓</span>
                  <span>→</span>
                  <span>JS ✓</span>
                  <span>→</span>
                  <span className="font-bold text-amber-300">Project 🚀</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

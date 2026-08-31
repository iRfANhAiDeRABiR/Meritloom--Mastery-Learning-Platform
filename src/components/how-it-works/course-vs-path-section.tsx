import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function CourseVsPathSection() {
  return (
    <section aria-labelledby="choose-way-heading" className="section-py bg-surface/50 transition-colors border-y border-line/60">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            Flexible Structure
          </span>
          <h2 id="choose-way-heading" className="heading-2 mt-2 text-ink">
            Choose your own way to learn
          </h2>
          <p className="lead-text mt-3 max-w-lg text-muted text-base sm:text-lg">
            Whether you want a deep dive on a single topic or a multi-course sequence, Meritloom adapts to your goals.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
          {/* Card 1: Course */}
          <div className="flex flex-col rounded-[24px] border border-line bg-card p-6 sm:p-8 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-[14px] bg-lavender text-primary shadow-xs">
                <BookOpen className="size-6" aria-hidden="true" />
              </span>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
                  Single Subject
                </span>
                <h3 className="text-2xl font-bold text-ink">Take a course</h3>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted leading-relaxed">
              Best when you already know the exact skill you want to learn or brush up on.
            </p>

            <div className="mt-4 rounded-xl bg-surface p-3 text-xs font-bold text-ink border border-line">
              e.g. JavaScript Fundamentals
            </div>

            <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-muted">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>Focus entirely on one topic</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>Start anytime without prerequisites</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>Learn at your own self-paced rhythm</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>Track your lesson completion</span>
              </li>
            </ul>

            <div className="flex-1" />

            <div className="mt-8 pt-4 border-t border-line">
              <Button asChild variant="outline" className="w-full gap-2 font-bold">
                <Link href={routes.courses.index}>
                  <span>Browse courses</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Card 2: Learning Path */}
          <div className="flex flex-col rounded-[24px] border border-primary/40 bg-gradient-to-br from-card via-card to-primary/10 p-6 sm:p-8 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift ring-1 ring-primary/20">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-[14px] bg-primary text-white shadow-xs">
                <Route className="size-6 text-mint" aria-hidden="true" />
              </span>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                  Structured Journey
                </span>
                <h3 className="text-2xl font-bold text-ink">Follow a Learning Path</h3>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted leading-relaxed">
              Best when you want a recommended sequence across multiple related skills.
            </p>

            <div className="mt-4 rounded-xl bg-primary/10 p-3 text-xs font-bold text-primary border border-primary/20">
              e.g. Web Development Foundations
            </div>

            <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-muted">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>Clear course ordering & sequence</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>Connect multiple related skills</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>Practical final capstone project</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>Still completely flexible with no locking</span>
              </li>
            </ul>

            <div className="flex-1" />

            <div className="mt-8 pt-4 border-t border-line">
              <Button asChild className="w-full gap-2 font-bold shadow-soft">
                <Link href={routes.learningPaths.index}>
                  <span>Explore Learning Paths</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Ungated message */}
        <div className="mt-12 text-center max-w-xl mx-auto">
          <p className="text-xs sm:text-sm font-semibold text-muted">
            <span className="text-primary font-bold">Important:</span> Learning Paths guide you — they don&apos;t lock you in. You can open any published course whenever you want.
          </p>
        </div>
      </div>
    </section>
  );
}

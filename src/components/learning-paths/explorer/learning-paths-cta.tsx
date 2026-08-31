import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function LearningPathsCTA() {
  return (
    <section aria-labelledby="paths-cta-heading" className="section-py bg-surface/40 transition-colors">
      <div className="container-page">
        <div className="relative overflow-hidden flex flex-col items-center gap-6 rounded-container bg-gradient-to-br from-primary via-primary-700 to-indigo-950 px-6 py-12 text-center text-white shadow-lift sm:px-12 sm:py-16">
          {/* Background Ambient Glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-white/10 blur-3xl animate-ambient-glow"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -bottom-24 size-80 rounded-full bg-mint/10 blur-3xl animate-ambient-glow"
            style={{ animationDelay: "3s" }}
          />

          <h2 id="paths-cta-heading" className="heading-2 max-w-xl text-white">
            Ready to start your learning journey?
          </h2>
          <p className="lead-text max-w-lg text-white/90 text-sm sm:text-base">
            Choose a guided path to learn HTML, CSS, and JavaScript in the right order — 100% free and self-paced.
          </p>

          <div className="relative z-10 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 hover:text-primary active:bg-white/80 shadow-soft hover:-translate-y-0.5 transition-all font-bold"
            >
              <Link href="/learning-paths/web-development-foundations">
                <span>Start Web Dev Foundations</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 hover:-translate-y-0.5 transition-transform"
            >
              <Link href={routes.courses.index}>
                <Compass className="size-4 text-muted" aria-hidden="true" />
                <span>Explore all courses</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

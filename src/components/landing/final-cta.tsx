import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { finalCtaContent } from "@/lib/content/landing";
import { routes } from "@/lib/routes";
import type { LearnerProfile } from "@/lib/types";

/**
 * Final call-to-action section.
 * "Start learning without a paywall."
 */
export function FinalCTA({ user }: { user: LearnerProfile | null }) {
  const primaryHref = user ? routes.dashboard : routes.auth.signUp;
  const primaryLabel = user ? "Go to my learning" : finalCtaContent.primaryCta;

  return (
    <section aria-labelledby="cta-heading" className="section-py bg-surface transition-colors">
      <div className="container-page">
        <div className="relative overflow-hidden flex flex-col items-center gap-6 rounded-container bg-primary px-6 py-12 text-center text-white shadow-lift sm:px-12 sm:py-16">
          {/* Subtle animated background decorative shapes */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-2xl animate-ambient-glow"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-white/10 blur-2xl animate-ambient-glow"
            style={{ animationDelay: "3s" }}
          />

          {/* Faint floating particles */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <span className="absolute top-[20%] left-[15%] size-1.5 rounded-full bg-white/30 animate-particle-1" />
            <span className="absolute bottom-[25%] right-[20%] size-2 rounded-full bg-white/20 animate-particle-2" />
          </div>

          <h2 id="cta-heading" className="heading-2 max-w-2xl text-white">
            {finalCtaContent.heading}
          </h2>
          <p className="lead-text max-w-xl text-white/90">
            {finalCtaContent.text}
          </p>

          <div className="relative z-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 hover:text-primary active:bg-white/80 shadow-soft hover:-translate-y-0.5 transition-all font-bold">
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 hover:-translate-y-0.5 transition-transform"
            >
              <Link href={routes.anchors.courses}>
                <Compass className="size-4" aria-hidden="true" />
                {finalCtaContent.secondaryCta}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { ProductPreview } from "@/components/landing/product-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { heroBenefits, heroContent } from "@/lib/content/landing";
import { routes } from "@/lib/routes";
import type { LearnerProfile } from "@/lib/types";

/**
 * Hero Section — Frame 3:2.
 * Two-column hero layout with exact copywriting, CTA buttons,
 * three benefit items without fabricated stats, and abstract platform preview.
 */
export function HeroSection({ user }: { user: LearnerProfile | null }) {
  const startHref = user ? routes.dashboard : routes.auth.signUp;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-surface transition-colors"
    >
      {/* Soft brand glow backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5"
      />

      <div className="container-page relative grid items-center gap-12 py-14 sm:py-18 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12 lg:py-24">
        {/* Left Column: Hero Content */}
        <div className="flex max-w-xl flex-col items-start gap-6">
          <Badge variant="default" className="gap-2 py-1.5 px-3.5">
            <span
              className="size-2 rounded-full bg-primary"
              aria-hidden="true"
            />
            {heroContent.badge}
          </Badge>

          <h1
            id="hero-heading"
            className="text-4xl font-extrabold leading-[1.12] text-ink sm:text-5xl lg:text-[3.25rem]"
          >
            {heroContent.headlinePrefix}
            <span className="text-primary">{heroContent.headlineHighlight}</span>
          </h1>

          <p className="lead-text max-w-lg text-muted">
            {heroContent.support}
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg">
              <Link href={startHref}>
                {heroContent.primaryCta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={routes.anchors.courses}>
                <Compass className="size-4" aria-hidden="true" />
                {heroContent.secondaryCta}
              </Link>
            </Button>
          </div>

          {/* Three Benefit Items (No numbers/percentages/unverified claims) */}
          <ul className="flex flex-wrap items-center gap-4 pt-2 sm:gap-6">
            {heroBenefits.map((benefit) => (
              <li key={benefit.label} className="flex items-center gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-mint text-mint-ink">
                  <benefit.icon className="size-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold text-ink">
                  {benefit.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Abstract Platform Illustration */}
        <div className="flex justify-center lg:justify-end">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}

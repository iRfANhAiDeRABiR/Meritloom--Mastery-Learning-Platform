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
 * Two-column hero layout with subtle animated background lighting, floating particles,
 * and abstract platform preview.
 */
export function HeroSection({ user }: { user: LearnerProfile | null }) {
  const startHref = user ? routes.dashboard : routes.auth.signUp;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-transparent transition-colors"
    >
      {/* 1. Soft animated brand ambient glow backdrops */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[460px] w-[860px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl dark:bg-primary/10 animate-ambient-glow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-10 size-[380px] rounded-full bg-mint/15 blur-3xl dark:bg-mint/10 animate-ambient-glow"
        style={{ animationDelay: "4s" }}
      />

      {/* 2. Subtle Faint Curved Orbit Line with Glowing Node */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-24 size-[520px] rounded-full border border-primary/10 animate-orbit-spin opacity-70"
      >
        <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)] animate-orbit-node" />
      </div>

      {/* 3. Subtle Floating Particles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <span className="absolute top-[18%] left-[8%] size-1.5 rounded-full bg-primary/30 animate-particle-1" />
        <span className="absolute top-[32%] right-[14%] size-2 rounded-full bg-mint/40 animate-particle-2" />
        <span className="absolute top-[65%] left-[16%] size-1 rounded-full bg-[#8B6CFF]/35 animate-particle-3" />
        <span className="absolute top-[78%] right-[22%] size-1.5 rounded-full bg-[#C4B5FD]/40 animate-particle-4" />
        <span className="absolute top-[88%] left-[45%] size-1.5 rounded-full bg-primary/25 animate-particle-2" />
      </div>

      <div className="container-page relative grid items-center gap-12 py-14 sm:py-18 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12 lg:py-24">
        {/* Left Column: Hero Content */}
        <div className="flex max-w-xl flex-col items-start gap-6">
          <Badge variant="default" className="gap-2 py-1.5 px-3.5 shadow-xs">
            <span
              className="size-2 rounded-full bg-primary animate-pulse"
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
            <Button asChild size="lg" className="shadow-soft hover:-translate-y-0.5 transition-transform">
              <Link href={startHref}>
                {heroContent.primaryCta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover:-translate-y-0.5 transition-transform">
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
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-mint text-mint-ink shadow-xs">
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

import * as React from "react";
import { Award, CheckCircle2, HeartHandshake, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTestimonialColumns } from "@/lib/content/testimonials";
import { TestimonialColumn } from "./testimonial-column";
import { cn } from "@/lib/utils";

interface TestimonialsSectionProps {
  className?: string;
}

export function TestimonialsSection({ className }: TestimonialsSectionProps) {
  const [col1, col2, col3, col4] = getTestimonialColumns();

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className={cn(
        "relative overflow-hidden section-py bg-surface transition-colors",
        className,
      )}
    >
      {/* Decorative ambient lighting backdrops */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 h-[480px] w-[600px] rounded-full bg-primary/10 dark:bg-primary/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-1/4 h-[440px] w-[600px] rounded-full bg-mint/15 dark:bg-mint/10 blur-[120px]"
      />

      <div className="container-page relative flex flex-col items-center">
        {/* Top Eyebrow Badge */}
        <Badge
          variant="default"
          className="gap-2 border border-primary/20 bg-primary/10 dark:border-primary/30 dark:bg-primary/20 px-3.5 py-1.5 text-xs font-bold text-primary dark:text-white shadow-soft"
        >
          <Sparkles className="size-3.5 text-primary dark:text-mint" aria-hidden="true" />
          <span>Learner Success Stories</span>
        </Badge>

        {/* Section Heading */}
        <h2
          id="testimonials-heading"
          className="heading-2 mt-5 text-center text-ink max-w-2xl"
        >
          Loved by learners building <span className="text-primary">real practical skills</span>
        </h2>

        {/* Subtitle */}
        <p className="lead-text mt-4 text-center max-w-2xl text-muted">
          Students, career switchers, and designers use Meritloom to master foundations, build genuine confidence, and progress without subscriptions.
        </p>

        {/* Trust Highlight Chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-semibold text-muted">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 shadow-xs">
            <CheckCircle2 className="size-3.5 text-primary" aria-hidden="true" />
            <span>100% Free Forever</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 shadow-xs">
            <Users className="size-3.5 text-primary" aria-hidden="true" />
            <span>Beginner Friendly</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 shadow-xs">
            <Award className="size-3.5 text-primary" aria-hidden="true" />
            <span>Practical Skill Building</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 shadow-xs">
            <HeartHandshake className="size-3.5 text-primary" aria-hidden="true" />
            <span>No Paywalls or Distractions</span>
          </span>
        </div>

        {/* 4-Column Auto-Scrolling Testimonial Marquee Wall */}
        <div className="relative mt-12 w-full">
          {/* Top & Bottom Gradient Fade Masks */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-surface via-surface/80 to-transparent z-20"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-surface via-surface/80 to-transparent z-20"
          />

          {/* Columns Grid: 1 on mobile, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {/* Column 1: Upward */}
            <TestimonialColumn
              testimonials={col1}
              direction="up"
              speed="normal"
            />

            {/* Column 2: Downward (visible on tablet & desktop) */}
            <TestimonialColumn
              testimonials={col2}
              direction="down"
              speed="slow"
              className="hidden sm:flex"
            />

            {/* Column 3: Upward (visible on desktop) */}
            <TestimonialColumn
              testimonials={col3}
              direction="up"
              speed="slow"
              className="hidden lg:flex"
            />

            {/* Column 4: Downward (visible on desktop) */}
            <TestimonialColumn
              testimonials={col4}
              direction="down"
              speed="normal"
              className="hidden lg:flex"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

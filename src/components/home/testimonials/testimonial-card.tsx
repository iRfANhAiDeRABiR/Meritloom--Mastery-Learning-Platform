import * as React from "react";
import { Star } from "lucide-react";
import type { TestimonialItem } from "@/lib/content/testimonials";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  testimonial: TestimonialItem;
  className?: string;
}

export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between gap-4 rounded-2xl border border-line bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift select-none",
        className,
      )}
    >
      {/* Top: 5-Star Rating & Batch Tag */}
      <div className="flex items-center justify-between gap-2">
        <div
          className="flex items-center gap-1 text-[#FBBF24]"
          aria-label={`${testimonial.rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="size-3.5 fill-[#FBBF24] text-[#FBBF24]"
              aria-hidden="true"
            />
          ))}
        </div>

        <span className="rounded-md border border-primary/20 bg-lavender/60 dark:bg-lavender/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
          {testimonial.batch}
        </span>
      </div>

      {/* Quote */}
      <blockquote className="text-sm font-normal leading-relaxed text-ink/90">
        “{testimonial.quote}”
      </blockquote>

      {/* Author & Outcome Info */}
      <div className="flex items-center gap-3 pt-2 border-t border-line/60">
        <div
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white bg-gradient-to-br shadow-xs",
            testimonial.gradient,
          )}
          aria-hidden="true"
        >
          {testimonial.initials}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-1.5 truncate">
            <span className="truncate text-xs font-bold text-ink">
              {testimonial.name}
            </span>
          </div>

          <span className="truncate text-[11px] font-medium text-muted">
            {testimonial.role} · <span className="text-primary font-semibold">{testimonial.outcome}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

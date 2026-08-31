import * as React from "react";
import type { TestimonialItem } from "@/lib/content/testimonials";
import { TestimonialCard } from "./testimonial-card";
import { cn } from "@/lib/utils";

interface TestimonialColumnProps {
  testimonials: TestimonialItem[];
  direction?: "up" | "down";
  speed?: "normal" | "slow";
  className?: string;
}

export function TestimonialColumn({
  testimonials,
  direction = "up",
  speed = "normal",
  className,
}: TestimonialColumnProps) {
  // Duplicate array for seamless infinite looping
  const items = [...testimonials, ...testimonials];

  const animationClass =
    direction === "up"
      ? speed === "slow"
        ? "animate-marquee-up-slow"
        : "animate-marquee-up"
      : speed === "slow"
        ? "animate-marquee-down-slow"
        : "animate-marquee-down";

  return (
    <div
      className={cn(
        "marquee-column group relative flex flex-col overflow-hidden h-[640px]",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-4 will-change-transform group-hover:[animation-play-state:paused]",
          animationClass,
        )}
      >
        {items.map((item, idx) => (
          <TestimonialCard
            key={`${item.id}-${idx}`}
            testimonial={item}
          />
        ))}
      </div>
    </div>
  );
}

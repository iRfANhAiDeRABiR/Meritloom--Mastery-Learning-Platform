import * as React from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, Sparkles } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { routes } from "@/lib/routes";

const BENEFIT_ITEMS = [
  {
    icon: BookOpen,
    title: "100% Free Courses",
    description: "Structured lessons without paywalls, subscriptions, or hidden fees.",
  },
  {
    icon: CheckCircle2,
    title: "Mastery-Focused Learning",
    description: "Build deep understanding through step-by-step practical examples.",
  },
  {
    icon: Clock,
    title: "Learn At Your Own Pace",
    description: "Complete courses on your schedule with zero time pressure.",
  },
] as const;

export function AuthBrandPanel() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-[#10172A] p-8 text-white sm:p-12 lg:p-14">
      {/* Decorative ambient gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-[380px] w-[380px] rounded-full bg-primary/25 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-20 h-[360px] w-[360px] rounded-full bg-mint/15 blur-[90px]"
      />

      {/* Geometric subtle pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
      />

      {/* Top: Logo & Badge */}
      <div className="relative z-10 flex flex-col items-start gap-6">
        <Link
          href={routes.home}
          aria-label="Meritloom home"
          className="shrink-0 rounded-[10px] text-white"
        >
          <Logo />
        </Link>

        <Badge
          variant="default"
          className="gap-1.5 border border-primary/40 bg-primary/20 px-3.5 py-1 text-xs font-bold text-white shadow-soft"
        >
          <Sparkles className="size-3.5 text-mint" aria-hidden="true" />
          Welcome to Meritloom
        </Badge>
      </div>

      {/* Middle: Headline & Value Proposition */}
      <div className="relative z-10 my-auto py-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.65rem] lg:leading-[1.18]">
          Turn every learning goal into a{" "}
          <span className="bg-gradient-to-r from-primary to-lavender bg-clip-text text-transparent">
            clear path forward.
          </span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
          Learn useful skills through free, structured courses designed to help
          you understand each concept.
        </p>

        {/* Product Benefit Card (Replacing fake testimonial card) */}
        <div className="mt-8 rounded-container border border-white/15 bg-white/5 p-6 backdrop-blur-md shadow-lift">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-mint">
            Learn without barriers
          </h2>

          <div className="mt-4 flex flex-col gap-4">
            {BENEFIT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/10 text-mint mt-0.5">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom subtle footer indicator */}
      <div className="relative z-10 flex items-center justify-between text-xs text-white/50">
        <span>© {new Date().getFullYear()} Meritloom. Free learning platform.</span>
      </div>
    </div>
  );
}


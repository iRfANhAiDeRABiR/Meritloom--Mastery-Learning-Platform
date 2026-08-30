"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface OnboardingSidebarProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const STEPS = [
  {
    step: 1,
    title: "Your interests",
    description: "Choose what you want to learn",
  },
  {
    step: 2,
    title: "Your level",
    description: "Tell us where you're starting",
  },
  {
    step: 3,
    title: "Learning style",
    description: "Set your study preference",
  },
] as const;

export function OnboardingSidebar({
  currentStep,
  onStepClick,
}: OnboardingSidebarProps) {
  return (
    <aside
      aria-label="Onboarding step navigation"
      className="relative flex h-full flex-col justify-between overflow-hidden bg-[#10172A] p-7 text-white select-none border-r border-[#1E293B]"
    >
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 -top-12 size-48 rounded-full bg-primary/20 blur-[60px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 -right-12 size-48 rounded-full bg-mint/15 blur-[60px]"
      />

      {/* Top: Brand Logo */}
      <div className="relative z-10">
        <Link
          href={routes.home}
          aria-label="Meritloom home"
          className="inline-block rounded-xl p-1 text-white transition-opacity hover:opacity-90"
        >
          <Logo />
        </Link>
      </div>

      {/* Center: Vertical Steps with Connecting Line */}
      <div className="relative z-10 my-auto py-8">
        <nav aria-label="Onboarding Progress" className="flex flex-col">
          <ol className="relative flex flex-col gap-8">
            {/* Connecting Vertical Line */}
            <div
              aria-hidden="true"
              className="absolute left-4.5 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-white/15"
            />

            {STEPS.map((item) => {
              const isCompleted = item.step < currentStep;
              const isActive = item.step === currentStep;
              const isFuture = item.step > currentStep;

              return (
                <li key={item.step} className="relative flex items-start gap-4">
                  {/* Step Number / Check Icon */}
                  <button
                    type="button"
                    disabled={isFuture || !onStepClick}
                    onClick={() => onStepClick?.(item.step)}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`Step ${item.step}: ${item.title}`}
                    className={cn(
                      "relative z-10 grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold transition-all duration-200",
                      isActive
                        ? "bg-primary text-white ring-4 ring-primary/25 shadow-[0_0_14px_rgba(109,74,255,0.45)]"
                        : isCompleted
                        ? "bg-mint text-mint-ink shadow-xs cursor-pointer hover:opacity-90"
                        : "bg-[#1E293B] text-white/40 border border-white/10",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-4 stroke-[2.5]" aria-hidden="true" />
                    ) : (
                      item.step
                    )}
                  </button>

                  {/* Step Title & Description */}
                  <div className="flex flex-col text-left pt-0.5">
                    <span
                      className={cn(
                        "text-sm font-bold transition-colors",
                        isActive
                          ? "text-white"
                          : isCompleted
                          ? "text-white/90"
                          : "text-white/40",
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        "text-xs leading-relaxed transition-colors",
                        isActive
                          ? "text-white/75"
                          : isCompleted
                          ? "text-white/60"
                          : "text-white/30",
                      )}
                    >
                      {item.description}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Bottom info */}
      <div className="relative z-10 text-[11px] text-white/40">
        <span>Step {currentStep} of 3 · Personalize discovery</span>
      </div>
    </aside>
  );
}


import * as React from "react";
import { cn } from "@/lib/utils";

interface OnboardingMobileProgressProps {
  currentStep: number;
  className?: string;
}

const STEPS = [
  { step: 1, label: "Interests" },
  { step: 2, label: "Level" },
  { step: 3, label: "Style" },
];

export function OnboardingMobileProgress({
  currentStep,
  className,
}: OnboardingMobileProgressProps) {
  return (
    <div
      aria-label={`Step ${currentStep} of 3`}
      className={cn("flex w-full flex-col gap-2 lg:hidden", className)}
    >
      <div className="flex items-center justify-between text-xs font-bold text-muted">
        <span className="text-primary font-extrabold uppercase tracking-wider">
          Step {currentStep} of 3
        </span>
        <span className="text-ink">
          {STEPS[currentStep - 1]?.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {STEPS.map((s) => {
          const isCompleted = s.step < currentStep;
          const isActive = s.step === currentStep;

          return (
            <div
              key={s.step}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                isActive
                  ? "bg-primary shadow-[0_0_8px_rgba(109,74,255,0.4)]"
                  : isCompleted
                  ? "bg-mint"
                  : "bg-line",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}


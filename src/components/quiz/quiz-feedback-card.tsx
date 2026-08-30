import { CheckCircle2, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizFeedbackCardProps {
  isCorrect: boolean;
  explanation: string | null;
}

export function QuizFeedbackCard({
  isCorrect,
  explanation,
}: QuizFeedbackCardProps) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "my-2 flex items-start gap-3 rounded-[16px] border p-4 sm:p-5 transition-all shadow-xs animate-in fade-in-0 duration-200",
        isCorrect
          ? "border-[#BFE8D4] bg-[#EAF8F2] dark:border-[#205B49] dark:bg-[#12382E]"
          : "border-[#F2DCA5] bg-[#FFF8E8] dark:border-[#5A4923] dark:bg-[#332A16]",
      )}
    >
      <div className="shrink-0 mt-0.5">
        {isCorrect ? (
          <CheckCircle2
            className="size-5 text-[#147A55] dark:text-[#74E0B8]"
            aria-hidden="true"
          />
        ) : (
          <Lightbulb
            className="size-5 text-amber-700 dark:text-amber-300"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <h3
          className={cn(
            "text-xs font-bold uppercase tracking-wider",
            isCorrect
              ? "text-[#147A55] dark:text-[#74E0B8]"
              : "text-amber-800 dark:text-amber-300",
          )}
        >
          {isCorrect ? "Correct!" : "Not quite"}
        </h3>

        {explanation && (
          <p
            className={cn(
              "text-xs sm:text-sm leading-relaxed font-medium",
              isCorrect
                ? "text-[#147A55]/95 dark:text-[#74E0B8]/95"
                : "text-amber-900/90 dark:text-amber-100/90",
            )}
          >
            {explanation}
          </p>
        )}
      </div>
    </div>
  );
}

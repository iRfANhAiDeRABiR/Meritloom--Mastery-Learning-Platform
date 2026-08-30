import { cn } from "@/lib/utils";

interface QuizScoreRingProps {
  percent: number;
  correctCount: number;
  totalQuestions: number;
  size?: number;
  strokeWidth?: number;
}

export function QuizScoreRing({
  percent,
  correctCount,
  totalQuestions,
  size = 140,
  strokeWidth = 10,
}: QuizScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  // Dynamic score color: Mint for >= 80, Amber for 50-79, Warm lavender/amber for < 50
  let strokeColor = "text-[#19B99A]"; // Mint
  if (percent < 50) {
    strokeColor = "text-primary"; // Lavender/purple
  } else if (percent < 80) {
    strokeColor = "text-amber-500"; // Amber
  }

  const ariaLabel = `${correctCount} out of ${totalQuestions} questions correct, ${percent} percent`;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="relative flex items-center justify-center shrink-0 select-none"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg] transform"
      >
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-line"
        />

        {/* Dynamic Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(strokeColor, "transition-all duration-700 ease-out")}
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl sm:text-3xl font-extrabold text-ink leading-none">
          {percent}%
        </span>
        <span className="text-[11px] font-bold text-muted mt-1">
          {correctCount} / {totalQuestions}
        </span>
      </div>
    </div>
  );
}


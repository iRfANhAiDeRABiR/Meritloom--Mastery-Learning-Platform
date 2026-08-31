import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";

interface QuizHeaderProps {
  courseSlug: string;
  title: string;
  estimatedMinutes: number;
}

export function QuizHeader({
  courseSlug,
  title,
  estimatedMinutes,
}: QuizHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      {/* Back to course link */}
      <div>
        <Link
          href={`/learn/courses/${courseSlug}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-bold text-ink hover:border-primary/40 hover:text-primary transition-all shadow-xs"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          <span>Back to course</span>
        </Link>
      </div>

      {/* Main Title & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-lavender px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-primary border border-primary/20">
              Quick knowledge check
            </span>
            {estimatedMinutes > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted">
                <Clock3 className="size-3 text-muted" aria-hidden="true" />
                <span>About {estimatedMinutes} min</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-muted">
            <span>Check your understanding and review anything that feels unclear. You can retry anytime.</span>
            <Link
              href="/help#knowledge-checks"
              className="font-semibold text-primary hover:underline"
            >
              How do knowledge checks work?
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}


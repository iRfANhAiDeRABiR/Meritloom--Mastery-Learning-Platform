import Link from "next/link";
import { ArrowRight, CheckCircle2, HelpCircle, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function ContactInfo() {
  const tips = [
    "Check the Help Center first for immediate answers to common questions",
    "Include the specific page or course URL where the problem occurred",
    "Describe what you expected to happen vs what actually happened",
    "Include the exact text of any error message that appeared",
  ];

  return (
    <div className="flex flex-col gap-6 rounded-[24px] border border-line bg-card p-6 sm:p-8 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-2xl bg-lavender text-primary shadow-xs">
          <LifeBuoy className="size-6" aria-hidden="true" />
        </span>
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            Support Tips
          </span>
          <h2 className="text-xl font-bold text-ink">Before sending a message</h2>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted">
        To help us investigate issues quickly, please provide clear and specific context.
      </p>

      <ul className="space-y-3 text-xs sm:text-sm text-ink/90 font-medium">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-6 border-t border-line">
        <Button asChild variant="outline" className="w-full gap-2 font-bold shadow-xs">
          <Link href={routes.help}>
            <HelpCircle className="size-4 text-muted" aria-hidden="true" />
            <span>Visit Help Center</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

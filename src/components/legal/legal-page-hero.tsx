import { Shield, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LegalPageHeroProps {
  badge?: string;
  title: string;
  description: string;
  lastUpdated: string;
}

export function LegalPageHero({
  badge = "LEGAL",
  title,
  description,
  lastUpdated,
}: LegalPageHeroProps) {
  return (
    <section aria-labelledby="legal-hero-heading" className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 transition-colors border-b border-line/60">
      {/* Background Lighting Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[380px] w-[780px] rounded-full bg-gradient-to-b from-primary/18 via-[#8B5CF6]/10 to-transparent blur-[120px] dark:from-primary/20 dark:via-[#7C3AED]/12"
      />

      <div className="container-page relative flex flex-col items-start max-w-5xl">
        <Badge
          variant="default"
          className="gap-1.5 border border-primary/20 bg-primary/10 text-primary font-bold px-3.5 py-1 text-xs shadow-soft"
        >
          <Sparkles className="size-3.5" aria-hidden="true" />
          <span>{badge}</span>
        </Badge>

        <h1
          id="legal-hero-heading"
          className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl"
        >
          {title}
        </h1>

        <p className="mt-3 max-w-2xl text-muted text-base sm:text-lg leading-relaxed">
          {description}
        </p>

        <div className="mt-4 flex items-center gap-2 font-mono text-xs text-muted/80">
          <Shield className="size-3.5 text-primary" aria-hidden="true" />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </div>
    </section>
  );
}

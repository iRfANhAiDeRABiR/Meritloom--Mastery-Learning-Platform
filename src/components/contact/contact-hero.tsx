import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ContactHero() {
  return (
    <section aria-labelledby="contact-hero-heading" className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 transition-colors">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[820px] rounded-full bg-gradient-to-b from-primary/18 via-[#8B5CF6]/12 to-transparent blur-[130px] dark:from-primary/22 dark:via-[#7C3AED]/15"
      />

      <div className="container-page relative flex flex-col items-center text-center">
        <Badge
          variant="default"
          className="gap-1.5 border border-primary/20 bg-primary/10 text-primary font-bold px-3.5 py-1.5 text-xs shadow-soft"
        >
          <Sparkles className="size-3.5" aria-hidden="true" />
          <span>CONTACT</span>
        </Badge>

        <h1
          id="contact-hero-heading"
          className="mt-5 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-[3.25rem] leading-[1.12]"
        >
          Get in{" "}
          <span className="bg-gradient-to-r from-primary via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
            touch
          </span>
        </h1>

        <p className="lead-text mt-4 max-w-xl text-muted text-base sm:text-lg">
          Have a question or found a problem? Send us a message and we&apos;ll use the details to understand what happened.
        </p>
      </div>
    </section>
  );
}

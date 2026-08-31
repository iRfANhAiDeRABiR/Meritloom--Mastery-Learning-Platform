import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function HelpContactCTA() {
  return (
    <section aria-labelledby="help-cta-heading" className="section-py bg-surface/40 transition-colors border-t border-line/60">
      <div className="container-page">
        <div className="relative overflow-hidden flex flex-col items-center gap-6 rounded-container bg-gradient-to-br from-primary via-primary-700 to-indigo-950 px-6 py-12 text-center text-white shadow-lift sm:px-12 sm:py-16">
          <span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-white shadow-soft">
            <MessageSquare className="size-7 text-amber-300" aria-hidden="true" />
          </span>

          <h2 id="help-cta-heading" className="heading-2 max-w-xl text-white">
            Still need help?
          </h2>
          <p className="lead-text max-w-lg text-white/90 text-sm sm:text-base">
            Send us a message and include as much detail as possible about what you&apos;re experiencing.
          </p>

          <div className="relative z-10">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 hover:text-primary active:bg-white/80 shadow-soft hover:-translate-y-0.5 transition-all font-bold"
            >
              <Link href={routes.contact}>
                <span>Contact support</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

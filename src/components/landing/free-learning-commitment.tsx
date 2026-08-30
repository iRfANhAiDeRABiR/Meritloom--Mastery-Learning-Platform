import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { freeCommitments } from "@/lib/content/landing";
import { routes } from "@/lib/routes";

/**
 * The free-learning commitment banner — visually distinct (dark brand panel)
 * to anchor the core promise of the product.
 */
export function FreeLearningCommitment() {
  return (
    <section
      id="about"
      aria-labelledby="commitment-heading"
      className="section-py bg-surface"
    >
      <div className="container-page">
        <div className="overflow-hidden rounded-container bg-ink p-8 text-white shadow-lift sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
            <div className="flex flex-col items-start gap-5">
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                Our commitment
              </span>
              <h2
                id="commitment-heading"
                className="heading-2 text-white"
              >
                Learning should not depend on your budget.
              </h2>
              <p className="max-w-lg text-base leading-relaxed text-white/70">
                Meritloom is designed to make structured, practical education
                available without putting essential lessons behind a paywall.
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link href={routes.courses.index}>
                  <Compass className="size-4" aria-hidden="true" />
                  Browse free courses
                </Link>
              </Button>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {freeCommitments.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/5 p-4"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mint text-mint-ink">
                    <item.icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

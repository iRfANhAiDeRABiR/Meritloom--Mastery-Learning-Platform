"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Is Meritloom free?",
    a: "Yes. Published Meritloom courses are free to learn. You don't need a subscription or credit card.",
  },
  {
    q: "Do I need an account?",
    a: "You can browse public courses without an account. An account is required when you want to start a course, save progress, or use personalized learning features.",
  },
  {
    q: "Can I learn without following a Learning Path?",
    a: "No problem. Learning Paths provide a recommended sequence, but you can open any available course whenever you want.",
  },
  {
    q: "Where do course videos come from?",
    a: "Some courses use educational videos from trusted external creators. Meritloom clearly attributes the original source while adding structured modules, summaries, practice, and progress tracking around the material.",
  },
  {
    q: "Can I take courses in any order?",
    a: "Yes. Recommended prerequisites can help, but Meritloom does not lock free courses behind previous course completion.",
  },
  {
    q: "How does progress tracking work?",
    a: "When you mark lessons complete, Meritloom records your progress and uses it to help you continue where you left off.",
  },
  {
    q: "Are knowledge checks required?",
    a: "Knowledge checks are designed for practice. They don't block access to later lessons based on your score.",
  },
];

export function HowItWorksFAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section aria-labelledby="faq-heading" className="section-py bg-surface/50 transition-colors border-t border-line/60">
      <div className="container-page max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            Got Questions?
          </span>
          <h2 id="faq-heading" className="heading-2 mt-2 text-ink">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-10 space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-line bg-card overflow-hidden shadow-soft transition-colors"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left font-bold text-ink hover:text-primary transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "size-5 text-muted transition-transform duration-200 shrink-0",
                      isOpen ? "rotate-180 text-primary" : "",
                    )}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-[15px] leading-relaxed text-muted animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

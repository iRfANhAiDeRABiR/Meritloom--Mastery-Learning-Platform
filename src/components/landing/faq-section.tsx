"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/landing/section-heading";
import type { FaqItem } from "@/lib/content/faq";

/**
 * Accessible FAQ accordion (Radix under the hood). Content is passed in from a
 * reusable data structure so copy changes never touch markup.
 */
export function FAQSection({ items }: { items: FaqItem[] }) {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="section-py bg-white"
    >
      <div className="container-page">
        <SectionHeading
          id="faq-heading"
          eyebrow="FAQ"
          title="Questions, answered"
          description="Everything learners ask before starting — in one place."
        />

        <div className="mx-auto mt-10 max-w-3xl">
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {items.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

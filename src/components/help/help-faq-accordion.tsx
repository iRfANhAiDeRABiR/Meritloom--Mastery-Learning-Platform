"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { HELP_ARTICLES, HELP_CATEGORIES, type HelpArticle } from "@/lib/data/help-center";
import { cn } from "@/lib/utils";

interface HelpFAQAccordionProps {
  selectedCategory: string | null;
  expandedArticleId: string | null;
  onToggleArticle: (articleId: string) => void;
}

export function HelpFAQAccordion({
  selectedCategory,
  expandedArticleId,
  onToggleArticle,
}: HelpFAQAccordionProps) {
  const articlesToDisplay: HelpArticle[] = React.useMemo(() => {
    if (selectedCategory) {
      return HELP_ARTICLES.filter((a) => a.categoryId === selectedCategory);
    }
    return HELP_ARTICLES;
  }, [selectedCategory]);

  const categoryName = selectedCategory
    ? HELP_CATEGORIES.find((c) => c.id === selectedCategory)?.name || "Category FAQ"
    : "Frequently Asked Questions";

  return (
    <section aria-labelledby="faq-list-heading" className="section-py transition-colors">
      <div className="container-page max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            Quick Answers
          </span>
          <h2 id="faq-list-heading" className="heading-2 mt-2 text-ink">
            {categoryName}
          </h2>
        </div>

        <div className="mt-10 space-y-3.5">
          {articlesToDisplay.map((article) => {
            const isOpen = expandedArticleId === article.id;
            return (
              <div
                key={article.id}
                id={article.id}
                className={cn(
                  "rounded-2xl border bg-card overflow-hidden shadow-soft transition-all",
                  isOpen ? "border-primary/40 ring-1 ring-primary/20" : "border-line",
                )}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => onToggleArticle(article.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left font-bold text-ink hover:text-primary transition-colors"
                >
                  <span className="text-base sm:text-lg">{article.question}</span>
                  <ChevronDown
                    className={cn(
                      "size-5 text-muted transition-transform duration-200 shrink-0",
                      isOpen ? "rotate-180 text-primary" : "",
                    )}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-[15px] leading-relaxed text-muted animate-fade-in border-t border-line/50 pt-3">
                    {article.answer}
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

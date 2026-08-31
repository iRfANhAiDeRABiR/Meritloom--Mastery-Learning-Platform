"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HELP_ARTICLES, type HelpArticle } from "@/lib/data/help-center";
import { routes } from "@/lib/routes";

interface HelpCenterHeroProps {
  onSelectArticle?: (articleId: string) => void;
}

export function HelpCenterHero({ onSelectArticle }: HelpCenterHeroProps) {
  const [query, setQuery] = React.useState("");

  const filteredArticles: HelpArticle[] = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return HELP_ARTICLES.filter(
      (a) =>
        a.question.toLowerCase().includes(q) ||
        a.answer.toLowerCase().includes(q) ||
        a.keywords.some((k) => k.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <section aria-labelledby="help-hero-heading" className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 transition-colors">
      {/* Background Lighting */}
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
          <span>HELP CENTER</span>
        </Badge>

        <h1
          id="help-hero-heading"
          className="mt-5 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-[3.25rem] leading-[1.12]"
        >
          How can we{" "}
          <span className="bg-gradient-to-r from-primary via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
            help?
          </span>
        </h1>

        <p className="lead-text mt-4 max-w-xl text-muted text-base sm:text-lg">
          Find answers about courses, progress, accounts, Learning Paths, and using Meritloom.
        </p>

        {/* Big Search Input */}
        <div className="mt-8 w-full max-w-2xl relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 size-5 text-muted pointer-events-none" aria-hidden="true" />
            <Input
              type="search"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search for help (e.g. video, progress, certificates, account)..."
              className="h-14 w-full rounded-2xl border-line bg-card pl-12 pr-10 text-base shadow-soft placeholder:text-muted/70 focus-visible:border-primary focus-visible:ring-primary/20"
              aria-label="Search help articles"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3.5 p-1 text-muted hover:text-ink transition-colors"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Search Dropdown / Live Results */}
          {query.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 z-30 overflow-hidden rounded-2xl border border-line bg-card p-3 shadow-lift text-left animate-fade-in max-h-96 overflow-y-auto">
              {filteredArticles.length > 0 ? (
                <div className="space-y-1">
                  <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
                    {filteredArticles.length} matching {filteredArticles.length === 1 ? "article" : "articles"}
                  </p>
                  {filteredArticles.map((article) => (
                    <a
                      key={article.id}
                      href={`#${article.id}`}
                      onClick={() => {
                        if (onSelectArticle) onSelectArticle(article.id);
                        setQuery("");
                      }}
                      className="block rounded-xl p-3 hover:bg-surface transition-colors"
                    >
                      <p className="text-sm font-bold text-ink">{article.question}</p>
                      <p className="text-xs text-muted line-clamp-1 mt-0.5">{article.answer}</p>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm font-bold text-ink">No matching help articles</p>
                  <p className="mt-1 text-xs text-muted">Try another search or contact us directly.</p>
                  <div className="mt-4">
                    <Button asChild size="sm" className="font-bold">
                      <Link href={routes.contact}>Contact support</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

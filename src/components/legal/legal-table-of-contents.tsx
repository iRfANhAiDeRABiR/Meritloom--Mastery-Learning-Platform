"use client";

import * as React from "react";
import { ChevronDown, ListFilter } from "lucide-react";
import type { LegalTOCItem } from "@/content/legal/privacy";
import { cn } from "@/lib/utils";

interface LegalTableOfContentsProps {
  items: LegalTOCItem[];
}

export function LegalTableOfContents({ items }: LegalTableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>(items[0]?.id || "");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 },
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleLinkClick = (id: string) => {
    setActiveId(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Collapsible TOC */}
      <div className="lg:hidden mb-8 rounded-2xl border border-line bg-card shadow-soft overflow-hidden">
        <button
          type="button"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex w-full items-center justify-between p-4 font-bold text-ink text-sm"
        >
          <div className="flex items-center gap-2">
            <ListFilter className="size-4 text-primary" aria-hidden="true" />
            <span>On this page</span>
          </div>
          <ChevronDown
            className={cn("size-4 text-muted transition-transform", mobileOpen ? "rotate-180" : "")}
            aria-hidden="true"
          />
        </button>

        {mobileOpen && (
          <nav aria-label="Table of contents mobile" className="border-t border-line p-4 space-y-2 text-xs bg-surface/50">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => handleLinkClick(item.id)}
                className={cn(
                  "block py-1.5 px-2.5 rounded-lg transition-colors",
                  activeId === item.id
                    ? "bg-primary text-white font-bold"
                    : "text-muted hover:text-ink hover:bg-surface",
                )}
              >
                {item.title}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop Sticky Sidebar TOC */}
      <nav
        aria-label="Table of contents"
        className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 select-none"
      >
        <p className="text-xs font-extrabold uppercase tracking-wider text-muted mb-4">
          On this page
        </p>
        <ul className="space-y-1 text-xs border-l border-line/80">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => handleLinkClick(item.id)}
                  className={cn(
                    "block py-1.5 pl-3.5 -ml-px border-l-2 transition-all leading-snug",
                    isActive
                      ? "border-primary text-primary font-bold bg-primary/5 rounded-r-md"
                      : "border-transparent text-muted hover:text-ink hover:border-muted/40",
                  )}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

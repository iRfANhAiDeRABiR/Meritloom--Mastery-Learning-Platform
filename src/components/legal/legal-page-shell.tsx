import * as React from "react";
import { LegalPageHero } from "./legal-page-hero";
import { LegalTableOfContents } from "./legal-table-of-contents";
import { LegalSectionRenderer } from "./legal-section-renderer";
import type { LegalTOCItem } from "@/content/legal/privacy";

interface LegalSectionData {
  id: string;
  title: string;
  content: string;
  callout?: {
    type: "info" | "important" | "transparency";
    title?: string;
    text: string;
  };
}

interface LegalPageShellProps {
  badge?: string;
  title: string;
  description: string;
  lastUpdated: string;
  tocItems: LegalTOCItem[];
  sections: LegalSectionData[];
}

export function LegalPageShell({
  badge,
  title,
  description,
  lastUpdated,
  tocItems,
  sections,
}: LegalPageShellProps) {
  return (
    <div className="flex flex-col bg-background text-ink transition-colors min-h-screen">
      {/* 1. Compact Hero */}
      <LegalPageHero
        badge={badge}
        title={title}
        description={description}
        lastUpdated={lastUpdated}
      />

      {/* 2. Main Content Grid */}
      <div className="container-page py-10 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] max-w-5xl mx-auto items-start">
          {/* Left Column: Table of Contents */}
          <LegalTableOfContents items={tocItems} />

          {/* Right Column: Legal Article Body */}
          <article className="max-w-[760px] mx-auto lg:mx-0">
            {sections.map((section) => (
              <LegalSectionRenderer key={section.id} section={section} />
            ))}
          </article>
        </div>
      </div>
    </div>
  );
}

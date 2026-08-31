"use client";

import * as React from "react";
import { HelpCenterHero } from "./help-center-hero";
import { HelpCategoryGrid } from "./help-category-grid";
import { HelpFAQAccordion } from "./help-faq-accordion";
import { VideoTroubleshooting } from "./video-troubleshooting";
import { HelpContactCTA } from "./help-contact-cta";

export function HelpCenterView() {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [expandedArticleId, setExpandedArticleId] = React.useState<string | null>("is-meritloom-free");

  // Handle initial URL hash on mount (e.g. /help#video-not-playing)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const timer = setTimeout(() => {
          setExpandedArticleId(hash);
          const elem = document.getElementById(hash);
          if (elem) {
            elem.scrollIntoView({ behavior: "smooth" });
          }
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleSelectArticleFromSearch = (articleId: string) => {
    setExpandedArticleId(articleId);
    setSelectedCategory(null);
    setTimeout(() => {
      const elem = document.getElementById(articleId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleToggleArticle = (articleId: string) => {
    setExpandedArticleId(expandedArticleId === articleId ? null : articleId);
  };

  return (
    <>
      {/* 1. Hero with Live Search */}
      <HelpCenterHero onSelectArticle={handleSelectArticleFromSearch} />

      {/* 2. Help Categories Grid */}
      <HelpCategoryGrid
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          // Set first article of category as expanded
          if (catId) {
            setExpandedArticleId(null);
          }
        }}
      />

      {/* 3. FAQ Accordion */}
      <HelpFAQAccordion
        selectedCategory={selectedCategory}
        expandedArticleId={expandedArticleId}
        onToggleArticle={handleToggleArticle}
      />

      {/* 4. Video Troubleshooting Guide */}
      <VideoTroubleshooting />

      {/* 5. Help Contact CTA */}
      <HelpContactCTA />
    </>
  );
}

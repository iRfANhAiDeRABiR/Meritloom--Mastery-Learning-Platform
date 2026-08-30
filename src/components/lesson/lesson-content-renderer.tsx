"use client";

import * as React from "react";
import { Check, Copy, Lightbulb } from "lucide-react";

import type { FullLessonDetail } from "@/lib/types";

interface LessonContentRendererProps {
  lesson: FullLessonDetail;
}

export function LessonContentRenderer({ lesson }: LessonContentRendererProps) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  // Helper to parse markdown content into structured blocks (Headings, Paragraphs, Code, Lists)
  const renderContentBlocks = (content: string) => {
    const rawBlocks = content.split(/\n\n+/);

    return rawBlocks.map((block, idx) => {
      const trimmed = block.trim();

      // 1. Code Block (```lang ... ```)
      if (trimmed.startsWith("```")) {
        const firstLineEnd = trimmed.indexOf("\n");
        const lang = trimmed.slice(3, firstLineEnd).trim() || "javascript";
        const code = trimmed.slice(firstLineEnd + 1, trimmed.lastIndexOf("```")).trim();
        const isCopied = copiedIndex === idx;

        return (
          <div
            key={idx}
            className="my-5 overflow-hidden rounded-xl border border-line bg-[#0E1424] text-white shadow-soft"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold text-white/70">
              <span className="uppercase tracking-wider font-mono">{lang}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(code, idx)}
                aria-label="Copy code snippet"
                className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="size-3 text-[#19B99A]" aria-hidden="true" />
                    <span className="text-[#19B99A]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs sm:text-[13px] leading-relaxed text-emerald-300/90">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // 2. Heading 2 (## Title)
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={idx}
            className="mt-6 mb-3 text-lg sm:text-xl font-bold tracking-tight text-ink border-b border-line pb-2"
          >
            {trimmed.slice(3)}
          </h2>
        );
      }

      // 3. Heading 3 (### Title)
      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="mt-5 mb-2 text-base sm:text-lg font-bold text-ink"
          >
            {trimmed.slice(4)}
          </h3>
        );
      }

      // 4. Unordered List (- item or * item)
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split("\n").map((line) => line.replace(/^[-*]\s+/, ""));
        return (
          <ul key={idx} className="my-3 space-y-2 pl-5 list-disc text-xs sm:text-sm text-ink/90 leading-relaxed">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      }

      // 5. Ordered List (1. item)
      if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split("\n").map((line) => line.replace(/^\d+\.\s+/, ""));
        return (
          <ol key={idx} className="my-3 space-y-2 pl-5 list-decimal text-xs sm:text-sm text-ink/90 leading-relaxed">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        );
      }

      // 6. Regular Paragraph
      return (
        <p
          key={idx}
          className="my-3 text-xs sm:text-sm leading-relaxed text-ink/85 font-normal"
        >
          {trimmed}
        </p>
      );
    });
  };

  return (
    <article className="flex flex-col gap-5">
      {/* Lesson Meta Badges & Heading */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-lavender px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
            Module {lesson.module.position} · Lesson {lesson.position}
          </span>
          <span className="rounded-md bg-surface px-2.5 py-0.5 text-xs font-semibold text-muted border border-line capitalize">
            {lesson.lessonType} lesson
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-[32px] leading-tight">
          {lesson.title}
        </h1>

        {lesson.summary && (
          <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-2xl">
            {lesson.summary}
          </p>
        )}
      </div>

      {/* Key Idea Callout Card */}
      {lesson.keyTakeaway && (
        <div className="my-1 flex items-start gap-3 rounded-[16px] border border-primary/30 bg-lavender/40 p-4 sm:p-5 shadow-xs">
          <span className="grid size-8 place-items-center rounded-xl bg-primary text-white shrink-0 shadow-soft">
            <Lightbulb className="size-4" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
              Key idea
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-ink leading-relaxed">
              {lesson.keyTakeaway}
            </p>
          </div>
        </div>
      )}

      {/* Main Educational Article Content */}
      {lesson.content && (
        <div className="prose-clean flex flex-col pt-2">
          {renderContentBlocks(lesson.content)}
        </div>
      )}
    </article>
  );
}


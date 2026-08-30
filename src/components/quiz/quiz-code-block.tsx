"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

interface QuizCodeBlockProps {
  code: string;
  language?: string | null;
}

export function QuizCodeBlock({ code, language = "javascript" }: QuizCodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-[14px] sm:rounded-[16px] border border-line bg-[#0E1424] text-white shadow-soft">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold text-white/70">
        <span className="uppercase tracking-wider font-mono">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code snippet"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
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
      <pre className="overflow-x-auto p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-emerald-300/95">
        <code>{code}</code>
      </pre>
    </div>
  );
}


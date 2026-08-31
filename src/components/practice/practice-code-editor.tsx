"use client";

import * as React from "react";
import { Check, Copy, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PracticeCodeEditorProps {
  language: "html" | "css" | "javascript";
  value: string;
  onChange: (val: string) => void;
  onRun?: () => void;
  className?: string;
}

export function PracticeCodeEditor({
  language,
  value,
  onChange,
  onRun,
  className,
}: PracticeCodeEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [fontSize, setFontSize] = React.useState<number>(14);
  const [copied, setCopied] = React.useState(false);

  const lines = React.useMemo(() => {
    return (value || "").split("\n");
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 1. Run shortcut: Ctrl+Enter / Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onRun?.();
      return;
    }

    // 2. Tab key handling: Insert 2 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const before = value.substring(0, start);
      const after = value.substring(end);

      const newValue = before + "  " + after;
      onChange(newValue);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast("Copied to clipboard", { duration: 2000 });
    setTimeout(() => setCopied(false), 2000);
  };

  const adjustFontSize = (delta: number) => {
    setFontSize((prev) => Math.max(12, Math.min(18, prev + delta)));
  };

  return (
    <div className={cn("flex flex-col h-full rounded-2xl border border-line bg-[#0E1424] text-white shadow-inner overflow-hidden", className)}>
      {/* Editor Sub-header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2 text-xs">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-white/70">
          {language === "html" ? "index.html" : language === "css" ? "styles.css" : "script.js"}
        </span>

        <div className="flex items-center gap-3">
          {/* Font size adjustment */}
          <div className="flex items-center gap-1 text-[11px] text-white/60">
            <button
              type="button"
              onClick={() => adjustFontSize(-1)}
              title="Decrease font size"
              className="rounded p-1 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-5 text-center font-mono">{fontSize}px</span>
            <button
              type="button"
              onClick={() => adjustFontSize(1)}
              title="Increase font size"
              className="rounded p-1 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="h-3 w-[1px] bg-white/10" />

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy code"
            className="flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Line Numbers Column */}
        <div
          className="select-none border-r border-white/10 bg-white/[0.02] py-3 px-3 text-right font-mono text-white/30"
          style={{ fontSize: `${fontSize}px`, lineHeight: "1.6" }}
          aria-hidden="true"
        >
          {lines.map((_, idx) => (
            <div key={idx}>{idx + 1}</div>
          ))}
        </div>

        {/* Code Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          aria-label={`${language.toUpperCase()} code editor`}
          className="flex-1 resize-none bg-transparent p-3 font-mono text-emerald-300/90 outline-none leading-relaxed overflow-auto whitespace-pre tab-2 placeholder:text-white/20"
          style={{ fontSize: `${fontSize}px`, lineHeight: "1.6" }}
          placeholder={`Write ${language.toUpperCase()} code here...`}
        />
      </div>
    </div>
  );
}

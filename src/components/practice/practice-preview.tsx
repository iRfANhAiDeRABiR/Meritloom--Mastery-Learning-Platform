"use client";

import * as React from "react";
import { AlertCircle, Maximize2, Monitor, RefreshCw, Smartphone, X } from "lucide-react";
import { buildSandboxedPreviewDocument } from "@/lib/practice/preview";
import { cn } from "@/lib/utils";

interface PracticePreviewProps {
  html: string;
  css: string;
  javascript: string;
  lessonTitle: string;
  runtimeError?: string | null;
  onRefresh?: () => void;
  className?: string;
}

export function PracticePreview({
  html,
  css,
  javascript,
  lessonTitle,
  runtimeError,
  onRefresh,
  className,
}: PracticePreviewProps) {
  const [deviceMode, setDeviceMode] = React.useState<"desktop" | "mobile">("desktop");
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const srcDoc = React.useMemo(() => {
    return buildSandboxedPreviewDocument(html, css, javascript);
  }, [html, css, javascript]);

  const handleManualRefresh = () => {
    setRefreshKey((k) => k + 1);
    onRefresh?.();
  };

  const previewFrame = (
    <div className="flex flex-col h-full bg-surface-elevated/10 overflow-hidden relative">
      {/* Device wrapper */}
      <div
        className={cn(
          "flex-1 mx-auto w-full transition-all duration-200 flex flex-col",
          deviceMode === "mobile" ? "max-w-[375px] my-2 rounded-2xl border-2 border-line shadow-lg overflow-hidden" : "h-full",
        )}
      >
        <iframe
          key={refreshKey}
          srcDoc={srcDoc}
          title={`Preview for ${lessonTitle}`}
          sandbox="allow-scripts"
          className="w-full flex-1 border-none bg-white min-h-[240px]"
        />
      </div>

      {/* Runtime error banner */}
      {runtimeError && (
        <div className="border-t border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">JavaScript Error:</span>
            <p className="font-mono text-[11px] leading-tight">{runtimeError}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("flex flex-col h-full rounded-2xl border border-line bg-surface overflow-hidden shadow-xs", className)}>
      {/* Header Toolbar */}
      <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2 text-xs">
        <span className="font-display font-bold text-ink flex items-center gap-1.5">
          <span>Preview</span>
        </span>

        <div className="flex items-center gap-2">
          {/* Device toggle */}
          <div className="flex items-center rounded-xl border border-line bg-surface-elevated/40 p-0.5">
            <button
              type="button"
              onClick={() => setDeviceMode("desktop")}
              title="Desktop preview"
              className={cn(
                "rounded-lg p-1 transition cursor-pointer",
                deviceMode === "desktop" ? "bg-surface text-primary shadow-xs" : "text-ink-muted hover:text-ink",
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("mobile")}
              title="Mobile preview (375px)"
              className={cn(
                "rounded-lg p-1 transition cursor-pointer",
                deviceMode === "mobile" ? "bg-surface text-primary shadow-xs" : "text-ink-muted hover:text-ink",
              )}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="h-3 w-[1px] bg-line" />

          {/* Refresh button */}
          <button
            type="button"
            onClick={handleManualRefresh}
            title="Refresh preview"
            className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-elevated hover:text-primary transition cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>

          {/* Expand Modal button */}
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            title="Expand preview"
            className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-elevated hover:text-primary transition cursor-pointer"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-hidden min-h-[280px]">
        {previewFrame}
      </div>

      {/* Expanded Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-8 backdrop-blur-sm">
          <div className="flex h-full max-h-[90vh] w-full max-w-5xl flex-col rounded-3xl border border-line bg-surface shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line p-4">
              <span className="font-display text-sm font-bold text-ink">
                Preview: {lessonTitle}
              </span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="rounded-xl p-1.5 text-ink-muted hover:bg-surface-elevated hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {previewFrame}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

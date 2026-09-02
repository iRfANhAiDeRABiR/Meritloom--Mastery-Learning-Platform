"use client";

import * as React from "react";
import { ChevronDown, Info, ShieldCheck } from "lucide-react";
import { CopyReferenceButton } from "@/components/errors/copy-reference-button";
import type { SafeErrorDetails } from "@/lib/errors/types";
import { cn } from "@/lib/utils";

interface ErrorDetailsDisclosureProps {
  details: SafeErrorDetails;
  className?: string;
}

export function ErrorDetailsDisclosure({
  details,
  className,
}: ErrorDetailsDisclosureProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const formattedDate = React.useMemo(() => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(details.timestamp));
    } catch {
      return details.timestamp;
    }
  }, [details.timestamp]);

  return (
    <div className={cn("w-full rounded-2xl border border-line bg-card/60 overflow-hidden text-left transition-all", className)}>
      {/* Disclosure Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <Info className="size-3.5 text-primary" aria-hidden="true" />
          <span>Error details & diagnostic reference</span>
        </div>
        <ChevronDown
          className={cn("size-3.5 transition-transform duration-200", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="border-t border-line px-4 py-3.5 text-xs text-ink flex flex-col gap-2.5 bg-surface/50 animate-in fade-in-0 duration-200">
          <div className="grid grid-cols-[110px_1fr] items-center gap-2">
            <span className="text-ink-muted">Reference:</span>
            <div className="flex items-center gap-2">
              <CopyReferenceButton reference={details.errorReference} />
            </div>
          </div>

          <div className="grid grid-cols-[110px_1fr] items-center gap-2">
            <span className="text-ink-muted">Error Type:</span>
            <span className="font-semibold text-ink capitalize">
              {details.category} ({details.safeCode})
            </span>
          </div>

          <div className="grid grid-cols-[110px_1fr] items-center gap-2">
            <span className="text-ink-muted">Timestamp:</span>
            <span className="font-mono text-ink-muted text-[11px]">{formattedDate}</span>
          </div>

          {details.route && (
            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
              <span className="text-ink-muted">Requested Page:</span>
              <span className="font-mono text-[11px] text-ink truncate max-w-[240px]">
                {details.route}
              </span>
            </div>
          )}

          <div className="mt-1 pt-2 border-t border-line/60 flex items-center gap-1.5 text-[11px] text-ink-muted">
            <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
            <span>Technical stack traces and sensitive account data are protected.</span>
          </div>
        </div>
      )}
    </div>
  );
}


"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyReferenceButtonProps {
  reference: string;
  className?: string;
}

export function CopyReferenceButton({
  reference,
  className,
}: CopyReferenceButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      toast.success("Error reference copied", {
        description: reference,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy reference");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy error reference ID"
      aria-label={`Copy error reference ${reference}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 text-[11px] font-mono font-bold text-ink-muted transition-colors hover:border-primary/40 hover:text-ink cursor-pointer select-none",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="size-3 text-emerald-500" aria-hidden="true" />
          <span className="text-emerald-500">Copied</span>
        </>
      ) : (
        <>
          <Copy className="size-3" aria-hidden="true" />
          <span>{reference}</span>
        </>
      )}
    </button>
  );
}


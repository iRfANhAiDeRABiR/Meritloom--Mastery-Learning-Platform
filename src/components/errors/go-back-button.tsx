"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoBackButtonProps {
  className?: string;
  fallbackHref?: string;
  label?: string;
}

export function GoBackButton({
  className,
  fallbackHref = "/",
  label = "Go back",
}: GoBackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-surface-elevated focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
    >
      <ArrowLeft className="size-3.5" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}


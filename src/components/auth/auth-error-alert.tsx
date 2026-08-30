import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuthErrorAlert({
  message,
  className,
}: {
  message: string | null;
  className?: string;
}) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-600 dark:text-rose-400 animate-in fade-in-50 duration-200",
        className,
      )}
    >
      <AlertCircle className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
      <span className="leading-relaxed">{message}</span>
    </div>
  );
}


import * as React from "react";
import { cn } from "@/lib/utils";

export function AuthDivider({
  text = "or continue with email",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative my-4 flex items-center justify-center", className)}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-line" />
      </div>
      <div className="relative flex justify-center bg-card px-3 text-xs font-semibold text-muted">
        <span>{text}</span>
      </div>
    </div>
  );
}


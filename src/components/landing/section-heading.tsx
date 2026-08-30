import * as React from "react";

import { cn } from "@/lib/utils";

/** Shared eyebrow + heading + supporting-text block used across sections. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "center",
  className,
  action,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-bold uppercase tracking-wide text-primary">
          {eyebrow}
        </p>
      ) : null}
      <div
        className={cn(
          "flex w-full flex-col gap-4",
          align === "center" ? "items-center" : "items-start justify-between sm:flex-row sm:items-end",
        )}
      >
        <div className={cn(align === "center" ? "max-w-2xl" : "max-w-2xl")}>
          <h2
            id={id}
            className="heading-2"
          >
            {title}
          </h2>
          {description ? (
            <p className="lead-text mt-3">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}

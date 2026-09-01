"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string | null;
  alt?: string;
  className?: string;
}

export function Avatar({
  src,
  name,
  alt,
  className,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  // Reset error state if the src URL changes
  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  const initials = React.useMemo(() => {
    if (!name) return "L";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }, [name]);

  const cleanSrc = typeof src === "string" ? src.trim() : null;
  const displayName = name ? `${name}'s profile photo` : alt || "Profile photo";

  if (cleanSrc && !hasError) {
    return (
      <div
        className={cn(
          "relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-surface shadow-xs",
          className,
        )}
        {...props}
      >
        <Image
          src={cleanSrc}
          alt={displayName}
          fill
          sizes="40px"
          onError={() => setHasError(true)}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      aria-label={displayName}
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#6847F5] text-xs font-bold text-white shadow-xs select-none",
        className,
      )}
      {...props}
    >
      <span>{initials}</span>
    </div>
  );
}


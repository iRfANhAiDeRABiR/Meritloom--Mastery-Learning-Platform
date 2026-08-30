import Image from "next/image";
import { GraduationCap } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Course thumbnail. Uses next/image when a URL exists in Supabase, otherwise a
 * branded gradient placeholder (never a broken image). The alt text describes
 * the course, so the placeholder still conveys context.
 */
export function Thumbnail({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={640}
        height={360}
        priority={priority}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "grid h-full w-full place-items-center bg-gradient-to-br from-lavender via-surface to-mint",
        className,
      )}
    >
      <GraduationCap className="size-10 text-primary/60" aria-hidden="true" />
    </div>
  );
}

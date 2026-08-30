import * as React from "react";
import Image from "next/image";
import {
  Briefcase,
  Code2,
  Languages,
  Layers,
  BrainCircuit,
  ListChecks,
  Palette,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CourseCoverProps {
  src: string | null;
  title: string;
  categorySlug?: string | null;
  priority?: boolean;
  className?: string;
}

const CATEGORY_THEMES: Record<
  string,
  { gradient: string; pattern: string }
> = {
  programming: {
    gradient: "from-indigo-600 via-purple-700 to-primary-700",
    pattern: "bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px]",
  },
  "web-development": {
    gradient: "from-purple-700 via-primary-700 to-indigo-900",
    pattern: "bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px]",
  },
  "data-and-ai": {
    gradient: "from-teal-700 via-cyan-800 to-slate-900",
    pattern: "bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px]",
  },
  design: {
    gradient: "from-rose-600 via-pink-700 to-purple-800",
    pattern: "bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px]",
  },
  business: {
    gradient: "from-amber-600 via-orange-700 to-slate-900",
    pattern: "bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px]",
  },
  english: {
    gradient: "from-emerald-600 via-teal-700 to-slate-900",
    pattern: "bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px]",
  },
  "personal-development": {
    gradient: "from-violet-600 via-primary to-slate-900",
    pattern: "bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px]",
  },
};

function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  switch (slug) {
    case "programming":
      return <Code2 className={className} aria-hidden="true" />;
    case "web-development":
      return <Layers className={className} aria-hidden="true" />;
    case "data-and-ai":
      return <BrainCircuit className={className} aria-hidden="true" />;
    case "design":
      return <Palette className={className} aria-hidden="true" />;
    case "business":
      return <Briefcase className={className} aria-hidden="true" />;
    case "english":
      return <Languages className={className} aria-hidden="true" />;
    case "personal-development":
      return <UserRound className={className} aria-hidden="true" />;
    default:
      return <Layers className={className} aria-hidden="true" />;
  }
}

export function CourseCover({
  src,
  title,
  categorySlug = "",
  priority = false,
  className,
}: CourseCoverProps) {
  const safeSlug = categorySlug ?? "";
  const theme = CATEGORY_THEMES[safeSlug] ?? {
    gradient: "from-primary via-primary-700 to-slate-900",
    pattern: "bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px]",
  };

  // Initials from title
  const initials = title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={cn(
        "relative aspect-[16/9] w-full overflow-hidden bg-surface transition-transform duration-300 group-hover:scale-[1.02]",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={`${title} course cover`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      ) : (
        /* Designed category-based fallback cover */
        <div
          role="img"
          aria-label={`${title} cover`}
          className={cn(
            "relative flex h-full w-full flex-col justify-between p-5 text-white bg-gradient-to-br",
            theme.gradient,
          )}
        >
          {/* Geometric pattern overlay */}
          <div
            className={cn("absolute inset-0 opacity-40 pointer-events-none", theme.pattern)}
            aria-hidden="true"
          />

          {/* Decorative subtle ambient circle */}
          <div
            className="absolute -right-8 -top-8 size-28 rounded-full bg-white/10 blur-xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Top category indicator */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="grid size-9 place-items-center rounded-xl bg-white/15 backdrop-blur-md shadow-xs">
              <CategoryIcon slug={safeSlug} className="size-5 text-white" />
            </span>
          </div>

          {/* Bottom initials badge */}
          <div className="relative z-10 flex items-end justify-between">
            <span className="text-xl font-black tracking-wider text-white/90">
              {initials}
            </span>
          </div>
        </div>
      )}

      {/* Free badge overlay */}
      <div className="absolute left-3.5 top-3.5 z-20">
        <Badge variant="mint" className="shadow-xs">
          <ListChecks className="size-3" aria-hidden="true" />
          Free
        </Badge>
      </div>
    </div>
  );
}


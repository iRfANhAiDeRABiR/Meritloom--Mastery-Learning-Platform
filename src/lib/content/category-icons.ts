import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Code2,
  Languages,
  Layers,
  BrainCircuit,
  Palette,
  UserRound,
} from "lucide-react";

/**
 * Map category slugs to icons. Falls back to a neutral icon so any new
 * Supabase category still renders cleanly without code changes.
 */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  programming: Code2,
  "web-development": Layers,
  "data-and-ai": BrainCircuit,
  design: Palette,
  business: Briefcase,
  english: Languages,
  "personal-development": UserRound,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? Layers;
}

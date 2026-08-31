import type { MeritloomContentPackage } from "./types";

export interface ValidationResult {
  valid: boolean;
  package?: MeritloomContentPackage;
  error?: string;
  details?: string[];
}

export function validateContentPackage(jsonString: string): ValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return {
      valid: false,
      error: "This file is not valid JSON.",
    };
  }

  if (!parsed || typeof parsed !== "object") {
    return {
      valid: false,
      error: "Invalid file structure. Expected a JSON object.",
    };
  }

  const obj = parsed as Record<string, unknown>;

  if (obj.format !== "meritloom-content") {
    return {
      valid: false,
      error: "This isn't a valid Meritloom content export. Expected format 'meritloom-content'.",
    };
  }

  if (obj.schemaVersion !== 1) {
    return {
      valid: false,
      error: `This backup uses schema version ${obj.schemaVersion}, but this system supports version 1.`,
    };
  }

  const details: string[] = [];

  // Validate courses
  if (Array.isArray(obj.courses)) {
    const courseSlugs = new Set<string>();
    for (let i = 0; i < obj.courses.length; i++) {
      const c = obj.courses[i];
      if (!c || typeof c !== "object" || !c.slug || typeof c.slug !== "string") {
        details.push(`Course at index ${i} is missing a valid 'slug'.`);
        continue;
      }
      if (courseSlugs.has(c.slug)) {
        details.push(`Duplicate course slug '${c.slug}' found in export.`);
      }
      courseSlugs.add(c.slug);

      if (!c.title || typeof c.title !== "string") {
        details.push(`Course '${c.slug}' is missing a title.`);
      }

      // Check modules & lessons
      if (Array.isArray(c.modules)) {
        const modSlugs = new Set<string>();
        const lessonSlugs = new Set<string>();

        for (const m of c.modules) {
          if (!m || typeof m !== "object" || !m.slug) {
            details.push(`A module in course '${c.slug}' is missing a slug.`);
            continue;
          }
          if (modSlugs.has(m.slug)) {
            details.push(`Duplicate module slug '${m.slug}' in course '${c.slug}'.`);
          }
          modSlugs.add(m.slug);

          if (Array.isArray(m.lessons)) {
            for (const l of m.lessons) {
              if (!l || typeof l !== "object" || !l.slug) {
                details.push(`A lesson in module '${m.slug}' is missing a slug.`);
                continue;
              }
              if (lessonSlugs.has(l.slug)) {
                details.push(`Duplicate lesson slug '${l.slug}' in course '${c.slug}'.`);
              }
              lessonSlugs.add(l.slug);
            }
          }
        }
      }
    }
  }

  // Validate Learning Paths
  if (Array.isArray(obj.learningPaths)) {
    const pathSlugs = new Set<string>();
    for (let i = 0; i < obj.learningPaths.length; i++) {
      const p = obj.learningPaths[i];
      if (!p || typeof p !== "object" || !p.slug || typeof p.slug !== "string") {
        details.push(`Learning Path at index ${i} is missing a valid 'slug'.`);
        continue;
      }
      if (pathSlugs.has(p.slug)) {
        details.push(`Duplicate Learning Path slug '${p.slug}' found in export.`);
      }
      pathSlugs.add(p.slug);

      if (!p.title || typeof p.title !== "string") {
        details.push(`Learning Path '${p.slug}' is missing a title.`);
      }
    }
  }

  if (details.length > 0) {
    return {
      valid: false,
      error: "Content package validation found structural errors.",
      details,
    };
  }

  return {
    valid: true,
    package: parsed as MeritloomContentPackage,
  };
}

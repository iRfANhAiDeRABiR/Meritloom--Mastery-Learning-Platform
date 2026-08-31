"use server";

import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateContentPackage } from "@/lib/admin/content-transfer/validation";
import { prepareContentImport } from "@/lib/admin/content-transfer/diff";
import { executeContentImport } from "@/lib/admin/content-transfer/import";
import type {
  ImportExecutionOptions,
  ImportPreviewSummary,
  ImportResultSummary,
} from "@/lib/admin/content-transfer/types";

/**
 * Fetch available courses and paths to populate Export Scope Picker dialog.
 */
export async function getExportScopeDataAction(): Promise<{
  courses: { slug: string; title: string; difficulty: string }[];
  learningPaths: { slug: string; title: string; difficulty: string }[];
}> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { courses: [], learningPaths: [] };

  const [coursesRes, pathsRes] = await Promise.all([
    supabase.from("courses").select("slug, title, difficulty").order("title"),
    supabase.from("learning_paths").select("slug, title, difficulty").order("title"),
  ]);

  return {
    courses: (coursesRes.data || []).map((c) => ({
      slug: c.slug,
      title: c.title,
      difficulty: c.difficulty || "beginner",
    })),
    learningPaths: (pathsRes.data || []).map((p) => ({
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty || "beginner",
    })),
  };
}

/**
 * Validate incoming JSON content and compute a dry-run diff preview.
 */
export async function validateAndPrepareImportAction(
  jsonString: string,
): Promise<{
  success: boolean;
  error?: string;
  details?: string[];
  preview?: ImportPreviewSummary;
}> {
  try {
    await requireAdmin();

    const val = validateContentPackage(jsonString);
    if (!val.valid || !val.package) {
      return {
        success: false,
        error: val.error || "Invalid Meritloom content backup.",
        details: val.details,
      };
    }

    const preview = await prepareContentImport(val.package);

    return {
      success: true,
      preview,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Validation failed.";
    return { success: false, error: msg };
  }
}

/**
 * Execute content import transaction safely.
 */
export async function executeImportAction(
  jsonString: string,
  options: ImportExecutionOptions,
): Promise<{
  success: boolean;
  error?: string;
  result?: ImportResultSummary;
}> {
  try {
    await requireAdmin();

    const val = validateContentPackage(jsonString);
    if (!val.valid || !val.package) {
      return {
        success: false,
        error: val.error || "Invalid Meritloom content backup.",
      };
    }

    const result = await executeContentImport(val.package, options);

    return {
      success: true,
      result,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Import failed.";
    return { success: false, error: msg };
  }
}

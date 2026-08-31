"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils/youtube-importer";
import type { CourseDifficulty } from "@/lib/types";

/**
 * Create a new draft Learning Path.
 */
export async function createLearningPathAction(input: {
  title: string;
  slug?: string;
  summary?: string;
  description?: string;
  difficulty?: CourseDifficulty;
}): Promise<{ success: boolean; pathId?: string; error?: string }> {
  try {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    const title = (input.title || "").trim();
    if (!title) return { success: false, error: "Title is required." };

    const slug = (input.slug || generateSlug(title)).trim().toLowerCase();
    if (!slug) return { success: false, error: "Slug is required." };

    // Check slug conflict
    const { data: existing } = await supabase
      .from("learning_paths")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error: "This Learning Path slug is already in use. Please choose another slug.",
      };
    }

    // Get max position
    const { data: maxPosRow } = await supabase
      .from("learning_paths")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextPosition = (maxPosRow?.position ?? 0) + 1;

    const { data: newPath, error: insertError } = await supabase
      .from("learning_paths")
      .insert({
        title,
        slug,
        summary: (input.summary || "").trim() || null,
        description: (input.description || "").trim() || null,
        difficulty: input.difficulty || "beginner",
        is_published: false,
        position: nextPosition,
        course_count: 0,
        estimated_minutes: 0,
      })
      .select("id")
      .single();

    if (insertError || !newPath) {
      if (insertError?.code === "23505") {
        return {
          success: false,
          error: "This Learning Path slug is already in use.",
        };
      }
      return { success: false, error: insertError?.message || "Failed to create Learning Path." };
    }

    revalidatePath("/admin/learning-paths");
    revalidatePath("/learning-paths");

    return { success: true, pathId: newPath.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create Learning Path.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Update Learning Path overview / metadata.
 */
export async function updateLearningPathOverviewAction(
  pathId: string,
  input: {
    title: string;
    slug: string;
    subtitle?: string;
    summary?: string;
    description?: string;
    difficulty: CourseDifficulty;
    coverImageUrl?: string | null;
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    const title = input.title.trim();
    const slug = input.slug.trim().toLowerCase();

    if (!title) return { success: false, error: "Title is required." };
    if (!slug) return { success: false, error: "Slug is required." };

    // Check slug uniqueness against other paths
    const { data: conflict } = await supabase
      .from("learning_paths")
      .select("id")
      .eq("slug", slug)
      .neq("id", pathId)
      .maybeSingle();

    if (conflict) {
      return {
        success: false,
        error: "This Learning Path slug is already in use by another path.",
      };
    }

    const { error } = await supabase
      .from("learning_paths")
      .update({
        title,
        slug,
        subtitle: input.subtitle?.trim() || null,
        summary: input.summary?.trim() || null,
        description: input.description?.trim() || null,
        difficulty: input.difficulty,
        cover_image_url: input.coverImageUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pathId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/learning-paths");
    revalidatePath(`/admin/learning-paths/${pathId}`);
    revalidatePath("/learning-paths");
    revalidatePath(`/learning-paths/${slug}`);

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update Learning Path.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Add a Course step to a Learning Path.
 */
export async function addCourseToLearningPathAction(
  pathId: string,
  courseId: string,
  isRequired = true,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    // Check duplicate course in this path
    const { data: existingItem } = await supabase
      .from("learning_path_items")
      .select("id")
      .eq("learning_path_id", pathId)
      .eq("course_id", courseId)
      .maybeSingle();

    if (existingItem) {
      return { success: false, error: "This course is already in this Learning Path." };
    }

    // Get max position in this path
    const { data: items } = await supabase
      .from("learning_path_items")
      .select("position")
      .eq("learning_path_id", pathId)
      .order("position", { ascending: false })
      .limit(1);

    const nextPosition = (items?.[0]?.position ?? 0) + 1;

    // Get course info for step title
    const { data: courseRow } = await supabase
      .from("courses")
      .select("title, estimated_minutes")
      .eq("id", courseId)
      .single();

    const { error: insertError } = await supabase
      .from("learning_path_items")
      .insert({
        learning_path_id: pathId,
        course_id: courseId,
        item_type: "course",
        title: courseRow?.title || "Course Step",
        step_label: `STEP ${nextPosition}`,
        position: nextPosition,
        is_required: isRequired,
        estimated_minutes: courseRow?.estimated_minutes || 0,
      });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    await syncLearningPathMetrics(pathId, supabase);

    revalidatePath(`/admin/learning-paths/${pathId}`);
    revalidatePath("/admin/learning-paths");
    revalidatePath("/learning-paths");

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to add course step.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Add a Project Milestone step to a Learning Path.
 */
export async function addProjectToLearningPathAction(
  pathId: string,
  input: {
    title: string;
    description?: string;
    estimatedMinutes?: number;
    isRequired?: boolean;
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    const title = input.title.trim();
    if (!title) return { success: false, error: "Project title is required." };

    // Get max position in this path
    const { data: items } = await supabase
      .from("learning_path_items")
      .select("position")
      .eq("learning_path_id", pathId)
      .order("position", { ascending: false })
      .limit(1);

    const nextPosition = (items?.[0]?.position ?? 0) + 1;

    const { error: insertError } = await supabase
      .from("learning_path_items")
      .insert({
        learning_path_id: pathId,
        course_id: null,
        item_type: "project",
        title,
        description: input.description?.trim() || null,
        step_label: "FINAL PROJECT",
        position: nextPosition,
        is_required: input.isRequired ?? false,
        estimated_minutes: input.estimatedMinutes || 30,
      });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    await syncLearningPathMetrics(pathId, supabase);

    revalidatePath(`/admin/learning-paths/${pathId}`);
    revalidatePath("/admin/learning-paths");
    revalidatePath("/learning-paths");

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to add project milestone.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Update an existing Learning Path Item.
 */
export async function updateLearningPathItemAction(
  itemId: string,
  pathId: string,
  input: {
    title?: string;
    description?: string;
    stepLabel?: string;
    isRequired?: boolean;
    estimatedMinutes?: number;
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    const { error } = await supabase
      .from("learning_path_items")
      .update({
        title: input.title !== undefined ? input.title.trim() : undefined,
        description: input.description !== undefined ? input.description.trim() : undefined,
        step_label: input.stepLabel !== undefined ? input.stepLabel.trim() : undefined,
        is_required: input.isRequired !== undefined ? input.isRequired : undefined,
        estimated_minutes: input.estimatedMinutes !== undefined ? input.estimatedMinutes : undefined,
      })
      .eq("id", itemId)
      .eq("learning_path_id", pathId);

    if (error) {
      return { success: false, error: error.message };
    }

    await syncLearningPathMetrics(pathId, supabase);

    revalidatePath(`/admin/learning-paths/${pathId}`);
    revalidatePath("/learning-paths");

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update item.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Remove an item from a Learning Path (does NOT delete course).
 */
export async function removeLearningPathItemAction(
  itemId: string,
  pathId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    const { error: deleteError } = await supabase
      .from("learning_path_items")
      .delete()
      .eq("id", itemId)
      .eq("learning_path_id", pathId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // Renumber remaining items sequentially
    const { data: remainingItems } = await supabase
      .from("learning_path_items")
      .select("id, item_type")
      .eq("learning_path_id", pathId)
      .order("position", { ascending: true });

    if (remainingItems && remainingItems.length > 0) {
      // Temporary shift to avoid position collisions
      for (let i = 0; i < remainingItems.length; i++) {
        await supabase
          .from("learning_path_items")
          .update({ position: 1000 + i })
          .eq("id", remainingItems[i].id);
      }

      // Final sequential renumbering
      for (let i = 0; i < remainingItems.length; i++) {
        const item = remainingItems[i];
        const stepLabel = item.item_type === "project" ? "FINAL PROJECT" : `STEP ${i + 1}`;
        await supabase
          .from("learning_path_items")
          .update({ position: i + 1, step_label: stepLabel })
          .eq("id", item.id);
      }
    }

    await syncLearningPathMetrics(pathId, supabase);

    revalidatePath(`/admin/learning-paths/${pathId}`);
    revalidatePath("/admin/learning-paths");
    revalidatePath("/learning-paths");

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to remove item.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Reorder Learning Path Items safely without unique constraint collisions.
 */
export async function reorderLearningPathItemsAction(
  pathId: string,
  orderedItemIds: string[],
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    // Fetch existing items
    const { data: items } = await supabase
      .from("learning_path_items")
      .select("id, item_type")
      .eq("learning_path_id", pathId);

    if (!items) return { success: false, error: "Path items not found." };

    const itemMap = new Map(items.map((it) => [it.id, it]));

    // Check all IDs exist and belong to this path
    for (const id of orderedItemIds) {
      if (!itemMap.has(id)) {
        return { success: false, error: "Invalid item ID for this path." };
      }
    }

    // 1. Shift all items to offset +1000
    for (let i = 0; i < orderedItemIds.length; i++) {
      await supabase
        .from("learning_path_items")
        .update({ position: 1000 + i })
        .eq("id", orderedItemIds[i])
        .eq("learning_path_id", pathId);
    }

    // 2. Set final 1..N positions and update STEP labels
    for (let i = 0; i < orderedItemIds.length; i++) {
      const id = orderedItemIds[i];
      const item = itemMap.get(id);
      const stepLabel = item?.item_type === "project" ? "FINAL PROJECT" : `STEP ${i + 1}`;

      await supabase
        .from("learning_path_items")
        .update({ position: i + 1, step_label: stepLabel })
        .eq("id", id)
        .eq("learning_path_id", pathId);
    }

    revalidatePath(`/admin/learning-paths/${pathId}`);
    revalidatePath("/learning-paths");

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to reorder items.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Publish a Learning Path.
 */
export async function publishLearningPathAction(
  pathId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    // Validation before publish
    const { data: pathRow } = await supabase
      .from("learning_paths")
      .select("id, title, summary, difficulty, items:learning_path_items(id, course_id, item_type)")
      .eq("id", pathId)
      .single();

    if (!pathRow) return { success: false, error: "Path not found." };
    if (!pathRow.title) return { success: false, error: "Path requires a title." };

    const items = Array.isArray(pathRow.items) ? pathRow.items : [];
    if (items.length === 0) {
      return { success: false, error: "Path requires at least one step before publishing." };
    }

    const { error } = await supabase
      .from("learning_paths")
      .update({
        is_published: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pathId);

    if (error) return { success: false, error: error.message };

    await syncLearningPathMetrics(pathId, supabase);

    revalidatePath("/admin/learning-paths");
    revalidatePath(`/admin/learning-paths/${pathId}`);
    revalidatePath("/learning-paths");

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to publish Learning Path.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Unpublish a Learning Path.
 */
export async function unpublishLearningPathAction(
  pathId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    const { error } = await supabase
      .from("learning_paths")
      .update({
        is_published: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pathId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/learning-paths");
    revalidatePath(`/admin/learning-paths/${pathId}`);
    revalidatePath("/learning-paths");

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to unpublish Learning Path.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Delete a draft Learning Path.
 */
export async function deleteDraftLearningPathAction(
  pathId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { success: false, error: "Database unavailable." };

    // Ensure it is draft
    const { data: pathRow } = await supabase
      .from("learning_paths")
      .select("id, is_published")
      .eq("id", pathId)
      .single();

    if (!pathRow) return { success: false, error: "Learning Path not found." };
    if (pathRow.is_published) {
      return {
        success: false,
        error: "Cannot delete a published Learning Path. Please unpublish it first.",
      };
    }

    // Delete items first, then path
    await supabase.from("learning_path_items").delete().eq("learning_path_id", pathId);
    const { error } = await supabase.from("learning_paths").delete().eq("id", pathId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/learning-paths");
    revalidatePath("/learning-paths");

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to delete Learning Path.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Internal helper to sync course_count and estimated_minutes on learning_paths table.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function syncLearningPathMetrics(pathId: string, supabase: any) {
  try {
    const { data: items } = await supabase
      .from("learning_path_items")
      .select(`
        item_type,
        estimated_minutes,
        course:courses (
          estimated_minutes
        )
      `)
      .eq("learning_path_id", pathId);

    if (!items) return;

    let courseCount = 0;
    let totalMinutes = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items.forEach((it: any) => {
      if (it.item_type === "course") {
        courseCount++;
        const c = Array.isArray(it.course) ? it.course[0] : it.course;
        totalMinutes += Number(c?.estimated_minutes) || 0;
      } else {
        totalMinutes += Number(it.estimated_minutes) || 30;
      }
    });

    await supabase
      .from("learning_paths")
      .update({
        course_count: courseCount,
        estimated_minutes: totalMinutes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pathId);
  } catch {
    // Non-fatal
  }
}

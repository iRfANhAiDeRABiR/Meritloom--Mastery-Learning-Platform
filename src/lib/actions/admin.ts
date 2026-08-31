"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { YouTubePlaylistItemParsed } from "@/lib/types";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// -----------------------------------------------------------------------------
// 1. COURSE ACTIONS
// -----------------------------------------------------------------------------

export async function createCourseAction(params: {
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  categoryId?: string | null;
  difficulty?: "beginner" | "intermediate" | "advanced";
  language?: string;
  estimatedMinutes?: number;
  coverImageUrl?: string | null;
}): Promise<ActionResult<{ courseId: string; slug: string }>> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const title = params.title?.trim();
  const slug = params.slug?.trim().toLowerCase();

  if (!title || title.length < 3) {
    return { success: false, error: "Course title must be at least 3 characters." };
  }
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return { success: false, error: "Slug must contain only lowercase letters, numbers, and hyphens." };
  }

  try {
    const { data: existing } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "A course with this slug already exists." };
    }

    const { data, error } = await supabase
      .from("courses")
      .insert({
        title,
        slug,
        summary: params.summary?.trim() || null,
        description: params.description?.trim() || null,
        category_id: params.categoryId || null,
        difficulty: params.difficulty || "beginner",
        language: params.language || "English",
        estimated_minutes: params.estimatedMinutes || 0,
        cover_image_url: params.coverImageUrl || null,
        is_free: true,
        is_published: false,
      })
      .select("id, slug")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to create course." };
    }

    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { success: true, data: { courseId: data.id, slug: data.slug } };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function updateCourseOverviewAction(
  courseId: string,
  params: {
    title: string;
    slug: string;
    summary?: string;
    description?: string;
    categoryId?: string | null;
    difficulty?: "beginner" | "intermediate" | "advanced";
    language?: string;
    estimatedMinutes?: number;
    coverImageUrl?: string | null;
  },
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const title = params.title?.trim();
  const slug = params.slug?.trim().toLowerCase();

  if (!title || title.length < 3) {
    return { success: false, error: "Course title must be at least 3 characters." };
  }
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return { success: false, error: "Invalid slug format." };
  }

  try {
    const { data: existing } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", slug)
      .neq("id", courseId)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "A different course is already using this slug." };
    }

    const { error } = await supabase
      .from("courses")
      .update({
        title,
        slug,
        summary: params.summary?.trim() || null,
        description: params.description?.trim() || null,
        category_id: params.categoryId || null,
        difficulty: params.difficulty || "beginner",
        language: params.language || "English",
        estimated_minutes: params.estimatedMinutes || 0,
        cover_image_url: params.coverImageUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", courseId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath(`/courses/${slug}`);
    revalidatePath("/courses");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function publishCourseAction(courseId: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  try {
    const { data: course, error: getErr } = await supabase
      .from("courses")
      .select("id, slug, published_at")
      .eq("id", courseId)
      .single();

    if (getErr || !course) return { success: false, error: "Course not found." };

    const { error } = await supabase
      .from("courses")
      .update({
        is_published: true,
        published_at: course.published_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", courseId);

    if (error) return { success: false, error: error.message };

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath(`/courses/${course.slug}`);
    revalidatePath("/courses");
    revalidatePath("/admin/courses");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function unpublishCourseAction(courseId: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  try {
    const { data: course, error: getErr } = await supabase
      .from("courses")
      .select("id, slug")
      .eq("id", courseId)
      .single();

    if (getErr || !course) return { success: false, error: "Course not found." };

    const { error } = await supabase
      .from("courses")
      .update({
        is_published: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", courseId);

    if (error) return { success: false, error: error.message };

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath(`/courses/${course.slug}`);
    revalidatePath("/courses");
    revalidatePath("/admin/courses");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function recalculateCourseDurationAction(courseId: string): Promise<ActionResult<{ minutes: number }>> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  try {
    // 1. Fetch all required lessons across all modules for this course
    const { data: modules } = await supabase
      .from("course_modules")
      .select("id, lessons:lessons(estimated_minutes, is_bonus)")
      .eq("course_id", courseId);

    let totalMinutes = 0;
    interface ModuleWithLessons {
      id: string;
      lessons?: { estimated_minutes?: number | null; is_bonus?: boolean }[];
    }
    ((modules || []) as ModuleWithLessons[]).forEach((m) => {
      let modMinutes = 0;
      if (Array.isArray(m.lessons)) {
        m.lessons.forEach((l) => {
          if (!l.is_bonus && typeof l.estimated_minutes === "number") {
            modMinutes += l.estimated_minutes;
          }
        });
      }
      totalMinutes += modMinutes;

      // Update module duration
      supabase
        .from("course_modules")
        .update({ estimated_minutes: modMinutes, updated_at: new Date().toISOString() })
        .eq("id", m.id);
    });

    const { error } = await supabase
      .from("courses")
      .update({ estimated_minutes: totalMinutes, updated_at: new Date().toISOString() })
      .eq("id", courseId);

    if (error) return { success: false, error: error.message };

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true, data: { minutes: totalMinutes } };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function deleteDraftCourseAction(courseId: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  try {
    // Check if course is published or has enrollments
    const { data: course } = await supabase
      .from("courses")
      .select("is_published, enrollments:course_enrollments(id)")
      .eq("id", courseId)
      .single();

    if (!course) return { success: false, error: "Course not found." };
    if (course.is_published) {
      return { success: false, error: "Cannot delete a published course. Unpublish it first." };
    }
    if (Array.isArray(course.enrollments) && course.enrollments.length > 0) {
      return { success: false, error: "Cannot delete course because learners are enrolled." };
    }

    const { error } = await supabase.from("courses").delete().eq("id", courseId);
    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/courses");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

// -----------------------------------------------------------------------------
// 2. MODULE ACTIONS
// -----------------------------------------------------------------------------

export async function createModuleAction(
  courseId: string,
  params: {
    title: string;
    slug?: string;
    description?: string;
    position?: number;
    estimatedMinutes?: number;
    isPublished?: boolean;
  },
): Promise<ActionResult<{ moduleId: string }>> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const title = params.title?.trim();
  if (!title) return { success: false, error: "Module title is required." };

  try {
    // Determine next position if not specified
    let pos = params.position;
    if (!pos) {
      const { data: lastMod } = await supabase
        .from("course_modules")
        .select("position")
        .eq("course_id", courseId)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();

      pos = (lastMod?.position || 0) + 1;
    }

    const slug = params.slug?.trim().toLowerCase() || `module-${pos}`;

    const { data, error } = await supabase
      .from("course_modules")
      .insert({
        course_id: courseId,
        title,
        slug,
        description: params.description?.trim() || null,
        position: pos,
        estimated_minutes: params.estimatedMinutes || 0,
        is_published: params.isPublished ?? true,
      })
      .select("id")
      .single();

    if (error || !data) return { success: false, error: error?.message || "Failed to create module." };

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true, data: { moduleId: data.id } };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function updateModuleAction(
  moduleId: string,
  courseId: string,
  params: {
    title: string;
    slug?: string;
    description?: string;
    estimatedMinutes?: number;
    isPublished?: boolean;
  },
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const title = params.title?.trim();
  if (!title) return { success: false, error: "Module title is required." };

  try {
    const { error } = await supabase
      .from("course_modules")
      .update({
        title,
        slug: params.slug?.trim().toLowerCase() || null,
        description: params.description?.trim() || null,
        estimated_minutes: params.estimatedMinutes || 0,
        is_published: params.isPublished ?? true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", moduleId);

    if (error) return { success: false, error: error.message };

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function reorderModulesAction(
  courseId: string,
  orderedModuleIds: string[],
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  try {
    // Avoid unique constraint clashes by first shifting positions to temporary offset +1000
    for (let i = 0; i < orderedModuleIds.length; i++) {
      await supabase
        .from("course_modules")
        .update({ position: 1000 + i + 1 })
        .eq("id", orderedModuleIds[i]);
    }

    // Now set final 1-based positions
    for (let i = 0; i < orderedModuleIds.length; i++) {
      await supabase
        .from("course_modules")
        .update({ position: i + 1, updated_at: new Date().toISOString() })
        .eq("id", orderedModuleIds[i]);
    }

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function deleteModuleAction(
  moduleId: string,
  courseId: string,
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  try {
    const { error } = await supabase.from("course_modules").delete().eq("id", moduleId);
    if (error) return { success: false, error: error.message };

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

// -----------------------------------------------------------------------------
// 3. LESSON ACTIONS
// -----------------------------------------------------------------------------

export async function createLessonAction(
  moduleId: string,
  courseId: string,
  params: {
    title: string;
    slug: string;
    summary?: string;
    lessonType: "video" | "article" | "exercise" | "practice" | "knowledge_check";
    content?: unknown;
    videoUrl?: string | null;
    videoProvider?: string | null;
    youtubeVideoId?: string | null;
    sourceChannel?: string | null;
    sourceUrl?: string | null;
    playlistId?: string | null;
    keyTakeaway?: string | null;
    estimatedMinutes?: number;
    position?: number;
    isPreview?: boolean;
    isBonus?: boolean;
    isPublished?: boolean;
  },
): Promise<ActionResult<{ lessonId: string }>> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const title = params.title?.trim();
  const slug = params.slug?.trim().toLowerCase();

  if (!title) return { success: false, error: "Lesson title is required." };
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return { success: false, error: "Valid slug is required." };
  }

  try {
    // Check slug uniqueness
    const { data: existing } = await supabase
      .from("lessons")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "A lesson with this slug already exists." };
    }

    // Determine position
    let pos = params.position;
    if (!pos) {
      const { data: lastLesson } = await supabase
        .from("lessons")
        .select("position")
        .eq("module_id", moduleId)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();

      pos = (lastLesson?.position || 0) + 1;
    }

    const { data, error } = await supabase
      .from("lessons")
      .insert({
        module_id: moduleId,
        title,
        slug,
        summary: params.summary?.trim() || null,
        lesson_type: params.lessonType,
        content: params.content || null,
        video_url: params.videoUrl || (params.youtubeVideoId ? `https://www.youtube.com/watch?v=${params.youtubeVideoId}` : null),
        video_provider: params.videoProvider || (params.youtubeVideoId ? "youtube" : null),
        youtube_video_id: params.youtubeVideoId || null,
        source_channel: params.sourceChannel || null,
        source_url: params.sourceUrl || null,
        playlist_id: params.playlistId || null,
        key_takeaway: params.keyTakeaway?.trim() || null,
        estimated_minutes: params.estimatedMinutes || 5,
        position: pos,
        is_preview: params.isPreview ?? false,
        is_bonus: params.isBonus ?? false,
        is_published: params.isPublished ?? true,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to create lesson." };
    }

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true, data: { lessonId: data.id } };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function updateLessonAction(
  lessonId: string,
  courseId: string,
  params: {
    title: string;
    slug: string;
    summary?: string;
    lessonType: "video" | "article" | "exercise" | "practice" | "knowledge_check";
    content?: unknown;
    videoUrl?: string | null;
    videoProvider?: string | null;
    youtubeVideoId?: string | null;
    sourceChannel?: string | null;
    sourceUrl?: string | null;
    playlistId?: string | null;
    keyTakeaway?: string | null;
    estimatedMinutes?: number;
    isPreview?: boolean;
    isBonus?: boolean;
    isPublished?: boolean;
  },
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const title = params.title?.trim();
  const slug = params.slug?.trim().toLowerCase();

  if (!title) return { success: false, error: "Lesson title is required." };
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return { success: false, error: "Valid slug is required." };
  }

  try {
    const { data: existing } = await supabase
      .from("lessons")
      .select("id")
      .eq("slug", slug)
      .neq("id", lessonId)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "Another lesson already has this slug." };
    }

    const { error } = await supabase
      .from("lessons")
      .update({
        title,
        slug,
        summary: params.summary?.trim() || null,
        lesson_type: params.lessonType,
        content: params.content || null,
        video_url: params.videoUrl || (params.youtubeVideoId ? `https://www.youtube.com/watch?v=${params.youtubeVideoId}` : null),
        video_provider: params.videoProvider || (params.youtubeVideoId ? "youtube" : null),
        youtube_video_id: params.youtubeVideoId || null,
        source_channel: params.sourceChannel || null,
        source_url: params.sourceUrl || null,
        playlist_id: params.playlistId || null,
        key_takeaway: params.keyTakeaway?.trim() || null,
        estimated_minutes: params.estimatedMinutes || 5,
        is_preview: params.isPreview ?? false,
        is_bonus: params.isBonus ?? false,
        is_published: params.isPublished ?? true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", lessonId);

    if (error) return { success: false, error: error.message };

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function reorderLessonsAction(
  moduleId: string,
  courseId: string,
  orderedLessonIds: string[],
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  try {
    // Avoid unique(module_id, position) collisions with offset +1000
    for (let i = 0; i < orderedLessonIds.length; i++) {
      await supabase
        .from("lessons")
        .update({ position: 1000 + i + 1 })
        .eq("id", orderedLessonIds[i]);
    }

    for (let i = 0; i < orderedLessonIds.length; i++) {
      await supabase
        .from("lessons")
        .update({ position: i + 1, updated_at: new Date().toISOString() })
        .eq("id", orderedLessonIds[i]);
    }

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function deleteLessonAction(
  lessonId: string,
  courseId: string,
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  try {
    const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
    if (error) return { success: false, error: error.message };

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

// -----------------------------------------------------------------------------
// 4. LESSON OBJECTIVES & RESOURCES
// -----------------------------------------------------------------------------

export async function updateLessonObjectivesAction(
  lessonId: string,
  courseId: string,
  objectives: string[],
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  try {
    // Delete existing objectives
    await supabase.from("lesson_objectives").delete().eq("lesson_id", lessonId);

    const validObjs = objectives.map((o) => o.trim()).filter((o) => o.length > 0);
    if (validObjs.length > 0) {
      const inserts = validObjs.map((obj, i) => ({
        lesson_id: lessonId,
        objective_text: obj,
        position: i + 1,
      }));
      const { error } = await supabase.from("lesson_objectives").insert(inserts);
      if (error) return { success: false, error: error.message };
    }

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function updateLessonResourcesAction(
  lessonId: string,
  courseId: string,
  resources: { label: string; resourceType: string; url?: string }[],
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  try {
    await supabase.from("lesson_resources").delete().eq("lesson_id", lessonId);

    const validRes = resources.filter((r) => r.label.trim().length > 0);
    if (validRes.length > 0) {
      const inserts = validRes.map((r, i) => ({
        lesson_id: lessonId,
        label: r.label.trim(),
        resource_type: r.resourceType || "external_link",
        url: r.url?.trim() || null,
        position: i + 1,
      }));
      const { error } = await supabase.from("lesson_resources").insert(inserts);
      if (error) return { success: false, error: error.message };
    }

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

// -----------------------------------------------------------------------------
// 5. PRACTICE QUIZ / KNOWLEDGE CHECK ACTIONS
// -----------------------------------------------------------------------------

export async function saveLessonQuizAction(
  lessonId: string,
  courseId: string,
  quizData: {
    title: string;
    description?: string;
    estimatedMinutes?: number;
    questions: {
      id?: string;
      questionType: "single_choice" | "multiple_choice" | "true_false";
      questionText: string;
      topic?: string;
      codeContent?: string;
      explanation?: string;
      options: { id?: string; text: string; isCorrect: boolean }[];
    }[];
  },
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  try {
    // 1. Find or create practice_quizzes record for this lesson
    let quizId: string;
    const { data: existingQuiz } = await supabase
      .from("practice_quizzes")
      .select("id")
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (existingQuiz) {
      quizId = existingQuiz.id;
      await supabase
        .from("practice_quizzes")
        .update({
          title: quizData.title.trim() || "Knowledge Check",
          description: quizData.description?.trim() || null,
          estimated_minutes: quizData.estimatedMinutes || 5,
          updated_at: new Date().toISOString(),
        })
        .eq("id", quizId);
    } else {
      const { data: newQuiz, error: createQErr } = await supabase
        .from("practice_quizzes")
        .insert({
          lesson_id: lessonId,
          title: quizData.title.trim() || "Knowledge Check",
          description: quizData.description?.trim() || null,
          estimated_minutes: quizData.estimatedMinutes || 5,
          is_published: true,
        })
        .select("id")
        .single();

      if (createQErr || !newQuiz) return { success: false, error: "Failed to initialize quiz." };
      quizId = newQuiz.id;
    }

    // 2. Clear old questions to rebuild safely
    await supabase.from("practice_questions").delete().eq("quiz_id", quizId);

    // 3. Insert questions, options, and correct answers
    for (let qIdx = 0; qIdx < quizData.questions.length; qIdx++) {
      const q = quizData.questions[qIdx];
      if (!q.questionText.trim()) continue;

      const { data: insertedQ, error: qErr } = await supabase
        .from("practice_questions")
        .insert({
          quiz_id: quizId,
          question_type: q.questionType,
          question_text: q.questionText.trim(),
          topic: q.topic?.trim() || null,
          code_content: q.codeContent?.trim() || null,
          explanation: q.explanation?.trim() || null,
          position: qIdx + 1,
        })
        .select("id")
        .single();

      if (qErr || !insertedQ) continue;

      const validOpts = q.options.filter((opt) => opt.text.trim().length > 0);
      for (let oIdx = 0; oIdx < validOpts.length; oIdx++) {
        const opt = validOpts[oIdx];
        const { data: insertedOpt } = await supabase
          .from("practice_question_options")
          .insert({
            question_id: insertedQ.id,
            option_text: opt.text.trim(),
            position: oIdx + 1,
          })
          .select("id")
          .single();

        if (insertedOpt && opt.isCorrect) {
          await supabase
            .from("practice_question_correct_options")
            .insert({
              question_id: insertedQ.id,
              option_id: insertedOpt.id,
            });
        }
      }
    }

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

// -----------------------------------------------------------------------------
// 6. OUTCOMES, PREREQUISITES & SKILLS
// -----------------------------------------------------------------------------

export async function updateCourseOutcomesAction(
  courseId: string,
  outcomes: string[],
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  try {
    await supabase.from("course_learning_outcomes").delete().eq("course_id", courseId);

    const valid = outcomes.map((o) => o.trim()).filter((o) => o.length > 0);
    if (valid.length > 0) {
      const inserts = valid.map((text, i) => ({
        course_id: courseId,
        outcome_text: text,
        position: i + 1,
      }));
      const { error } = await supabase.from("course_learning_outcomes").insert(inserts);
      if (error) return { success: false, error: error.message };
    }

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function updateCoursePrerequisitesAction(
  courseId: string,
  prerequisites: string[],
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  try {
    await supabase.from("course_prerequisites").delete().eq("course_id", courseId);

    const valid = prerequisites.map((p) => p.trim()).filter((p) => p.length > 0);
    if (valid.length > 0) {
      const inserts = valid.map((text, i) => ({
        course_id: courseId,
        prerequisite_text: text,
        position: i + 1,
      }));
      const { error } = await supabase.from("course_prerequisites").insert(inserts);
      if (error) return { success: false, error: error.message };
    }

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function updateCourseSkillsAction(
  courseId: string,
  skillIds: string[],
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  try {
    await supabase.from("course_skills").delete().eq("course_id", courseId);

    if (skillIds.length > 0) {
      const inserts = skillIds.map((sId) => ({
        course_id: courseId,
        skill_id: sId,
      }));
      const { error } = await supabase.from("course_skills").insert(inserts);
      if (error) return { success: false, error: error.message };
    }

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function createSkillAction(params: {
  name: string;
  slug: string;
  description?: string;
}): Promise<ActionResult<{ skillId: string }>> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const name = params.name?.trim();
  const slug = params.slug?.trim().toLowerCase();

  if (!name || !slug) return { success: false, error: "Skill name and slug are required." };

  try {
    // If slug exists, return existing
    const { data: existing } = await supabase
      .from("skills")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      return { success: true, data: { skillId: existing.id } };
    }

    const { data, error } = await supabase
      .from("skills")
      .insert({
        name,
        slug,
        description: params.description?.trim() || null,
        is_active: true,
      })
      .select("id")
      .single();

    if (error || !data) return { success: false, error: error?.message || "Failed to create skill." };

    revalidatePath("/admin/skills");
    return { success: true, data: { skillId: data.id } };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

// -----------------------------------------------------------------------------
// 7. CATEGORY ACTIONS
// -----------------------------------------------------------------------------

export async function createCategoryAction(params: {
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  position?: number;
}): Promise<ActionResult<{ categoryId: string }>> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const name = params.name?.trim();
  const slug = params.slug?.trim().toLowerCase();

  if (!name || !slug) return { success: false, error: "Category name and slug are required." };

  try {
    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        slug,
        description: params.description?.trim() || null,
        icon_name: params.iconName || "Layers",
        position: params.position || 1,
        is_active: true,
      })
      .select("id")
      .single();

    if (error || !data) return { success: false, error: error?.message || "Failed to create category." };

    revalidatePath("/admin/categories");
    revalidatePath("/courses");
    return { success: true, data: { categoryId: data.id } };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

export async function updateCategoryAction(
  categoryId: string,
  params: {
    name: string;
    slug: string;
    description?: string;
    iconName?: string;
    position?: number;
    isActive?: boolean;
  },
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  const name = params.name?.trim();
  const slug = params.slug?.trim().toLowerCase();

  if (!name || !slug) return { success: false, error: "Category name and slug are required." };

  try {
    const { error } = await supabase
      .from("categories")
      .update({
        name,
        slug,
        description: params.description?.trim() || null,
        icon_name: params.iconName || "Layers",
        position: params.position || 1,
        is_active: params.isActive ?? true,
      })
      .eq("id", categoryId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/categories");
    revalidatePath("/courses");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

// -----------------------------------------------------------------------------
// 8. PLAYLIST IMPORT ACTION
// -----------------------------------------------------------------------------

export async function importYouTubePlaylistAction(
  courseId: string,
  targetModuleId: string | null,
  newModuleTitle: string | null,
  items: YouTubePlaylistItemParsed[],
): Promise<ActionResult<{ importedCount: number }>> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { success: false, error: "Database unavailable." };

  try {
    // 1. Resolve or create target module
    let moduleId = targetModuleId;
    if (!moduleId && newModuleTitle) {
      const modRes = await createModuleAction(courseId, {
        title: newModuleTitle.trim(),
        isPublished: true,
      });
      if (!modRes.success || !modRes.data?.moduleId) {
        return { success: false, error: modRes.error || "Failed to create target module." };
      }
      moduleId = modRes.data.moduleId;
    }

    if (!moduleId) {
      return { success: false, error: "Target module is required." };
    }

    // 2. Get existing lessons in module to determine starting position
    const { data: lastLesson } = await supabase
      .from("lessons")
      .select("position")
      .eq("module_id", moduleId)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    let startPos = (lastLesson?.position || 0) + 1;
    let importedCount = 0;

    for (const item of items) {
      // Check if video ID already exists in this course
      const { data: existingVid } = await supabase
        .from("lessons")
        .select("id")
        .eq("youtube_video_id", item.videoId)
        .maybeSingle();

      if (existingVid) continue; // Skip duplicates

      // Ensure slug uniqueness
      let lessonSlug = item.slug;
      const { data: existingSlug } = await supabase
        .from("lessons")
        .select("id")
        .eq("slug", lessonSlug)
        .maybeSingle();

      if (existingSlug) {
        lessonSlug = `${lessonSlug}-${item.videoId.slice(0, 6)}`;
      }

      await supabase.from("lessons").insert({
        module_id: moduleId,
        title: item.cleanTitle,
        slug: lessonSlug,
        summary: `In this video lesson, learners explore ${item.cleanTitle}.`,
        lesson_type: "video",
        video_url: item.videoUrl,
        video_provider: "youtube",
        youtube_video_id: item.videoId,
        source_channel: item.channelTitle,
        source_url: item.videoUrl,
        playlist_id: item.playlistId,
        estimated_minutes: item.durationMinutes || 5,
        position: startPos++,
        is_preview: importedCount === 0, // First video can be preview
        is_bonus: item.isBonus,
        is_published: true,
      });

      importedCount++;
    }

    // Recalculate duration automatically
    await recalculateCourseDurationAction(courseId);

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true, data: { importedCount } };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}

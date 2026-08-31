import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  LearnerLessonBookmarkItem,
  LearnerLessonNoteItem,
  LessonType,
  MyNotesPageData,
} from "@/lib/types";

interface RawNoteRow {
  id: string;
  lesson_id: string;
  content: string;
  updated_at: string;
  lesson?: {
    id: string;
    slug: string;
    title: string;
    lesson_type: string;
    module?: {
      title: string;
      course?: {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      } | {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      }[];
    } | {
      title: string;
      course?: {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      } | {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      }[];
    }[];
  } | {
    id: string;
    slug: string;
    title: string;
    lesson_type: string;
    module?: {
      title: string;
      course?: {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      } | {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      }[];
    } | {
      title: string;
      course?: {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      } | {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      }[];
    }[];
  }[];
}

interface RawBookmarkRow {
  id: string;
  lesson_id: string;
  created_at: string;
  lesson?: {
    id: string;
    slug: string;
    title: string;
    lesson_type: string;
    estimated_minutes: number | null;
    module?: {
      title: string;
      course?: {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      } | {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      }[];
    } | {
      title: string;
      course?: {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      } | {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      }[];
    }[];
  } | {
    id: string;
    slug: string;
    title: string;
    lesson_type: string;
    estimated_minutes: number | null;
    module?: {
      title: string;
      course?: {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      } | {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      }[];
    } | {
      title: string;
      course?: {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      } | {
        id: string;
        slug: string;
        title: string;
        is_published: boolean;
      }[];
    }[];
  }[];
}

/**
 * Fetch all private notes and bookmarked lessons for the authenticated learner.
 */
export async function getMyNotesAndBookmarksData(
  userId: string,
): Promise<MyNotesPageData> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { notes: [], bookmarks: [], availableCourses: [] };
  }

  try {
    const [notesRes, bookmarksRes, progressRes] = await Promise.all([
      supabase
        .from("lesson_notes")
        .select(`
          id,
          lesson_id,
          content,
          updated_at,
          lesson:lessons (
            id,
            slug,
            title,
            lesson_type,
            module:course_modules (
              title,
              course:courses (
                id,
                slug,
                title,
                is_published
              )
            )
          )
        `)
        .eq("user_id", userId)
        .neq("content", "")
        .order("updated_at", { ascending: false }),

      supabase
        .from("lesson_bookmarks")
        .select(`
          id,
          lesson_id,
          created_at,
          lesson:lessons (
            id,
            slug,
            title,
            lesson_type,
            estimated_minutes,
            module:course_modules (
              title,
              course:courses (
                id,
                slug,
                title,
                is_published
              )
            )
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),

      supabase
        .from("lesson_progress")
        .select("lesson_id, completed")
        .eq("user_id", userId)
        .eq("completed", true),
    ]);

    const completedLessonIds = new Set(
      (progressRes.data || []).map((p) => p.lesson_id),
    );

    const bookmarkedLessonIds = new Set<string>();
    const notedLessonIds = new Set<string>();

    const coursesMap = new Map<string, { slug: string; title: string }>();

    // Process Notes
    const notes: LearnerLessonNoteItem[] = [];
    if (notesRes.data) {
      for (const row of notesRes.data as unknown as RawNoteRow[]) {
        const l = Array.isArray(row.lesson) ? row.lesson[0] : row.lesson;
        if (!l) continue;

        const m = Array.isArray(l.module) ? l.module[0] : l.module;
        const c = Array.isArray(m?.course) ? m?.course[0] : m?.course;
        if (!c) continue;

        notedLessonIds.add(row.lesson_id);
        coursesMap.set(c.slug, { slug: c.slug, title: c.title });

        notes.push({
          id: row.id,
          lessonId: row.lesson_id,
          lessonSlug: l.slug,
          lessonTitle: l.title,
          lessonType: (l.lesson_type || "article") as LessonType,
          courseId: c.id,
          courseSlug: c.slug,
          courseTitle: c.title,
          moduleTitle: m?.title || "Module",
          content: row.content,
          updatedAt: row.updated_at,
          isBookmarked: false, // will update below
        });
      }
    }

    // Process Bookmarks
    const bookmarks: LearnerLessonBookmarkItem[] = [];
    if (bookmarksRes.data) {
      for (const row of bookmarksRes.data as unknown as RawBookmarkRow[]) {
        const l = Array.isArray(row.lesson) ? row.lesson[0] : row.lesson;
        if (!l) continue;

        const m = Array.isArray(l.module) ? l.module[0] : l.module;
        const c = Array.isArray(m?.course) ? m?.course[0] : m?.course;
        if (!c) continue;

        bookmarkedLessonIds.add(row.lesson_id);
        coursesMap.set(c.slug, { slug: c.slug, title: c.title });

        bookmarks.push({
          id: row.id,
          lessonId: row.lesson_id,
          lessonSlug: l.slug,
          lessonTitle: l.title,
          lessonType: (l.lesson_type || "article") as LessonType,
          estimatedMinutes: l.estimated_minutes,
          courseId: c.id,
          courseSlug: c.slug,
          courseTitle: c.title,
          moduleTitle: m?.title || "Module",
          isCompleted: completedLessonIds.has(row.lesson_id),
          hasNote: notedLessonIds.has(row.lesson_id),
          bookmarkedAt: row.created_at,
        });
      }
    }

    // Correlate note bookmarked flag
    for (const n of notes) {
      n.isBookmarked = bookmarkedLessonIds.has(n.lessonId);
    }

    return {
      notes,
      bookmarks,
      availableCourses: Array.from(coursesMap.values()),
    };
  } catch {
    return { notes: [], bookmarks: [], availableCourses: [] };
  }
}

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ALL_STATIC_COURSES } from "@/lib/data/static-courses";
import { ALL_STATIC_QUIZZES } from "@/lib/data/static-quizzes";
import type {
  AdminCourseDetail,
  AdminCourseListItem,
  AdminDashboardMetrics,
  AdminInstructorDetail,
  AdminKnowledgeCheckItem,
  AdminKnowledgeChecksData,
  AdminLearnerListItem,
  AdminLearningPathDetail,
  AdminLearningPathItemDetail,
  AdminLearningPathListItem,
  AdminLessonDetail,
  AdminModuleDetail,
  AdminQuestionDetail,
  AdminQuizDetail,
  AdminSupportMessage,
  AvailableCourseForPath,
  Category,
  CourseDifficulty,
  LessonType,
  SupportMessageStatus,
  SupportMessageTopic,
} from "@/lib/types";

/**
 * Fetch overview metrics for the Admin Dashboard.
 */
export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const supabase = await createSupabaseServerClient();
  const fallback: AdminDashboardMetrics = {
    publishedCoursesCount: 0,
    draftCoursesCount: 0,
    publishedLessonsCount: 0,
    categoriesCount: 0,
    learningPathsCount: 0,
    learnersCount: 0,
    enrollmentsCount: 0,
    unreadMessagesCount: 0,
    recentCourses: [],
  };

  if (!supabase) return fallback;

  try {
    const [
      coursesRes,
      lessonsRes,
      catRes,
      pathsRes,
      profilesRes,
      enrollmentsRes,
      messagesRes,
    ] = await Promise.all([
      supabase.from("courses").select("id, is_published"),
      supabase.from("lessons").select("id, is_published"),
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase.from("learning_paths").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("course_enrollments").select("id", { count: "exact", head: true }),
      supabase.from("support_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    ]);

    const coursesData = coursesRes.data || [];
    const publishedCourses = coursesData.filter((c) => c.is_published);
    const draftCourses = coursesData.filter((c) => !c.is_published);
    const publishedLessons = (lessonsRes.data || []).filter((l) => l.is_published);
    const categoriesCount = catRes.count ?? (catRes.data || []).length;
    const learningPathsCount = pathsRes.count ?? 0;
    const learnersCount = profilesRes.count ?? 0;
    const enrollmentsCount = enrollmentsRes.count ?? 0;
    const unreadMessagesCount = messagesRes.count ?? 0;

    const recentCoursesList = await getAdminCoursesList({});

    return {
      publishedCoursesCount: publishedCourses.length,
      draftCoursesCount: draftCourses.length,
      publishedLessonsCount: publishedLessons.length,
      categoriesCount,
      learningPathsCount,
      learnersCount,
      enrollmentsCount,
      unreadMessagesCount,
      recentCourses: recentCoursesList.slice(0, 5),
    };
  } catch {
    return fallback;
  }
}

interface RawCourseListRow {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  difficulty: string | null;
  is_published: boolean | null;
  is_free: boolean | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  cover_image_url: string | null;
  estimated_minutes: number | null;
  instructor_profile_id?: string | null;
  instructor?: { display_name?: string } | { display_name?: string }[] | null;
  category?: { name?: string; slug?: string } | { name?: string; slug?: string }[] | null;
  modules?: { id: string; lessons?: { id: string }[] }[] | null;
}

/**
 * Fetch all courses for Admin Courses List with filtering.
 */
export async function getAdminCoursesList(params: {
  q?: string;
  status?: string;
  category?: string;
}): Promise<AdminCourseListItem[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from("courses")
      .select(`
        id,
        slug,
        title,
        summary,
        difficulty,
        is_published,
        is_free,
        published_at,
        created_at,
        updated_at,
        cover_image_url,
        estimated_minutes,
        instructor_profile_id,
        instructor:instructor_profiles (display_name),
        category:categories (name, slug),
        modules:course_modules (
          id,
          lessons:lessons (id)
        )
      `)
      .order("updated_at", { ascending: false });

    const q = (params.q ?? "").trim().toLowerCase();
    if (q) {
      const clean = q.replace(/[%_]/g, "");
      query = query.or(`title.ilike.%${clean}%,slug.ilike.%${clean}%,summary.ilike.%${clean}%`);
    }

    const status = (params.status ?? "all").toLowerCase().trim();
    if (status === "published") {
      query = query.eq("is_published", true);
    } else if (status === "draft") {
      query = query.eq("is_published", false);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    let items: AdminCourseListItem[] = (data as unknown as RawCourseListRow[]).map((row) => {
      const cat = Array.isArray(row.category) ? row.category[0] : row.category;
      const inst = Array.isArray(row.instructor) ? row.instructor[0] : row.instructor;
      const modules = Array.isArray(row.modules) ? row.modules : [];
      let totalLessons = 0;
      modules.forEach((m) => {
        if (Array.isArray(m.lessons)) totalLessons += m.lessons.length;
      });

      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        categoryName: cat?.name ?? null,
        categorySlug: cat?.slug ?? null,
        instructorName: inst?.display_name ?? null,
        instructorProfileId: row.instructor_profile_id ?? null,
        difficulty: (row.difficulty || "beginner") as CourseDifficulty,
        isPublished: Boolean(row.is_published),
        isFree: row.is_free !== false,
        publishedAt: row.published_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        coverImageUrl: row.cover_image_url,
        moduleCount: modules.length,
        lessonCount: totalLessons,
        estimatedMinutes: row.estimated_minutes,
      };
    });

    if (params.category && params.category !== "all") {
      const catFilter = params.category.toLowerCase().trim();
      items = items.filter((c) => c.categorySlug === catFilter);
    }

    return items;
  } catch {
    return [];
  }
}

interface RawOptionRow {
  id: string;
  option_text: string;
  position: number;
}

interface RawQuestionRow {
  id: string;
  quiz_id: string;
  question_type: "single_choice" | "multiple_choice" | "true_false";
  question_text: string;
  topic: string | null;
  code_content: string | null;
  code_language: string | null;
  explanation: string | null;
  position: number;
  options?: RawOptionRow[] | null;
  correct_options?: { option_id: string }[] | null;
}

interface RawQuizRow {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  estimated_minutes: number;
  is_published: boolean;
  questions?: RawQuestionRow[] | null;
}

interface RawObjectiveRow {
  id: string;
  objective_text: string;
  position: number;
}

interface RawResourceRow {
  id: string;
  label: string;
  resource_type: string;
  url: string | null;
  file_path: string | null;
  position: number;
}

interface RawLessonRow {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  summary: string | null;
  lesson_type: LessonType;
  content: unknown;
  video_url: string | null;
  video_provider: string | null;
  youtube_video_id: string | null;
  source_channel: string | null;
  source_url: string | null;
  playlist_id: string | null;
  key_takeaway: string | null;
  estimated_minutes: number | null;
  position: number;
  is_preview: boolean | null;
  is_bonus: boolean | null;
  is_published: boolean | null;
  objectives?: RawObjectiveRow[] | null;
  resources?: RawResourceRow[] | null;
  quizzes?: RawQuizRow | RawQuizRow[] | null;
}

interface RawModuleRow {
  id: string;
  course_id: string;
  slug: string | null;
  title: string;
  description: string | null;
  position: number;
  estimated_minutes: number | null;
  is_published: boolean | null;
  lessons?: RawLessonRow[] | null;
}

/**
 * Fetch complete course structure for the Admin Course Editor.
 */
export async function getAdminCourseDetail(
  courseIdOrSlug: string,
): Promise<AdminCourseDetail | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      courseIdOrSlug,
    );

    let courseQuery = supabase
      .from("courses")
      .select(`
        id,
        slug,
        title,
        summary,
        description,
        difficulty,
        language,
        estimated_minutes,
        cover_image_url,
        is_free,
        is_published,
        published_at,
        created_at,
        updated_at,
        category_id,
        instructor_profile_id,
        instructor:instructor_profiles (id, display_name, title, bio, avatar_url, is_published),
        category:categories (id, name, slug)
      `);

    if (isUuid) {
      courseQuery = courseQuery.eq("id", courseIdOrSlug);
    } else {
      courseQuery = courseQuery.eq("slug", courseIdOrSlug);
    }

    const { data: courseRow, error: courseErr } = await courseQuery.maybeSingle();
    if (courseErr || !courseRow) return null;

    const courseId = courseRow.id;

    const [modulesRes, outcomesRes, prereqsRes, skillsRes, pathRes] = await Promise.all([
      supabase
        .from("course_modules")
        .select(`
          id,
          course_id,
          slug,
          title,
          description,
          position,
          estimated_minutes,
          is_published,
          lessons:lessons (
            id,
            module_id,
            slug,
            title,
            summary,
            lesson_type,
            content,
            video_url,
            video_provider,
            youtube_video_id,
            source_channel,
            source_url,
            playlist_id,
            key_takeaway,
            estimated_minutes,
            position,
            is_preview,
            is_bonus,
            is_published,
            objectives:lesson_objectives (id, objective_text, position),
            resources:lesson_resources (id, label, resource_type, url, file_path, position),
            quizzes:practice_quizzes (
              id,
              lesson_id,
              title,
              description,
              estimated_minutes,
              is_published,
              questions:practice_questions (
                id,
                quiz_id,
                question_type,
                question_text,
                topic,
                code_content,
                code_language,
                explanation,
                position,
                options:practice_question_options (id, option_text, position),
                correct_options:practice_question_correct_options (option_id)
              )
            )
          )
        `)
        .eq("course_id", courseId)
        .order("position", { ascending: true }),

      supabase
        .from("course_learning_outcomes")
        .select("id, outcome_text, position")
        .eq("course_id", courseId)
        .order("position", { ascending: true }),

      supabase
        .from("course_prerequisites")
        .select("id, prerequisite_text, position")
        .eq("course_id", courseId)
        .order("position", { ascending: true }),

      supabase
        .from("course_skills")
        .select("skill:skills(id, name, slug)")
        .eq("course_id", courseId),

      supabase
        .from("learning_path_items")
        .select("path:learning_paths(id, title, slug)")
        .eq("course_id", courseId)
        .maybeSingle(),
    ]);

    const rawModules = (modulesRes.data || []) as unknown as RawModuleRow[];
    const modules: AdminModuleDetail[] = rawModules.map((m) => {
      const rawLessons = Array.isArray(m.lessons) ? m.lessons : [];
      const lessons: AdminLessonDetail[] = rawLessons
        .sort((a, b) => a.position - b.position)
        .map((l) => {
          const rawObjectives = Array.isArray(l.objectives) ? l.objectives : [];
          const rawResources = Array.isArray(l.resources) ? l.resources : [];
          const rawQuiz = Array.isArray(l.quizzes) ? l.quizzes[0] : l.quizzes;

          let quizDetail: AdminQuizDetail | null = null;
          if (rawQuiz) {
            const rawQuestions = Array.isArray(rawQuiz.questions) ? rawQuiz.questions : [];
            const questions: AdminQuestionDetail[] = rawQuestions
              .sort((a, b) => a.position - b.position)
              .map((q) => {
                const correctSet = new Set((q.correct_options || []).map((co) => co.option_id));
                const rawOptions = Array.isArray(q.options) ? q.options : [];
                const options = rawOptions
                  .sort((a, b) => a.position - b.position)
                  .map((opt) => ({
                    id: opt.id,
                    text: opt.option_text,
                    position: opt.position,
                    isCorrect: correctSet.has(opt.id),
                  }));

                return {
                  id: q.id,
                  quizId: q.quiz_id,
                  questionType: q.question_type,
                  questionText: q.question_text,
                  topic: q.topic,
                  codeContent: q.code_content,
                  codeLanguage: q.code_language,
                  explanation: q.explanation,
                  position: q.position,
                  options,
                };
              });

            quizDetail = {
              id: rawQuiz.id,
              lessonId: rawQuiz.lesson_id,
              title: rawQuiz.title,
              description: rawQuiz.description,
              estimatedMinutes: rawQuiz.estimated_minutes,
              isPublished: rawQuiz.is_published,
              questions,
            };
          }

          return {
            id: l.id,
            moduleId: l.module_id,
            courseId,
            slug: l.slug,
            title: l.title,
            summary: l.summary,
            lessonType: l.lesson_type,
            content: l.content,
            videoUrl: l.video_url,
            videoProvider: l.video_provider,
            youtubeVideoId: l.youtube_video_id,
            sourceChannel: l.source_channel,
            sourceUrl: l.source_url,
            playlistId: l.playlist_id,
            keyTakeaway: l.key_takeaway,
            estimatedMinutes: l.estimated_minutes,
            position: l.position,
            isPreview: Boolean(l.is_preview),
            isBonus: Boolean(l.is_bonus),
            isPublished: Boolean(l.is_published),
            objectives: rawObjectives
              .sort((a, b) => a.position - b.position)
              .map((o) => ({
                id: o.id,
                text: o.objective_text,
                position: o.position,
              })),
            resources: rawResources
              .sort((a, b) => a.position - b.position)
              .map((r) => ({
                id: r.id,
                label: r.label,
                resourceType: r.resource_type,
                url: r.url || r.file_path,
                position: r.position,
              })),
            quiz: quizDetail,
          };
        });

      return {
        id: m.id,
        courseId: m.course_id,
        slug: m.slug,
        title: m.title,
        description: m.description,
        position: m.position,
        estimatedMinutes: m.estimated_minutes,
        isPublished: Boolean(m.is_published),
        lessons,
      };
    });

    const cat = Array.isArray(courseRow.category) ? courseRow.category[0] : courseRow.category;
    const outcomes = (outcomesRes.data || []).map((o: { id: string; outcome_text: string; position: number }) => ({
      id: o.id,
      outcomeText: o.outcome_text,
      position: o.position,
    }));
    const prerequisites = (prereqsRes.data || []).map((p: { id: string; prerequisite_text: string; position: number }) => ({
      id: p.id,
      prerequisiteText: p.prerequisite_text,
      position: p.position,
    }));

    interface RawCourseSkillItem {
      skill?: { id: string; name: string; slug: string } | null;
    }
    const skills = ((skillsRes.data || []) as unknown as RawCourseSkillItem[])
      .filter((s) => s.skill)
      .map((s) => ({
        id: s.skill!.id,
        name: s.skill!.name,
        slug: s.skill!.slug,
      }));

    interface RawPathItem {
      path?: { id: string; title: string; slug: string } | { id: string; title: string; slug: string }[] | null;
    }
    const pathItem = pathRes.data as unknown as RawPathItem | null;
    const pathData = Array.isArray(pathItem?.path) ? pathItem.path[0] : pathItem?.path;

    interface RawInstructorItem {
      id: string;
      display_name: string;
      title: string | null;
      bio: string | null;
      avatar_url: string | null;
      is_published: boolean;
    }
    const inst = (Array.isArray(courseRow.instructor) ? courseRow.instructor[0] : courseRow.instructor) as RawInstructorItem | null;
    const instructorDetail: AdminInstructorDetail | null = inst
      ? {
          id: inst.id,
          profileId: null,
          displayName: inst.display_name,
          title: inst.title,
          bio: inst.bio,
          avatarUrl: inst.avatar_url,
          isPublished: inst.is_published,
          createdAt: "",
          updatedAt: "",
        }
      : null;

    return {
      id: courseRow.id,
      slug: courseRow.slug,
      title: courseRow.title,
      summary: courseRow.summary,
      description: courseRow.description,
      categoryId: courseRow.category_id,
      categoryName: cat?.name ?? null,
      categorySlug: cat?.slug ?? null,
      instructorProfileId: courseRow.instructor_profile_id ?? null,
      instructor: instructorDetail,
      difficulty: (courseRow.difficulty || "beginner") as CourseDifficulty,
      language: courseRow.language || "English",
      estimatedMinutes: courseRow.estimated_minutes,
      coverImageUrl: courseRow.cover_image_url,
      isFree: courseRow.is_free !== false,
      isPublished: Boolean(courseRow.is_published),
      publishedAt: courseRow.published_at,
      createdAt: courseRow.created_at,
      updatedAt: courseRow.updated_at,
      modules,
      learningOutcomes: outcomes,
      prerequisites,
      skills,
      learningPathName: pathData?.title ?? null,
      learningPathSlug: pathData?.slug ?? null,
    };
  } catch {
    return null;
  }
}

interface RawCategoryRow {
  id: string;
  slug: string;
  name: string;
  icon_name: string | null;
  description: string | null;
  position: number;
  courses?: { id: string }[] | null;
}

/**
 * Fetch all categories for Admin Categories Management.
 */
export async function getAdminCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, slug, name, icon_name, description, position, courses:courses(id)")
      .order("position", { ascending: true });

    if (error || !data) return [];

    return (data as unknown as RawCategoryRow[]).map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      iconName: row.icon_name || undefined,
      description: row.description || undefined,
      courseCount: Array.isArray(row.courses) ? row.courses.length : 0,
    }));
  } catch {
    return [];
  }
}

interface RawSkillRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  course_skills?: { course_id: string }[] | null;
}

/**
 * Fetch all skills for Admin Skills Management.
 */
export async function getAdminSkills(): Promise<
  { id: string; name: string; slug: string; description: string | null; courseCount: number }[]
> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("skills")
      .select("id, name, slug, description, course_skills:course_skills(course_id)")
      .order("name", { ascending: true });

    if (error || !data) return [];

    return (data as unknown as RawSkillRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      courseCount: Array.isArray(row.course_skills) ? row.course_skills.length : 0,
    }));
  } catch {
    return [];
  }
}

interface RawPathListRow {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  difficulty: string | null;
  is_published: boolean | null;
  position: number | null;
  estimated_minutes: number | null;
  created_at: string;
  updated_at: string;
  items?: {
    id: string;
    item_type: string;
    estimated_minutes: number | null;
    course?: { estimated_minutes: number | null } | { estimated_minutes: number | null }[] | null;
  }[] | null;
}

/**
 * Fetch all learning paths for Admin Learning Paths list with search & filter.
 */
export async function getAdminLearningPathsList(params: {
  q?: string;
  status?: string;
}): Promise<AdminLearningPathListItem[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from("learning_paths")
      .select(`
        id,
        slug,
        title,
        summary,
        difficulty,
        is_published,
        position,
        estimated_minutes,
        created_at,
        updated_at,
        items:learning_path_items (
          id,
          item_type,
          estimated_minutes,
          course:courses (
            estimated_minutes
          )
        )
      `)
      .order("position", { ascending: true })
      .order("updated_at", { ascending: false });

    const q = (params.q ?? "").trim().toLowerCase();
    if (q) {
      const clean = q.replace(/[%_]/g, "");
      query = query.or(`title.ilike.%${clean}%,slug.ilike.%${clean}%,summary.ilike.%${clean}%`);
    }

    const status = (params.status ?? "all").toLowerCase().trim();
    if (status === "published") {
      query = query.eq("is_published", true);
    } else if (status === "draft") {
      query = query.eq("is_published", false);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return (data as unknown as RawPathListRow[]).map((row) => {
      const items = Array.isArray(row.items) ? row.items : [];
      const courseItems = items.filter((i) => i.item_type === "course");

      let totalDuration = 0;
      items.forEach((it) => {
        if (it.item_type === "course") {
          const c = Array.isArray(it.course) ? it.course[0] : it.course;
          totalDuration += Number(c?.estimated_minutes) || 0;
        } else {
          totalDuration += Number(it.estimated_minutes) || 30;
        }
      });

      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        difficulty: (row.difficulty || "beginner") as CourseDifficulty,
        isPublished: Boolean(row.is_published),
        position: row.position ?? 0,
        courseCount: courseItems.length,
        stepCount: items.length,
        estimatedMinutes: totalDuration || Number(row.estimated_minutes) || 0,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    });
  } catch {
    return [];
  }
}

interface RawAdminPathDetailRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  description: string | null;
  difficulty: string | null;
  estimated_minutes: number | null;
  course_count: number | null;
  cover_image_url: string | null;
  is_published: boolean | null;
  position: number | null;
  created_at: string;
  updated_at: string;
  items?: {
    id: string;
    learning_path_id: string;
    course_id: string | null;
    item_type: string;
    title: string | null;
    description: string | null;
    step_label: string | null;
    position: number;
    is_required: boolean | null;
    estimated_minutes: number | null;
    course?: {
      id: string;
      slug: string;
      title: string;
      summary: string | null;
      difficulty: string | null;
      is_published: boolean | null;
      estimated_minutes: number | null;
      cover_image_url: string | null;
      category?: { name?: string } | { name?: string }[] | null;
      modules?: { id: string; lessons?: { id: string }[] }[] | null;
    } | {
      id: string;
      slug: string;
      title: string;
      summary: string | null;
      difficulty: string | null;
      is_published: boolean | null;
      estimated_minutes: number | null;
      cover_image_url: string | null;
      category?: { name?: string } | { name?: string }[] | null;
      modules?: { id: string; lessons?: { id: string }[] }[] | null;
    }[] | null;
  }[] | null;
}

/**
 * Fetch full learning path structure for Admin Editor.
 */
export async function getAdminLearningPathDetail(
  pathIdOrSlug: string,
): Promise<AdminLearningPathDetail | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      pathIdOrSlug,
    );

    let query = supabase
      .from("learning_paths")
      .select(`
        id,
        slug,
        title,
        subtitle,
        summary,
        description,
        difficulty,
        estimated_minutes,
        course_count,
        cover_image_url,
        is_published,
        position,
        created_at,
        updated_at,
        items:learning_path_items (
          id,
          learning_path_id,
          course_id,
          item_type,
          title,
          description,
          step_label,
          position,
          is_required,
          estimated_minutes,
          course:courses (
            id,
            slug,
            title,
            summary,
            difficulty,
            is_published,
            estimated_minutes,
            cover_image_url,
            category:categories (name),
            modules:course_modules (
              id,
              lessons:lessons (id)
            )
          )
        )
      `);

    if (isUuid) {
      query = query.eq("id", pathIdOrSlug);
    } else {
      query = query.eq("slug", pathIdOrSlug);
    }

    const { data, error } = await query.maybeSingle();
    if (error || !data) return null;

    const row = data as unknown as RawAdminPathDetailRow;
    const rawItems = Array.isArray(row.items) ? row.items : [];
    const sortedItems = [...rawItems].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    let totalDuration = 0;
    const items: AdminLearningPathItemDetail[] = sortedItems.map((it) => {
      const c = Array.isArray(it.course) ? it.course[0] : it.course;
      let courseObj = null;

      if (it.item_type === "course" && c) {
        const cat = Array.isArray(c.category) ? c.category[0] : c.category;
        const modules = Array.isArray(c.modules) ? c.modules : [];
        let totalLessons = 0;
        modules.forEach((m) => {
          if (Array.isArray(m.lessons)) totalLessons += m.lessons.length;
        });

        const est = Number(c.estimated_minutes) || 0;
        totalDuration += est;

        courseObj = {
          id: c.id,
          slug: c.slug,
          title: c.title,
          summary: c.summary,
          difficulty: (c.difficulty || "beginner") as CourseDifficulty,
          isPublished: Boolean(c.is_published),
          lessonCount: totalLessons,
          estimatedMinutes: c.estimated_minutes,
          categoryName: cat?.name ?? null,
          coverImageUrl: c.cover_image_url,
        };
      } else if (it.item_type === "project") {
        totalDuration += Number(it.estimated_minutes) || 30;
      }

      return {
        id: it.id,
        learningPathId: it.learning_path_id,
        courseId: it.course_id,
        itemType: (it.item_type === "project" ? "project" : "course") as "course" | "project",
        title: it.title,
        description: it.description,
        stepLabel: it.step_label,
        position: it.position,
        isRequired: it.is_required !== false,
        estimatedMinutes: it.estimated_minutes,
        course: courseObj,
      };
    });

    const courseCount = items.filter((i) => i.itemType === "course").length;

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      subtitle: row.subtitle,
      summary: row.summary,
      description: row.description,
      difficulty: (row.difficulty || "beginner") as CourseDifficulty,
      estimatedMinutes: totalDuration || Number(row.estimated_minutes) || 0,
      courseCount,
      coverImageUrl: row.cover_image_url,
      isPublished: Boolean(row.is_published),
      position: row.position ?? 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      items,
    };
  } catch {
    return null;
  }
}

interface RawAvailableCourseRow {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  difficulty: string | null;
  is_published: boolean | null;
  estimated_minutes: number | null;
  cover_image_url: string | null;
  category?: { name?: string } | { name?: string }[] | null;
  modules?: { id: string; lessons?: { id: string }[] }[] | null;
}

/**
 * Fetch all available courses for CoursePicker in Learning Path editor.
 */
export async function getAdminAvailableCoursesForPath(): Promise<AvailableCourseForPath[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("courses")
      .select(`
        id,
        slug,
        title,
        summary,
        difficulty,
        is_published,
        estimated_minutes,
        cover_image_url,
        category:categories (name),
        modules:course_modules (
          id,
          lessons:lessons (id)
        )
      `)
      .order("title", { ascending: true });

    if (error || !data) return [];

    return (data as unknown as RawAvailableCourseRow[]).map((c) => {
      const cat = Array.isArray(c.category) ? c.category[0] : c.category;
      const modules = Array.isArray(c.modules) ? c.modules : [];
      let totalLessons = 0;
      modules.forEach((m) => {
        if (Array.isArray(m.lessons)) totalLessons += m.lessons.length;
      });

      return {
        id: c.id,
        slug: c.slug,
        title: c.title,
        summary: c.summary,
        difficulty: (c.difficulty || "beginner") as CourseDifficulty,
        isPublished: Boolean(c.is_published),
        categoryName: cat?.name ?? null,
        lessonCount: totalLessons,
        estimatedMinutes: c.estimated_minutes,
        coverImageUrl: c.cover_image_url,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Fetch learning paths that contain a specific course.
 */
export async function getAdminCourseLearningPaths(
  courseId: string,
): Promise<{ id: string; slug: string; title: string; stepLabel: string | null; isPublished: boolean }[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("learning_path_items")
      .select(`
        step_label,
        path:learning_paths (
          id,
          slug,
          title,
          is_published
        )
      `)
      .eq("course_id", courseId);

    if (error || !data) return [];

    interface RawPathMembership {
      step_label: string | null;
      path?: { id: string; slug: string; title: string; is_published: boolean } | { id: string; slug: string; title: string; is_published: boolean }[] | null;
    }

    return (data as unknown as RawPathMembership[])
      .filter((d) => d.path)
      .map((d) => {
        const p = Array.isArray(d.path) ? d.path[0] : d.path;
        return {
          id: p!.id,
          slug: p!.slug,
          title: p!.title,
          stepLabel: d.step_label,
          isPublished: Boolean(p!.is_published),
        };
      });
  } catch {
    return [];
  }
}

/**
 * Fetch all support and contact inquiries for the Admin Messages Inbox.
 */
export async function getAdminSupportMessages(params: {
  q?: string;
  status?: string;
  topic?: string;
}): Promise<AdminSupportMessage[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from("support_messages")
      .select("*")
      .order("created_at", { ascending: false });

    const q = (params.q ?? "").trim().toLowerCase();
    if (q) {
      const clean = q.replace(/[%_]/g, "");
      query = query.or(`name.ilike.%${clean}%,email.ilike.%${clean}%,message.ilike.%${clean}%`);
    }

    const status = (params.status ?? "all").toLowerCase().trim();
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const topic = (params.topic ?? "all").toLowerCase().trim();
    if (topic && topic !== "all") {
      query = query.eq("topic", topic);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      email: row.email,
      topic: row.topic as SupportMessageTopic,
      message: row.message,
      pageUrl: row.page_url,
      status: row.status as SupportMessageStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch all registered learners with enrollment and completion statistics.
 */
export async function getAdminLearnersList(params: {
  q?: string;
  role?: string;
}): Promise<AdminLearnerListItem[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        avatar_url,
        role,
        created_at,
        updated_at,
        enrollments:course_enrollments (
          id,
          course:courses (title)
        ),
        progress:lesson_progress (id, completed),
        quiz_attempts:practice_quiz_attempts (id)
      `)
      .order("created_at", { ascending: false });

    const q = (params.q ?? "").trim().toLowerCase();
    if (q) {
      const clean = q.replace(/[%_]/g, "");
      query = query.or(`full_name.ilike.%${clean}%`);
    }

    const role = (params.role ?? "all").toLowerCase().trim();
    if (role && role !== "all") {
      query = query.eq("role", role);
    }

    const { data, error } = await query;
    if (error || !data) {
      // Fallback to simple profiles query if joins fail
      const { data: simpleProfiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, role, created_at, updated_at")
        .order("created_at", { ascending: false });

      if (!simpleProfiles) return [];

      return simpleProfiles.map((p) => ({
        id: p.id,
        fullName: p.full_name,
        avatarUrl: p.avatar_url,
        role: (p.role === "admin" ? "admin" : "learner") as "learner" | "admin",
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        enrollmentCount: 0,
        completedLessonsCount: 0,
        quizAttemptsCount: 0,
        enrolledCourseTitles: [],
      }));
    }

    interface RawLearnerRow {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
      role: string | null;
      created_at: string;
      updated_at: string;
      enrollments?: { id: string; course?: { title?: string } | { title?: string }[] | null }[] | null;
      progress?: { id: string; completed?: boolean }[] | null;
      quiz_attempts?: { id: string }[] | null;
    }

    return (data as unknown as RawLearnerRow[]).map((row) => {
      const enrollments = Array.isArray(row.enrollments) ? row.enrollments : [];
      const progress = Array.isArray(row.progress) ? row.progress : [];
      const quizAttempts = Array.isArray(row.quiz_attempts) ? row.quiz_attempts : [];

      const enrolledTitles = enrollments
        .map((e) => {
          const c = Array.isArray(e.course) ? e.course[0] : e.course;
          return c?.title;
        })
        .filter((t): t is string => Boolean(t));

      const completedCount = progress.filter((p) => p.completed).length;

      return {
        id: row.id,
        fullName: row.full_name,
        avatarUrl: row.avatar_url,
        role: (row.role === "admin" ? "admin" : "learner") as "learner" | "admin",
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        enrollmentCount: enrollments.length,
        completedLessonsCount: completedCount,
        quizAttemptsCount: quizAttempts.length,
        enrolledCourseTitles: enrolledTitles,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Fetch all instructor profiles for Admin Management.
 */
export async function getAdminInstructorsList(): Promise<AdminInstructorDetail[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("instructor_profiles")
      .select(`
        id,
        profile_id,
        display_name,
        title,
        bio,
        avatar_url,
        is_published,
        created_at,
        updated_at,
        courses:courses (id)
      `)
      .order("display_name", { ascending: true });

    if (error || !data) return [];

    interface RawInstructorListRow {
      id: string;
      profile_id: string | null;
      display_name: string;
      title: string | null;
      bio: string | null;
      avatar_url: string | null;
      is_published: boolean | null;
      created_at: string;
      updated_at: string;
      courses?: { id: string }[] | null;
    }

    return (data as unknown as RawInstructorListRow[]).map((row) => ({
      id: row.id,
      profileId: row.profile_id,
      displayName: row.display_name,
      title: row.title,
      bio: row.bio,
      avatarUrl: row.avatar_url,
      isPublished: Boolean(row.is_published),
      courseCount: Array.isArray(row.courses) ? row.courses.length : 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch all Knowledge Checks across the platform with full questions and stats for Admin Management.
 */
export async function getAdminKnowledgeChecksOverview(): Promise<AdminKnowledgeChecksData> {
  const supabase = await createSupabaseServerClient();

  const fallbackData: AdminKnowledgeChecksData = (() => {
    const items: AdminKnowledgeCheckItem[] = [];
    let singleChoice = 0;
    let multipleChoice = 0;
    let trueFalse = 0;
    let totalQ = 0;

    for (const course of ALL_STATIC_COURSES) {
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          if (lesson.lessonType === "knowledge_check" || lesson.lessonType === "quiz") {
            const quizDef = ALL_STATIC_QUIZZES[lesson.slug];
            const questions: AdminQuestionDetail[] = (quizDef?.questions || []).map((q, qIdx) => {
              if (q.questionType === "single_choice") singleChoice++;
              else if (q.questionType === "multiple_choice") multipleChoice++;
              else if (q.questionType === "true_false") trueFalse++;
              totalQ++;

              return {
                id: q.id,
                quizId: `quiz-${lesson.id}`,
                questionType: q.questionType,
                questionText: q.questionText,
                topic: q.topic || null,
                codeContent: q.codeContent || null,
                codeLanguage: q.codeLanguage || null,
                explanation: q.explanation || null,
                position: qIdx + 1,
                options: q.options.map((opt, oIdx) => ({
                  id: opt.id,
                  text: opt.optionText,
                  position: oIdx + 1,
                  isCorrect: opt.isCorrect,
                })),
              };
            });

            items.push({
              id: `quiz-${lesson.id}`,
              lessonId: lesson.id,
              courseId: course.id,
              courseTitle: course.title,
              courseSlug: course.slug,
              moduleId: mod.id,
              moduleTitle: mod.title,
              modulePosition: mod.position,
              lessonTitle: lesson.title,
              lessonSlug: lesson.slug,
              quizTitle: quizDef?.title || lesson.title,
              quizDescription: quizDef?.description || null,
              estimatedMinutes: quizDef?.estimatedMinutes || lesson.estimatedMinutes || 5,
              isPublished: lesson.isPublished,
              questionCount: questions.length,
              questions,
            });
          }
        }
      }
    }

    const courseStats = ALL_STATIC_COURSES.map((c) => {
      const courseQuizzes = items.filter((i) => i.courseId === c.id);
      return {
        courseId: c.id,
        courseTitle: c.title,
        courseSlug: c.slug,
        quizCount: courseQuizzes.length,
        questionCount: courseQuizzes.reduce((s, q) => s + q.questionCount, 0),
      };
    });

    return {
      items,
      totalQuizzes: items.length,
      totalQuestions: totalQ,
      singleChoiceCount: singleChoice,
      multipleChoiceCount: multipleChoice,
      trueFalseCount: trueFalse,
      courseStats,
    };
  })();

  if (!supabase) return fallbackData;

  try {
    const { data: dbCourses } = await supabase
      .from("courses")
      .select(`
        id,
        title,
        slug,
        modules:course_modules (
          id,
          title,
          position,
          lessons:lessons (
            id,
            title,
            slug,
            lesson_type,
            estimated_minutes,
            is_published,
            quizzes:practice_quizzes (
              id,
              title,
              description,
              estimated_minutes,
              is_published,
              questions:practice_questions (
                id,
                quiz_id,
                question_type,
                question_text,
                topic,
                code_content,
                code_language,
                explanation,
                position,
                options:practice_question_options (id, option_text, position),
                correct_options:practice_question_correct_options (option_id)
              )
            )
          )
        )
      `)
      .order("title", { ascending: true });

    if (!dbCourses || dbCourses.length === 0) {
      return fallbackData;
    }

    const items: AdminKnowledgeCheckItem[] = [];
    let singleChoice = 0;
    let multipleChoice = 0;
    let trueFalse = 0;
    let totalQ = 0;

    for (const c of dbCourses) {
      const cModules = Array.isArray(c.modules) ? c.modules : [];
      for (const m of cModules) {
        const mLessons = Array.isArray(m.lessons) ? m.lessons : [];
        for (const l of mLessons) {
          if (l.lesson_type === "knowledge_check" || l.lesson_type === "quiz") {
            const rawQuiz = Array.isArray(l.quizzes) ? l.quizzes[0] : l.quizzes;
            const staticDef = ALL_STATIC_QUIZZES[l.slug];

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let questions: AdminQuestionDetail[] = [];
            if (rawQuiz && Array.isArray(rawQuiz.questions) && rawQuiz.questions.length > 0) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              questions = rawQuiz.questions.map((q: any) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const correctIds = new Set(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (q.correct_options || []).map((co: any) => co.option_id),
                );
                if (q.question_type === "single_choice") singleChoice++;
                else if (q.question_type === "multiple_choice") multipleChoice++;
                else if (q.question_type === "true_false") trueFalse++;
                totalQ++;

                return {
                  id: q.id,
                  quizId: q.quiz_id,
                  questionType: q.question_type,
                  questionText: q.question_text,
                  topic: q.topic || null,
                  codeContent: q.code_content || null,
                  codeLanguage: q.code_language || null,
                  explanation: q.explanation || null,
                  position: q.position,
                  options: (q.options || [])
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .sort((a: any, b: any) => a.position - b.position)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map((opt: any) => ({
                      id: opt.id,
                      text: opt.option_text,
                      position: opt.position,
                      isCorrect: correctIds.has(opt.id),
                    })),
                };
              });
            } else if (staticDef) {
              questions = staticDef.questions.map((q, qIdx) => {
                if (q.questionType === "single_choice") singleChoice++;
                else if (q.questionType === "multiple_choice") multipleChoice++;
                else if (q.questionType === "true_false") trueFalse++;
                totalQ++;

                return {
                  id: q.id,
                  quizId: rawQuiz?.id || `quiz-${l.id}`,
                  questionType: q.questionType,
                  questionText: q.questionText,
                  topic: q.topic || null,
                  codeContent: q.codeContent || null,
                  codeLanguage: q.codeLanguage || null,
                  explanation: q.explanation || null,
                  position: qIdx + 1,
                  options: q.options.map((opt, oIdx) => ({
                    id: opt.id,
                    text: opt.optionText,
                    position: oIdx + 1,
                    isCorrect: opt.isCorrect,
                  })),
                };
              });
            }

            items.push({
              id: rawQuiz?.id || `quiz-${l.id}`,
              lessonId: l.id,
              courseId: c.id,
              courseTitle: c.title,
              courseSlug: c.slug,
              moduleId: m.id,
              moduleTitle: m.title,
              modulePosition: m.position,
              lessonTitle: l.title,
              lessonSlug: l.slug,
              quizTitle: rawQuiz?.title || staticDef?.title || l.title,
              quizDescription: rawQuiz?.description || staticDef?.description || null,
              estimatedMinutes: rawQuiz?.estimated_minutes || staticDef?.estimatedMinutes || l.estimated_minutes || 5,
              isPublished: l.is_published,
              questionCount: questions.length,
              questions,
            });
          }
        }
      }
    }

    if (items.length === 0) return fallbackData;

    const courseStats = dbCourses.map((c) => {
      const courseQuizzes = items.filter((i) => i.courseId === c.id);
      return {
        courseId: c.id,
        courseTitle: c.title,
        courseSlug: c.slug,
        quizCount: courseQuizzes.length,
        questionCount: courseQuizzes.reduce((s, q) => s + q.questionCount, 0),
      };
    });

    return {
      items,
      totalQuizzes: items.length,
      totalQuestions: totalQ,
      singleChoiceCount: singleChoice,
      multipleChoiceCount: multipleChoice,
      trueFalseCount: trueFalse,
      courseStats,
    };
  } catch {
    return fallbackData;
  }
}


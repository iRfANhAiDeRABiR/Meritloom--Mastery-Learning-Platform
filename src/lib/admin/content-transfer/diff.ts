import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CourseDiff,
  EntityChangeType,
  ImportPreviewSummary,
  LearningPathDiff,
  MeritloomContentPackage,
} from "./types";

export async function prepareContentImport(
  pkg: MeritloomContentPackage,
): Promise<ImportPreviewSummary> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Database unavailable.");

  // Fetch current database entities
  const [coursesRes, lessonsRes, pathsRes, categoriesRes] = await Promise.all([
    supabase.from("courses").select("id, slug, title, is_published"),
    supabase.from("lessons").select("id, module_id, slug, title, lesson_type"),
    supabase.from("learning_paths").select("id, slug, title, is_published"),
    supabase.from("categories").select("id, slug"),
  ]);

  const existingCourseMap = new Map((coursesRes.data || []).map((c) => [c.slug, c]));
  const existingPathMap = new Map((pathsRes.data || []).map((p) => [p.slug, p]));
  const existingCategorySlugs = new Set((categoriesRes.data || []).map((c) => c.slug));
  const existingLessonSlugs = new Set((lessonsRes.data || []).map((l) => l.slug));

  const warnings: string[] = [];

  let newCourses = 0;
  let updatedCourses = 0;
  const unchangedCourses = 0;
  let newModules = 0;
  let updatedModules = 0;
  let newLessons = 0;
  let updatedLessons = 0;

  const courseDiffs: CourseDiff[] = [];

  for (const c of pkg.courses) {
    const existing = existingCourseMap.get(c.slug);
    const courseType: EntityChangeType = existing ? "update" : "new";

    if (courseType === "new") newCourses++;
    else updatedCourses++;

    if (c.categorySlug && !existingCategorySlugs.has(c.categorySlug)) {
      const isCatInPackage = pkg.categories?.some((cat) => cat.slug === c.categorySlug);
      if (!isCatInPackage) {
        warnings.push(`Course '${c.title}' references category '${c.categorySlug}' which does not exist in DB or export.`);
      }
    }

    const moduleDiffs = (c.modules || []).map((m) => {
      const isModNew = !existing; // If course is new, all modules are new
      if (isModNew) newModules++;
      else updatedModules++;

      const lessonDiffs = (m.lessons || []).map((l) => {
        const isLessonExisting = existingLessonSlugs.has(l.slug);
        const lType: EntityChangeType = isLessonExisting ? "update" : "new";
        if (lType === "new") newLessons++;
        else updatedLessons++;

        return {
          type: lType,
          slug: l.slug,
          title: l.title,
          lessonType: l.lessonType,
          hasQuiz: Boolean(l.quiz),
        };
      });

      return {
        type: (isModNew ? "new" : "update") as EntityChangeType,
        slug: m.slug,
        title: m.title,
        lessons: lessonDiffs,
      };
    });

    courseDiffs.push({
      type: courseType,
      slug: c.slug,
      title: c.title,
      modules: moduleDiffs,
    });
  }

  let newPaths = 0;
  let updatedPaths = 0;
  const unchangedPaths = 0;
  const pathDiffs: LearningPathDiff[] = [];

  for (const p of pkg.learningPaths || []) {
    const existing = existingPathMap.get(p.slug);
    const pType: EntityChangeType = existing ? "update" : "new";
    if (pType === "new") newPaths++;
    else updatedPaths++;

    const itemTypes = (p.items || []).map((it) => it.itemType);

    pathDiffs.push({
      type: pType,
      slug: p.slug,
      title: p.title,
      stepsCount: (p.items || []).length,
      itemTypes,
    });
  }

  return {
    counts: {
      newCourses,
      updatedCourses,
      unchangedCourses,
      newPaths,
      updatedPaths,
      unchangedPaths,
      newModules,
      updatedModules,
      newLessons,
      updatedLessons,
      totalCategories: (pkg.categories || []).length,
      totalSkills: (pkg.skills || []).length,
      warningsCount: warnings.length,
    },
    courses: courseDiffs,
    learningPaths: pathDiffs,
    warnings,
  };
}

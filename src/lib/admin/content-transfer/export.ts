import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import type { MeritloomContentPackage } from "./types";
import type { CourseDifficulty, LessonType } from "@/lib/types";

export interface ExportScopeOptions {
  type: "all" | "courses" | "learning_paths";
  courseSlugs?: string[];
  learningPathSlugs?: string[];
  includeReferencedCourses?: boolean;
}

export interface ExportResult {
  jsonString: string;
  filename: string;
  summary: {
    coursesCount: number;
    modulesCount: number;
    lessonsCount: number;
    pathsCount: number;
    categoriesCount: number;
    skillsCount: number;
  };
}

export async function generateContentExport(
  scope: ExportScopeOptions,
): Promise<ExportResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Database connection unavailable.");

  const todayStr = new Date().toISOString().split("T")[0];

  // 1. Determine which learning paths to export
  let pathSlugsToExport: string[] = [];
  if (scope.type === "all") {
    const { data: allPaths } = await supabase.from("learning_paths").select("slug").order("position");
    pathSlugsToExport = (allPaths || []).map((p) => p.slug);
  } else if (scope.type === "learning_paths") {
    pathSlugsToExport = scope.learningPathSlugs || [];
  }

  // 2. Fetch Learning Paths and their items
  const exportedPaths: MeritloomContentPackage["learningPaths"] = [];
  const referencedCourseIdsFromPaths = new Set<string>();

  if (pathSlugsToExport.length > 0) {
    const { data: pathsData } = await supabase
      .from("learning_paths")
      .select(`
        id,
        slug,
        title,
        subtitle,
        summary,
        description,
        difficulty,
        cover_image_url,
        is_published,
        position,
        items:learning_path_items (
          id,
          course_id,
          item_type,
          title,
          description,
          step_label,
          position,
          is_required,
          estimated_minutes,
          course:courses (
            slug
          )
        )
      `)
      .in("slug", pathSlugsToExport)
      .order("position", { ascending: true });

    if (pathsData) {
      for (const p of pathsData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawItems: any[] = Array.isArray(p.items) ? p.items : [];
        rawItems.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items = rawItems.map((it: any) => {
          if (it.item_type === "course" && it.course_id) {
            referencedCourseIdsFromPaths.add(it.course_id);
          }
          const c = Array.isArray(it.course) ? it.course[0] : it.course;
          return {
            itemType: (it.item_type || "course") as "course" | "project",
            courseSlug: c?.slug || null,
            title: it.title || null,
            description: it.description || null,
            stepLabel: it.step_label || null,
            position: it.position ?? 1,
            isRequired: it.is_required !== false,
            estimatedMinutes: it.estimated_minutes || null,
          };
        });

        exportedPaths.push({
          slug: p.slug,
          title: p.title,
          subtitle: p.subtitle,
          summary: p.summary,
          description: p.description,
          difficulty: (p.difficulty || "beginner") as CourseDifficulty,
          coverImageUrl: p.cover_image_url,
          isPublished: Boolean(p.is_published),
          position: p.position ?? 0,
          items,
        });
      }
    }
  }

  // 3. Determine which courses to export
  let courseSlugsToExport = new Set<string>();
  if (scope.type === "all") {
    const { data: allCourses } = await supabase.from("courses").select("slug").order("slug");
    courseSlugsToExport = new Set((allCourses || []).map((c) => c.slug));
  } else if (scope.type === "courses") {
    courseSlugsToExport = new Set(scope.courseSlugs || []);
  } else if (scope.type === "learning_paths" && scope.includeReferencedCourses !== false) {
    if (referencedCourseIdsFromPaths.size > 0) {
      const { data: refCourses } = await supabase
        .from("courses")
        .select("slug")
        .in("id", Array.from(referencedCourseIdsFromPaths));
      courseSlugsToExport = new Set((refCourses || []).map((c) => c.slug));
    }
  }

  // 4. Fetch Courses and all nested curriculum
  const exportedCourses: MeritloomContentPackage["courses"] = [];
  const referencedCategoryIds = new Set<string>();
  const referencedSkillIds = new Set<string>();

  let totalModules = 0;
  let totalLessons = 0;

  if (courseSlugsToExport.size > 0) {
    const { data: coursesData } = await supabase
      .from("courses")
      .select(`
        id,
        slug,
        title,
        summary,
        description,
        cover_image_url,
        difficulty,
        language,
        estimated_minutes,
        is_free,
        is_published,
        category_id,
        category:categories (slug),
        outcomes:course_learning_outcomes (outcome, position),
        prerequisites:course_prerequisites (prerequisite, position),
        skills:course_skills (
          skill_id,
          skill:skills (id, slug)
        ),
        modules:course_modules (
          id,
          slug,
          title,
          description,
          position,
          estimated_minutes,
          is_published,
          lessons:lessons (
            id,
            slug,
            title,
            summary,
            lesson_type,
            content,
            video_url,
            key_takeaway,
            estimated_minutes,
            position,
            is_preview,
            is_published,
            objectives:lesson_objectives (objective, position),
            resources:lesson_resources (title, resource_type, external_url, storage_path, position),
            quiz:practice_quizzes (
              id,
              title,
              description,
              estimated_minutes,
              is_published,
              questions:practice_questions (
                id,
                question_type,
                question_text,
                topic,
                code_content,
                code_language,
                explanation,
                position,
                options:practice_question_options (
                  id,
                  option_text,
                  position
                ),
                correct_options:practice_question_correct_options (
                  option_id
                )
              )
            )
          )
        )
      `)
      .in("slug", Array.from(courseSlugsToExport))
      .order("slug");

    if (coursesData) {
      for (const c of coursesData) {
        if (c.category_id) referencedCategoryIds.add(c.category_id);
        const cat = Array.isArray(c.category) ? c.category[0] : c.category;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawOutcomes: any[] = Array.isArray(c.outcomes) ? c.outcomes : [];
        rawOutcomes.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        const outcomes = rawOutcomes.map((o) => o.outcome).filter(Boolean);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawPrereqs: any[] = Array.isArray(c.prerequisites) ? c.prerequisites : [];
        rawPrereqs.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        const prerequisites = rawPrereqs.map((p) => p.prerequisite).filter(Boolean);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawSkills: any[] = Array.isArray(c.skills) ? c.skills : [];
        const skillSlugs: string[] = [];
        for (const s of rawSkills) {
          const sk = Array.isArray(s.skill) ? s.skill[0] : s.skill;
          if (sk?.slug) {
            skillSlugs.push(sk.slug);
            if (sk.id) referencedSkillIds.add(sk.id);
          }
        }

        // Modules & Lessons
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawModules: any[] = Array.isArray(c.modules) ? c.modules : [];
        rawModules.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        totalModules += rawModules.length;

        const modules = rawModules.map((m) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rawLessons: any[] = Array.isArray(m.lessons) ? m.lessons : [];
          rawLessons.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
          totalLessons += rawLessons.length;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const lessons = rawLessons.map((l: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rawObjs: any[] = Array.isArray(l.objectives) ? l.objectives : [];
            rawObjs.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
            const objectives = rawObjs.map((o) => o.objective).filter(Boolean);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rawRes: any[] = Array.isArray(l.resources) ? l.resources : [];
            rawRes.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const resources = rawRes.map((r: any) => ({
              title: r.title,
              resourceType: r.resource_type,
              externalUrl: r.external_url || null,
              storagePath: r.storage_path || null,
              position: r.position ?? 1,
            }));

            // Practice Quiz
            let quiz = null;
            const qObj = Array.isArray(l.quiz) ? l.quiz[0] : l.quiz;
            if (qObj) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const rawQuestions: any[] = Array.isArray(qObj.questions) ? qObj.questions : [];
              rawQuestions.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const questions = rawQuestions.map((q: any) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const rawOptions: any[] = Array.isArray(q.options) ? q.options : [];
                rawOptions.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const rawCorrect: any[] = Array.isArray(q.correct_options) ? q.correct_options : [];
                const correctOptionIds = new Set(rawCorrect.map((co) => co.option_id));

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const options = rawOptions.map((opt: any) => ({
                  optionText: opt.option_text,
                  position: opt.position ?? 1,
                  isCorrect: correctOptionIds.has(opt.id),
                }));

                return {
                  questionType: (q.question_type || "single_choice") as "single_choice" | "multiple_choice" | "true_false",
                  questionText: q.question_text,
                  topic: q.topic || null,
                  codeContent: q.code_content || null,
                  codeLanguage: q.code_language || null,
                  explanation: q.explanation || null,
                  position: q.position ?? 1,
                  options,
                };
              });

              quiz = {
                title: qObj.title,
                description: qObj.description || null,
                estimatedMinutes: qObj.estimated_minutes ?? 5,
                isPublished: qObj.is_published !== false,
                questions,
              };
            }

            return {
              slug: l.slug,
              title: l.title,
              summary: l.summary || null,
              lessonType: (l.lesson_type || "article") as LessonType,
              content: l.content || null,
              videoUrl: l.video_url || null,
              keyTakeaway: l.key_takeaway || null,
              estimatedMinutes: l.estimated_minutes || null,
              position: l.position ?? 1,
              isPreview: Boolean(l.is_preview),
              isPublished: Boolean(l.is_published),
              objectives,
              resources,
              quiz,
            };
          });

          return {
            slug: m.slug,
            title: m.title,
            description: m.description || null,
            position: m.position ?? 1,
            estimatedMinutes: m.estimated_minutes || null,
            isPublished: Boolean(m.is_published),
            lessons,
          };
        });

        exportedCourses.push({
          slug: c.slug,
          title: c.title,
          summary: c.summary || null,
          description: c.description || null,
          coverImageUrl: c.cover_image_url || null,
          difficulty: (c.difficulty || "beginner") as CourseDifficulty,
          language: c.language || "English",
          estimatedMinutes: c.estimated_minutes || null,
          isFree: c.is_free !== false,
          isPublished: Boolean(c.is_published),
          categorySlug: cat?.slug || null,
          outcomes,
          prerequisites,
          skillSlugs,
          modules,
        });
      }
    }
  }

  // 5. Fetch referenced or all Categories
  const exportedCategories: MeritloomContentPackage["categories"] = [];
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("slug, name, description, icon_name, position, is_active")
    .order("position", { ascending: true });

  if (categoriesData) {
    for (const cat of categoriesData) {
      exportedCategories.push({
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        iconName: cat.icon_name,
        position: cat.position ?? 0,
        isActive: cat.is_active !== false,
      });
    }
  }

  // 6. Fetch referenced or all Skills
  const exportedSkills: MeritloomContentPackage["skills"] = [];
  const { data: skillsData } = await supabase
    .from("skills")
    .select("slug, name, is_active")
    .order("slug", { ascending: true });

  if (skillsData) {
    for (const sk of skillsData) {
      exportedSkills.push({
        slug: sk.slug,
        name: sk.name,
        isActive: sk.is_active !== false,
      });
    }
  }

  // Build package
  const pkg: MeritloomContentPackage = {
    format: "meritloom-content",
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    application: "Meritloom",
    scope: {
      type: scope.type,
      courseSlugs: scope.courseSlugs,
      learningPathSlugs: scope.learningPathSlugs,
      includeReferencedCourses: scope.includeReferencedCourses,
    },
    categories: exportedCategories,
    skills: exportedSkills,
    courses: exportedCourses,
    learningPaths: exportedPaths,
  };

  let filename = `meritloom-content-${todayStr}.json`;
  if (scope.type === "courses" && scope.courseSlugs?.length === 1) {
    filename = `meritloom-course-${scope.courseSlugs[0]}-${todayStr}.json`;
  } else if (scope.type === "learning_paths" && scope.learningPathSlugs?.length === 1) {
    filename = `meritloom-path-${scope.learningPathSlugs[0]}-${todayStr}.json`;
  }

  const jsonString = JSON.stringify(pkg, null, 2);

  return {
    jsonString,
    filename,
    summary: {
      coursesCount: exportedCourses.length,
      modulesCount: totalModules,
      lessonsCount: totalLessons,
      pathsCount: exportedPaths.length,
      categoriesCount: exportedCategories.length,
      skillsCount: exportedSkills.length,
    },
  };
}

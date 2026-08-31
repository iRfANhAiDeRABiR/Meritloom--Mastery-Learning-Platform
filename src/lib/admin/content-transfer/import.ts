import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import type { ImportResultSummary, MeritloomContentPackage } from "./types";

export interface ImportExecutionOptions {
  strategy: "safe_merge" | "create_only";
  newEntitiesDraft?: boolean;
  preservePublication?: boolean;
}

export async function executeContentImport(
  pkg: MeritloomContentPackage,
  options: ImportExecutionOptions,
): Promise<ImportResultSummary> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Database unavailable.");

  const isCreateOnly = options.strategy === "create_only";
  const newAsDraft = options.newEntitiesDraft ?? true;

  let createdCourses = 0;
  let updatedCourses = 0;
  let createdModules = 0;
  let updatedModules = 0;
  let createdLessons = 0;
  let updatedLessons = 0;
  let createdPaths = 0;
  let updatedPaths = 0;
  let createdSkills = 0;
  let createdCategories = 0;
  let skippedCount = 0;
  let errorsCount = 0;

  // 1. Categories
  const categoryIdMap = new Map<string, string>();
  for (const cat of pkg.categories || []) {
    const { data: existingCat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", cat.slug)
      .maybeSingle();

    if (existingCat) {
      categoryIdMap.set(cat.slug, existingCat.id);
      if (!isCreateOnly) {
        await supabase
          .from("categories")
          .update({
            name: cat.name,
            description: cat.description,
            icon_name: cat.iconName,
            position: cat.position,
            is_active: cat.isActive,
          })
          .eq("id", existingCat.id);
      }
    } else {
      const { data: newCat } = await supabase
        .from("categories")
        .insert({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon_name: cat.iconName,
          position: cat.position,
          is_active: cat.isActive,
        })
        .select("id")
        .single();

      if (newCat) {
        categoryIdMap.set(cat.slug, newCat.id);
        createdCategories++;
      }
    }
  }

  // 2. Skills
  const skillIdMap = new Map<string, string>();
  for (const sk of pkg.skills || []) {
    const { data: existingSkill } = await supabase
      .from("skills")
      .select("id")
      .eq("slug", sk.slug)
      .maybeSingle();

    if (existingSkill) {
      skillIdMap.set(sk.slug, existingSkill.id);
      if (!isCreateOnly) {
        await supabase.from("skills").update({ name: sk.name, is_active: sk.isActive }).eq("id", existingSkill.id);
      }
    } else {
      const { data: newSkill } = await supabase
        .from("skills")
        .insert({
          name: sk.name,
          slug: sk.slug,
          is_active: sk.isActive,
        })
        .select("id")
        .single();

      if (newSkill) {
        skillIdMap.set(sk.slug, newSkill.id);
        createdSkills++;
      }
    }
  }

  // 3. Courses, Modules, Lessons, Quizzes
  for (const c of pkg.courses || []) {
    const { data: existingCourse } = await supabase
      .from("courses")
      .select("id, is_published")
      .eq("slug", c.slug)
      .maybeSingle();

    if (existingCourse && isCreateOnly) {
      skippedCount++;
      continue;
    }

    let courseId = existingCourse?.id;
    const categoryId = c.categorySlug ? categoryIdMap.get(c.categorySlug) || null : null;

    let targetIsPublished = c.isPublished;
    if (existingCourse) {
      if (options.preservePublication) {
        targetIsPublished = existingCourse.is_published;
      }
    } else {
      if (newAsDraft) targetIsPublished = false;
    }

    if (existingCourse) {
      // Update existing course, preserving UUID
      const { error: updErr } = await supabase
        .from("courses")
        .update({
          title: c.title,
          summary: c.summary,
          description: c.description,
          cover_image_url: c.coverImageUrl,
          difficulty: c.difficulty,
          language: c.language || "English",
          estimated_minutes: c.estimatedMinutes,
          is_free: c.isFree,
          is_published: targetIsPublished,
          category_id: categoryId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingCourse.id);

      if (updErr) {
        errorsCount++;
        continue;
      }
      updatedCourses++;
    } else {
      // Create new course
      const { data: newCourse, error: insErr } = await supabase
        .from("courses")
        .insert({
          slug: c.slug,
          title: c.title,
          summary: c.summary,
          description: c.description,
          cover_image_url: c.coverImageUrl,
          difficulty: c.difficulty,
          language: c.language || "English",
          estimated_minutes: c.estimatedMinutes,
          is_free: c.isFree,
          is_published: targetIsPublished,
          category_id: categoryId,
        })
        .select("id")
        .single();

      if (insErr || !newCourse) {
        errorsCount++;
        continue;
      }
      courseId = newCourse.id;
      createdCourses++;
    }

    if (!courseId) continue;

    // Outcomes
    if (Array.isArray(c.outcomes)) {
      await supabase.from("course_learning_outcomes").delete().eq("course_id", courseId);
      if (c.outcomes.length > 0) {
        await supabase.from("course_learning_outcomes").insert(
          c.outcomes.map((outcome, idx) => ({
            course_id: courseId,
            outcome,
            position: idx + 1,
          })),
        );
      }
    }

    // Prerequisites
    if (Array.isArray(c.prerequisites)) {
      await supabase.from("course_prerequisites").delete().eq("course_id", courseId);
      if (c.prerequisites.length > 0) {
        await supabase.from("course_prerequisites").insert(
          c.prerequisites.map((prerequisite, idx) => ({
            course_id: courseId,
            prerequisite,
            position: idx + 1,
          })),
        );
      }
    }

    // Skill associations
    if (Array.isArray(c.skillSlugs)) {
      await supabase.from("course_skills").delete().eq("course_id", courseId);
      const skillIdsToLink = c.skillSlugs
        .map((sSlug) => skillIdMap.get(sSlug))
        .filter((sId): sId is string => Boolean(sId));

      if (skillIdsToLink.length > 0) {
        await supabase.from("course_skills").insert(
          skillIdsToLink.map((skill_id) => ({
            course_id: courseId,
            skill_id,
          })),
        );
      }
    }

    // Modules & Lessons
    for (const m of c.modules || []) {
      const { data: existingMod } = await supabase
        .from("course_modules")
        .select("id")
        .eq("course_id", courseId)
        .eq("slug", m.slug)
        .maybeSingle();

      let moduleId = existingMod?.id;

      if (existingMod) {
        await supabase
          .from("course_modules")
          .update({
            title: m.title,
            description: m.description,
            position: 1000 + m.position, // safe position offset
            estimated_minutes: m.estimatedMinutes,
            is_published: m.isPublished,
          })
          .eq("id", existingMod.id);
        updatedModules++;
      } else {
        const { data: newMod } = await supabase
          .from("course_modules")
          .insert({
            course_id: courseId,
            slug: m.slug,
            title: m.title,
            description: m.description,
            position: 1000 + m.position,
            estimated_minutes: m.estimatedMinutes,
            is_published: m.isPublished,
          })
          .select("id")
          .single();

        if (newMod) {
          moduleId = newMod.id;
          createdModules++;
        }
      }

      if (!moduleId) continue;

      // Lessons
      for (const l of m.lessons || []) {
        const { data: existingLesson } = await supabase
          .from("lessons")
          .select("id")
          .eq("slug", l.slug)
          .maybeSingle();

        let lessonId = existingLesson?.id;

        if (existingLesson) {
          await supabase
            .from("lessons")
            .update({
              module_id: moduleId,
              title: l.title,
              summary: l.summary,
              lesson_type: l.lessonType,
              content: l.content,
              video_url: l.videoUrl,
              key_takeaway: l.keyTakeaway,
              estimated_minutes: l.estimatedMinutes,
              position: 1000 + l.position,
              is_preview: l.isPreview,
              is_published: l.isPublished,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingLesson.id);
          updatedLessons++;
        } else {
          const { data: newLesson } = await supabase
            .from("lessons")
            .insert({
              module_id: moduleId,
              slug: l.slug,
              title: l.title,
              summary: l.summary,
              lesson_type: l.lessonType,
              content: l.content,
              video_url: l.videoUrl,
              key_takeaway: l.keyTakeaway,
              estimated_minutes: l.estimatedMinutes,
              position: 1000 + l.position,
              is_preview: l.isPreview,
              is_published: l.isPublished,
            })
            .select("id")
            .single();

          if (newLesson) {
            lessonId = newLesson.id;
            createdLessons++;
          }
        }

        if (!lessonId) continue;

        // Lesson Objectives
        if (Array.isArray(l.objectives)) {
          await supabase.from("lesson_objectives").delete().eq("lesson_id", lessonId);
          if (l.objectives.length > 0) {
            await supabase.from("lesson_objectives").insert(
              l.objectives.map((objective, idx) => ({
                lesson_id: lessonId,
                objective,
                position: idx + 1,
              })),
            );
          }
        }

        // Lesson Resources
        if (Array.isArray(l.resources)) {
          await supabase.from("lesson_resources").delete().eq("lesson_id", lessonId);
          if (l.resources.length > 0) {
            await supabase.from("lesson_resources").insert(
              l.resources.map((r, idx) => ({
                lesson_id: lessonId,
                title: r.title,
                resource_type: r.resourceType,
                external_url: r.externalUrl,
                storage_path: r.storagePath,
                position: r.position ?? idx + 1,
              })),
            );
          }
        }

        // Practice Quiz
        if (l.quiz) {
          // Find or create quiz
          const { data: existingQuiz } = await supabase
            .from("practice_quizzes")
            .select("id")
            .eq("lesson_id", lessonId)
            .maybeSingle();

          let quizId = existingQuiz?.id;

          if (existingQuiz) {
            await supabase
              .from("practice_quizzes")
              .update({
                title: l.quiz.title,
                description: l.quiz.description,
                estimated_minutes: l.quiz.estimatedMinutes,
                is_published: l.quiz.isPublished,
                updated_at: new Date().toISOString(),
              })
              .eq("id", existingQuiz.id);
          } else {
            const { data: newQuiz } = await supabase
              .from("practice_quizzes")
              .insert({
                lesson_id: lessonId,
                title: l.quiz.title,
                description: l.quiz.description,
                estimated_minutes: l.quiz.estimatedMinutes,
                is_published: l.quiz.isPublished,
              })
              .select("id")
              .single();

            if (newQuiz) quizId = newQuiz.id;
          }

          if (quizId && Array.isArray(l.quiz.questions)) {
            // Delete questions for this quiz and rebuild
            await supabase.from("practice_questions").delete().eq("quiz_id", quizId);

            for (const q of l.quiz.questions) {
              const { data: newQ } = await supabase
                .from("practice_questions")
                .insert({
                  quiz_id: quizId,
                  question_type: q.questionType,
                  question_text: q.questionText,
                  topic: q.topic,
                  code_content: q.codeContent,
                  code_language: q.codeLanguage,
                  explanation: q.explanation,
                  position: q.position,
                })
                .select("id")
                .single();

              if (newQ && Array.isArray(q.options)) {
                for (const opt of q.options) {
                  const { data: newOpt } = await supabase
                    .from("practice_question_options")
                    .insert({
                      question_id: newQ.id,
                      option_text: opt.optionText,
                      position: opt.position,
                    })
                    .select("id")
                    .single();

                  if (newOpt && opt.isCorrect) {
                    await supabase
                      .from("practice_question_correct_options")
                      .insert({
                        question_id: newQ.id,
                        option_id: newOpt.id,
                      });
                  }
                }
              }
            }
          }
        }
      }

      // Restore final sequential positions for lessons
      for (const l of m.lessons || []) {
        await supabase
          .from("lessons")
          .update({ position: l.position })
          .eq("slug", l.slug);
      }
    }

    // Restore final sequential positions for modules
    for (const m of c.modules || []) {
      await supabase
        .from("course_modules")
        .update({ position: m.position })
        .eq("course_id", courseId)
        .eq("slug", m.slug);
    }
  }

  // 4. Learning Paths
  for (const p of pkg.learningPaths || []) {
    const { data: existingPath } = await supabase
      .from("learning_paths")
      .select("id, is_published")
      .eq("slug", p.slug)
      .maybeSingle();

    if (existingPath && isCreateOnly) {
      skippedCount++;
      continue;
    }

    let pathId = existingPath?.id;

    let targetIsPublished = p.isPublished;
    if (existingPath) {
      if (options.preservePublication) {
        targetIsPublished = existingPath.is_published;
      }
    } else {
      if (newAsDraft) targetIsPublished = false;
    }

    if (existingPath) {
      await supabase
        .from("learning_paths")
        .update({
          title: p.title,
          subtitle: p.subtitle,
          summary: p.summary,
          description: p.description,
          difficulty: p.difficulty,
          cover_image_url: p.coverImageUrl,
          is_published: targetIsPublished,
          position: p.position,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingPath.id);
      updatedPaths++;
    } else {
      const { data: newPath } = await supabase
        .from("learning_paths")
        .insert({
          slug: p.slug,
          title: p.title,
          subtitle: p.subtitle,
          summary: p.summary,
          description: p.description,
          difficulty: p.difficulty,
          cover_image_url: p.coverImageUrl,
          is_published: targetIsPublished,
          position: p.position,
        })
        .select("id")
        .single();

      if (newPath) {
        pathId = newPath.id;
        createdPaths++;
      }
    }

    if (!pathId) continue;

    // Clear and rebuild learning_path_items
    await supabase.from("learning_path_items").delete().eq("learning_path_id", pathId);

    if (Array.isArray(p.items)) {
      for (const it of p.items) {
        let courseIdForStep: string | null = null;
        if (it.itemType === "course" && it.courseSlug) {
          const { data: foundCourse } = await supabase
            .from("courses")
            .select("id")
            .eq("slug", it.courseSlug)
            .maybeSingle();
          courseIdForStep = foundCourse?.id || null;
        }

        await supabase.from("learning_path_items").insert({
          learning_path_id: pathId,
          course_id: courseIdForStep,
          item_type: it.itemType,
          title: it.title,
          description: it.description,
          step_label: it.stepLabel || (it.itemType === "project" ? "FINAL PROJECT" : `STEP ${it.position}`),
          position: it.position,
          is_required: it.isRequired !== false,
          estimated_minutes: it.estimatedMinutes,
        });
      }
    }
  }

  // Revalidate cache
  revalidatePath("/admin/courses");
  revalidatePath("/admin/learning-paths");
  revalidatePath("/courses");
  revalidatePath("/learning-paths");

  return {
    createdCourses,
    updatedCourses,
    createdModules,
    updatedModules,
    createdLessons,
    updatedLessons,
    createdPaths,
    updatedPaths,
    createdSkills,
    createdCategories,
    skippedCount,
    errorsCount,
  };
}

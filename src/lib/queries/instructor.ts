import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CourseDifficulty } from "@/lib/types";
import type {
  InstructorCourseSummary,
  InstructorDashboardData,
  InstructorProfileData,
  InstructorQualityWarning,
  InstructorRecentActivity,
} from "@/lib/types/instructor";

/**
 * Fetch comprehensive dashboard metrics and assigned courses for an instructor.
 * Request-memoized to execute at most once per request.
 */
export const getInstructorDashboardData = cache(async function getInstructorDashboardData(
  userId: string,
): Promise<InstructorDashboardData> {
  const supabase = await createSupabaseServerClient();

  const emptyResult: InstructorDashboardData = {
    user: {
      id: userId,
      name: "Instructor",
      email: null,
      avatarUrl: null,
      role: "instructor",
    },
    metrics: {
      assignedCoursesCount: 0,
      publishedCoursesCount: 0,
      draftLessonsCount: 0,
      qualityIssuesCount: 0,
    },
    assignedCourses: [],
    needsAttention: [],
    recentActivity: [],
  };

  if (!supabase) return emptyResult;

  try {
    // 1. Fetch user profile and instructor metadata in parallel with assigned course IDs
    const [profileRes, instructorProfileRes, assignmentsRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, avatar_url, role")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("instructor_profiles")
        .select("professional_title, bio")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("course_instructors")
        .select("course_id")
        .eq("user_id", userId),
    ]);

    const profile = profileRes.data;
    const isRootAdmin = profile?.role === "admin";
    const isSubAdmin = profile?.role === "sub_admin";

    emptyResult.user = {
      id: userId,
      name: profile?.full_name || "Instructor",
      email: null,
      avatarUrl: profile?.avatar_url || null,
      role: (profile?.role as "instructor" | "admin" | "sub_admin") || "instructor",
      professionalTitle: instructorProfileRes.data?.professional_title || null,
      bio: instructorProfileRes.data?.bio || null,
    };

    // Determine target course IDs
    let assignedCourseIds: string[] = (assignmentsRes.data || []).map((a) => a.course_id);

    // If Root Admin is previewing the Instructor view, load first 6 published/draft courses
    if ((isRootAdmin || isSubAdmin) && assignedCourseIds.length === 0) {
      const { data: allCourses } = await supabase
        .from("courses")
        .select("id")
        .limit(6);
      assignedCourseIds = (allCourses || []).map((c) => c.id);
    }

    if (assignedCourseIds.length === 0) {
      return emptyResult;
    }

    // 2. Fetch full course trees for assigned courses in one concurrent batch
    const [coursesRes, auditRes] = await Promise.all([
      supabase
        .from("courses")
        .select(`
          id,
          slug,
          title,
          summary,
          difficulty,
          is_published,
          cover_image_url,
          updated_at,
          category:categories (name),
          modules:course_modules (
            id,
            title,
            position,
            lessons:lessons (
              id,
              title,
              slug,
              position,
              lesson_type,
              is_bonus,
              is_published,
              youtube_video_id,
              video_url,
              content
            )
          )
        `)
        .in("id", assignedCourseIds)
        .order("updated_at", { ascending: false }),

      supabase
        .from("admin_audit_log")
        .select("id, action, target_type, metadata, created_at")
        .eq("actor_user_id", userId)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    const rawCourses = coursesRes.data || [];
    const assignedCourses: InstructorCourseSummary[] = [];
    const needsAttention: InstructorQualityWarning[] = [];
    let totalDraftLessons = 0;
    let totalQualityIssues = 0;
    let publishedCoursesCount = 0;

    for (const c of rawCourses) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cat = Array.isArray(c.category) ? c.category[0] : (c.category as any);
      const rawModules = Array.isArray(c.modules) ? c.modules : [];
      let totalLessons = 0;
      let publishedLessons = 0;
      let draftLessons = 0;
      let quizCount = 0;
      let courseQualityWarnings = 0;

      if (c.is_published) {
        publishedCoursesCount++;
      }

      for (const mod of rawModules) {
        const rawLessons = Array.isArray(mod.lessons) ? mod.lessons : [];
        let moduleHasQuiz = false;

        for (const les of rawLessons) {
          totalLessons++;
          if (les.is_published === false) {
            draftLessons++;
            totalDraftLessons++;
          } else {
            publishedLessons++;
          }

          if (
            les.lesson_type === "quiz" ||
            les.lesson_type === "knowledge_check" ||
            les.slug?.toLowerCase().includes("quiz")
          ) {
            quizCount++;
            moduleHasQuiz = true;
          }

          // Check for video lesson without video source
          if (les.lesson_type === "video" && !les.youtube_video_id && !les.video_url) {
            courseQualityWarnings++;
            totalQualityIssues++;
            needsAttention.push({
              id: `warn-video-${les.id}`,
              courseId: c.id,
              courseTitle: c.title,
              courseSlug: c.slug,
              category: "video",
              severity: "warning",
              message: `Lesson "${les.title}" has video format selected but no video source URL.`,
              lessonId: les.id,
              lessonTitle: les.title,
            });
          }

          // Check for article lesson without content
          if (les.lesson_type === "article" && (!les.content || les.content.trim().length < 50)) {
            courseQualityWarnings++;
            totalQualityIssues++;
            needsAttention.push({
              id: `warn-content-${les.id}`,
              courseId: c.id,
              courseTitle: c.title,
              courseSlug: c.slug,
              category: "structure",
              severity: "suggestion",
              message: `Lesson "${les.title}" has minimal article content.`,
              lessonId: les.id,
              lessonTitle: les.title,
            });
          }
        }

        // Check if module is missing a knowledge check
        if (!moduleHasQuiz && rawLessons.length > 3) {
          courseQualityWarnings++;
          totalQualityIssues++;
          needsAttention.push({
            id: `warn-quiz-${mod.id}`,
            courseId: c.id,
            courseTitle: c.title,
            courseSlug: c.slug,
            category: "quiz",
            severity: "warning",
            message: `Module "${mod.title}" has ${rawLessons.length} lessons but no Knowledge Check assessment.`,
          });
        }
      }

      assignedCourses.push({
        id: c.id,
        slug: c.slug,
        title: c.title,
        summary: c.summary || null,
        difficulty: (c.difficulty as CourseDifficulty) || "beginner",
        isPublished: Boolean(c.is_published),
        coverImageUrl: c.cover_image_url || null,
        categoryName: cat?.name || null,
        moduleCount: rawModules.length,
        totalLessons,
        publishedLessons,
        draftLessons,
        quizCount,
        qualityWarningCount: courseQualityWarnings,
        updatedAt: c.updated_at || new Date().toISOString(),
      });
    }

    // 3. Process recent audit events
    const recentActivity: InstructorRecentActivity[] = (auditRes.data || []).map((a) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const meta = (a.metadata || {}) as any;
      return {
        id: a.id,
        action: a.action,
        targetType: a.target_type,
        targetTitle: meta.title || meta.name || a.target_type,
        courseSlug: meta.course_slug,
        createdAt: a.created_at,
      };
    });

    return {
      user: emptyResult.user,
      metrics: {
        assignedCoursesCount: assignedCourses.length,
        publishedCoursesCount,
        draftLessonsCount: totalDraftLessons,
        qualityIssuesCount: totalQualityIssues,
      },
      assignedCourses,
      needsAttention: needsAttention.slice(0, 5),
      recentActivity,
    };
  } catch (err) {
    console.error("Error loading instructor dashboard data:", err);
    return emptyResult;
  }
});

/**
 * Fetch list of all assigned courses for an instructor.
 */
export const getInstructorCourses = cache(async function getInstructorCourses(
  userId: string,
): Promise<InstructorCourseSummary[]> {
  const data = await getInstructorDashboardData(userId);
  return data.assignedCourses;
});

/**
 * Fetch profile data for an instructor.
 */
export const getInstructorProfile = cache(async function getInstructorProfile(
  userId: string,
): Promise<InstructorProfileData | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  try {
    const [profileRes, instructorRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("instructor_profiles")
        .select("id, professional_title, bio, website_url, github_url, twitter_url, linkedin_url")
        .eq("user_id", userId)
        .maybeSingle(),
    ]);

    const p = profileRes.data;
    if (!p) return null;

    const ip = instructorRes.data;

    return {
      id: ip?.id || p.id,
      userId: p.id,
      name: p.full_name || "Instructor",
      email: null,
      avatarUrl: p.avatar_url || null,
      professionalTitle: ip?.professional_title || null,
      bio: ip?.bio || null,
      websiteUrl: ip?.website_url || null,
      githubUrl: ip?.github_url || null,
      twitterUrl: ip?.twitter_url || null,
      linkedinUrl: ip?.linkedin_url || null,
    };
  } catch (err) {
    console.error("Error loading instructor profile:", err);
    return null;
  }
});


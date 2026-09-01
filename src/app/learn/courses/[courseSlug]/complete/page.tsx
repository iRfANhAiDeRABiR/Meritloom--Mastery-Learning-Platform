import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCourseCompletionData } from "@/lib/completion/queries";
import { CourseCompletionView } from "@/components/completion/course/course-completion-view";

interface CourseCompletePageProps {
  params: Promise<{
    courseSlug: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: CourseCompletePageProps): Promise<Metadata> {
  const { courseSlug } = await params;
  return {
    title: `Course Completion Summary | Meritloom`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CourseCompletePage({
  params,
}: CourseCompletePageProps) {
  const { courseSlug } = await params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect(`/learn/courses/${courseSlug}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/sign-in?next=/learn/courses/${courseSlug}/complete`);
  }

  const completionData = await getCourseCompletionData(user.id, courseSlug);

  if (!completionData) {
    notFound();
  }

  // Access rule: Only completed courses can view the completion summary
  if (!completionData.isCompleted) {
    redirect(`/learn/courses/${courseSlug}`);
  }

  return <CourseCompletionView data={completionData} />;
}

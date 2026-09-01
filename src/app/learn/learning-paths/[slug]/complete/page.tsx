import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getLearningPathCompletionData } from "@/lib/completion/queries";
import { LearningPathCompletionView } from "@/components/completion/path/learning-path-completion-view";

interface PathCompletePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PathCompletePageProps): Promise<Metadata> {
  const { slug } = await params;
  const readable = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${readable} Completion Summary | Meritloom`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function LearningPathCompletePage({
  params,
}: PathCompletePageProps) {
  const { slug } = await params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect(`/learning-paths/${slug}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/sign-in?next=/learn/learning-paths/${slug}/complete`);
  }

  const completionData = await getLearningPathCompletionData(user.id, slug);

  if (!completionData) {
    notFound();
  }

  // Access rule: Only completed learning paths can view the completion summary
  if (!completionData.isCompleted) {
    redirect(`/learning-paths/${slug}`);
  }

  return <LearningPathCompletionView data={completionData} />;
}

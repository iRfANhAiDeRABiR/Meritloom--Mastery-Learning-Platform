import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LearnerLayout } from "@/components/learn/learner-layout";
import { getCurrentUser } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Learning Dashboard | Meritloom",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(routes.auth.signIn);
  }

  return <LearnerLayout user={user}>{children}</LearnerLayout>;
}


import type { Metadata } from "next";
import { getAdminSkills } from "@/lib/queries/admin";
import { SkillsView } from "@/components/admin/skills-view";

export const metadata: Metadata = {
  title: "Skills | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await getAdminSkills();

  return <SkillsView skills={skills} />;
}

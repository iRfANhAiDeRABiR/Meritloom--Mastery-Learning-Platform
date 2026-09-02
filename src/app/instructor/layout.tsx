import type { Metadata } from "next";
import { InstructorLayout } from "@/components/instructor/instructor-layout";
import { requireInstructorSession } from "@/lib/auth/rbac";

export const metadata: Metadata = {
  title: "Instructor Studio | Meritloom",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function InstructorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireInstructorSession();

  return (
    <InstructorLayout user={session.profile} workspaces={session.workspaces}>
      {children}
    </InstructorLayout>
  );
}

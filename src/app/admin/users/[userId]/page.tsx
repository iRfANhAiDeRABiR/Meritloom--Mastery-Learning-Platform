import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminUserDetail } from "@/lib/queries/users";
import { UserDetailView } from "@/components/admin/users/user-detail-view";

export const metadata: Metadata = {
  title: "User Profile & Progress | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface UserDetailPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function AdminUserDetailPage({ params }: UserDetailPageProps) {
  await requireAdmin();
  const { userId } = await params;

  const user = await getAdminUserDetail(userId);
  if (!user) {
    notFound();
  }

  return <UserDetailView user={user} />;
}

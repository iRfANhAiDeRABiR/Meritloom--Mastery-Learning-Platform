import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminUsersList } from "@/lib/queries/users";
import { UsersTableView } from "@/components/admin/users/users-table-view";

export const metadata: Metadata = {
  title: "User Management | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface UsersPageProps {
  searchParams: Promise<{
    q?: string;
    role?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;

  const { users, totalCount, totalPages } = await getAdminUsersList({
    q: params.q,
    role: params.role,
    status: params.status,
    page,
    limit: 25,
  });

  return (
    <UsersTableView
      initialUsers={users}
      totalCount={totalCount}
      currentPage={page}
      totalPages={totalPages}
    />
  );
}

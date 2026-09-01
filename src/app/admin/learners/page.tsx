import { redirect } from "next/navigation";

export default async function AdminLearnersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  const params = await searchParams;
  const qStr = params.q ? `?q=${encodeURIComponent(params.q)}` : "";
  redirect(`/admin/users${qStr}`);
}


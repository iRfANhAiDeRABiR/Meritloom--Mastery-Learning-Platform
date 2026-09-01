import type { Metadata } from "next";
import { getAdminSupportMessages } from "@/lib/queries/admin";
import { MessagesView } from "@/components/admin/messages-view";

export const metadata: Metadata = {
  title: "Support Messages | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface MessagesPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    topic?: string;
  }>;
}

export default async function AdminMessagesPage({ searchParams }: MessagesPageProps) {
  const resolvedParams = await searchParams;
  const messages = await getAdminSupportMessages({
    q: resolvedParams.q,
    status: resolvedParams.status,
    topic: resolvedParams.topic,
  });

  return (
    <MessagesView
      initialMessages={messages}
      searchQuery={resolvedParams.q || ""}
      selectedStatus={resolvedParams.status || "all"}
      selectedTopic={resolvedParams.topic || "all"}
    />
  );
}


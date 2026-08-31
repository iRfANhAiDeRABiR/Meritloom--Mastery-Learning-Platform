import type { Metadata } from "next";
import { ContentToolsView } from "@/components/admin/content-tools/content-tools-view";

export const metadata: Metadata = {
  title: "Content Tools & Backup | Meritloom Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default function AdminContentToolsPage() {
  return <ContentToolsView />;
}

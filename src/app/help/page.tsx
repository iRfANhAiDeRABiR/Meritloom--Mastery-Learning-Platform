import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { HelpCenterView } from "@/components/help/help-center-view";

export const metadata: Metadata = {
  title: "Help Center | Meritloom",
  description:
    "Find answers about Meritloom courses, accounts, Learning Paths, progress tracking, videos, and practice activities.",
  openGraph: {
    title: "Help Center — Meritloom",
    description:
      "Find answers about courses, progress, accounts, Learning Paths, and using Meritloom.",
    type: "website",
  },
  alternates: {
    canonical: "/help",
  },
};

export default async function HelpCenterPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-dvh flex-col bg-background text-ink transition-colors">
      <SiteHeader user={user} />

      <main id="main" className="flex-1">
        <HelpCenterView />
      </main>

      <SiteFooter />
    </div>
  );
}

import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { PRIVACY_SECTIONS, PRIVACY_TOC } from "@/content/legal/privacy";
import { legalConfig } from "@/config/legal";

export const metadata: Metadata = {
  title: "Privacy Policy | Meritloom",
  description:
    "Read how Meritloom handles account information, learner progress, preferences, support messages, and third-party learning services.",
  openGraph: {
    title: "Privacy Policy — Meritloom",
    description:
      "Learn what information Meritloom uses, why it is needed, and the choices you have when using the platform.",
    type: "website",
  },
  alternates: {
    canonical: "/privacy",
  },
};

export default async function PrivacyPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-dvh flex-col bg-background text-ink transition-colors">
      <SiteHeader user={user} />

      <main id="main" className="flex-1">
        <LegalPageShell
          badge="LEGAL"
          title="Privacy Policy"
          description="Learn what information Meritloom uses, why it is needed, and the choices you have when using the platform."
          lastUpdated={legalConfig.privacyLastUpdated}
          tocItems={PRIVACY_TOC}
          sections={PRIVACY_SECTIONS}
        />
      </main>

      <SiteFooter />
    </div>
  );
}

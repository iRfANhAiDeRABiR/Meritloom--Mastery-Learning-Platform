import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { TERMS_SECTIONS, TERMS_TOC } from "@/content/legal/terms";
import { legalConfig } from "@/config/legal";

export const metadata: Metadata = {
  title: "Terms of Service | Meritloom",
  description:
    "Read the terms that apply when using Meritloom courses, learning features, accounts, and external educational resources.",
  openGraph: {
    title: "Terms of Service — Meritloom",
    description:
      "These terms explain the rules for using Meritloom and the responsibilities that come with accessing the platform.",
    type: "website",
  },
  alternates: {
    canonical: "/terms",
  },
};

export default async function TermsPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-dvh flex-col bg-background text-ink transition-colors">
      <SiteHeader user={user} />

      <main id="main" className="flex-1">
        <LegalPageShell
          badge="LEGAL"
          title="Terms of Service"
          description="These terms explain the rules for using Meritloom and the responsibilities that come with accessing the platform."
          lastUpdated={legalConfig.termsLastUpdated}
          tocItems={TERMS_TOC}
          sections={TERMS_SECTIONS}
        />
      </main>

      <SiteFooter />
    </div>
  );
}

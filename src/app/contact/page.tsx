import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactInfo } from "@/components/contact/contact-info";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Meritloom",
  description:
    "Contact Meritloom about course, account, learning, content, or technical issues.",
  openGraph: {
    title: "Contact Meritloom",
    description:
      "Have a question or found a problem? Send us a message and we'll use the details to understand what happened.",
    type: "website",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default async function ContactPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-dvh flex-col bg-background text-ink transition-colors">
      <SiteHeader user={user} />

      <main id="main" className="flex-1">
        <ContactHero />

        <section className="pb-16 sm:pb-24">
          <div className="container-page">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] max-w-5xl mx-auto items-start">
              {/* Left Column: Guidance & Help Center Link */}
              <ContactInfo />

              {/* Right Column: Contact Form */}
              <ContactForm user={user} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

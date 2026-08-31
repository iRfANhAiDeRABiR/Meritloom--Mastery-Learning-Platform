import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { routes } from "@/lib/routes";

const FOOTER_NAV = [
  {
    heading: "Learn",
    links: [
      { label: "Courses", href: routes.courses.index },
      { label: "Learning Paths", href: routes.learningPaths.index },
      { label: "How It Works", href: routes.howItWorks },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "About", href: routes.about },
      { label: "Help", href: routes.howItWorks },
      { label: "Contact", href: routes.about },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: () => (
      <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: () => (
      <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: () => (
      <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.95 0-1.72.78-1.72 1.73a1.73 1.73 0 0 0 1.72 1.73c.96 0 1.73-.78 1.73-1.73 0-.95-.77-1.73-1.73-1.73" />
      </svg>
    ),
  },
];

/**
 * Site Footer.
 * Fully aligned with individual learner scope — no enterprise, billing, or sales references.
 */
export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-card text-ink transition-colors">
      <div className="container-page flex flex-col gap-12 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
          {/* Brand & Mission statement */}
          <div className="flex flex-col gap-4">
            <Link
              href={routes.home}
              aria-label="Meritloom home"
              className="inline-flex w-fit rounded-[10px]"
            >
              <Logo />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Meritloom is a free, mastery-based learning platform helping
              individual learners follow structured courses and master concepts
              without paywalls.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Meritloom on ${social.label}`}
                    className="grid size-9 place-items-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-primary/50 hover:bg-lavender hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links Grid */}
          <nav
            aria-label="Footer Navigation"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3"
          >
            {FOOTER_NAV.map((group) => (
              <div key={group.heading} className="flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  {group.heading}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-muted transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Bar with Dynamic Year */}
        <div className="flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Meritloom. Free learning for everyone.</p>
          <p>Built for individual learners. No payment or subscription required.</p>
        </div>
      </div>
    </footer>
  );
}

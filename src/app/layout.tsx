import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://meritloom.iabir.me";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Meritloom — Free mastery-based learning for everyone",
    template: "%s · Meritloom",
  },
  description:
    "Meritloom offers free, structured courses that help you learn each concept, practise it and move forward with confidence.",
  keywords: [
    "free online courses",
    "mastery learning",
    "structured learning paths",
    "self-paced learning",
    "programming courses",
    "learn to code free",
  ],
  authors: [{ name: "Meritloom" }],
  openGraph: {
    type: "website",
    siteName: "Meritloom",
    locale: "en_US",
    title: "Meritloom — Free mastery-based learning",
    description:
      "Meritloom offers free, structured courses that help you learn each concept, practise it and move forward with confidence.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meritloom — Free mastery-based learning",
    description:
      "Meritloom offers free, structured courses that help you learn each concept, practise it and move forward with confidence.",
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
      <body className="min-h-dvh bg-background font-sans text-ink antialiased">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only rounded-field bg-primary px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]"
          >
            Skip to main content
          </a>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

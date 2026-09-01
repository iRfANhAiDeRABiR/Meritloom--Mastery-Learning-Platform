import type { Metadata } from "next";
import Link from "next/link";
import { AlertOctagon, Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Account Suspended | Meritloom",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountSuspendedPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-6 text-center text-ink">
      <div className="mx-auto max-w-md space-y-6 rounded-3xl border border-line bg-surface p-8 shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
          <AlertOctagon className="size-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Account Suspended
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            Your Meritloom account is currently suspended. If you believe this is an error or would like to request an appeal, please reach out to our team.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
          <Button asChild className="rounded-xl bg-primary font-semibold text-white shadow-sm hover:bg-primary/90">
            <Link href="/contact">
              <Mail className="mr-1.5 size-4" />
              <span>Contact Support</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="rounded-xl border-line text-xs font-semibold">
            <Link href="/auth/sign-out">
              <LogOut className="mr-1.5 size-4 text-ink-muted" />
              <span>Sign Out</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

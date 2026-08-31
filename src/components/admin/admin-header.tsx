"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, ShieldCheck, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AdminUserSession } from "@/lib/auth/admin";

interface AdminHeaderProps {
  session: AdminUserSession;
}

export function AdminHeader({ session }: AdminHeaderProps) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-line bg-surface/95 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-ink transition hover:opacity-90"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white shadow-sm shadow-primary/30">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <span>Meritloom Admin</span>
        </Link>
        <Badge variant="outline" className="hidden border-primary/30 bg-primary/10 text-primary sm:inline-flex">
          Internal
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-muted transition hover:border-primary/40 hover:text-ink"
        >
          <span>View site</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <div className="h-4 w-[1px] bg-line" />

        <ThemeToggle />

        <div className="flex items-center gap-2 pl-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface-elevated text-xs font-bold text-ink">
            {session.profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.profile.avatarUrl}
                alt={session.profile.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-ink-muted" />
            )}
          </div>
          <span className="hidden text-xs font-semibold text-ink md:inline-block">
            {session.profile.name}
          </span>

          <button
            type="button"
            onClick={async () => {
              const supabase = createSupabaseBrowserClient();
              if (supabase) {
                await supabase.auth.signOut();
              }
              router.push("/");
              router.refresh();
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-semibold text-ink-muted transition hover:border-rose-500/40 hover:text-rose-500 cursor-pointer"
            title="Sign out"
          >
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

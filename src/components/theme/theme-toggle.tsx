"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        "relative grid size-10 place-items-center rounded-full border border-line bg-card text-ink transition-colors hover:bg-lavender/60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
        className,
      )}
    >
      <Sun
        className={cn(
          "size-[18px] transition-all duration-300",
          mounted && isDark
            ? "rotate-0 scale-100 opacity-100 text-amber-400"
            : "-rotate-90 scale-0 opacity-0 absolute",
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          "size-[18px] transition-all duration-300",
          !mounted || !isDark
            ? "rotate-0 scale-100 opacity-100 text-ink"
            : "rotate-90 scale-0 opacity-0 absolute",
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </button>
  );
}


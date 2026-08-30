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
        "relative grid size-[42px] place-items-center rounded-full border transition-all duration-250 cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isDark
          ? "border-[#29334A] bg-[#151D31]/85 text-[#FFD76A] hover:bg-[#1A233A] hover:border-[#7C5CFF]/40 hover:scale-105"
          : "border-[#E7EAF1] bg-white/90 text-[#263148] hover:bg-white hover:border-[#7C5CFF]/40 hover:scale-105",
        className,
      )}
    >
      <Sun
        className={cn(
          "size-[19px] transition-all duration-300",
          mounted && isDark
            ? "rotate-0 scale-100 opacity-100 text-[#FFD76A]"
            : "-rotate-90 scale-0 opacity-0 absolute",
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          "size-[19px] transition-all duration-300",
          !mounted || !isDark
            ? "rotate-0 scale-100 opacity-100 text-[#263148]"
            : "rotate-90 scale-0 opacity-0 absolute",
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </button>
  );
}

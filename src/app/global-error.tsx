"use client";

import * as React from "react";
import Link from "next/link";
import { formatErrorDigest } from "@/lib/errors/reference";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const reference = React.useMemo(() => {
    return formatErrorDigest(error?.digest);
  }, [error?.digest]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-dvh bg-[#0B1020] text-[#F7F8FC] font-sans antialiased flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-[#29334A] bg-[#151D31] p-8 text-center shadow-2xl">
          {/* Stylized Brand Indicator */}
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#7C5CFF]/10 border border-[#7C5CFF]/30 text-[#7C5CFF]">
            <svg
              className="size-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F8FC]">
            Meritloom couldn&apos;t load
          </h1>

          <p className="mt-2 text-sm text-[#AAB3C5] leading-relaxed">
            A critical application error occurred. Your learning progress is preserved safely.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto rounded-xl bg-[#7C5CFF] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#6847F5] cursor-pointer"
            >
              Try again
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto rounded-xl border border-[#29334A] bg-[#1A2338] px-5 py-2.5 text-sm font-semibold text-[#F7F8FC] transition-all hover:bg-[#29334A]"
            >
              Return home
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-[#29334A]/60 text-[11px] font-mono text-[#AAB3C5]">
            Reference: <span className="font-bold text-[#F7F8FC]">{reference}</span>
          </div>
        </div>
      </body>
    </html>
  );
}

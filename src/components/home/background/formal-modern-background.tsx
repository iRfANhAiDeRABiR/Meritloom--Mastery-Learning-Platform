import * as React from "react";

/**
 * FormalModernBackground
 *
 * A high-end, modern, formal ambient background animation for the Meritloom homepage.
 * Combines:
 * - Fluid multi-layered chromatic aurora mesh orbs with organic sinusoidal floating
 * - Precision architectural tech grid & coordinate matrix with radial fade mask
 * - Faint laser beam sweeps traveling along grid axes
 * - Subtle pulsating precision crosshairs (+) and micro coordinate badges
 * - GPU-accelerated and accessible (respects prefers-reduced-motion)
 */
export function FormalModernBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
    >
      {/* 1. Fluid Chromatic Aurora Mesh Glows (Slow organic drift) */}
      <div className="absolute inset-0">
        {/* Top-Center Primary Royal Violet / Indigo Orb */}
        <div
          className="absolute -top-[12rem] left-1/2 h-[680px] w-[980px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/20 via-[#8B5CF6]/15 to-transparent blur-[140px] dark:from-primary/25 dark:via-[#7C3AED]/20 animate-aurora-1"
        />

        {/* Top-Right Emerald / Mint Accent Orb */}
        <div
          className="absolute top-[8%] -right-24 h-[560px] w-[560px] rounded-full bg-gradient-to-br from-mint-ink/15 via-[#10B981]/10 to-transparent blur-[130px] dark:from-mint-ink/20 dark:via-[#059669]/15 animate-aurora-2"
          style={{ animationDelay: "-6s" }}
        />

        {/* Mid-Left Sapphire / Cobalt Orb */}
        <div
          className="absolute top-[38%] -left-32 h-[620px] w-[620px] rounded-full bg-gradient-to-tr from-[#3B82F6]/15 via-[#6366F1]/10 to-transparent blur-[150px] dark:from-[#2563EB]/18 dark:via-[#4F46E5]/12 animate-aurora-3"
          style={{ animationDelay: "-12s" }}
        />

        {/* Lower Testimonials / CTA Warm Violet Glow */}
        <div
          className="absolute bottom-[10%] right-[10%] h-[580px] w-[720px] rounded-full bg-gradient-to-tl from-primary/15 via-[#C084FC]/10 to-transparent blur-[160px] dark:from-primary/20 dark:via-[#9333EA]/12 animate-aurora-1"
          style={{ animationDelay: "-18s" }}
        />
      </div>

      {/* 2. Precision Architectural Grid Pattern with Radial Vignette */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.07] [mask-image:radial-gradient(ellipse_85%_70%_at_50%_15%,#000_70%,transparent_100%)]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* 3. Subtle Dot Matrix Accent Overlay (Higher density for micro-texture) */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05] [mask-image:radial-gradient(circle_at_50%_40%,#000_40%,transparent_80%)]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* 4. Elegant Gliding Grid Light Beams (Data Highway Effect) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Horizontal Beam 1 — Across Upper Hero Line */}
        <div className="absolute top-[280px] inset-x-0 h-px">
          <div className="h-full w-48 bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-beam-h" />
        </div>

        {/* Horizontal Beam 2 — Across Middle Section */}
        <div className="absolute top-[720px] inset-x-0 h-px opacity-60">
          <div
            className="h-full w-64 bg-gradient-to-r from-transparent via-mint-ink/50 to-transparent animate-beam-h"
            style={{ animationDelay: "-7s", animationDuration: "19s" }}
          />
        </div>

        {/* Vertical Beam 1 — Along Left Grid Axis */}
        <div className="absolute left-[12%] inset-y-0 w-px hidden md:block">
          <div className="w-full h-48 bg-gradient-to-b from-transparent via-primary/50 to-transparent animate-beam-v" />
        </div>

        {/* Vertical Beam 2 — Along Right Grid Axis */}
        <div className="absolute right-[12%] inset-y-0 w-px hidden md:block opacity-60">
          <div
            className="w-full h-56 bg-gradient-to-b from-transparent via-[#8B5CF6]/50 to-transparent animate-beam-v"
            style={{ animationDelay: "-9s", animationDuration: "22s" }}
          />
        </div>
      </div>

      {/* 5. Precision Crosshair Markers (+) at Grid Coordinates */}
      <div className="absolute inset-0 overflow-hidden font-mono text-[10px] text-muted/40 select-none">
        {/* Crosshair 1: Top-Left Hero Coordinate */}
        <div className="absolute top-[144px] left-[8%] flex items-center gap-1.5 animate-crosshair">
          <span className="font-sans text-xs font-light text-primary/60">+</span>
          <span className="hidden xl:inline text-[9px] tracking-widest text-muted/30">01.NAV</span>
        </div>

        {/* Crosshair 2: Top-Right Hero Coordinate */}
        <div
          className="absolute top-[192px] right-[10%] flex items-center gap-1.5 animate-crosshair"
          style={{ animationDelay: "-2s" }}
        >
          <span className="font-sans text-xs font-light text-mint-ink/60">+</span>
          <span className="hidden xl:inline text-[9px] tracking-widest text-muted/30">02.SYS</span>
        </div>

        {/* Crosshair 3: Mid-Page Left Features */}
        <div
          className="absolute top-[624px] left-[14%] flex items-center gap-1.5 animate-crosshair"
          style={{ animationDelay: "-4s" }}
        >
          <span className="font-sans text-xs font-light text-primary/60">+</span>
        </div>

        {/* Crosshair 4: Lower Right Catalog */}
        <div
          className="absolute top-[1152px] right-[15%] flex items-center gap-1.5 animate-crosshair"
          style={{ animationDelay: "-3s" }}
        >
          <span className="font-sans text-xs font-light text-primary/50">+</span>
          <span className="hidden xl:inline text-[9px] tracking-widest text-muted/30">03.CAT</span>
        </div>

        {/* Crosshair 5: Testimonials Coordinate */}
        <div
          className="absolute top-[1728px] left-[10%] flex items-center gap-1.5 animate-crosshair"
          style={{ animationDelay: "-5s" }}
        >
          <span className="font-sans text-xs font-light text-mint-ink/50">+</span>
        </div>
      </div>

      {/* 6. Subtle Floating Luminous Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <span
          className="absolute top-[14%] left-[18%] size-1.5 rounded-full bg-primary/40 shadow-[0_0_8px_var(--color-primary)] animate-particle-1"
        />
        <span
          className="absolute top-[28%] right-[24%] size-2 rounded-full bg-mint/50 shadow-[0_0_10px_var(--color-mint-ink)] animate-particle-2"
        />
        <span
          className="absolute top-[52%] left-[8%] size-1 rounded-full bg-[#8B5CF6]/40 shadow-[0_0_6px_#8B5CF6] animate-particle-3"
        />
        <span
          className="absolute top-[68%] right-[12%] size-1.5 rounded-full bg-primary/30 shadow-[0_0_8px_var(--color-primary)] animate-particle-4"
        />
        <span
          className="absolute top-[82%] left-[22%] size-2 rounded-full bg-mint/40 shadow-[0_0_10px_var(--color-mint-ink)] animate-particle-2"
        />
      </div>
    </div>
  );
}

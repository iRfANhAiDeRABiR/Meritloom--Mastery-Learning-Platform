"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Clock3, Sparkles } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { routes } from "@/lib/routes";

const BENEFIT_ITEMS = [
  {
    icon: BookOpen,
    title: "100% Free Courses",
    description: "Structured lessons without paywalls, subscriptions, or hidden fees.",
  },
  {
    icon: CheckCircle2,
    title: "Mastery-Focused Learning",
    description: "Build deep understanding through step-by-step practical examples.",
  },
  {
    icon: Clock3,
    title: "Learn At Your Own Pace",
    description: "Complete courses on your schedule with zero time pressure.",
  },
] as const;

// 10 Subtle Floating Particles with varied sizes, positions, colors and animations
const PARTICLES = [
  { top: "12%", left: "18%", size: 4, color: "#8B6CFF", anim: "animate-particle-1" },
  { top: "25%", left: "78%", size: 3, color: "#C4B5FD", anim: "animate-particle-2" },
  { top: "38%", left: "12%", size: 5, color: "#60A5FA", anim: "animate-particle-3" },
  { top: "52%", left: "85%", size: 3, color: "#8B6CFF", anim: "animate-particle-4" },
  { top: "68%", left: "22%", size: 4, color: "#C4B5FD", anim: "animate-particle-1" },
  { top: "78%", left: "72%", size: 6, color: "#8B6CFF", anim: "animate-particle-2" },
  { top: "86%", left: "35%", size: 3, color: "#60A5FA", anim: "animate-particle-3" },
  { top: "18%", left: "55%", size: 2, color: "#C4B5FD", anim: "animate-particle-4" },
  { top: "45%", left: "62%", size: 4, color: "#8B6CFF", anim: "animate-particle-2" },
  { top: "92%", left: "80%", size: 3, color: "#60A5FA", anim: "animate-particle-1" },
];

export function AuthBrandPanel() {
  const [mousePos, setMousePos] = React.useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-full flex-col justify-between overflow-hidden p-8 text-[#F7F8FC] sm:p-12 lg:p-14 select-none"
      style={{
        background:
          "linear-gradient(135deg, #111633 0%, #141a38 40%, #10172a 100%)",
      }}
    >
      {/* 1. Base ambient radial glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 10%, rgba(109, 74, 255, 0.20), transparent 38%),
            radial-gradient(circle at 80% 85%, rgba(99, 102, 241, 0.15), transparent 45%)
          `,
        }}
      />

      {/* 2. Large subtle blurred ambient breathing glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/3 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B6CFF]/15 blur-[100px] animate-ambient-glow"
      />

      {/* 3. Interactive soft mouse follow glow (Desktop only) */}
      {mousePos && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute size-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            background:
              "radial-gradient(circle, rgba(139, 108, 255, 0.08) 0%, transparent 70%)",
          }}
        />
      )}

      {/* 4. Subtle Animated Orbit Paths & Learning Route Lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/4 size-[480px] rounded-full border border-[rgba(124,92,255,0.12)] animate-orbit-spin"
      >
        <span className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-[#8B6CFF] shadow-[0_0_10px_#8B6CFF] animate-orbit-node" />
        <span className="absolute -bottom-1.5 left-1/3 size-2 -translate-x-1/2 rounded-full bg-[#60A5FA] shadow-[0_0_8px_#60A5FA] animate-orbit-node" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-1/4 size-[540px] rounded-full border border-[rgba(99,102,241,0.09)] animate-orbit-spin"
        style={{ animationDirection: "reverse", animationDuration: "90s" }}
      >
        <span className="absolute top-1/3 -right-1 size-2.5 rounded-full bg-[#C4B5FD] shadow-[0_0_8px_#C4B5FD] animate-orbit-node" />
      </div>

      {/* 5. Floating particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p, idx) => (
          <span
            key={idx}
            className={`absolute rounded-full ${p.anim}`}
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 6px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* 6. Subtle Floating Geometric Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-12 top-24 size-10 rounded-2xl border border-[rgba(139,108,255,0.2)] bg-[rgba(139,108,255,0.04)] backdrop-blur-xs animate-float-rotate opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-10 bottom-36 size-8 rotate-45 rounded-lg border border-[rgba(96,165,250,0.2)] bg-[rgba(96,165,250,0.04)] backdrop-blur-xs animate-float-rotate opacity-60"
        style={{ animationDelay: "2s" }}
      />

      {/* Geometric subtle grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
      />

      {/* TOP CONTENT: Brand Logo & Badge */}
      <div className="relative z-10 flex flex-col items-start gap-6">
        <Link
          href={routes.home}
          aria-label="Meritloom home"
          className="group shrink-0 rounded-2xl p-1.5 transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="rounded-xl bg-gradient-to-br from-[#7957FF]/30 to-[#6445EF]/20 p-2 border border-white/10 shadow-[0_0_20px_rgba(109,74,255,0.25)] backdrop-blur-md">
            <Logo />
          </div>
        </Link>

        <Badge
          variant="default"
          className="gap-1.5 border border-primary/40 bg-primary/20 px-3.5 py-1 text-xs font-bold text-white shadow-soft"
        >
          <Sparkles className="size-3.5 text-mint" aria-hidden="true" />
          Welcome to Meritloom
        </Badge>
      </div>

      {/* MIDDLE CONTENT: Headline & Subtitle */}
      <div className="relative z-10 my-auto py-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#F7F8FC] sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
          Turn every learning goal into a{" "}
          <span className="bg-gradient-to-r from-[#8B6CFF] via-[#7057FF] to-[#9B7BFF] bg-clip-text text-transparent">
            clear path forward.
          </span>
        </h1>
        <p className="mt-4 text-[17px] leading-[1.65] text-[#C2C9DA] max-w-xl">
          Learn useful skills through free, structured courses designed to help
          you understand each concept.
        </p>

        {/* Modernized Benefit Card ("LEARN WITHOUT BARRIERS") */}
        <div
          className="mt-8 rounded-container border border-[rgba(148,163,184,0.16)] p-6 backdrop-blur-[14px] shadow-lift relative overflow-hidden"
          style={{
            background: "rgba(23, 31, 54, 0.66)",
            boxShadow:
              "0 4px 24px -1px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(124, 92, 255, 0.05)",
          }}
        >
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-mint flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-mint shadow-[0_0_6px_#67e8d2]" />
            Learn without barriers
          </h2>

          <div className="mt-4 flex flex-col gap-3.5">
            {BENEFIT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group flex items-start gap-3.5 rounded-xl p-2 transition-all duration-200 hover:bg-white/[0.04]"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-[12px] border border-[rgba(124,92,255,0.25)] bg-[rgba(124,92,255,0.12)] text-[#9B86FF] transition-all duration-200 group-hover:border-[rgba(124,92,255,0.45)] group-hover:bg-[rgba(124,92,255,0.22)] group-hover:shadow-[0_0_12px_rgba(139,108,255,0.35)]">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#F3F5FB]">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#AEB7CB]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER INDICATOR */}
      <div className="relative z-10 flex items-center justify-between text-xs text-white/50">
        <span>© {new Date().getFullYear()} Meritloom. Free learning platform.</span>
      </div>
    </div>
  );
}

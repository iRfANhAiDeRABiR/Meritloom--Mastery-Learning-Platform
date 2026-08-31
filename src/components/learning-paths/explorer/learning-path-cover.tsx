import * as React from "react";
import { Braces, Code2, Palette, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface LearningPathCoverProps {
  slug?: string;
  className?: string;
}

export function LearningPathCover({ className }: LearningPathCoverProps) {
  return (
    <div
      className={cn(
        "relative aspect-[16/8] w-full overflow-hidden rounded-t-[22px] bg-gradient-to-br from-[#111827] via-[#1E1B4B] to-[#31104B] p-5 text-white shadow-soft flex items-center justify-center",
        className,
      )}
    >
      {/* Geometric Ambient Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Connected 4-Node Sequence Graphic */}
      <div className="relative z-10 flex items-center gap-2 sm:gap-3">
        {/* Node 1: HTML */}
        <div className="flex flex-col items-center gap-1">
          <div className="grid size-9 sm:size-10 place-items-center rounded-xl border border-amber-500/40 bg-amber-500/20 text-amber-400 shadow-xs">
            <Code2 className="size-4 sm:size-5" aria-hidden="true" />
          </div>
          <span className="text-[10px] font-bold text-amber-300/90">HTML</span>
        </div>

        {/* Connector 1 */}
        <div className="h-0.5 w-4 sm:w-6 bg-gradient-to-r from-amber-500 to-cyan-500 opacity-60" />

        {/* Node 2: CSS */}
        <div className="flex flex-col items-center gap-1">
          <div className="grid size-9 sm:size-10 place-items-center rounded-xl border border-cyan-500/40 bg-cyan-500/20 text-cyan-400 shadow-xs">
            <Palette className="size-4 sm:size-5" aria-hidden="true" />
          </div>
          <span className="text-[10px] font-bold text-cyan-300/90">CSS</span>
        </div>

        {/* Connector 2 */}
        <div className="h-0.5 w-4 sm:w-6 bg-gradient-to-r from-cyan-500 to-amber-400 opacity-60" />

        {/* Node 3: JS */}
        <div className="flex flex-col items-center gap-1">
          <div className="grid size-9 sm:size-10 place-items-center rounded-xl border border-amber-400/40 bg-amber-400/20 text-amber-300 shadow-xs">
            <Braces className="size-4 sm:size-5" aria-hidden="true" />
          </div>
          <span className="text-[10px] font-bold text-amber-300/90">JS</span>
        </div>

        {/* Connector 3 */}
        <div className="h-0.5 w-4 sm:w-6 bg-gradient-to-r from-amber-400 to-primary opacity-60" />

        {/* Node 4: Project */}
        <div className="flex flex-col items-center gap-1">
          <div className="grid size-9 sm:size-10 place-items-center rounded-xl border border-primary/50 bg-primary/30 text-white shadow-xs">
            <Rocket className="size-4 sm:size-5 text-amber-300" aria-hidden="true" />
          </div>
          <span className="text-[10px] font-bold text-white/90">Project</span>
        </div>
      </div>
    </div>
  );
}

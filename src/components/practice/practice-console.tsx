"use client";

import * as React from "react";
import { AlertCircle, AlertTriangle, Terminal, Trash2 } from "lucide-react";
import type { ConsoleLogMessage } from "@/lib/practice/types";
import { cn } from "@/lib/utils";

interface PracticeConsoleProps {
  logs: ConsoleLogMessage[];
  onClear: () => void;
  className?: string;
}

export function PracticeConsole({ logs, onClear, className }: PracticeConsoleProps) {
  return (
    <div className={cn("flex flex-col h-full rounded-2xl border border-line bg-[#0E1424] text-white shadow-inner overflow-hidden", className)}>
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2 text-xs">
        <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-white/70">
          <Terminal className="h-3.5 w-3.5" />
          <span>Console ({logs.length})</span>
        </span>

        {logs.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-[11px] text-white/60 hover:text-rose-400 transition cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Logs List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1.5 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-white/40 italic py-4 text-center">
            Console output will appear here when your code calls console.log().
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={cn(
                "flex items-start gap-2 rounded px-2 py-1 leading-relaxed break-all",
                log.type === "error" && "bg-rose-500/15 text-rose-300 border border-rose-500/30",
                log.type === "warn" && "bg-amber-500/15 text-amber-300 border border-amber-500/30",
                log.type === "info" && "bg-sky-500/15 text-sky-300",
                log.type === "log" && "text-emerald-300/90",
              )}
            >
              {log.type === "error" ? (
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-400" />
              ) : log.type === "warn" ? (
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-400" />
              ) : (
                <span className="text-white/30 shrink-0 select-none">&gt;</span>
              )}
              <span className="whitespace-pre-wrap">{log.content}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

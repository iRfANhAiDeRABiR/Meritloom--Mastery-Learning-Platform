"use client";

import * as React from "react";
import {
  Check,
  Code2,
  Eye,
  ListChecks,
  Loader2,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Terminal,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { PracticeCodeEditor } from "./practice-code-editor";
import { PracticePreview } from "./practice-preview";
import { PracticeConsole } from "./practice-console";
import { PracticeTaskPanel } from "./practice-task-panel";
import { PracticeCheckResultsDialog } from "./practice-check-results-dialog";
import { PracticeResetDialog } from "./practice-reset-dialog";
import { evaluatePracticeRequirements } from "@/lib/practice/checks";
import { resetPracticeDraftAction, savePracticeDraftAction } from "@/lib/practice/actions";
import type {
  ConsoleLogMessage,
  PracticeCheckEvaluation,
  PracticeConfig,
  PracticeLanguage,
  PracticeStarterCode,
} from "@/lib/practice/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodingPracticeWorkspaceProps {
  lessonId: string;
  lessonTitle: string;
  config: PracticeConfig;
  initialCode: PracticeStarterCode;
}

export function CodingPracticeWorkspace({
  lessonId,
  lessonTitle,
  config,
  initialCode,
}: CodingPracticeWorkspaceProps) {
  // Code editor states
  const [htmlCode, setHtmlCode] = React.useState(initialCode.html || "");
  const [cssCode, setCssCode] = React.useState(initialCode.css || "");
  const [jsCode, setJsCode] = React.useState(initialCode.javascript || "");

  // Active language tab (only configured languages)
  const availableLangs = config.languages || ["html"];
  const [activeLang, setActiveLang] = React.useState<PracticeLanguage>(availableLangs[0]);

  // View tabs (for mobile / split view)
  const [activeView, setActiveView] = React.useState<"code" | "preview" | "console">("code");

  // Output execution states
  const [previewHtml, setPreviewHtml] = React.useState(initialCode.html || "");
  const [previewCss, setPreviewCss] = React.useState(initialCode.css || "");
  const [previewJs, setPreviewJs] = React.useState(initialCode.javascript || "");
  const [consoleLogs, setConsoleLogs] = React.useState<ConsoleLogMessage[]>([]);
  const [runtimeError, setRuntimeError] = React.useState<string | null>(null);

  // Requirement checks state
  const [passedCheckIds, setPassedCheckIds] = React.useState<Set<string>>(new Set());
  const [checkEvaluation, setCheckEvaluation] = React.useState<PracticeCheckEvaluation | null>(null);
  const [showCheckDialog, setShowCheckDialog] = React.useState(false);
  const [showResetDialog, setShowResetDialog] = React.useState(false);

  // Autosave states
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const hadSaveFailureRef = React.useRef(false);

  // Focus mode
  const [isFocusMode, setIsFocusMode] = React.useState(false);

  // Listen to sandbox postMessage bridge for console & errors
  React.useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "MERITLOOM_SANDBOX_CONSOLE") {
        const newLog: ConsoleLogMessage = {
          id: String(Date.now()) + Math.random().toString(36).substring(2, 5),
          type: e.data.level || "log",
          content: e.data.content || "",
          timestamp: e.data.timestamp || Date.now(),
        };

        setConsoleLogs((prev) => [...prev, newLog]);

        if (e.data.level === "error") {
          setRuntimeError(e.data.content);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Run preview explicitly
  const handleRunCode = React.useCallback(() => {
    setRuntimeError(null);
    setPreviewHtml(htmlCode);
    setPreviewCss(cssCode);
    setPreviewJs(jsCode);

    // Evaluate safe checklist
    const evaluation = evaluatePracticeRequirements(htmlCode, cssCode, config.requirements);
    const passed = new Set(evaluation.checks.filter((c) => c.passed).map((c) => c.id));
    setPassedCheckIds(passed);

    // On mobile, auto-switch to preview to see result
    if (window.innerWidth < 768) {
      setActiveView("preview");
    }
  }, [htmlCode, cssCode, jsCode, config.requirements]);

  // Trigger Check My Work
  const handleCheckMyWork = () => {
    const evaluation = evaluatePracticeRequirements(htmlCode, cssCode, config.requirements);
    setCheckEvaluation(evaluation);
    const passed = new Set(evaluation.checks.filter((c) => c.passed).map((c) => c.id));
    setPassedCheckIds(passed);
    setShowCheckDialog(true);
  };

  // Perform Draft Autosave
  const saveRef = React.useRef<(h: string, c: string, j: string) => Promise<void>>(async () => {});

  const performSave = React.useCallback(async (h: string, c: string, j: string) => {
    setSaveStatus("saving");
    try {
      const res = await savePracticeDraftAction({
        lessonId,
        html: h,
        css: c,
        javascript: j,
      });

      if (res.success) {
        setSaveStatus("saved");
        if (hadSaveFailureRef.current) {
          hadSaveFailureRef.current = false;
          toast("Draft saved", { description: "Your latest code is now saved.", duration: 3000 });
        }
      } else {
        setSaveStatus("error");
        hadSaveFailureRef.current = true;
        toast.error("Code couldn't be saved", {
          description: "Your work is still in the editor. Try again.",
          action: {
            label: "Retry",
            onClick: () => {
              saveRef.current(h, c, j);
            },
          },
        });
      }
    } catch {
      setSaveStatus("error");
      hadSaveFailureRef.current = true;
    }
  }, [lessonId]);

  React.useEffect(() => {
    saveRef.current = performSave;
  }, [performSave]);

  // Code change dispatchers with debounce
  const handleCodeChange = (lang: PracticeLanguage, newVal: string) => {
    let nextH = htmlCode;
    let nextC = cssCode;
    let nextJ = jsCode;

    if (lang === "html") {
      setHtmlCode(newVal);
      nextH = newVal;
    } else if (lang === "css") {
      setCssCode(newVal);
      nextC = newVal;
    } else if (lang === "javascript") {
      setJsCode(newVal);
      nextJ = newVal;
    }

    setSaveStatus("saving");
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      performSave(nextH, nextC, nextJ);
    }, 1000);
  };

  // Handle Reset to Starter Code
  const handleConfirmReset = async () => {
    await resetPracticeDraftAction(lessonId);
    setHtmlCode(config.starterCode.html || "");
    setCssCode(config.starterCode.css || "");
    setJsCode(config.starterCode.javascript || "");
    setPreviewHtml(config.starterCode.html || "");
    setPreviewCss(config.starterCode.css || "");
    setPreviewJs(config.starterCode.javascript || "");
    setConsoleLogs([]);
    setRuntimeError(null);
    setPassedCheckIds(new Set());
    setSaveStatus("idle");
    toast("Code reset", { description: "Starter code restored.", duration: 3000 });
  };

  return (
    <div className={cn("w-full flex flex-col gap-6", isFocusMode && "fixed inset-0 z-50 bg-background p-4 sm:p-6 overflow-y-auto")}>
      {/* Focus Mode Top Banner */}
      {isFocusMode && (
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-primary">Meritloom Practice</span>
            <span className="text-ink-muted text-xs">•</span>
            <span className="text-xs font-bold text-ink truncate">{lessonTitle}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFocusMode(false)}
            className="rounded-xl border-line text-xs font-semibold"
          >
            <Minimize2 className="mr-1.5 h-3.5 w-3.5" />
            <span>Exit focus mode</span>
          </Button>
        </div>
      )}

      {/* Task Instructions & Requirements Panel */}
      <PracticeTaskPanel config={config} passedCheckIds={passedCheckIds} />

      {/* Main Coding & Preview Workspace Container */}
      <div className="flex flex-col rounded-3xl border border-line bg-surface shadow-sm overflow-hidden">
        {/* Workspace Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface p-3 sm:px-5">
          {/* Left: Language Tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-line bg-surface-elevated/30 p-1">
            {availableLangs.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  setActiveLang(lang);
                  setActiveView("code");
                }}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-mono text-xs font-bold uppercase transition cursor-pointer",
                  activeLang === lang && activeView === "code"
                    ? "bg-primary text-white shadow-xs"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Center (Mobile Only): Switch between Code, Preview, and Console */}
          <div className="flex md:hidden items-center gap-1 rounded-xl border border-line bg-surface-elevated/30 p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveView("code")}
              className={cn("rounded-lg px-2.5 py-1 font-bold", activeView === "code" ? "bg-primary text-white" : "text-ink-muted")}
            >
              <Code2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setActiveView("preview")}
              className={cn("rounded-lg px-2.5 py-1 font-bold", activeView === "preview" ? "bg-primary text-white" : "text-ink-muted")}
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            {availableLangs.includes("javascript") && (
              <button
                type="button"
                onClick={() => setActiveView("console")}
                className={cn("rounded-lg px-2.5 py-1 font-bold", activeView === "console" ? "bg-primary text-white" : "text-ink-muted")}
              >
                <Terminal className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right: Actions (Autosave Status, Reset, Check Work, Run, Focus) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Inline Save Status */}
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-ink-muted">
              {saveStatus === "saving" && (
                <span className="flex items-center gap-1 text-ink-muted">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  <span>Saving...</span>
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="flex items-center gap-1 text-emerald-500">
                  <Check className="h-3 w-3" />
                  <span>Saved</span>
                </span>
              )}
              {saveStatus === "error" && (
                <span className="flex items-center gap-1 text-rose-500">
                  <XCircle className="h-3 w-3" />
                  <span>Couldn&apos;t save</span>
                </span>
              )}
            </div>

            {/* Reset Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowResetDialog(true)}
              title="Reset to starter code"
              className="h-8 rounded-xl border-line text-xs font-semibold hover:text-rose-500"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>

            {/* Check my work button */}
            {config.requirements.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCheckMyWork}
                className="h-8 rounded-xl border-line text-xs font-semibold text-ink hover:border-primary/40 hover:text-primary"
              >
                <ListChecks className="mr-1 h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">Check my work</span>
              </Button>
            )}

            {/* Run Button (Primary) */}
            <Button
              type="button"
              size="sm"
              onClick={handleRunCode}
              className="h-8 rounded-xl bg-primary px-3 text-xs font-bold text-white shadow-sm hover:bg-primary/90"
            >
              <Play className="mr-1 h-3.5 w-3.5 fill-white" />
              <span>Run</span>
            </Button>

            {/* Focus Mode Toggle */}
            {!isFocusMode && (
              <button
                type="button"
                onClick={() => setIsFocusMode(true)}
                title="Enter Focus Mode"
                className="hidden lg:grid h-8 w-8 place-items-center rounded-xl border border-line bg-surface text-ink-muted hover:text-primary transition cursor-pointer"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Two-Column Editor & Preview Grid (Desktop) / Tabbed (Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 min-h-[440px] bg-surface-elevated/10">
          {/* Left Column: Code Editor */}
          <div className={cn("h-[420px] md:h-[500px]", activeView !== "code" && "hidden md:block")}>
            <PracticeCodeEditor
              language={activeLang}
              value={activeLang === "html" ? htmlCode : activeLang === "css" ? cssCode : jsCode}
              onChange={(val) => handleCodeChange(activeLang, val)}
              onRun={handleRunCode}
            />
          </div>

          {/* Right Column: Preview & Optional Console */}
          <div className={cn("flex flex-col gap-4 h-[420px] md:h-[500px]", activeView === "code" && "hidden md:flex")}>
            {/* Preview Panel */}
            <div className={cn("flex-1 overflow-hidden", activeView === "console" && "hidden md:block")}>
              <PracticePreview
                html={previewHtml}
                css={previewCss}
                javascript={previewJs}
                lessonTitle={lessonTitle}
                runtimeError={runtimeError}
                onRefresh={handleRunCode}
              />
            </div>

            {/* Console Panel (if JavaScript is configured) */}
            {availableLangs.includes("javascript") && (
              <div className={cn("h-36 md:h-44", activeView === "preview" && "hidden md:block")}>
                <PracticeConsole
                  logs={consoleLogs}
                  onClear={() => {
                    setConsoleLogs([]);
                    setRuntimeError(null);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Check My Work Results Modal */}
      {showCheckDialog && checkEvaluation && (
        <PracticeCheckResultsDialog
          evaluation={checkEvaluation}
          onClose={() => setShowCheckDialog(false)}
          onContinue={() => setShowCheckDialog(false)}
        />
      )}

      {/* Reset Confirmation Modal */}
      {showResetDialog && (
        <PracticeResetDialog
          onClose={() => setShowResetDialog(false)}
          onConfirmReset={handleConfirmReset}
        />
      )}
    </div>
  );
}

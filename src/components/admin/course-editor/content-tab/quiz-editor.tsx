"use client";

import * as React from "react";
import { Check, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveLessonQuizAction } from "@/lib/actions/admin";
import type { AdminQuizDetail } from "@/lib/types";

interface QuizEditorProps {
  lessonId: string;
  courseId: string;
  initialQuiz?: AdminQuizDetail | null;
  onUpdated: () => void;
}

export function QuizEditor({ lessonId, courseId, initialQuiz, onUpdated }: QuizEditorProps) {
  const [title, setTitle] = React.useState(initialQuiz?.title || "Knowledge Check");
  const [description] = React.useState(initialQuiz?.description || "");
  const [estimatedMinutes, setEstimatedMinutes] = React.useState(initialQuiz?.estimatedMinutes || 5);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [questions, setQuestions] = React.useState<any[]>(
    initialQuiz?.questions.map((q) => ({
      id: q.id,
      questionType: q.questionType,
      questionText: q.questionText,
      topic: q.topic || "",
      codeContent: q.codeContent || "",
      explanation: q.explanation || "",
      options: q.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        isCorrect: Boolean(opt.isCorrect),
      })),
    })) || [],
  );

  const [isSaving, setIsSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionType: "single_choice",
        questionText: "",
        topic: "",
        codeContent: "",
        explanation: "",
        options: [
          { text: "", isCorrect: true },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setMsg(null);

    try {
      const res = await saveLessonQuizAction(lessonId, courseId, {
        title,
        description,
        estimatedMinutes,
        questions,
      });

      if (!res.success) {
        setMsg({ type: "error", text: res.error || "Failed to save quiz." });
      } else {
        setMsg({ type: "success", text: "Knowledge Check saved successfully." });
        onUpdated();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save quiz.";
      setMsg({ type: "error", text: message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {msg && (
        <div
          className={`rounded-xl p-3 text-xs font-semibold ${
            msg.type === "success"
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Quiz Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Estimated Duration (Mins)
          </label>
          <input
            type="number"
            min={1}
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(parseInt(e.target.value, 10) || 5)}
            className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Questions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <h3 className="font-display text-sm font-bold text-ink">
            Questions ({questions.length})
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddQuestion}
            className="rounded-xl border-line text-xs font-semibold"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            <span>Add Question</span>
          </Button>
        </div>

        {questions.length === 0 ? (
          <p className="py-8 text-center text-xs text-ink-muted">
            No questions in this quiz. Click &quot;Add Question&quot; to create practice questions.
          </p>
        ) : (
          questions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="rounded-2xl border border-line bg-surface-elevated/30 p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink">Question {qIdx + 1}</span>
                <div className="flex items-center gap-2">
                  <select
                    value={q.questionType}
                    onChange={(e) => {
                      const next = [...questions];
                      next[qIdx].questionType = e.target.value;
                      if (e.target.value === "true_false") {
                        next[qIdx].options = [
                          { text: "True", isCorrect: true },
                          { text: "False", isCorrect: false },
                        ];
                      }
                      setQuestions(next);
                    }}
                    className="h-8 rounded-lg border border-line bg-surface px-2 text-xs text-ink focus:border-primary focus:outline-none"
                  >
                    <option value="single_choice">Single Choice</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True / False</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))}
                    className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-muted">
                  Question Prompt *
                </label>
                <textarea
                  rows={2}
                  required
                  value={q.questionText}
                  onChange={(e) => {
                    const next = [...questions];
                    next[qIdx].questionText = e.target.value;
                    setQuestions(next);
                  }}
                  placeholder="What is the purpose of the <body> tag in HTML?"
                  className="mt-1 w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-muted">
                  Code Snippet (Optional)
                </label>
                <textarea
                  rows={2}
                  value={q.codeContent}
                  onChange={(e) => {
                    const next = [...questions];
                    next[qIdx].codeContent = e.target.value;
                    setQuestions(next);
                  }}
                  placeholder="<h1 class='title'>Hello</h1>"
                  className="mt-1 w-full rounded-xl border border-line bg-surface p-2.5 font-mono text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  Options (Select correct answer)
                </label>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {q.options.map((opt: any, oIdx: number) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...questions];
                        if (q.questionType === "single_choice" || q.questionType === "true_false") {
                          // Uncheck all other options
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          next[qIdx].options.forEach((o: any) => (o.isCorrect = false));
                          next[qIdx].options[oIdx].isCorrect = true;
                        } else {
                          // Toggle for multiple choice
                          next[qIdx].options[oIdx].isCorrect = !next[qIdx].options[oIdx].isCorrect;
                        }
                        setQuestions(next);
                      }}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                        opt.isCorrect
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-line bg-surface text-ink-muted hover:border-emerald-500"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const next = [...questions];
                        next[qIdx].options[oIdx].text = e.target.value;
                        setQuestions(next);
                      }}
                      placeholder={`Option ${oIdx + 1}`}
                      className="h-8 flex-1 rounded-lg border border-line bg-surface px-2.5 text-xs text-ink focus:border-primary focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-muted">
                  Explanation
                </label>
                <input
                  type="text"
                  value={q.explanation}
                  onChange={(e) => {
                    const next = [...questions];
                    next[qIdx].explanation = e.target.value;
                    setQuestions(next);
                  }}
                  placeholder="Explain why this answer is correct..."
                  className="mt-1 h-8 w-full rounded-lg border border-line bg-surface px-2.5 text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-primary px-6 font-semibold text-white shadow-sm hover:bg-primary/90"
        >
          {isSaving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
          <span>Save Knowledge Check</span>
        </Button>
      </div>
    </form>
  );
}

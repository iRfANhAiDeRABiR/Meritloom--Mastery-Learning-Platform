"use client";

import * as React from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Eye,
  FileQuestion,
  Info,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { saveLessonQuizAction } from "@/lib/actions/admin";
import type { AdminQuizDetail } from "@/lib/types";

interface QuestionOptionDraft {
  id?: string;
  text: string;
  isCorrect: boolean;
}

interface QuestionDraft {
  id?: string;
  questionType: "single_choice" | "multiple_choice" | "true_false";
  questionText: string;
  topic: string;
  codeContent: string;
  explanation: string;
  options: QuestionOptionDraft[];
}

interface QuizEditorProps {
  lessonId: string;
  courseId: string;
  initialQuiz?: AdminQuizDetail | null;
  onUpdated: () => void;
}

export function QuizEditor({ lessonId, courseId, initialQuiz, onUpdated }: QuizEditorProps) {
  const [title, setTitle] = React.useState(initialQuiz?.title || "Knowledge Check");
  const [description, setDescription] = React.useState(initialQuiz?.description || "");
  const [estimatedMinutes, setEstimatedMinutes] = React.useState(initialQuiz?.estimatedMinutes || 5);
  const [questions, setQuestions] = React.useState<QuestionDraft[]>(
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
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewIdx, setPreviewIdx] = React.useState(0);
  const [previewSelected, setPreviewSelected] = React.useState<Record<number, number[]>>({});
  const [previewSubmitted, setPreviewSubmitted] = React.useState<Record<number, boolean>>({});

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

  const handleDuplicateQuestion = (idx: number) => {
    const target = questions[idx];
    const duplicated: QuestionDraft = {
      ...target,
      id: undefined,
      questionText: `${target.questionText} (Copy)`,
      options: target.options.map((o) => ({ ...o, id: undefined })),
    };
    const next = [...questions];
    next.splice(idx + 1, 0, duplicated);
    setQuestions(next);
  };

  const handleMoveQuestion = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    const next = [...questions];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setQuestions(next);
  };

  const validateQuestions = (): string | null => {
    if (questions.length === 0) {
      return "Please add at least 1 question before saving.";
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const qNum = i + 1;

      if (!q.questionText.trim()) {
        return `Question ${qNum}: Question prompt cannot be empty.`;
      }

      if (q.options.length < 2) {
        return `Question ${qNum}: Must have at least 2 answer options.`;
      }

      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].text.trim()) {
          return `Question ${qNum}: Option ${j + 1} text cannot be empty.`;
        }
      }

      const correctCount = q.options.filter((o) => o.isCorrect).length;

      if (q.questionType === "single_choice" && correctCount !== 1) {
        return `Question ${qNum}: Single Choice questions must have exactly 1 correct option (found ${correctCount}).`;
      }

      if (q.questionType === "true_false" && correctCount !== 1) {
        return `Question ${qNum}: True/False questions must have exactly 1 correct option (found ${correctCount}).`;
      }

      if (q.questionType === "multiple_choice" && correctCount < 1) {
        return `Question ${qNum}: Multiple Choice questions must have at least 1 correct option marked.`;
      }
    }

    return null;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const validationErr = validateQuestions();
    if (validationErr) {
      setMsg({ type: "error", text: validationErr });
      return;
    }

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

  const startPreview = () => {
    setPreviewIdx(0);
    setPreviewSelected({});
    setPreviewSubmitted({});
    setPreviewOpen(true);
  };

  const currentPreviewQ = questions[previewIdx];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface-elevated/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <FileQuestion className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold text-ink">Knowledge Check Editor</h2>
            <p className="text-[11px] text-ink-muted">
              Manage checkpoint questions, answer keys, explanations, and preview the learner experience.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-2.5 py-1 border-line font-mono font-medium">
            {questions.length} Question{questions.length === 1 ? "" : "s"}
          </Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startPreview}
            disabled={questions.length === 0}
            className="rounded-xl border-line text-xs font-semibold hover:border-primary/40"
          >
            <Eye className="mr-1.5 h-3.5 w-3.5 text-primary" />
            <span>Preview as Learner</span>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {msg && (
          <div
            className={`rounded-xl p-3 text-xs font-semibold flex items-center gap-2 ${
              msg.type === "success"
                ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            {msg.type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Quiz Title *
            </label>
            <input
              type="text"
              required
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

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Quiz Description (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Review and verify key concepts from this module."
            className="mt-1.5 h-10 w-full rounded-xl border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
          />
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
            <div className="rounded-2xl border border-dashed border-line p-8 text-center text-xs text-ink-muted">
              No questions in this quiz yet. Click &quot;Add Question&quot; to create practice questions.
            </div>
          ) : (
            questions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="rounded-2xl border border-line bg-surface-elevated/30 p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">Question {qIdx + 1}</span>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono px-1.5 py-0 border-line">
                      {q.questionType.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={qIdx === 0}
                      onClick={() => handleMoveQuestion(qIdx, "up")}
                      className="p-1 text-ink-muted hover:text-ink disabled:opacity-20"
                      title="Move Question Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={qIdx === questions.length - 1}
                      onClick={() => handleMoveQuestion(qIdx, "down")}
                      className="p-1 text-ink-muted hover:text-ink disabled:opacity-20"
                      title="Move Question Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateQuestion(qIdx)}
                      className="p-1 text-ink-muted hover:text-primary rounded"
                      title="Duplicate Question"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>

                    <select
                      value={q.questionType}
                      onChange={(e) => {
                        const next = [...questions];
                        const newType = e.target.value as QuestionDraft["questionType"];
                        next[qIdx].questionType = newType;
                        if (newType === "true_false") {
                          next[qIdx].options = [
                            { text: "True", isCorrect: true },
                            { text: "False", isCorrect: false },
                          ];
                        }
                        setQuestions(next);
                      }}
                      className="h-7 rounded-lg border border-line bg-surface px-2 text-[11px] text-ink focus:border-primary focus:outline-none"
                    >
                      <option value="single_choice">Single Choice</option>
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="true_false">True / False</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))}
                      className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                      title="Delete Question"
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
                    placeholder="e.g. What is the purpose of the <body> tag in HTML?"
                    className="mt-1 w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-ink focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted">
                      Topic / Concept Tag (Optional)
                    </label>
                    <input
                      type="text"
                      value={q.topic}
                      onChange={(e) => {
                        const next = [...questions];
                        next[qIdx].topic = e.target.value;
                        setQuestions(next);
                      }}
                      placeholder="e.g. HTML Elements, Box Model"
                      className="mt-1 h-8 w-full rounded-lg border border-line bg-surface px-2.5 text-xs text-ink focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted">
                      Code Snippet (Optional)
                    </label>
                    <textarea
                      rows={1}
                      value={q.codeContent}
                      onChange={(e) => {
                        const next = [...questions];
                        next[qIdx].codeContent = e.target.value;
                        setQuestions(next);
                      }}
                      placeholder="e.g. <h1 class='title'>Hello</h1>"
                      className="mt-1 w-full rounded-lg border border-line bg-surface p-1.5 font-mono text-xs text-ink focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                      Answer Options (Click checkmark to set correct answer)
                    </label>
                    {q.questionType !== "true_false" && q.options.length < 6 && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...questions];
                          next[qIdx].options.push({ text: "", isCorrect: false });
                          setQuestions(next);
                        }}
                        className="text-[11px] font-semibold text-primary hover:underline"
                      >
                        + Add Option
                      </button>
                    )}
                  </div>

                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...questions];
                          if (q.questionType === "single_choice" || q.questionType === "true_false") {
                            // Uncheck all other options
                            next[qIdx].options.forEach((o) => (o.isCorrect = false));
                            next[qIdx].options[oIdx].isCorrect = true;
                          } else {
                            // Toggle for multiple choice
                            next[qIdx].options[oIdx].isCorrect = !next[qIdx].options[oIdx].isCorrect;
                          }
                          setQuestions(next);
                        }}
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition ${
                          opt.isCorrect
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-line bg-surface text-ink-muted hover:border-emerald-500"
                        }`}
                        title={opt.isCorrect ? "Marked as correct" : "Click to mark as correct"}
                      >
                        <Check className="h-4 w-4" />
                      </button>

                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => {
                          const next = [...questions];
                          next[qIdx].options[oIdx].text = e.target.value;
                          setQuestions(next);
                        }}
                        placeholder={`Option ${oIdx + 1}`}
                        className="h-8 flex-1 rounded-lg border border-line bg-surface px-2.5 text-xs text-ink focus:border-primary focus:outline-none"
                      />

                      {q.questionType !== "true_false" && q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...questions];
                            next[qIdx].options = next[qIdx].options.filter((_, i) => i !== oIdx);
                            setQuestions(next);
                          }}
                          className="p-1 text-ink-muted hover:text-rose-500"
                          title="Remove Option"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted">
                    Educational Explanation (Shown to learner after answering)
                  </label>
                  <input
                    type="text"
                    value={q.explanation}
                    onChange={(e) => {
                      const next = [...questions];
                      next[qIdx].explanation = e.target.value;
                      setQuestions(next);
                    }}
                    placeholder="e.g. <h1> is the highest level heading used for main titles."
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

      {/* Preview as Learner Modal */}
      {previewOpen && currentPreviewQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs">
                  Learner Preview
                </Badge>
                <span className="text-xs font-bold text-ink">
                  Question {previewIdx + 1} of {questions.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg p-1 text-ink-muted hover:bg-surface-elevated hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Question display */}
            <div className="space-y-4">
              <h3 className="font-display text-sm font-bold text-ink">
                {currentPreviewQ.questionText || "Question prompt goes here..."}
              </h3>

              {currentPreviewQ.codeContent && (
                <pre className="rounded-xl bg-surface-elevated p-3 font-mono text-xs text-ink border border-line overflow-x-auto">
                  <code>{currentPreviewQ.codeContent}</code>
                </pre>
              )}

              {/* Interactive choices */}
              <div className="space-y-2">
                {currentPreviewQ.options.map((opt, oIdx) => {
                  const isSelected = (previewSelected[previewIdx] || []).includes(oIdx);
                  const isSubmitted = Boolean(previewSubmitted[previewIdx]);

                  let btnStyle = "border-line bg-surface hover:border-primary/40 text-ink";
                  if (isSubmitted) {
                    if (opt.isCorrect) {
                      btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold";
                    } else if (isSelected && !opt.isCorrect) {
                      btnStyle = "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400";
                    }
                  } else if (isSelected) {
                    btnStyle = "border-primary bg-primary/10 text-primary font-semibold";
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => {
                        if (currentPreviewQ.questionType === "multiple_choice") {
                          const current = previewSelected[previewIdx] || [];
                          const updated = current.includes(oIdx)
                            ? current.filter((i) => i !== oIdx)
                            : [...current, oIdx];
                          setPreviewSelected({ ...previewSelected, [previewIdx]: updated });
                        } else {
                          setPreviewSelected({ ...previewSelected, [previewIdx]: [oIdx] });
                        }
                      }}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs transition ${btnStyle}`}
                    >
                      <span>{opt.text || `Option ${oIdx + 1}`}</span>
                      {isSubmitted && opt.isCorrect && (
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback explanation */}
              {previewSubmitted[previewIdx] && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-primary">
                    <Info className="h-4 w-4 shrink-0" />
                    <span>Explanation</span>
                  </div>
                  <p className="text-ink-muted">
                    {currentPreviewQ.explanation || "No explanation provided for this question."}
                  </p>
                </div>
              )}
            </div>

            {/* Preview Navigation */}
            <div className="flex items-center justify-between border-t border-line pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={previewIdx === 0}
                onClick={() => setPreviewIdx(previewIdx - 1)}
                className="rounded-xl text-xs"
              >
                Previous
              </Button>

              {!previewSubmitted[previewIdx] ? (
                <Button
                  type="button"
                  size="sm"
                  disabled={!(previewSelected[previewIdx]?.length > 0)}
                  onClick={() => setPreviewSubmitted({ ...previewSubmitted, [previewIdx]: true })}
                  className="rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90"
                >
                  Check Answer
                </Button>
              ) : previewIdx < questions.length - 1 ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setPreviewIdx(previewIdx + 1)}
                  className="rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90"
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-xl bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Finished Preview
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

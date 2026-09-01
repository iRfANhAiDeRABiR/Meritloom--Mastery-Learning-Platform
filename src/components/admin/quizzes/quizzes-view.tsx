"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  ExternalLink,
  Eye,
  FileQuestion,
  Filter,
  HelpCircle,
  Layers,
  ListFilter,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Table as TableIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuizEditor } from "@/components/admin/course-editor/content-tab/quiz-editor";
import type { AdminKnowledgeCheckItem, AdminKnowledgeChecksData, AdminQuizDetail } from "@/lib/types";

interface QuizzesViewProps {
  initialData: AdminKnowledgeChecksData;
}

export function QuizzesView({ initialData }: QuizzesViewProps) {
  const router = useRouter();
  const [data, setData] = React.useState<AdminKnowledgeChecksData>(initialData);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCourseSlug, setSelectedCourseSlug] = React.useState<string>("all");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [viewMode, setViewMode] = React.useState<"quizzes" | "questions">("quizzes");
  const [expandedQuizzes, setExpandedQuizzes] = React.useState<Set<string>>(new Set());

  // Edit Quiz Modal state
  const [editingQuiz, setEditingQuiz] = React.useState<AdminKnowledgeCheckItem | null>(null);

  // Learner Preview Modal state
  const [previewQuiz, setPreviewQuiz] = React.useState<AdminKnowledgeCheckItem | null>(null);
  const [previewQIdx, setPreviewQIdx] = React.useState(0);
  const [previewSelected, setPreviewSelected] = React.useState<Record<number, number[]>>({});
  const [previewSubmitted, setPreviewSubmitted] = React.useState<Record<number, boolean>>({});

  // Filter items
  const filteredQuizzes = React.useMemo(() => {
    return data.items.filter((quiz) => {
      // Course filter
      if (selectedCourseSlug !== "all" && quiz.courseSlug !== selectedCourseSlug) {
        return false;
      }

      // Question type filter
      if (selectedType !== "all") {
        const hasType = quiz.questions.some((q) => q.questionType === selectedType);
        if (!hasType) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle =
          quiz.quizTitle.toLowerCase().includes(query) ||
          quiz.lessonTitle.toLowerCase().includes(query) ||
          quiz.moduleTitle.toLowerCase().includes(query) ||
          quiz.courseTitle.toLowerCase().includes(query);

        const matchesQuestion = quiz.questions.some(
          (q) =>
            q.questionText.toLowerCase().includes(query) ||
            (q.topic && q.topic.toLowerCase().includes(query)) ||
            (q.explanation && q.explanation.toLowerCase().includes(query)) ||
            q.options.some((o) => o.text.toLowerCase().includes(query)),
        );

        if (!matchesTitle && !matchesQuestion) return false;
      }

      return true;
    });
  }, [data.items, selectedCourseSlug, selectedType, searchQuery]);

  // Flattened questions for Table View
  const allFilteredQuestions = React.useMemo(() => {
    const list: {
      quiz: AdminKnowledgeCheckItem;
      question: AdminKnowledgeCheckItem["questions"][0];
      indexInQuiz: number;
    }[] = [];

    filteredQuizzes.forEach((quiz) => {
      quiz.questions.forEach((q, idx) => {
        if (selectedType !== "all" && q.questionType !== selectedType) {
          return;
        }
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matches =
            q.questionText.toLowerCase().includes(query) ||
            (q.topic && q.topic.toLowerCase().includes(query)) ||
            (q.explanation && q.explanation.toLowerCase().includes(query)) ||
            q.options.some((o) => o.text.toLowerCase().includes(query)) ||
            quiz.courseTitle.toLowerCase().includes(query) ||
            quiz.moduleTitle.toLowerCase().includes(query);
          if (!matches) return;
        }
        list.push({ quiz, question: q, indexInQuiz: idx });
      });
    });

    return list;
  }, [filteredQuizzes, selectedType, searchQuery]);

  const toggleExpand = (quizId: string) => {
    const next = new Set(expandedQuizzes);
    if (next.has(quizId)) next.delete(quizId);
    else next.add(quizId);
    setExpandedQuizzes(next);
  };

  const openPreview = (quiz: AdminKnowledgeCheckItem, startIdx = 0) => {
    setPreviewQuiz(quiz);
    setPreviewQIdx(startIdx);
    setPreviewSelected({});
    setPreviewSubmitted({});
  };

  const handleEditorUpdated = () => {
    setEditingQuiz(null);
    router.refresh();
  };

  const currentPreviewQ = previewQuiz?.questions[previewQIdx];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Knowledge Checks & Questions
            </h1>
            <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-xs font-semibold">
              {data.totalQuizzes} Quizzes • {data.totalQuestions} Questions
            </Badge>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Global question bank control center: manage checkpoint quizzes, review questions, topics, answer keys, and test learner experiences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.refresh()}
            className="rounded-xl border-line text-xs font-semibold hover:border-primary/40"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            <span>Refresh Bank</span>
          </Button>
          <Link href="/admin/courses">
            <Button
              type="button"
              size="sm"
              className="rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90"
            >
              <BookOpen className="mr-1.5 h-3.5 w-3.5" />
              <span>Go to Course Studio</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-2xl border border-line bg-surface-elevated/40 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <FileQuestion className="h-4 w-4 text-purple-500" />
            <span>Knowledge Checks</span>
          </div>
          <p className="font-display text-2xl font-bold text-ink">{data.totalQuizzes}</p>
          <p className="text-[11px] text-ink-muted">Across 3 core courses</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface-elevated/40 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Layers className="h-4 w-4 text-primary" />
            <span>Total Questions</span>
          </div>
          <p className="font-display text-2xl font-bold text-ink">{data.totalQuestions}</p>
          <p className="text-[11px] text-ink-muted">5 questions per check</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface-elevated/40 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Single Choice</span>
          </div>
          <p className="font-display text-2xl font-bold text-ink">{data.singleChoiceCount}</p>
          <p className="text-[11px] text-ink-muted">Standard 1-correct</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface-elevated/40 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Check className="h-4 w-4 text-blue-500" />
            <span>Multiple Choice</span>
          </div>
          <p className="font-display text-2xl font-bold text-ink">{data.multipleChoiceCount}</p>
          <p className="text-[11px] text-ink-muted">Multi-select options</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface-elevated/40 p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <HelpCircle className="h-4 w-4 text-amber-500" />
            <span>True / False</span>
          </div>
          <p className="font-display text-2xl font-bold text-ink">{data.trueFalseCount}</p>
          <p className="text-[11px] text-ink-muted">Binary checks</p>
        </div>
      </div>

      {/* Course Breakdown Bar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {data.courseStats.map((c) => (
          <button
            key={c.courseId}
            type="button"
            onClick={() => setSelectedCourseSlug(selectedCourseSlug === c.courseSlug ? "all" : c.courseSlug)}
            className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
              selectedCourseSlug === c.courseSlug
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-line bg-surface hover:border-primary/40"
            }`}
          >
            <div className="space-y-0.5">
              <span className="font-display text-xs font-bold text-ink">{c.courseTitle}</span>
              <p className="text-[11px] text-ink-muted">{c.quizCount} Module Checks • {c.questionCount} Questions</p>
            </div>
            <Badge variant="outline" className="border-line font-mono text-xs">
              {c.questionCount} Qs
            </Badge>
          </button>
        ))}
      </div>

      {/* Filter and View Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, topics, prompts, explanations..."
            className="h-10 w-full rounded-xl border border-line bg-surface-elevated pl-9 pr-8 text-xs text-ink focus:border-primary focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-ink-muted hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filters and View Switch */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Question Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-9 rounded-xl border border-line bg-surface-elevated px-3 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
          >
            <option value="all">All Question Types</option>
            <option value="single_choice">Single Choice Only</option>
            <option value="multiple_choice">Multiple Choice Only</option>
            <option value="true_false">True / False Only</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex rounded-xl border border-line bg-surface-elevated p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("quizzes")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === "quizzes"
                  ? "bg-surface text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span>Quizzes View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("questions")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === "questions"
                  ? "bg-surface text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Questions Table ({allFilteredQuestions.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "quizzes" ? (
        /* QUIZZES ACCORDION / CARDS VIEW */
        <div className="space-y-4">
          {filteredQuizzes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line p-12 text-center text-xs text-ink-muted space-y-2">
              <FileQuestion className="mx-auto h-8 w-8 text-ink-muted/50" />
              <p className="font-semibold text-ink">No knowledge checks match your search filter.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCourseSlug("all");
                  setSelectedType("all");
                }}
                className="rounded-xl text-xs"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => {
              const isExpanded = expandedQuizzes.has(quiz.id);

              return (
                <div
                  key={quiz.id}
                  className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition hover:border-line-hover"
                >
                  {/* Quiz Header */}
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between bg-surface-elevated/20">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleExpand(quiz.id)}
                        className="mt-1 p-0.5 text-ink-muted hover:text-ink"
                        title={isExpanded ? "Collapse questions" : "Expand questions"}
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="border-line font-mono text-[10px] uppercase font-bold text-ink-muted">
                            {quiz.courseTitle}
                          </Badge>
                          <span className="text-xs text-ink-muted font-medium">
                            Module {quiz.modulePosition}: {quiz.moduleTitle}
                          </span>
                        </div>
                        <h3 className="font-display text-sm font-bold text-ink">
                          {quiz.quizTitle}
                        </h3>
                        {quiz.quizDescription && (
                          <p className="text-xs text-ink-muted line-clamp-1">{quiz.quizDescription}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Badge variant="outline" className="border-line font-mono text-xs px-2 py-0.5">
                        {quiz.questionCount} Questions
                      </Badge>
                      <Badge variant="outline" className="border-line font-mono text-xs px-2 py-0.5 text-ink-muted">
                        ~{quiz.estimatedMinutes} mins
                      </Badge>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openPreview(quiz)}
                        className="rounded-xl border-line text-xs font-semibold hover:border-primary/40"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        <span>Preview</span>
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setEditingQuiz(quiz)}
                        className="rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90"
                      >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        <span>Edit Questions</span>
                      </Button>

                      <Link href={`/admin/courses/${quiz.courseId}`}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-ink-muted hover:text-ink"
                          title="Open in Course Studio"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Expandable Questions List */}
                  {isExpanded && (
                    <div className="border-t border-line/60 divide-y divide-line/60 bg-surface">
                      {quiz.questions.map((q, qIdx) => (
                        <div key={q.id || qIdx} className="p-4 space-y-3 hover:bg-surface-elevated/30 transition">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-ink">Q{qIdx + 1}.</span>
                                <Badge variant="outline" className="text-[10px] uppercase font-mono px-1.5 py-0 border-line">
                                  {q.questionType.replace("_", " ")}
                                </Badge>
                                {q.topic && (
                                  <Badge variant="outline" className="text-[10px] border-primary/20 bg-primary/5 text-primary px-1.5 py-0">
                                    {q.topic}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs font-medium text-ink">{q.questionText}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => openPreview(quiz, qIdx)}
                              className="text-xs text-primary font-semibold hover:underline shrink-0"
                            >
                              Test Question
                            </button>
                          </div>

                          {q.codeContent && (
                            <pre className="rounded-xl bg-surface-elevated p-2.5 font-mono text-[11px] text-ink border border-line overflow-x-auto max-w-2xl">
                              <code>{q.codeContent}</code>
                            </pre>
                          )}

                          {/* Options grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt, oIdx) => (
                              <div
                                key={opt.id || oIdx}
                                className={`flex items-center gap-2 rounded-xl border p-2 text-xs transition ${
                                  opt.isCorrect
                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                                    : "border-line bg-surface-elevated/30 text-ink-muted"
                                }`}
                              >
                                <div
                                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                                    opt.isCorrect
                                      ? "bg-emerald-500 text-white"
                                      : "border border-line bg-surface text-ink-muted"
                                  }`}
                                >
                                  {opt.isCorrect ? <Check className="h-3 w-3" /> : <span className="text-[10px]">{oIdx + 1}</span>}
                                </div>
                                <span className="truncate">{opt.text}</span>
                              </div>
                            ))}
                          </div>

                          {q.explanation && (
                            <div className="rounded-xl border border-primary/15 bg-primary/5 p-2.5 text-[11px] text-ink-muted">
                              <span className="font-bold text-primary mr-1.5">Explanation:</span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* QUESTIONS EXPLORER TABLE VIEW */
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-surface-elevated/60 text-ink-muted uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 pl-4 pr-2">#</th>
                  <th className="py-3.5 px-3">Question Prompt & Topic</th>
                  <th className="py-3.5 px-3">Course / Module</th>
                  <th className="py-3.5 px-3">Type</th>
                  <th className="py-3.5 px-3">Options & Correct Answer</th>
                  <th className="py-3.5 pr-4 pl-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {allFilteredQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-ink-muted">
                      No questions match your current filters.
                    </td>
                  </tr>
                ) : (
                  allFilteredQuestions.map(({ quiz, question: q, indexInQuiz }, rowIdx) => {
                    const correctOptions = q.options.filter((o) => o.isCorrect);

                    return (
                      <tr key={q.id || rowIdx} className="hover:bg-surface-elevated/30 transition">
                        <td className="py-3 pl-4 pr-2 font-mono text-ink-muted">{rowIdx + 1}</td>
                        <td className="py-3 px-3 max-w-md">
                          <div className="space-y-1">
                            <p className="font-semibold text-ink line-clamp-2">{q.questionText}</p>
                            {q.topic && (
                              <Badge variant="outline" className="text-[10px] border-primary/20 bg-primary/5 text-primary px-1.5 py-0">
                                {q.topic}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-ink block">{quiz.courseTitle}</span>
                            <span className="text-[11px] text-ink-muted block">M{quiz.modulePosition}: {quiz.moduleTitle}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <Badge variant="outline" className="text-[10px] uppercase font-mono px-1.5 py-0 border-line">
                            {q.questionType.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          <div className="space-y-1">
                            <span className="text-[11px] text-ink-muted block">{q.options.length} options</span>
                            <div className="flex flex-wrap gap-1">
                              {correctOptions.map((co, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
                                >
                                  <Check className="h-2.5 w-2.5" />
                                  <span className="truncate max-w-[140px]">{co.text}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 pl-2 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => openPreview(quiz, indexInQuiz)}
                              className="h-7 rounded-lg px-2 text-[11px] border-line font-semibold"
                            >
                              <Eye className="mr-1 h-3 w-3 text-primary" />
                              <span>Test</span>
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => setEditingQuiz(quiz)}
                              className="h-7 rounded-lg px-2 text-[11px] bg-primary font-semibold text-white hover:bg-primary/90"
                            >
                              <Pencil className="mr-1 h-3 w-3" />
                              <span>Edit</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT QUIZ MODAL */}
      {editingQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-line font-mono text-[10px] uppercase font-bold text-ink-muted">
                    {editingQuiz.courseTitle}
                  </Badge>
                  <span className="text-xs text-ink-muted">
                    Module {editingQuiz.modulePosition}: {editingQuiz.moduleTitle}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-ink">
                  Edit Knowledge Check: {editingQuiz.quizTitle}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setEditingQuiz(null)}
                className="rounded-lg p-1 text-ink-muted hover:bg-surface-elevated hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <QuizEditor
              lessonId={editingQuiz.lessonId}
              courseId={editingQuiz.courseId}
              initialQuiz={{
                id: editingQuiz.id,
                lessonId: editingQuiz.lessonId,
                title: editingQuiz.quizTitle,
                description: editingQuiz.quizDescription,
                estimatedMinutes: editingQuiz.estimatedMinutes,
                isPublished: editingQuiz.isPublished,
                questions: editingQuiz.questions,
              }}
              onUpdated={handleEditorUpdated}
            />
          </div>
        </div>
      )}

      {/* LEARNER PREVIEW MODAL */}
      {previewQuiz && currentPreviewQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs">
                  Learner Preview
                </Badge>
                <span className="text-xs font-bold text-ink">
                  Question {previewQIdx + 1} of {previewQuiz.questions.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewQuiz(null)}
                className="rounded-lg p-1 text-ink-muted hover:bg-surface-elevated hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Question display */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] uppercase font-mono text-ink-muted font-bold">
                  {previewQuiz.courseTitle} • Module {previewQuiz.modulePosition}
                </span>
                <h3 className="font-display text-sm font-bold text-ink">
                  {currentPreviewQ.questionText}
                </h3>
              </div>

              {currentPreviewQ.codeContent && (
                <pre className="rounded-xl bg-surface-elevated p-3 font-mono text-xs text-ink border border-line overflow-x-auto">
                  <code>{currentPreviewQ.codeContent}</code>
                </pre>
              )}

              {/* Interactive choices */}
              <div className="space-y-2">
                {currentPreviewQ.options.map((opt, oIdx) => {
                  const isSelected = (previewSelected[previewQIdx] || []).includes(oIdx);
                  const isSubmitted = Boolean(previewSubmitted[previewQIdx]);

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
                      key={opt.id || oIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => {
                        if (currentPreviewQ.questionType === "multiple_choice") {
                          const current = previewSelected[previewQIdx] || [];
                          const updated = current.includes(oIdx)
                            ? current.filter((i) => i !== oIdx)
                            : [...current, oIdx];
                          setPreviewSelected({ ...previewSelected, [previewQIdx]: updated });
                        } else {
                          setPreviewSelected({ ...previewSelected, [previewQIdx]: [oIdx] });
                        }
                      }}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs transition ${btnStyle}`}
                    >
                      <span>{opt.text}</span>
                      {isSubmitted && opt.isCorrect && (
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback explanation */}
              {previewSubmitted[previewQIdx] && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-primary">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Educational Explanation</span>
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
                disabled={previewQIdx === 0}
                onClick={() => setPreviewQIdx(previewQIdx - 1)}
                className="rounded-xl text-xs"
              >
                Previous
              </Button>

              {!previewSubmitted[previewQIdx] ? (
                <Button
                  type="button"
                  size="sm"
                  disabled={!(previewSelected[previewQIdx]?.length > 0)}
                  onClick={() => setPreviewSubmitted({ ...previewSubmitted, [previewQIdx]: true })}
                  className="rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90"
                >
                  Check Answer
                </Button>
              ) : previewQIdx < previewQuiz.questions.length - 1 ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setPreviewQIdx(previewQIdx + 1)}
                  className="rounded-xl bg-primary text-xs font-semibold text-white hover:bg-primary/90"
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setPreviewQuiz(null)}
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

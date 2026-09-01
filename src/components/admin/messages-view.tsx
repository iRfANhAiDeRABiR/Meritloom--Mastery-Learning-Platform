"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Inbox,
  Mail,
  MessageSquare,
  Search,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  deleteSupportMessageAction,
  updateSupportMessageStatusAction,
} from "@/lib/actions/admin";
import { notify } from "@/lib/notifications/toast";
import type { AdminSupportMessage, SupportMessageStatus, SupportMessageTopic } from "@/lib/types";

interface MessagesViewProps {
  initialMessages: AdminSupportMessage[];
  searchQuery: string;
  selectedStatus: string;
  selectedTopic: string;
}

const TOPICS: { value: string; label: string }[] = [
  { value: "all", label: "All Topics" },
  { value: "course", label: "Course Content" },
  { value: "video", label: "Video Issues" },
  { value: "account", label: "Account & Profile" },
  { value: "progress", label: "Learning Progress" },
  { value: "learning_path", label: "Learning Paths" },
  { value: "bug", label: "Bug Report" },
  { value: "content_feedback", label: "Feedback & Suggestions" },
  { value: "general", label: "General Inquiries" },
];

const STATUSES: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New / Unread" },
  { value: "reviewing", label: "In Review" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export function MessagesView({
  initialMessages,
  searchQuery,
  selectedStatus,
  selectedTopic,
}: MessagesViewProps) {
  const router = useRouter();
  const [messages, setMessages] = React.useState<AdminSupportMessage[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = React.useState<AdminSupportMessage | null>(null);
  const [q, setQ] = React.useState(searchQuery);
  const [statusFilter, setStatusFilter] = React.useState(selectedStatus);
  const [topicFilter, setTopicFilter] = React.useState(selectedTopic);
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const applyFilters = (newQ = q, newStatus = statusFilter, newTopic = topicFilter) => {
    const params = new URLSearchParams();
    if (newQ.trim()) params.set("q", newQ.trim());
    if (newStatus !== "all") params.set("status", newStatus);
    if (newTopic !== "all") params.set("topic", newTopic);
    router.push(`/admin/messages?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(q, statusFilter, topicFilter);
  };

  const handleStatusChange = async (messageId: string, newStatus: SupportMessageStatus) => {
    setIsUpdating(true);
    try {
      const res = await updateSupportMessageStatusAction(messageId, newStatus);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, status: newStatus } : m)),
        );
        if (selectedMessage?.id === messageId) {
          setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        notify.success({ title: `Status updated to ${newStatus}` });
      } else {
        notify.error({ title: res.error || "Failed to update status" });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await deleteSupportMessageAction(messageId);
      if (res.success) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
        notify.success({ title: "Message deleted" });
      } else {
        notify.error({ title: res.error || "Failed to delete message" });
      }
    } catch {
      notify.error({ title: "Failed to delete message" });
    }
  };

  const getStatusBadge = (status: SupportMessageStatus) => {
    switch (status) {
      case "new":
        return (
          <Badge className="border-rose-500/20 bg-rose-500/10 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            New
          </Badge>
        );
      case "reviewing":
        return (
          <Badge className="border-amber-500/20 bg-amber-500/10 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            Reviewing
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="border-emerald-500/20 bg-emerald-500/10 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Resolved
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="border-line text-[11px] text-ink-muted">
            Closed
          </Badge>
        );
    }
  };

  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Support & Contact Inquiries
            </h1>
            {newCount > 0 && (
              <Badge className="border-rose-500/30 bg-rose-500 text-xs font-bold text-white shadow-sm">
                {newCount} New
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Review feedback, support questions, and bug reports submitted by learners and visitors.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by sender name, email, or message keyword..."
            className="h-10 w-full rounded-xl border border-line bg-surface-elevated pl-10 pr-4 text-xs text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={topicFilter}
            onChange={(e) => {
              setTopicFilter(e.target.value);
              applyFilters(q, statusFilter, e.target.value);
            }}
            className="h-10 rounded-xl border border-line bg-surface-elevated px-3 text-xs font-medium text-ink focus:border-primary focus:outline-none"
          >
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              applyFilters(q, e.target.value, topicFilter);
            }}
            className="h-10 rounded-xl border border-line bg-surface-elevated px-3 text-xs font-medium text-ink focus:border-primary focus:outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Layout: Table & Detail Drawer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Messages List */}
        <div className={selectedMessage ? "lg:col-span-7" : "lg:col-span-12"}>
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Inbox className="h-12 w-12 text-ink-muted opacity-40" />
                <h3 className="mt-3 font-display text-base font-bold text-ink">No Messages Found</h3>
                <p className="mt-1 text-xs text-ink-muted">
                  No support messages matched your search query or filters.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-line">
                {messages.map((msg) => {
                  const isSelected = selectedMessage?.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`group flex cursor-pointer flex-col gap-2.5 p-4 transition hover:bg-surface-elevated/60 ${
                        isSelected ? "bg-primary/5 border-l-4 border-l-primary" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-ink">{msg.name}</span>
                          <span className="text-xs text-ink-muted">({msg.email})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(msg.status)}
                          <span className="text-[11px] text-ink-muted">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-line bg-surface-elevated text-[10px] uppercase font-bold text-ink-muted">
                          {msg.topic.replace("_", " ")}
                        </Badge>
                        <p className="line-clamp-1 text-xs text-ink-muted">{msg.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected Message Detail Drawer */}
        {selectedMessage && (
          <div className="lg:col-span-5">
            <div className="sticky top-6 rounded-2xl border border-line bg-surface p-6 shadow-sm">
              <div className="flex items-start justify-between border-b border-line pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Message Details
                  </span>
                  <h2 className="mt-1 font-display text-lg font-bold text-ink">
                    {selectedMessage.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-lg p-1 text-ink-muted hover:bg-surface-elevated hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <span className="font-bold text-ink-muted uppercase tracking-wider text-[10px]">
                    Sender Email
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="font-semibold text-ink hover:text-primary hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="font-bold text-ink-muted uppercase tracking-wider text-[10px]">
                      Topic
                    </span>
                    <p className="mt-1 font-medium text-ink capitalize">
                      {selectedMessage.topic.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-ink-muted uppercase tracking-wider text-[10px]">
                      Received
                    </span>
                    <p className="mt-1 text-ink-muted">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedMessage.pageUrl && (
                  <div>
                    <span className="font-bold text-ink-muted uppercase tracking-wider text-[10px]">
                      Submitted From Page
                    </span>
                    <a
                      href={selectedMessage.pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>{selectedMessage.pageUrl}</span>
                    </a>
                  </div>
                )}

                <div>
                  <span className="font-bold text-ink-muted uppercase tracking-wider text-[10px]">
                    Message
                  </span>
                  <div className="mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-line bg-surface-elevated p-3.5 leading-relaxed text-ink whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Status Updater */}
                <div className="border-t border-line pt-4">
                  <span className="block font-bold text-ink-muted uppercase tracking-wider text-[10px] mb-2">
                    Update Message Status
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(["new", "reviewing", "resolved", "closed"] as SupportMessageStatus[]).map(
                      (st) => (
                        <Button
                          key={st}
                          type="button"
                          variant={selectedMessage.status === st ? "default" : "outline"}
                          size="sm"
                          disabled={isUpdating || selectedMessage.status === st}
                          onClick={() => handleStatusChange(selectedMessage.id, st)}
                          className={`rounded-xl text-xs font-semibold capitalize ${
                            selectedMessage.status === st ? "bg-primary text-white" : "border-line text-ink-muted hover:text-ink"
                          }`}
                        >
                          {st}
                        </Button>
                      ),
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-line pt-4">
                  <Button asChild size="sm" className="rounded-xl bg-primary text-xs font-semibold text-white">
                    <a href={`mailto:${selectedMessage.email}?subject=Re: Meritloom Support - ${selectedMessage.topic}`}>
                      <Mail className="mr-1.5 h-3.5 w-3.5" />
                      <span>Reply via Email</span>
                    </a>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="rounded-xl text-xs text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


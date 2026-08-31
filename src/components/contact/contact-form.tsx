"use client";

import * as React from "react";
import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitSupportMessage, type SupportActionState } from "@/lib/actions/support";
import type { LearnerProfile } from "@/lib/types";

const TOPIC_OPTIONS = [
  { value: "course", label: "Course issue" },
  { value: "video", label: "Video playback issue" },
  { value: "account", label: "Account or profile issue" },
  { value: "progress", label: "Progress tracking issue" },
  { value: "learning_path", label: "Learning Path issue" },
  { value: "bug", label: "Bug report" },
  { value: "content_feedback", label: "Content feedback" },
  { value: "general", label: "General question" },
];

export function ContactForm({ user }: { user: LearnerProfile | null }) {
  const [state, formAction, isPending] = useActionState<SupportActionState, FormData>(
    submitSupportMessage,
    {},
  );

  const [message, setMessage] = React.useState("");

  if (state.success) {
    return (
      <div className="flex flex-col items-center justify-center text-center rounded-[24px] border border-mint-ink/30 bg-card p-8 sm:p-12 shadow-soft animate-fade-in">
        <span className="grid size-16 place-items-center rounded-2xl bg-mint/40 text-mint-ink shadow-xs">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <h3 className="heading-3 mt-4 text-ink">Message sent</h3>
        <p className="mt-2 text-sm text-muted max-w-md leading-relaxed">
          Thanks for contacting Meritloom. Your message has been received and will be reviewed.
        </p>
        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.location.reload()}
            className="font-bold"
          >
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-[24px] border border-line bg-card p-6 sm:p-8 shadow-soft"
    >
      {/* Honeypot Spam Field (Hidden) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_hp">Leave this empty</label>
        <input type="text" id="website_hp" name="website_hp" tabIndex={-1} autoComplete="off" />
      </div>

      {state.error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-bold text-rose-500">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
          Your Name <span className="text-primary">*</span>
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={user?.name || ""}
          required
          placeholder="e.g. Alex Morgan"
          className="h-12 rounded-xl bg-surface border-line"
        />
        {state.fieldErrors?.name && (
          <p className="mt-1 text-xs text-rose-500">{state.fieldErrors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
          Email Address <span className="text-primary">*</span>
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={user?.email || ""}
          required
          placeholder="alex@example.com"
          className="h-12 rounded-xl bg-surface border-line"
        />
        {state.fieldErrors?.email && (
          <p className="mt-1 text-xs text-rose-500">{state.fieldErrors.email}</p>
        )}
      </div>

      {/* Topic Field */}
      <div>
        <label htmlFor="topic" className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
          Topic <span className="text-primary">*</span>
        </label>
        <select
          id="topic"
          name="topic"
          required
          defaultValue="general"
          className="h-12 w-full rounded-xl border border-line bg-surface px-3.5 text-sm font-medium text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {TOPIC_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {state.fieldErrors?.topic && (
          <p className="mt-1 text-xs text-rose-500">{state.fieldErrors.topic}</p>
        )}
      </div>

      {/* Optional Page/Course URL */}
      <div>
        <label htmlFor="pageUrl" className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
          Page or Course URL <span className="text-muted font-normal lowercase">(optional)</span>
        </label>
        <Input
          id="pageUrl"
          name="pageUrl"
          type="url"
          placeholder="https://.../courses/javascript-fundamentals"
          className="h-12 rounded-xl bg-surface border-line"
        />
        {state.fieldErrors?.pageUrl && (
          <p className="mt-1 text-xs text-rose-500">{state.fieldErrors.pageUrl}</p>
        )}
      </div>

      {/* Message Textarea */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label htmlFor="message" className="block text-xs font-bold text-ink uppercase tracking-wider">
            How can we help? <span className="text-primary">*</span>
          </label>
          <span className="text-[11px] text-muted">{message.length}/5000</span>
        </div>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe what happened, where you saw the problem, and any error message that appeared..."
          className="w-full rounded-xl border border-line bg-surface p-3.5 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y min-h-[140px]"
        />
        {state.fieldErrors?.message && (
          <p className="mt-1 text-xs text-rose-500">{state.fieldErrors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 gap-2 font-bold shadow-soft hover:-translate-y-0.5 transition-transform"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="size-4" />
              <span>Send message</span>
            </>
          )}
        </Button>
      </div>

      <p className="text-[11px] text-muted text-center leading-relaxed">
        Information submitted through this form is handled according to our{" "}
        <a href="/privacy" className="text-primary font-semibold hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}

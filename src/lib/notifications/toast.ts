"use client";

import { toast as sonner } from "sonner";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type NotifyOptions = {
  id?: string;
  title: string;
  description?: string;
  duration?: number;
  action?: ToastAction;
  icon?: React.ReactNode;
};

// Durations per spec: ms
const DURATIONS = {
  success: 4000,
  info: 4500,
  warning: 5500,
  error: 7000,
  copied: 2000,
} as const;

/**
 * Single global toast API for the entire Meritloom application.
 *
 * Prefer calling notify.* over direct sonner usage so the implementation
 * can change without touching feature code.
 *
 * Example:
 *   notify.success({ title: "Course saved", description: "Your changes have been updated." })
 *   notify.loading({ id: "course-save:abc", title: "Saving course..." })
 *   notify.success({ id: "course-save:abc", title: "Course saved" }) // updates same toast
 */
export const notify = {
  success: (opts: NotifyOptions) => {
    return sonner.success(opts.title, {
      id: opts.id,
      description: opts.description,
      duration: opts.duration ?? DURATIONS.success,
      action: opts.action ? { label: opts.action.label, onClick: opts.action.onClick } : undefined,
      icon: opts.icon as never,
    });
  },

  error: (opts: NotifyOptions) => {
    return sonner.error(opts.title, {
      id: opts.id,
      description: opts.description,
      duration: opts.duration ?? DURATIONS.error,
      action: opts.action ? { label: opts.action.label, onClick: opts.action.onClick } : undefined,
      icon: opts.icon as never,
    });
  },

  warning: (opts: NotifyOptions) => {
    return sonner.warning(opts.title, {
      id: opts.id,
      description: opts.description,
      duration: opts.duration ?? DURATIONS.warning,
      action: opts.action ? { label: opts.action.label, onClick: opts.action.onClick } : undefined,
      icon: opts.icon as never,
    });
  },

  info: (opts: NotifyOptions) => {
    // sonner has no explicit warning type in some versions; fall back to generic toast with info
    return sonner.info(opts.title, {
      id: opts.id,
      description: opts.description,
      duration: opts.duration ?? DURATIONS.info,
      action: opts.action ? { label: opts.action.label, onClick: opts.action.onClick } : undefined,
      icon: opts.icon as never,
    });
  },

  loading: (opts: NotifyOptions) => {
    return sonner.loading(opts.title, {
      id: opts.id,
      description: opts.description,
    });
  },

  /**
   * Update an existing toast in place (same id) or create a new one.
   */
  update: (type: "success" | "error" | "warning" | "info", opts: NotifyOptions) => {
    switch (type) {
      case "success":
        return notify.success(opts);
      case "error":
        return notify.error(opts);
      case "warning":
        return notify.warning(opts);
      case "info":
        return notify.info(opts);
    }
  },

  /**
   * Wraps a promise: shows loading toast and replaces it with success/error.
   * Each state updates the SAME toast id to avoid spam.
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
      id?: string;
      successDescription?: string;
      errorDescription?: string;
    },
  ) => {
    const id = messages.id ?? `promise-${Date.now()}`;
    return sonner.promise(promise, {
      loading: messages.loading,
      success: (data: T) =>
        typeof messages.success === "function" ? messages.success(data) : messages.success,
      error: (err: unknown) =>
        typeof messages.error === "function" ? messages.error(err) : messages.error,
      id,
    });
  },

  /**
   * Show a short "Copied to clipboard" confirmation.
   */
  copied: (title = "Copied to clipboard") => {
    return sonner.success(title, { duration: DURATIONS.copied });
  },

  dismiss: (id?: string | number) => {
    if (id !== undefined) return sonner.dismiss(id);
    return sonner.dismiss();
  },
};

/**
 * Shorthand for server-action result handling.
 * Example: notifyActionResult(res, { successTitle: "Profile updated" })
 */
export function notifyActionResult(
  result: { success: boolean; error?: string },
  messages: { successTitle: string; successDescription?: string; loadingId?: string },
): void {
  if (result.success) {
    notify.success({
      id: messages.loadingId,
      title: messages.successTitle,
      description: messages.successDescription,
    });
  } else {
    const err = result.error || "Please try again.";
    notify.error({
      id: messages.loadingId,
      title: err.length < 80 ? err : "Something went wrong",
      description: err.length >= 80 ? err : messages.successDescription ? undefined : "Please try again.",
    });
  }
}

export const TOAST_DURATIONS = DURATIONS;

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  FileText,
  HelpCircle,
  KeyRound,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  MessageSquare,
  Shield,
  ShieldAlert,
  Trash2,
} from "lucide-react";

import { deleteAccountAction, updatePasswordAction } from "@/lib/actions/profile";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { routes } from "@/lib/routes";
import { toast } from "sonner";
import type { ProfileSettingsData } from "@/lib/types";

interface AccountTabProps {
  profile: ProfileSettingsData["profile"];
  provider: ProfileSettingsData["provider"];
  hasPassword?: boolean;
  hasGoogle?: boolean;
}

interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  autoComplete: string;
  error?: string;
  showHideAriaLabel: { show: string; hide: string };
  disabled?: boolean;
}

function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = "Min. 8 characters",
  autoComplete,
  error,
  showHideAriaLabel,
  disabled,
}: PasswordFieldProps) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-xs font-bold text-ink">
        {label}
      </label>
      <div className="relative flex items-center">
        <span
          className="pointer-events-none absolute left-3.5 flex items-center text-ink-muted"
          aria-hidden="true"
        >
          <LockKeyhole className="size-4" />
        </span>

        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-12 w-full rounded-xl border bg-surface pl-10 pr-11 text-xs sm:text-sm font-semibold text-ink placeholder:text-ink-muted/60 transition-all outline-none focus:ring-2 ${
            error
              ? "border-rose-500 ring-rose-500/20"
              : "border-line focus:border-primary focus:ring-primary/20"
          }`}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? showHideAriaLabel.hide : showHideAriaLabel.show}
          className="absolute right-2 flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        >
          {show ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs font-semibold text-rose-500 mt-0.5 animate-in fade-in-0 duration-150">
          {error}
        </p>
      )}
    </div>
  );
}

export function AccountTab({
  profile,
  hasPassword = true,
  hasGoogle = false,
}: AccountTabProps) {
  const router = useRouter();

  const isGoogleOnly = hasGoogle && !hasPassword;
  const isLinkedBoth = hasGoogle && hasPassword;

  // Password state
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Google-only password creation toggle
  const [isSettingGooglePassword, setIsSettingGooglePassword] = React.useState(false);

  // Sign out state
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  // Delete account modal state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdatingPassword) return;

    // Clear previous errors
    setGeneralError(null);
    const errors: typeof fieldErrors = {};

    if (!isGoogleOnly && (!currentPassword || currentPassword.trim().length === 0)) {
      errors.currentPassword = "Enter your current password.";
    }

    if (!newPassword || newPassword.trim().length === 0) {
      errors.newPassword = "Enter a new password.";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters long.";
    }

    if (!confirmPassword || confirmPassword.trim().length === 0) {
      errors.confirmPassword = "Confirm your new password.";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords don't match.";
    }

    if (!isGoogleOnly && currentPassword && newPassword && currentPassword === newPassword) {
      errors.newPassword = "Choose a password different from your current password.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsUpdatingPassword(true);

    try {
      const result = await updatePasswordAction({
        currentPassword: isGoogleOnly ? undefined : currentPassword,
        newPassword,
        confirmPassword,
      });

      if (result.success) {
        toast.success("Password updated", {
          description: "Your password has been changed successfully.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setFieldErrors({});
        setGeneralError(null);
        if (isGoogleOnly) {
          setIsSettingGooglePassword(false);
          router.refresh();
        }
      } else {
        if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
          setFieldErrors(result.fieldErrors);
        } else {
          const msg = result.error || "We couldn't update your password. Please try again.";
          setGeneralError(msg);
          toast.error("Password couldn't be updated", {
            description: msg,
          });
        }
      }
    } catch {
      setGeneralError("We couldn't update your password. Please try again.");
      toast.error("Password couldn't be updated", {
        description: "Please try again.",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText !== "DELETE" || isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);

    const result = await deleteAccountAction({ confirmationText: deleteConfirmText });

    if (result.success) {
      toast.success("Account deleted", {
        description: "Your account and all associated learning data have been permanently removed.",
      });

      const supabase = createSupabaseBrowserClient();
      if (supabase) {
        await supabase.auth.signOut();
      }

      router.push("/");
      router.refresh();
    } else {
      const msg = result.error || "Failed to delete account.";
      setDeleteError(msg);
      toast.error(msg);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-line pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-ink">
          Account
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted">
          Manage your sign-in credentials and account security.
        </p>
      </div>

      {/* 1. Sign-in Method & Email */}
      <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-xs flex flex-col gap-4">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-muted">
          Sign-in Details
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-surface border border-line">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-card text-ink-muted shadow-2xs">
              <Mail className="size-4 text-primary" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-ink">{profile.email}</span>
              <span className="text-[11px] text-ink-muted">Primary account email</span>
            </div>
          </div>

          <span className="rounded-md bg-card px-2.5 py-1 text-[11px] font-bold text-ink-muted border border-line self-start sm:self-auto shadow-2xs">
            {isLinkedBoth
              ? "Email & Google Linked"
              : isGoogleOnly
              ? "Google Authentication"
              : "Email & Password"}
          </span>
        </div>
      </div>

      {/* 2. Password Management Section */}
      {isGoogleOnly && !isSettingGooglePassword ? (
        /* Google-Only Account View */
        <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
              <KeyRound className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-ink">You currently sign in with Google</span>
              </div>
              <p className="mt-1 text-xs text-ink-muted leading-relaxed max-w-md">
                Add a password if you would also like to sign in with your Meritloom email and password.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSettingGooglePassword(true)}
            className="inline-flex h-11 min-h-[44px] items-center justify-center rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-xs transition hover:bg-primary/90 cursor-pointer shrink-0"
          >
            <span>Set a password</span>
          </button>
        </div>
      ) : (
        /* Password Form (Standard Change or Google Setup) */
        <form
          onSubmit={handlePasswordSubmit}
          className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-xs flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-muted">
              {isGoogleOnly ? "Set Password" : "Change Password"}
            </span>
            <p className="text-xs text-ink-muted">
              Choose a strong password with at least 8 characters.
            </p>
          </div>

          {/* Operation Error Banner (Only for general failures) */}
          {generalError && (
            <div
              role="alert"
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 animate-in fade-in-0 duration-150"
            >
              {generalError}
            </div>
          )}

          {/* Field 1: Current Password (Full Width) */}
          {!isGoogleOnly && (
            <div className="w-full">
              <PasswordField
                id="account-current-password"
                name="currentPassword"
                label="Current password"
                value={currentPassword}
                onChange={(val) => {
                  setCurrentPassword(val);
                  if (fieldErrors.currentPassword) {
                    setFieldErrors((prev) => ({ ...prev, currentPassword: undefined }));
                  }
                }}
                autoComplete="current-password"
                placeholder="Enter current password"
                error={fieldErrors.currentPassword}
                showHideAriaLabel={{
                  show: "Show current password",
                  hide: "Hide current password",
                }}
                disabled={isUpdatingPassword}
              />
            </div>
          )}

          {/* Fields 2 & 3: New Password & Confirm Password (2 Columns on Desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordField
              id="account-new-password"
              name="newPassword"
              label={isGoogleOnly ? "Create password" : "New password"}
              value={newPassword}
              onChange={(val) => {
                setNewPassword(val);
                if (fieldErrors.newPassword) {
                  setFieldErrors((prev) => ({ ...prev, newPassword: undefined }));
                }
              }}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              error={fieldErrors.newPassword}
              showHideAriaLabel={{
                show: "Show new password",
                hide: "Hide new password",
              }}
              disabled={isUpdatingPassword}
            />

            <PasswordField
              id="account-confirm-password"
              name="confirmPassword"
              label={isGoogleOnly ? "Confirm password" : "Confirm new password"}
              value={confirmPassword}
              onChange={(val) => {
                setConfirmPassword(val);
                if (fieldErrors.confirmPassword) {
                  setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }
              }}
              autoComplete="new-password"
              placeholder="Re-enter password"
              error={fieldErrors.confirmPassword}
              showHideAriaLabel={{
                show: "Show confirmation password",
                hide: "Hide confirmation password",
              }}
              disabled={isUpdatingPassword}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-2">
            {!isGoogleOnly ? (
              <Link
                href={routes.auth.forgotPassword}
                className="text-xs font-semibold text-primary hover:underline self-start"
              >
                Forgot your password?
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsSettingGooglePassword(false);
                  setFieldErrors({});
                  setGeneralError(null);
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="text-xs font-semibold text-ink-muted hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={
                isUpdatingPassword ||
                (!isGoogleOnly && !currentPassword) ||
                !newPassword ||
                !confirmPassword
              }
              className="inline-flex h-11 min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold text-white shadow-xs transition hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  <span>Updating…</span>
                </>
              ) : (
                <span>{isGoogleOnly ? "Set password" : "Update password"}</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 3. Session & Sign Out */}
      <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-xs flex flex-col gap-4">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-muted">
          Session
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-line">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-card text-ink-muted shadow-2xs">
              <Shield className="size-4 text-emerald-500" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-ink">Active session</span>
              <span className="text-[11px] text-ink-muted">Secure authenticated browsing session</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-card px-4 text-xs font-bold text-ink shadow-2xs hover:bg-surface transition-all cursor-pointer"
          >
            {isSigningOut ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <LogOut className="size-3.5 text-ink-muted" />
            )}
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* 4. Support & Legal Links */}
      <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-xs flex flex-col gap-4">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-muted">
          Support & Legal
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/help"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-line bg-surface hover:bg-card transition-colors"
          >
            <HelpCircle className="size-4 text-primary shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-ink">Help Center</span>
              <span className="text-[10px] text-ink-muted">FAQs and guides</span>
            </div>
          </Link>

          <Link
            href="/contact"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-line bg-surface hover:bg-card transition-colors"
          >
            <MessageSquare className="size-4 text-primary shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-ink">Contact Support</span>
              <span className="text-[10px] text-ink-muted">Get assistance</span>
            </div>
          </Link>

          <Link
            href="/privacy"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-line bg-surface hover:bg-card transition-colors"
          >
            <FileText className="size-4 text-primary shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-ink">Privacy & Terms</span>
              <span className="text-[10px] text-ink-muted">Platform policies</span>
            </div>
          </Link>
        </div>
      </div>

      {/* 5. Danger Zone / Delete Account */}
      <div className="rounded-[18px] border border-rose-500/20 bg-rose-500/5 p-5 sm:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <ShieldAlert className="size-4.5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Danger Zone
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-ink">
              Permanently delete this account
            </span>
            <p className="text-xs text-ink-muted max-w-lg leading-relaxed">
              Once deleted, all your learning history, course progress, notes, bookmarks, and quiz attempts will be immediately and permanently removed. This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="inline-flex h-11 min-h-[44px] items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-card px-4 text-xs font-bold text-rose-600 dark:text-rose-400 shadow-2xs hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
          >
            <Trash2 className="size-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div className="w-full max-w-md rounded-[20px] border border-line bg-card p-6 shadow-xl flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="size-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-ink">
                  Delete Meritloom Account
                </h3>
                <span className="text-xs text-ink-muted">
                  Irreversible action
                </span>
              </div>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed">
              This will permanently delete your account and all associated data. To confirm, please type <strong className="text-rose-600 dark:text-rose-400 font-mono">DELETE</strong> below:
            </p>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-xs sm:text-sm font-semibold text-ink placeholder:text-ink-muted focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />

            {deleteError && (
              <p className="text-xs font-semibold text-rose-500">
                {deleteError}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDeleteConfirmText("");
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="h-10 rounded-xl px-4 text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE" || isDeleting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-xs font-bold text-white shadow-soft transition-all hover:bg-rose-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <span>Confirm Deletion</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

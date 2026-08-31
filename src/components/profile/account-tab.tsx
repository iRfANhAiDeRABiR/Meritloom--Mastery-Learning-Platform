"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  FileText,
  HelpCircle,
  KeyRound,
  Loader2,
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
import type { ProfileSettingsData } from "@/lib/types";

interface AccountTabProps {
  profile: ProfileSettingsData["profile"];
  provider: ProfileSettingsData["provider"];
}

export function AccountTab({ profile, provider }: AccountTabProps) {
  const router = useRouter();

  // Password state
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);
  const [passwordStatus, setPasswordStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

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

    if (newPassword.length < 8) {
      setPasswordStatus("error");
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus("error");
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordStatus("idle");
    setPasswordError(null);

    const result = await updatePasswordAction({ newPassword });

    if (result.success) {
      setPasswordStatus("success");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordStatus("idle"), 3000);
    } else {
      setPasswordStatus("error");
      setPasswordError(result.error || "Failed to update password.");
    }

    setIsUpdatingPassword(false);
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
      router.push("/");
      router.refresh();
    } else {
      setDeleteError(result.error || "Failed to delete account.");
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
        <p className="text-xs sm:text-sm text-muted">
          Manage your sign-in credentials and account security.
        </p>
      </div>

      {/* 1. Sign-in Method & Email */}
      <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-soft flex flex-col gap-4">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
          Sign-in Details
        </span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-surface border border-line">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-card text-muted shadow-2xs">
              <Mail className="size-4 text-primary" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-ink">{profile.email}</span>
              <span className="text-[11px] text-muted">Primary account email</span>
            </div>
          </div>

          <span className="rounded-md bg-card px-2.5 py-1 text-[11px] font-bold text-muted border border-line self-start sm:self-auto shadow-2xs">
            {provider === "google" ? "Google Authentication" : "Email & Password"}
          </span>
        </div>
      </div>

      {/* 2. Password Section */}
      {provider === "google" ? (
        <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-soft flex items-center gap-3.5">
          <KeyRound className="size-5 text-primary shrink-0" aria-hidden="true" />
          <p className="text-xs text-muted leading-relaxed">
            You signed in using Google authentication. Password management is handled securely through your Google account.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handlePasswordSubmit}
          className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-soft flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
              Change Password
            </span>
            <p className="text-xs text-muted">
              Choose a strong password with at least 8 characters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="account-new-password" className="text-xs font-bold text-ink">
                New password
              </label>
              <div className="relative">
                <input
                  id="account-new-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="h-11 w-full rounded-xl border border-line bg-surface px-4 pr-10 text-xs sm:text-sm font-semibold text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="account-confirm-password" className="text-xs font-bold text-ink">
                Confirm new password
              </label>
              <input
                id="account-confirm-password"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-xs sm:text-sm font-semibold text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {passwordStatus === "success" && (
            <div className="flex items-center gap-2 text-xs font-bold text-[#14895A] dark:text-[#74E0B8] bg-mint/30 border border-[#19B99A]/30 rounded-xl px-4 py-2.5 animate-in fade-in-0 duration-150">
              <Check className="size-4" aria-hidden="true" />
              <span>Password updated successfully</span>
            </div>
          )}

          {passwordStatus === "error" && passwordError && (
            <div className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl px-4 py-2.5 animate-in fade-in-0 duration-150">
              {passwordError}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUpdatingPassword || !newPassword || !confirmPassword}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-soft transition-all hover:bg-primary-hover disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  <span>Updating…</span>
                </>
              ) : (
                <span>Update password</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 3. Sign Out Section */}
      <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-ink">Sign out</span>
          <p className="text-xs text-muted">
            End your active session on this device.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-4 text-xs font-bold text-ink hover:border-primary/40 hover:text-primary transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          <LogOut className="size-3.5" aria-hidden="true" />
          <span>{isSigningOut ? "Signing out…" : "Sign out"}</span>
        </button>
      </div>

      {/* 4. Legal & Support Links */}
      <div className="rounded-[18px] border border-line bg-card p-5 sm:p-6 shadow-soft space-y-4">
        <div>
          <span className="text-xs font-bold text-ink">Legal & Support</span>
          <p className="text-xs text-muted mt-0.5">
            Review Meritloom&apos;s platform terms, privacy policy, and help resources.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-1">
          <Link
            href={routes.privacy}
            className="flex items-center gap-2 rounded-xl border border-line bg-surface p-3 text-xs font-semibold text-ink hover:border-primary/40 hover:text-primary transition-colors"
          >
            <Shield className="size-3.5 text-primary" aria-hidden="true" />
            <span>Privacy Policy</span>
          </Link>

          <Link
            href={routes.terms}
            className="flex items-center gap-2 rounded-xl border border-line bg-surface p-3 text-xs font-semibold text-ink hover:border-primary/40 hover:text-primary transition-colors"
          >
            <FileText className="size-3.5 text-primary" aria-hidden="true" />
            <span>Terms of Service</span>
          </Link>

          <Link
            href={routes.help}
            className="flex items-center gap-2 rounded-xl border border-line bg-surface p-3 text-xs font-semibold text-ink hover:border-primary/40 hover:text-primary transition-colors"
          >
            <HelpCircle className="size-3.5 text-primary" aria-hidden="true" />
            <span>Help Center</span>
          </Link>

          <Link
            href={routes.contact}
            className="flex items-center gap-2 rounded-xl border border-line bg-surface p-3 text-xs font-semibold text-ink hover:border-primary/40 hover:text-primary transition-colors"
          >
            <MessageSquare className="size-3.5 text-primary" aria-hidden="true" />
            <span>Contact Us</span>
          </Link>
        </div>
      </div>

      {/* 5. Danger Zone */}
      <div className="rounded-[18px] border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 p-5 sm:p-6 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
              Delete account
            </span>
            <p className="text-xs text-rose-700/80 dark:text-rose-300/80 leading-relaxed">
              Permanently delete your Meritloom account and all learning progress. This cannot be undone.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-500 text-white px-4 text-xs font-bold shadow-xs hover:bg-rose-600 transition-all cursor-pointer shrink-0"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          <span>Delete account</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150"
        >
          <div className="w-full max-w-md rounded-[20px] border border-line bg-card p-6 shadow-lift flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="grid size-10 place-items-center rounded-xl bg-rose-100 dark:bg-rose-950/60">
                <ShieldAlert className="size-5 text-rose-500" aria-hidden="true" />
              </div>
              <h3 id="delete-dialog-title" className="text-lg font-bold text-ink">
                Delete your account?
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              This will permanently delete your Meritloom account, course enrollments, notes, and quiz history. This action is irreversible.
            </p>

            <form onSubmit={handleDeleteAccount} className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirm-delete-input" className="text-xs font-bold text-ink">
                  Type <span className="font-mono text-rose-500">DELETE</span> to confirm:
                </label>
                <input
                  id="confirm-delete-input"
                  type="text"
                  required
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-xs sm:text-sm font-mono font-bold text-ink focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              {deleteError && (
                <p className="text-xs font-bold text-rose-500">
                  {deleteError}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setDeleteConfirmText("");
                    setDeleteError(null);
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-line bg-surface px-4 text-xs font-bold text-ink hover:bg-card transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={deleteConfirmText !== "DELETE" || isDeleting}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 text-xs font-bold text-white shadow-soft transition-all hover:bg-rose-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                      <span>Deleting…</span>
                    </>
                  ) : (
                    <span>Permanently delete</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  KeyRound,
  Mail,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { inviteStaffMemberAction } from "@/lib/actions/users";
import {
  ALL_STAFF_PERMISSIONS,
  PERMISSION_PRESETS,
  type StaffPermission,
} from "@/lib/types/staff";

interface StaffInviteModalProps {
  availableCourses: {
    id: string;
    title: string;
    slug: string;
  }[];
  children?: React.ReactNode;
}

export function StaffInviteModal({
  availableCourses,
  children,
}: StaffInviteModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [role, setRole] = React.useState<"instructor" | "sub_admin">("instructor");
  const [selectedCourses, setSelectedCourses] = React.useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = React.useState<string>("content_manager");
  const [selectedPermissions, setSelectedPermissions] = React.useState<StaffPermission[]>(
    PERMISSION_PRESETS.content_manager.permissions,
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey !== "custom" && PERMISSION_PRESETS[presetKey]) {
      setSelectedPermissions(PERMISSION_PRESETS[presetKey].permissions);
    }
  };

  const handleTogglePermission = (permId: StaffPermission) => {
    setSelectedPreset("custom");
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId],
    );
  };

  const handleToggleCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    toast("Sending staff invitation...", { id: "invite-action" });

    try {
      const res = await inviteStaffMemberAction({
        email: email.trim(),
        role,
        displayName: displayName.trim() || undefined,
        permissions: role === "sub_admin" ? selectedPermissions : [],
        assignedCourseIds: role === "instructor" ? selectedCourses : [],
      });

      if (res.success) {
        toast.success(`Invitation sent to ${email}`, { id: "invite-action" });
        setIsOpen(false);
        setEmail("");
        setDisplayName("");
        setSelectedCourses([]);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to send invitation", { id: "invite-action" });
      }
    } catch {
      toast.error("Failed to send invitation", { id: "invite-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="rounded-xl bg-primary font-semibold text-white shadow-xs hover:bg-primary/90 text-xs">
            <UserPlus className="mr-1.5 size-3.5" />
            <span>Invite Staff</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
            <ShieldCheck className="size-5" />
          </div>
          <DialogTitle>Invite Staff Member</DialogTitle>
          <DialogDescription className="text-xs text-ink-muted">
            Send an onboarding invitation to an instructor or delegated sub-administrator.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("instructor")}
              className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                role === "instructor"
                  ? "border-primary bg-primary/5 text-ink"
                  : "border-line text-ink-muted hover:border-line-hover"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-xs">
                <BookOpen className="size-3.5 text-blue-500" />
                <span>Instructor</span>
              </div>
              <p className="mt-1 text-[11px] text-ink-muted">
                Author & manage curriculum for assigned courses
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole("sub_admin")}
              className={`flex flex-col items-start rounded-xl border p-3 text-left transition ${
                role === "sub_admin"
                  ? "border-primary bg-primary/5 text-ink"
                  : "border-line text-ink-muted hover:border-line-hover"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-xs">
                <KeyRound className="size-3.5 text-amber-500" />
                <span>Sub-Admin</span>
              </div>
              <p className="mt-1 text-[11px] text-ink-muted">
                Delegated administrative tools & policy enforcement
              </p>
            </button>
          </div>

          {/* Email & Name Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-ink">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-muted" />
                <input
                  type="email"
                  required
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface-elevated/40 pl-9 pr-3.5 h-11 min-h-[44px] text-xs text-ink placeholder:text-ink-muted outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink">
                Display Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Rahman"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-surface-elevated/40 px-3.5 h-11 min-h-[44px] text-xs text-ink placeholder:text-ink-muted outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Course Assignment for Instructors */}
          {role === "instructor" && (
            <div className="space-y-2 border-t border-line pt-3">
              <label className="text-xs font-semibold text-ink">
                Assign Courses
              </label>
              <p className="text-[11px] text-ink-muted">
                Select the courses this instructor is authorized to edit.
              </p>

              <div className="max-h-44 overflow-y-auto rounded-xl border border-line bg-surface-elevated/20 p-2 space-y-1">
                {availableCourses.length === 0 ? (
                  <p className="py-2 text-center text-xs text-ink-muted">No courses available.</p>
                ) : (
                  availableCourses.map((c) => {
                    const isChecked = selectedCourses.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className={`flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs transition ${
                          isChecked ? "bg-primary/10 text-ink font-semibold" : "hover:bg-surface-elevated text-ink-muted"
                        }`}
                      >
                        <span>{c.title}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCourse(c.id)}
                          className="rounded border-line text-primary focus:ring-0"
                        />
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Permissions for Sub-Admins */}
          {role === "sub_admin" && (
            <div className="space-y-3 border-t border-line pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-ink">
                    Permission Preset
                  </label>
                  <p className="text-[11px] text-ink-muted">
                    Choose a role preset or customize permissions below.
                  </p>
                </div>

                <select
                  value={selectedPreset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="h-10 min-h-[40px] rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-ink shadow-xs outline-none"
                >
                  <option value="content_manager">Content Manager</option>
                  <option value="user_support">User Support</option>
                  <option value="content_and_users">Content + Users</option>
                  <option value="full_sub_admin">Full Sub-Admin</option>
                  <option value="custom">Custom Permissions</option>
                </select>
              </div>

              <div className="max-h-52 overflow-y-auto space-y-2 rounded-xl border border-line bg-surface-elevated/20 p-2.5">
                {ALL_STAFF_PERMISSIONS.map((perm) => {
                  const isChecked = selectedPermissions.includes(perm.id);
                  return (
                    <label
                      key={perm.id}
                      className={`flex cursor-pointer items-start gap-2.5 rounded-lg p-2 text-xs transition ${
                        isChecked ? "bg-surface text-ink shadow-2xs" : "text-ink-muted hover:bg-surface/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTogglePermission(perm.id)}
                        className="mt-0.5 rounded border-line text-primary focus:ring-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <span>{perm.label}</span>
                          {perm.isSensitive && (
                            <span className="rounded bg-rose-500/10 px-1 py-0.2 text-[9px] font-bold text-rose-500">
                              Sensitive
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-ink-muted">{perm.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-line pt-3 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-11 min-h-[44px] rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 min-h-[44px] rounded-xl bg-primary font-semibold text-white hover:bg-primary/90 text-xs cursor-pointer"
            >
              {isSubmitting ? "Sending..." : "Send Staff Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

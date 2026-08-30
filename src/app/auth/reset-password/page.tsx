import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Update Password | Meritloom",
  description: "Update your Meritloom account password.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="h-[400px] animate-pulse" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}


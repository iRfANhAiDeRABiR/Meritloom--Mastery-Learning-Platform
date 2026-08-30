import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password | Meritloom",
  description: "Reset your Meritloom account password.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="h-[360px] animate-pulse" />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}


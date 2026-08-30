import type { Metadata } from "next";
import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create a Free Account | Meritloom",
  description:
    "Create your free Meritloom account and start learning with structured, mastery-based courses.",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="h-[460px] animate-pulse" />}>
      <SignUpForm />
    </Suspense>
  );
}


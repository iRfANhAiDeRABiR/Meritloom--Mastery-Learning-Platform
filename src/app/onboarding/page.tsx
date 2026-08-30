import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { getCurrentUser } from "@/lib/auth";
import { getCategories } from "@/lib/queries";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Learner Onboarding | Meritloom",
  description:
    "Tell us what you'd like to learn so we can recommend free courses matching your goals.",
};

/**
 * Meritloom Learner Onboarding Page — Page 5.
 * Route: /onboarding
 *
 * Implements Figma Frame 4:2 in a streamlined 3-step personalization flow:
 * - Step 1: Interests & Primary Goal
 * - Step 2: Experience Level
 * - Step 3: Learning Style & Study Pace
 *
 * Protected route: requires authenticated session.
 */
export default async function OnboardingPage() {
  // 1. Enforce authentication
  const user = await getCurrentUser();
  if (!user) {
    redirect(`${routes.auth.signIn}?next=/onboarding`);
  }

  // 2. Fetch published categories for interest chips
  const categories = await getCategories();

  return <OnboardingFlow categories={categories} />;
}


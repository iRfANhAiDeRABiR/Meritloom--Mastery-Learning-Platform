"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

import { OnboardingMobileProgress } from "@/components/onboarding/onboarding-mobile-progress";
import { OnboardingSidebar } from "@/components/onboarding/onboarding-sidebar";
import { StepExperience } from "@/components/onboarding/step-experience";
import { StepInterests } from "@/components/onboarding/step-interests";
import { StepLearningStyle } from "@/components/onboarding/step-learning-style";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { saveOnboardingAction } from "@/lib/actions/onboarding";
import { routes } from "@/lib/routes";
import type {
  Category,
  ContentPreference,
  CourseDifficulty,
  LearnerOnboardingState,
  PrimaryLearningGoal,
  StudyPace,
} from "@/lib/types";

interface OnboardingFlowProps {
  categories: Category[];
}

const STORAGE_KEY = "meritloom_onboarding_draft";

export function OnboardingFlow({ categories }: OnboardingFlowProps) {
  const router = useRouter();

  const [step, setStep] = React.useState<number>(1);
  const [goal, setGoal] = React.useState<PrimaryLearningGoal | null>("explore");
  const [interests, setInterests] = React.useState<string[]>([]);
  const [level, setLevel] = React.useState<CourseDifficulty | null>("beginner");
  const [notSureLevel, setNotSureLevel] = React.useState(false);
  const [studyPace, setStudyPace] = React.useState<StudyPace | null>("30_min");
  const [contentPreferences, setContentPreferences] = React.useState<
    ContentPreference[]
  >(["video", "exercises"]);
  const [reminders, setReminders] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Sync draft state to sessionStorage whenever values change
  React.useEffect(() => {
    try {
      const draft = {
        step,
        goal,
        interests,
        level,
        notSureLevel,
        studyPace,
        contentPreferences,
        reminders,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Ignore
    }
  }, [
    step,
    goal,
    interests,
    level,
    notSureLevel,
    studyPace,
    contentPreferences,
    reminders,
  ]);

  const handleToggleInterest = (slug: string) => {
    setInterests((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, slug];
    });
  };

  const handleSelectLevel = (lvl: CourseDifficulty) => {
    setLevel(lvl);
    setNotSureLevel(false);
  };

  const handleSelectNotSure = () => {
    setNotSureLevel(true);
    setLevel(null);
  };

  const handleToggleFormat = (fmt: ContentPreference) => {
    setContentPreferences((prev) => {
      if (prev.includes(fmt)) {
        return prev.filter((f) => f !== fmt);
      }
      return [...prev, fmt];
    });
  };

  const handleSkip = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    router.push(routes.courses.index);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const data: LearnerOnboardingState = {
      goal,
      interests,
      level,
      notSureLevel,
      studyPace,
      contentPreferences,
      reminders,
    };

    const res = await saveOnboardingAction(data);

    if (res.success) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
      setIsSuccess(true);
    } else {
      setIsLoading(false);
      router.push(routes.learn);
    }
  };

  // Success Confirmation Screen
  if (isSuccess) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center text-ink">
        <div className="flex max-w-md flex-col items-center gap-6 rounded-container border border-line bg-card p-8 shadow-lift sm:p-10">
          <div className="grid size-16 place-items-center rounded-2xl bg-lavender text-primary shadow-soft">
            <Sparkles className="size-8" aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              You&apos;re ready to start learning.
            </h1>
            <p className="text-sm leading-relaxed text-muted">
              We&apos;ve organized course recommendations based on your interests and
              preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push(routes.learn)}
            className="group flex h-[48px] w-full items-center justify-center gap-2.5 rounded-[13px] bg-gradient-to-r from-[#7357FF] via-[#7C5CFF] to-[#6847F5] px-6 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(109,74,255,0.35)] cursor-pointer"
          >
            <span>Explore my recommendations</span>
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-background text-ink transition-colors duration-300">
      {/* Desktop Left Step Sidebar (~280px width) */}
      <div className="hidden lg:block lg:w-[280px] shrink-0">
        <div className="sticky top-0 h-screen w-full">
          <OnboardingSidebar
            currentStep={step}
            onStepClick={(s) => setStep(s)}
          />
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="relative flex flex-1 flex-col justify-between overflow-hidden p-6 sm:p-10 lg:p-12 xl:p-14">
        {/* Subtle Right-Side Background Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 85% 15%, rgba(124, 92, 255, 0.05), transparent 40%),
              radial-gradient(circle at 15% 85%, rgba(109, 74, 255, 0.03), transparent 35%)
            `,
          }}
        />

        {/* Top Header Row with Theme Toggle & Mobile Progress */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="lg:hidden">
              <Link
                href={routes.home}
                className="text-xs font-bold text-muted hover:text-ink transition-colors"
              >
                Meritloom
              </Link>
            </div>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Step Progress Indicator */}
          <OnboardingMobileProgress currentStep={step} />
        </div>

        {/* Main Content Area */}
        <main
          id="onboarding-main"
          className="mx-auto my-auto flex w-full max-w-3xl flex-col justify-center py-8"
        >
          {step === 1 && (
            <StepInterests
              categories={categories}
              selectedGoal={goal}
              selectedInterests={interests}
              onSelectGoal={(g) => setGoal(g)}
              onToggleInterest={handleToggleInterest}
              onNext={() => setStep(2)}
              onSkip={handleSkip}
            />
          )}

          {step === 2 && (
            <StepExperience
              selectedLevel={level}
              notSureLevel={notSureLevel}
              onSelectLevel={handleSelectLevel}
              onSelectNotSure={handleSelectNotSure}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <StepLearningStyle
              selectedPace={studyPace}
              selectedFormats={contentPreferences}
              remindersEnabled={reminders}
              isLoading={isLoading}
              onSelectPace={(p) => setStudyPace(p)}
              onToggleFormat={handleToggleFormat}
              onToggleReminders={() => setReminders((prev) => !prev)}
              onSubmit={handleSubmit}
              onBack={() => setStep(2)}
            />
          )}
        </main>

        {/* Footer info */}
        <footer className="mt-auto pt-6 text-center text-xs text-muted">
          <span>
            You can always browse all courses freely regardless of these
            recommendations.
          </span>
        </footer>
      </div>
    </div>
  );
}


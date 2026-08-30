import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  Layers,
  Lock,
  Sparkles,
  UserPlus,
} from "lucide-react";

/**
 * Static landing-page copy and data structures matching Figma Frame 3:2.
 */

export const heroContent = {
  badge: "Free mastery-based learning",
  headlinePrefix: "Students advance when they ",
  headlineHighlight: "truly understand.",
  support:
    "Meritloom offers free, structured courses that help you learn each concept, practise it and move forward with confidence.",
  primaryCta: "Start learning free",
  secondaryCta: "Explore courses",
} as const;

export interface HeroBenefit {
  label: string;
  icon: LucideIcon;
}

export const heroBenefits: HeroBenefit[] = [
  {
    label: "Completely free",
    icon: BadgeCheck,
  },
  {
    label: "Learn at your own pace",
    icon: Clock,
  },
  {
    label: "Practical, structured lessons",
    icon: Sparkles,
  },
];

export interface FeatureCardItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const mainFeatures = {
  heading: "A better way to learn for free",
  support:
    "Follow clear lessons, practise important concepts and build skills without subscriptions or paywalls.",
  cards: [
    {
      title: "Structured learning paths",
      description:
        "Learn topics in the right order through carefully organized courses and lessons.",
      icon: Layers,
    },
    {
      title: "Practice for understanding",
      description:
        "Strengthen each concept through exercises, examples and short knowledge checks.",
      icon: CheckCircle2,
    },
    {
      title: "Learn at your own pace",
      description:
        "Study whenever you want and revisit lessons whenever you need.",
      icon: Clock,
    },
  ] as FeatureCardItem[],
};

export interface HowItWorksStep {
  stepNumber: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const howItWorksData = {
  heading: "How it works",
  support: "A straightforward, mastery-based approach designed for individual learners.",
  steps: [
    {
      stepNumber: 1,
      title: "Choose a course",
      description: "Find a subject or skill you want to learn.",
      icon: Compass,
    },
    {
      stepNumber: 2,
      title: "Learn and practise",
      description: "Follow short lessons, examples and exercises.",
      icon: BookOpen,
    },
    {
      stepNumber: 3,
      title: "Build real understanding",
      description: "Review difficult concepts and apply what you learn.",
      icon: CheckCircle2,
    },
  ] as HowItWorksStep[],
};

export const featuredCoursesContent = {
  heading: "Explore free courses",
  support: "Start with a practical course and build your knowledge one lesson at a time.",
  viewAll: "View all courses",
};

export const finalCtaContent = {
  heading: "Start learning without a paywall.",
  text: "Explore free courses and begin building skills at your own pace.",
  primaryCta: "Start Learning Free",
  secondaryCta: "Browse Courses",
};

export interface CommitmentItem {
  label: string;
  icon: LucideIcon;
}

export const freeCommitments: CommitmentItem[] = [
  { label: "No subscription required", icon: Check },
  { label: "No locked premium lessons", icon: Lock },
  { label: "No payment information needed", icon: CreditCard },
  { label: "Account is only required for saving progress", icon: UserPlus },
];

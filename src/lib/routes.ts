/**
 * Centralised route constants.
 */
export const routes = {
  home: "/",
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    signOut: "/auth/sign-out",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    callback: "/auth/callback",
  },
  onboarding: "/onboarding",
  dashboard: "/learn",
  learn: "/learn",
  learnCourses: "/learn/courses",
  learnSaved: "/learn/saved",
  profile: "/profile",
  courses: {
    index: "/courses",
    detail: (slug: string) => `/courses/${slug}`,
  },
  learningPaths: {
    index: "/learning-paths",
    detail: (slug: string) => `/learning-paths/${slug}`,
  },
  categories: {
    index: "/categories",
    detail: (slug: string) => `/categories/${slug}`,
  },
  myLearning: "/learn",
  // In-page anchors used by the landing navigation.
  anchors: {
    courses: "#courses",
    paths: "#learning-paths",
    howItWorks: "#how-it-works",
    about: "#about",
    faq: "#faq",
  },
} as const;

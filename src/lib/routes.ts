/**
 * Centralised route constants.
 *
 * Only the landing page (`/`) is implemented in this step. The other routes
 * are referenced by navigation and CTAs and are prepared for later page
 * prompts, so they should be defined here rather than hard-coded as strings.
 */
export const routes = {
  home: "/",
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    signOut: "/auth/sign-out",
  },
  dashboard: "/dashboard",
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
  myLearning: "/my-learning",
  // In-page anchors used by the landing navigation.
  anchors: {
    courses: "#courses",
    paths: "#learning-paths",
    howItWorks: "#how-it-works",
    about: "#about",
    faq: "#faq",
  },
} as const;

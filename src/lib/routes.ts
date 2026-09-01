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
  learnNotes: "/learn/notes",
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
  howItWorks: "/how-it-works",
  about: "/about",
  help: "/help",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  myLearning: "/learn",
  admin: {
    dashboard: "/admin",
    courses: "/admin/courses",
    quizzes: "/admin/quizzes",
    newCourse: "/admin/courses/new",
    course: (id: string) => `/admin/courses/${id}`,
    learningPaths: "/admin/learning-paths",
    newLearningPath: "/admin/learning-paths/new",
    learningPath: (id: string) => `/admin/learning-paths/${id}`,
    learners: "/admin/learners",
    messages: "/admin/messages",
    instructors: "/admin/instructors",
    categories: "/admin/categories",
    skills: "/admin/skills",
    contentTools: "/admin/content-tools",
  },
  // In-page anchors used by the landing navigation.
  anchors: {
    courses: "#courses",
    paths: "#learning-paths",
    howItWorks: "#how-it-works",
    about: "#about",
    faq: "#faq",
  },
} as const;

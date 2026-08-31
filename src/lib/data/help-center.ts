export interface HelpCategory {
  id: string;
  name: string;
  description: string;
  iconName: "UserRound" | "BookOpen" | "Route" | "ChartNoAxesColumnIncreasing" | "PlayCircle" | "CircleHelp" | "Bookmark";
  itemCount: number;
}

export interface HelpArticle {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  keywords: string[];
  isPopular?: boolean;
}

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: "account",
    name: "Account & Profile",
    description: "Sign in, account settings, email, password, avatar and profile management.",
    iconName: "UserRound",
    itemCount: 6,
  },
  {
    id: "courses",
    name: "Courses & Enrollment",
    description: "Starting courses, lessons, module structure, and course completion.",
    iconName: "BookOpen",
    itemCount: 7,
  },
  {
    id: "learning-paths",
    name: "Learning Paths",
    description: "How guided multi-course journeys and milestone progressions work.",
    iconName: "Route",
    itemCount: 5,
  },
  {
    id: "progress",
    name: "Progress Tracking",
    description: "Lesson completion, percentage calculations, and calm activity logging.",
    iconName: "ChartNoAxesColumnIncreasing",
    itemCount: 5,
  },
  {
    id: "video",
    name: "Video & Content",
    description: "YouTube lessons, open educational resources, playback, and troubleshooting.",
    iconName: "PlayCircle",
    itemCount: 6,
  },
  {
    id: "practice",
    name: "Practice & Knowledge Checks",
    description: "Hands-on exercises, checkpoint quizzes, retries, and instant explanations.",
    iconName: "CircleHelp",
    itemCount: 4,
  },
];

export const HELP_ARTICLES: HelpArticle[] = [
  // Popular / Flagship Questions
  {
    id: "is-meritloom-free",
    categoryId: "courses",
    question: "Is Meritloom free?",
    answer:
      "Yes. Published Meritloom learning content is free to access. You do not need a subscription, credit card, or payment method to start learning.",
    keywords: ["free", "pricing", "cost", "subscription", "paywall", "credit card", "money"],
    isPopular: true,
  },
  {
    id: "do-i-need-an-account",
    categoryId: "account",
    question: "Do I need an account to use Meritloom?",
    answer:
      "You can browse public courses, curriculum outlines, and Learning Paths without an account. An account is required to start courses, save your lesson progress, bookmark courses, and use personalized learning dashboard features.",
    keywords: ["account", "signup", "register", "sign in", "login", "anonymous"],
    isPopular: true,
  },
  {
    id: "how-do-i-start-a-course",
    categoryId: "courses",
    question: "How do I start a course?",
    answer:
      "Open any published course from the Course Catalog and choose 'Start Course' or 'Start with Lesson 1.' If you are not signed in, Meritloom will prompt you to create a free account or sign in to keep your progress synchronized.",
    keywords: ["start course", "enroll", "begin", "first lesson", "enrollment"],
    isPopular: true,
  },
  {
    id: "can-i-take-courses-in-any-order",
    categoryId: "courses",
    question: "Can I take courses in any order?",
    answer:
      "Yes. Recommended prerequisites and Learning Paths provide helpful guidance, but published courses are never locked behind previous course completions. You can jump directly to any topic.",
    keywords: ["order", "prerequisites", "lock", "skip", "flexible", "sequence"],
    isPopular: true,
  },
  {
    id: "course-progress",
    categoryId: "progress",
    question: "How does course progress work?",
    answer:
      "Meritloom records lessons you mark as completed. Course progress percentage is calculated from required published lessons. Bonus lessons are optional and provide extra enrichment without penalizing your overall completion metric.",
    keywords: ["progress", "percentage", "completion", "completed", "calculate", "formula"],
    isPopular: true,
  },
  {
    id: "knowledge-checks",
    categoryId: "practice",
    question: "What happens if I fail or miss a question on a knowledge check?",
    answer:
      "Knowledge checks are designed as active practice checkpoints, not restrictive gates. You can review detailed explanations, retry as many times as you like, and proceed to subsequent lessons regardless of your score.",
    keywords: ["quiz", "knowledge check", "fail", "score", "retry", "gate", "practice"],
    isPopular: true,
  },
  {
    id: "can-i-replay-completed-lessons",
    categoryId: "courses",
    question: "Can I replay completed lessons?",
    answer:
      "Yes. All completed lessons and practice activities remain permanently open for review, practice, and reference whenever you want.",
    keywords: ["replay", "review", "completed lesson", "revisit", "rewatch"],
    isPopular: true,
  },
  {
    id: "what-is-a-learning-path",
    categoryId: "learning-paths",
    question: "What is a Learning Path?",
    answer:
      "A Learning Path is a recommended sequence of related courses leading to a practical capstone project. For example, Web Development Foundations guides learners step-by-step through HTML, CSS, JavaScript, and an Interactive Personal Website project.",
    keywords: ["learning path", "roadmap", "curriculum", "journey", "track", "sequence"],
    isPopular: true,
  },
  {
    id: "are-learning-paths-mandatory",
    categoryId: "learning-paths",
    question: "Are Learning Paths mandatory?",
    answer:
      "No. Learning Paths are recommendations, not restrictions. You can follow them in sequence, skip ahead, or explore standalone courses from the catalog at any time.",
    keywords: ["mandatory", "required", "lock", "path lock", "freedom"],
    isPopular: true,
  },
  {
    id: "where-do-videos-come-from",
    categoryId: "video",
    question: "Where do Meritloom course videos come from?",
    answer:
      "Some courses use educational YouTube videos from trusted open creators such as W3Schools. Meritloom clearly credits the original creator and organizes these videos with structured modules, original summaries, takeaways, practice exercises, and progress tracking.",
    keywords: ["video source", "youtube", "w3schools", "creator", "attribution", "copyright"],
    isPopular: true,
  },

  // Account Category Articles
  {
    id: "how-to-change-name",
    categoryId: "account",
    question: "How do I change my display name?",
    answer:
      "Go to your Profile page by clicking your avatar in the navigation header and selecting 'Profile.' You can update your display name and save your changes immediately.",
    keywords: ["change name", "profile name", "display name", "update name"],
  },
  {
    id: "how-to-change-avatar",
    categoryId: "account",
    question: "How do I change my profile photo?",
    answer:
      "Navigate to Profile > Edit Avatar. You can upload a custom image (JPG, PNG, WebP up to 2MB) or pick one of our default avatar styles.",
    keywords: ["avatar", "profile photo", "picture", "upload image", "photo"],
  },
  {
    id: "how-to-reset-password",
    categoryId: "account",
    question: "How do I reset my password?",
    answer:
      "On the Sign In page, click 'Forgot password?' Enter your registered email address and we will send you a secure reset link.",
    keywords: ["reset password", "forgot password", "change password", "password help"],
  },
  {
    id: "how-to-sign-out",
    categoryId: "account",
    question: "How do I sign out of Meritloom?",
    answer:
      "Click your avatar in the top right navigation bar and select 'Sign Out.' You will be safely signed out of your session on this device.",
    keywords: ["sign out", "logout", "log off"],
  },

  // Course Category Articles
  {
    id: "how-to-continue-where-i-stopped",
    categoryId: "courses",
    question: "How do I continue where I stopped?",
    answer:
      "When you sign in, your Learner Dashboard (/learn) prominently displays your active course with a 'Continue Learning' button that takes you directly to your next uncompleted lesson.",
    keywords: ["continue", "resume", "last lesson", "where I left off", "dashboard"],
  },
  {
    id: "what-is-a-bonus-lesson",
    categoryId: "courses",
    question: "What does 'bonus lesson' mean?",
    answer:
      "Bonus lessons provide optional deep dives or extra coding challenges. They are marked with a 'Bonus' tag and are not required to achieve 100% course completion.",
    keywords: ["bonus", "optional lesson", "extra content", "bonus lesson"],
  },

  // Learning Path Category Articles
  {
    id: "how-is-learning-path-progress-calculated",
    categoryId: "learning-paths",
    question: "How is Learning Path progress calculated?",
    answer:
      "Meritloom automatically derives Learning Path progress from the courses you start and complete in that path. You do not need to enroll in a Learning Path separately.",
    keywords: ["path progress", "calculate path", "path completion", "path enroll"],
  },

  // Video & Playback Category Articles
  {
    id: "video-not-playing",
    categoryId: "video",
    question: "Why is my video not playing?",
    answer:
      "Video playback issues are usually caused by ad-blockers, browser tracking protections, or slow network connections. Try refreshing the page, temporarily pausing content blockers on Meritloom, or clicking the 'Watch on YouTube' link.",
    keywords: ["video not playing", "video error", "black screen", "playback issue", "video buffering"],
    isPopular: true,
  },
  {
    id: "can-i-download-videos",
    categoryId: "video",
    question: "Can I download course videos for offline viewing?",
    answer:
      "Meritloom embeds videos from their original sources and does not support downloading or re-hosting video files. Playback requires an active internet connection.",
    keywords: ["download video", "offline", "save video", "offline mode"],
  },

  // Saved Courses
  {
    id: "saved-courses",
    categoryId: "courses",
    question: "How do I bookmark or save a course for later?",
    answer:
      "Click the bookmark icon on any Course Card or Course Details page. You can view and manage all your bookmarked courses anytime at /learn/saved.",
    keywords: ["save course", "bookmark", "saved courses", "favorites"],
  },
];

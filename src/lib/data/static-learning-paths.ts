import type { LearningPathDetail, LearningPathSummary } from "@/lib/types";

export const WEB_DEV_FOUNDATIONS_PATH: LearningPathDetail = {
  id: "path-web-dev-foundations",
  slug: "web-development-foundations",
  title: "Web Development Foundations",
  subtitle: "Build the core skills you need to create modern interactive websites.",
  description:
    "Follow a guided sequence through HTML, CSS, and JavaScript. Learn each foundation in order, practice what you learn, and move through the path at your own pace.",
  difficulty: "beginner",
  estimatedMinutes: 335, // 110 + 90 + 105 + 30 min project (~5.6 hrs video/practice, ~12 hrs study)
  courseCount: 3,
  isPublished: true,
  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "Semantic HTML",
    "Web Styling",
    "Responsive Design",
    "Functions & Logic",
    "DOM Manipulation",
    "Frontend Development",
  ],
  capabilities: [
    {
      title: "Structured Websites",
      description:
        "Build accessible page structures with clean semantic HTML5 tags, links, media, forms, and tables.",
      iconName: "LayoutTemplate",
    },
    {
      title: "Responsive Interfaces",
      description:
        "Transform plain HTML into polished layouts that adapt smoothly across mobile, tablet, and desktop screens.",
      iconName: "PanelsTopLeft",
    },
    {
      title: "Interactive Experiences",
      description:
        "Add dynamic behavior, calculation logic, DOM element updates, and event listeners using JavaScript.",
      iconName: "MousePointerClick",
    },
    {
      title: "Complete Frontend Project",
      description:
        "Combine HTML structure, CSS styling, and JavaScript logic into a unified, interactive portfolio website.",
      iconName: "Rocket",
    },
  ],
  items: [
    {
      id: "path-item-html",
      itemType: "course",
      position: 1,
      stepNumber: 1,
      stepLabel: "STEP 1",
      courseId: "course-html-fundamentals",
      courseSlug: "html-fundamentals",
      title: "HTML Fundamentals",
      description:
        "Learn how websites are structured using headings, text, links, images, forms, tables, and semantic HTML.",
      iconName: "Code2",
      accentColor: "amber",
      difficulty: "beginner",
      lessonCount: 23,
      estimatedMinutes: 110,
      categoryName: "Web Development",
    },
    {
      id: "path-item-css",
      itemType: "course",
      position: 2,
      stepNumber: 2,
      stepLabel: "STEP 2",
      courseId: "course-css-fundamentals",
      courseSlug: "css-fundamentals",
      title: "CSS Fundamentals",
      description:
        "Transform plain HTML into polished layouts using colors, selectors, backgrounds, spacing, and visual styling.",
      iconName: "Palette",
      accentColor: "cyan",
      difficulty: "beginner",
      lessonCount: 18,
      estimatedMinutes: 90,
      categoryName: "Web Development",
    },
    {
      id: "path-item-js",
      itemType: "course",
      position: 3,
      stepNumber: 3,
      stepLabel: "STEP 3",
      courseId: "course-javascript-fundamentals",
      courseSlug: "javascript-fundamentals",
      title: "JavaScript Fundamentals",
      description:
        "Add behavior and interaction to your webpages using variables, functions, conditions, arrays, objects, loops, and browser events.",
      iconName: "Braces",
      accentColor: "gold",
      difficulty: "beginner",
      lessonCount: 17,
      estimatedMinutes: 105,
      categoryName: "Web Development",
    },
    {
      id: "path-item-project",
      itemType: "project",
      position: 4,
      stepNumber: 4,
      stepLabel: "FINAL PROJECT",
      title: "Build an Interactive Personal Website",
      description:
        "Combine HTML structure, CSS styling, and JavaScript behavior into one complete frontend project.",
      iconName: "Rocket",
      accentColor: "purple",
      estimatedMinutes: 30,
      outcomes: [
        "Semantic webpage structure with clean HTML5 markup",
        "Responsive styling and reusable CSS layout classes",
        "Interactive buttons and real-time DOM updates",
        "Dynamic calculations and calculated output displays",
        "Complete, shareable frontend portfolio project",
      ],
      projectUrl: "/courses/javascript-fundamentals",
    },
  ],
};

export const ALL_STATIC_LEARNING_PATHS: LearningPathDetail[] = [
  WEB_DEV_FOUNDATIONS_PATH,
];

export const ALL_STATIC_PATH_SUMMARIES: LearningPathSummary[] = [
  {
    id: WEB_DEV_FOUNDATIONS_PATH.id,
    slug: WEB_DEV_FOUNDATIONS_PATH.slug,
    title: WEB_DEV_FOUNDATIONS_PATH.title,
    outcome:
      "Master HTML, CSS, and JavaScript to build responsive, interactive websites.",
    difficulty: WEB_DEV_FOUNDATIONS_PATH.difficulty,
    estimatedMinutes: WEB_DEV_FOUNDATIONS_PATH.estimatedMinutes,
    courseCount: WEB_DEV_FOUNDATIONS_PATH.courseCount,
    roadmapPreview: [
      "HTML Fundamentals",
      "CSS Fundamentals",
      "JavaScript Fundamentals",
      "Final Project",
    ],
  },
];

/**
 * FAQ entries in a reusable data structure so the accordion and the content
 * stay decoupled. Answers are factual product statements only.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "Is Meritloom completely free?",
    answer:
      "Yes. Courses, lessons, practice exercises, mastery checks and learning paths are all free. There are no subscriptions, no paid plans and no locked premium lessons.",
  },
  {
    question: "Do I need an account to start learning?",
    answer:
      "You can browse every course and learning path without an account. An account is only needed when you want to save progress, track streaks and pick up where you left off.",
  },
  {
    question: "Can I track my progress?",
    answer:
      "Yes. Once you create a free account, Meritloom saves completed lessons, course progress and mastery-check results automatically so you always know what to do next.",
  },
  {
    question: "Are certificates available?",
    answer:
      "Meritloom is built around genuine mastery rather than completion paperwork. Where a course or path offers a certificate of completion, it is stated clearly on that course page — and it is always free.",
  },
  {
    question: "Can I learn on a mobile device?",
    answer:
      "Yes. Meritloom is fully responsive and works on phones, tablets and desktops in any modern browser. There is nothing to install.",
  },
];

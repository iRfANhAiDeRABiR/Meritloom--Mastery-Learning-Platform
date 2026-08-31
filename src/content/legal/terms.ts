export interface LegalTOCItem {
  id: string;
  title: string;
}

export interface LegalSectionData {
  id: string;
  title: string;
  content: string;
  callout?: {
    type: "info" | "important" | "transparency";
    title?: string;
    text: string;
  };
}

export const TERMS_TOC: LegalTOCItem[] = [
  { id: "using-meritloom", title: "1. Using Meritloom" },
  { id: "what-meritloom-provides", title: "2. What Meritloom provides" },
  { id: "free-learning-access", title: "3. Free learning access" },
  { id: "your-account", title: "4. Your account" },
  { id: "acceptable-use", title: "5. Acceptable use" },
  { id: "learning-content", title: "6. Learning content and third-party resources" },
  { id: "intellectual-property", title: "7. Intellectual property" },
  { id: "content-you-provide", title: "8. Content you provide" },
  { id: "educational-disclaimer", title: "9. Educational purpose disclaimer" },
  { id: "progress-and-availability", title: "10. Progress and availability" },
  { id: "third-party-services", title: "11. Third-party services" },
  { id: "service-changes", title: "12. Changes to Meritloom" },
  { id: "account-restrictions", title: "13. Account restrictions" },
  { id: "ending-your-account", title: "14. Ending your account" },
  { id: "service-disclaimers", title: "15. Disclaimers" },
  { id: "liability", title: "16. Limitation of liability" },
  { id: "governing-law", title: "17. General terms" },
  { id: "terms-changes", title: "18. Changes to these terms" },
  { id: "contact-terms", title: "19. Contact" },
];

export const TERMS_SECTIONS: LegalSectionData[] = [
  {
    id: "using-meritloom",
    title: "1. Using Meritloom",
    content: `
These Terms of Service ("Terms") govern your access to and use of Meritloom, including our website, courses, lessons, practice checks, and learning paths. By accessing or using Meritloom, you agree to comply with and be bound by these Terms. If you do not agree, please do not use the platform.
`,
  },
  {
    id: "what-meritloom-provides",
    title: "2. What Meritloom provides",
    content: `
Meritloom provides self-paced digital learning experiences, including:
- Free published foundational programming and web development courses
- Modular lesson sequences, original summaries, and key takeaways
- Embedded educational resources and video tutorials
- Interactive checkpoint quizzes, coding exercises, and practice feedback
- Personal progress tracking, bookmarked courses, and guided Learning Paths

Meritloom is designed as an educational tool to help individuals learn practical digital skills at their own pace.
`,
  },
  {
    id: "free-learning-access",
    title: "3. Free learning access",
    content: `
Published Meritloom courses and learning paths are currently available free of charge without mandatory subscription fees or payment paywalls. You do not need to provide payment information to access our published courses.
`,
  },
  {
    id: "your-account",
    title: "4. Your account",
    content: `
You may explore public course outlines without creating an account. An account is required to start courses, track lesson completion, save bookmarks, and record quiz attempts.

When creating an account, you agree to:
- Provide accurate, current account information.
- Maintain the confidentiality of your login credentials.
- Take responsibility for all activities that occur under your account.
- Promptly notify us via our Contact form if you suspect any unauthorized access or security breach.
`,
  },
  {
    id: "acceptable-use",
    title: "5. Acceptable use",
    content: `
To ensure a safe and productive environment for all learners, you agree not to:
- Attempt to circumvent or breach authentication, security, or access controls.
- Interfere with or disrupt the operation of the platform, servers, or networks.
- Use automated scripts, scrapers, or bots to harvest content or overwhelm the service.
- Upload or transmit malicious code, viruses, or harmful components.
- Impersonate any person or entity or misrepresent your affiliation.
- Submit abusive, harassing, or unlawful content through support forms.
- Use Meritloom for any unlawful or unauthorized commercial purpose.
`,
  },
  {
    id: "learning-content",
    title: "6. Learning content and third-party resources",
    callout: {
      type: "transparency",
      title: "Educational Content Attribution",
      text: "Some lessons embed educational videos from trusted external creators, such as W3Schools on YouTube. Original creators retain full ownership and copyright of their video material.",
    },
    content: `
Meritloom utilizes two types of content:
1. **Meritloom Original Materials:** Course structure, module ordering, lesson summaries, key takeaways, practice quizzes, exercises, and guided learning roadmaps created by Meritloom.
2. **Third-Party Educational Resources:** Videos embedded from YouTube or links to external documentation.

Meritloom provides clear attribution and direct links to original creator sources. Third-party videos remain subject to the availability, policies, and terms of their respective platforms and creators. Meritloom cannot guarantee the permanent uninterrupted availability of externally hosted media.
`,
  },
  {
    id: "intellectual-property",
    title: "7. Intellectual property",
    content: `
The Meritloom brand name, logos, visual design, user interface components, software codebase, original lesson text, and curriculum structure are the intellectual property of Meritloom and are protected by applicable copyright and trademark laws.

You may access and use Meritloom materials solely for personal, non-commercial educational purposes. You may not copy, redistribute, modify, or resell Meritloom's original interface or compilation without prior permission.
`,
  },
  {
    id: "content-you-provide",
    title: "8. Content you provide",
    content: `
You retain ownership of any content you submit to Meritloom, such as your profile display name, uploaded avatar, and contact messages. By submitting content, you grant Meritloom a limited license to host, display, and process that content solely as necessary to operate the relevant feature. You agree not to submit content that violates third-party rights or applicable laws.
`,
  },
  {
    id: "educational-disclaimer",
    title: "9. Educational purpose disclaimer",
    content: `
Meritloom is an independent self-paced educational platform. Unless explicitly stated otherwise:
- Meritloom courses do not grant accredited academic degrees, university credits, or formal professional licenses.
- Completion of courses or learning paths does not guarantee employment, salary increases, or examination results.
- Practice quizzes and checkpoint scores are intended for self-assessment and do not constitute certified professional assessments.
`,
  },
  {
    id: "progress-and-availability",
    title: "10. Progress and availability",
    content: `
We work hard to record your lesson progress and quiz attempts accurately. However, you should not rely on Meritloom as the sole permanent archive of your educational achievements. We recommend that you maintain local copies of project code and personal notes created during your studies.
`,
  },
  {
    id: "third-party-services",
    title: "11. Third-party services",
    content: `
Meritloom integrates with third-party services such as Supabase (for database/auth) and YouTube (for video playback). Your interaction with third-party services is governed by their respective terms of service and privacy policies.
`,
  },
  {
    id: "service-changes",
    title: "12. Changes to Meritloom",
    content: `
We continuously improve Meritloom. We may add new courses, modify curriculum structures, update practice exercises, replace broken third-party videos, or modify features over time. We will endeavor to make changes smoothly without unnecessary disruption to active learners.
`,
  },
  {
    id: "account-restrictions",
    title: "13. Account restrictions",
    content: `
We reserve the right to suspend or terminate accounts that engage in security attacks, automated abuse, violation of acceptable use rules, or unlawful activity on the platform.
`,
  },
  {
    id: "ending-your-account",
    title: "14. Ending your account",
    content: `
You may terminate your account at any time by navigating to **Profile > Account > Delete Account**. Upon deletion, your personal profile data will be removed and your active session will be signed out.
`,
  },
  {
    id: "service-disclaimers",
    title: "15. Disclaimers",
    content: `
Meritloom is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the platform will always be error-free, uninterrupted, or secure.
`,
  },
  {
    id: "liability",
    title: "16. Limitation of liability",
    content: `
To the maximum extent permitted by applicable law, Meritloom and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or goodwill arising out of or in connection with your use of the platform.
`,
  },
  {
    id: "governing-law",
    title: "17. General terms",
    content: `
If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect. These Terms constitute the complete agreement between you and Meritloom regarding the use of the platform.
`,
  },
  {
    id: "terms-changes",
    title: "18. Changes to these terms",
    content: `
We may revise these Terms from time to time. When changes occur, we will update the **Last updated** date at the top of this document. Continued use of Meritloom after changes are published constitutes your acceptance of the revised Terms.
`,
  },
  {
    id: "contact-terms",
    title: "19. Contact",
    content: `
If you have questions regarding these Terms of Service, please reach out through our Contact page.
`,
  },
];

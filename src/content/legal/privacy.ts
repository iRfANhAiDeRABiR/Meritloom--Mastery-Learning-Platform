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

export const PRIVACY_TOC: LegalTOCItem[] = [
  { id: "about-this-policy", title: "1. About this policy" },
  { id: "information-we-collect", title: "2. Information we collect" },
  { id: "what-we-do-not-collect", title: "3. What we do not collect" },
  { id: "how-we-use-information", title: "4. How we use information" },
  { id: "third-party-services", title: "5. Services that help Meritloom operate" },
  { id: "cookies-and-storage", title: "6. Cookies and local storage" },
  { id: "data-visibility", title: "7. Who can see your learning data?" },
  { id: "data-sharing", title: "8. When information may be shared" },
  { id: "data-retention", title: "9. How long information is kept" },
  { id: "your-choices", title: "10. Your choices and controls" },
  { id: "security", title: "11. Security" },
  { id: "children-privacy", title: "12. Children's privacy" },
  { id: "policy-changes", title: "13. Changes to this policy" },
  { id: "contact-privacy", title: "14. Questions about privacy" },
];

export const PRIVACY_SECTIONS: LegalSectionData[] = [
  {
    id: "about-this-policy",
    title: "1. About this policy",
    content: `
This Privacy Policy describes how Meritloom handles information when learners browse courses, create accounts, save progress, complete practice activities, and use learning features.

Meritloom is designed as an accessible, self-paced learning platform. We aim to collect only the information necessary to provide structured courses, save your learning progress, and help you continue your education seamlessly.
`,
  },
  {
    id: "information-we-collect",
    title: "2. Information we collect",
    content: `
Depending on how you interact with Meritloom, we may store the following categories of information:

### Account & Authentication Information
When you create an account, we store:
- Your email address
- Your full or display name
- Your encrypted authentication credentials (managed securely via Supabase Auth)
- Your avatar or profile image selection/upload
- Account creation and last sign-in timestamps

If you sign in using Google OAuth, Google provides basic profile details (such as your verified email address, name, and profile photo) according to the permissions displayed during sign-in. Meritloom never receives or stores your Google password.

### Learning Activity & Progress
When you are signed in, Meritloom records:
- Courses you have started or enrolled in
- Lessons marked as completed
- Your last viewed lesson, so you can resume where you stopped
- Checkpoint quiz attempts, selected answers, and performance scores
- Courses and specific lessons you have bookmarked or saved to your library
- Private lesson study notes and in-browser coding practice drafts so you can resume your work
- Derived Learning Path completion milestones

### Onboarding & Learning Preferences
During onboarding and in your Profile settings, you may optionally provide:
- Your primary learning goal (e.g. explore foundations, practical career skills, or deepen concepts)
- Topics and category interests
- Self-assessed experience level
- Target daily study duration and schedule pace
- Learning reminder preferences

### Support & Contact Inquiries
When you submit a message through our Contact page, we store:
- Your name and email address
- The selected topic and your message details
- Optional page or course URLs you provide for troubleshooting
- Your authenticated learner ID (if signed in at the time of submission)
`,
  },
  {
    id: "what-we-do-not-collect",
    title: "3. What we do not collect",
    callout: {
      type: "transparency",
      title: "No Payment Details Required",
      text: "Because published Meritloom courses and learning paths are free, Meritloom does not request, process, or store credit card numbers, billing addresses, or subscription payment details.",
    },
    content: `
We do not collect unnecessary personal data. Specifically:
- We do not sell your personal information or learning activity to data brokers or advertisers.
- We do not require employment history, academic transcripts, or national identification numbers.
- We do not track you across unrelated third-party websites.
`,
  },
  {
    id: "how-we-use-information",
    title: "4. How we use information",
    content: `
We use the information we collect solely to provide, operate, and maintain Meritloom's educational features:
- **Account Management:** To authenticate your identity and keep your session secure.
- **Learning Continuity:** To remember your completed lessons, calculate course completion percentages, and resume your active lesson when you return.
- **Personalized Recommendations:** To display relevant courses aligned with your onboarding interests and goals.
- **Practice Feedback:** To score checkpoint quizzes, display concept reviews, and allow unlimited retries.
- **Support Communication:** To investigate and respond to bug reports, feedback, and technical questions submitted through our contact form.
- **Security & Reliability:** To monitor technical performance, detect automated abuse, and safeguard platform integrity.
`,
  },
  {
    id: "third-party-services",
    title: "5. Services that help Meritloom operate",
    content: `
Meritloom relies on trusted infrastructure providers to deliver its services:

### Supabase
Meritloom uses **Supabase** for user authentication, PostgreSQL database storage, and avatar image storage. User authentication and learning data are processed through Supabase infrastructure under strict database access controls.

### Google Sign-In
If you choose to register or sign in using Google, Google processes authentication according to the Google Privacy Policy and provides basic profile tokens to Meritloom.

### YouTube Video Embeds
Some Meritloom course lessons include educational video tutorials hosted by YouTube (such as courses created by W3Schools). When you load or play an embedded video, YouTube may process technical information (including your IP address and playback telemetry) in accordance with YouTube's Terms of Service and Google's Privacy Policy. Where possible, Meritloom utilizes privacy-enhanced embed parameters.

### External Educational Links
Course lesson notes and takeaways may link to external documentation (such as MDN Web Docs or W3Schools). Meritloom is not responsible for the privacy practices or content of external websites.
`,
  },
  {
    id: "cookies-and-storage",
    title: "6. Cookies and local storage",
    content: `
Meritloom uses minimal, essential storage mechanisms strictly required for platform functionality:
- **Authentication Cookies:** Secure, encrypted HTTP-only session cookies managed by Supabase to maintain your logged-in state across page navigations.
- **Local Storage:** Used to persist your theme preference (Light or Dark mode) and temporary client-side interface state.

We do not deploy third-party advertising cookies or cross-site tracking pixels.
`,
  },
  {
    id: "data-visibility",
    title: "7. Who can see your learning data?",
    content: `
- **Your Personal Learning Data:** Your course enrollments, lesson completion status, quiz scores, saved bookmarks, and support messages are private to your account and protected by Supabase Row Level Security (RLS).
- **Public Information:** Course titles, lesson summaries, syllabi, and instructor attributions are publicly accessible.
- **Other Learners:** Meritloom does not feature public leaderboards, competitive user rankings, or public profile directories. Other learners cannot view your lesson completion history or quiz attempts.
`,
  },
  {
    id: "data-sharing",
    title: "8. When information may be shared",
    content: `
We do not sell, rent, or trade your personal information. We may disclose information only in the following limited situations:
- **Service Providers:** Infrastructure and hosting providers (e.g. Supabase) who process data strictly on our behalf to operate the service.
- **Legal Requirements:** If required by applicable law, court order, or governmental authority.
- **Protection & Security:** When reasonably necessary to protect the security of Meritloom, prevent fraudulent or abusive activity, or enforce our Terms of Service.
`,
  },
  {
    id: "data-retention",
    title: "9. How long information is kept",
    content: `
We retain your account profile, preferences, and learning progress for as long as your account remains active. If you delete your account, your personal profile data is deleted from our active database, and associated enrollments and lesson records are removed or anonymized in accordance with database cascade constraints.

Support inquiries submitted through our contact form may be retained for a reasonable period to resolve reported issues and improve platform reliability.
`,
  },
  {
    id: "your-choices",
    title: "10. Your choices and controls",
    content: `
You have full control over your data on Meritloom:
- **Edit Profile:** Update your display name and avatar at any time from your Profile settings.
- **Update Preferences:** Adjust your learning goals, experience level, and study pace in Profile > Learning.
- **Remove Saved Courses:** Bookmark or remove courses from your library at /learn/saved.
- **Change Password:** Update your login credentials in Profile > Account.
- **Delete Account:** You can permanently delete your Meritloom account at any time via **Profile > Account > Delete Account**.
`,
  },
  {
    id: "security",
    title: "11. Security",
    content: `
Meritloom employs technical and organizational measures designed to protect your information against unauthorized access, loss, or alteration. These include TLS encryption in transit, secure authentication token handling, and Supabase Row Level Security (RLS) policies enforcing strict data boundaries.

While we strive to use reasonable security practices, no Internet transmission or digital storage system is 100% immune to risk. We encourage you to use a unique, strong password.
`,
  },
  {
    id: "children-privacy",
    title: "12. Children's privacy",
    content: `
Meritloom is built as a general-audience educational platform. We do not knowingly collect personal information directly from young children without parental or guardian oversight. If you believe a child has provided personal information to Meritloom inappropriately, please contact us so we can take steps to remove the information.
`,
  },
  {
    id: "policy-changes",
    title: "13. Changes to this policy",
    content: `
We may update this Privacy Policy from time to time to reflect improvements to Meritloom's features, technology, or legal requirements. When updates occur, we will revise the **Last updated** date at the top of this page. We encourage you to review this policy periodically.
`,
  },
  {
    id: "contact-privacy",
    title: "14. Questions about privacy",
    content: `
If you have questions or concerns about this Privacy Policy or how your data is handled on Meritloom, please send us a message through our Contact page.
`,
  },
];

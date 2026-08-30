import type { Category, CourseDetail, CourseSummary } from "@/lib/types";

export const HTML_FUNDAMENTALS_CATEGORY: Category = {
  id: "cat-web-dev",
  slug: "web-development",
  name: "Web Development",
  courseCount: 1,
};

export const HTML_FUNDAMENTALS_SUMMARY: CourseSummary = {
  id: "course-html-fundamentals",
  slug: "html-fundamentals",
  title: "HTML Fundamentals",
  shortDescription:
    "Learn the foundations of HTML and build well-structured web pages using headings, text, links, images, forms, tables and semantic HTML.",
  difficulty: "beginner",
  estimatedMinutes: 285,
  lessonCount: 20,
  categoryName: "Web Development",
  categorySlug: "web-development",
  thumbnailUrl: null,
  isFree: true,
  instructorName: "Dave Gray",
};

export const HTML_FUNDAMENTALS_COURSE: CourseDetail = {
  id: "course-html-fundamentals",
  slug: "html-fundamentals",
  title: "HTML Fundamentals",
  summary:
    "Learn the foundations of HTML and build well-structured web pages using headings, text, links, images, forms, tables and semantic HTML.",
  description:
    "HTML is the foundation of every website. In this beginner-friendly course, learners will understand how web pages are structured using HTML and gradually build confidence with the most important HTML elements. The course starts with the basic document structure and then covers text, links, images, lists, tables, forms and semantic HTML. Lessons use real video tutorials together with short Meritloom lesson summaries and practice opportunities. No previous web-development experience is required.",
  difficulty: "beginner",
  language: "English",
  estimatedMinutes: 285,
  lessonCount: 20,
  moduleCount: 8,
  isFree: true,
  isPublished: true,
  thumbnailUrl: null,
  category: {
    id: "cat-web-dev",
    name: "Web Development",
    slug: "web-development",
  },
  instructor: {
    id: "inst-dave-gray",
    name: "Dave Gray",
    title: "Web Developer & Educator",
    avatarUrl: null,
    bio: "Dave Gray creates comprehensive, beginner-friendly web development tutorials on YouTube and freeCodeCamp.",
  },
  learningOutcomes: [
    "Understand how HTML structures a webpage",
    "Create a valid HTML document",
    "Work with headings, paragraphs and text formatting",
    "Create links and navigation",
    "Add images and media",
    "Build ordered and unordered lists",
    "Create HTML tables",
    "Build accessible HTML forms",
    "Use semantic HTML elements",
    "Build a complete basic webpage",
  ],
  prerequisites: [
    "No previous coding experience required",
    "Basic computer skills",
    "A modern web browser",
    "A text editor such as VS Code",
  ],
  skills: [
    "HTML",
    "Semantic HTML",
    "HTML Forms",
    "Web Development",
    "Web Accessibility",
    "Web Page Structure",
  ],
  targetAudience: [
    "Beginners who want to start their journey into web development",
    "Learners looking for a clear, hands-on foundation in HTML",
    "Anyone preparing to learn CSS, JavaScript, or modern frontend frameworks",
  ],
  modules: [
    {
      id: "mod-1-getting-started",
      title: "Getting Started with HTML",
      description:
        "Understand what HTML is, set up your development environment in VS Code, and create your first valid HTML5 document.",
      position: 1,
      estimatedMinutes: 38,
      lessonCount: 3,
      lessons: [
        {
          id: "les-1-1-what-is-html",
          slug: "what-is-html-and-editor-setup",
          title: "What is HTML & Setting Up Your Editor",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 19,
          isPreview: true,
          isPublished: true,
        },
        {
          id: "les-1-2-document-structure",
          slug: "html-document-structure-and-head",
          title: "HTML Document Structure & The Head Element",
          lessonType: "video",
          position: 2,
          estimatedMinutes: 9,
          isPreview: false,
          isPublished: true,
        },
        {
          id: "les-1-3-practice-first-doc",
          slug: "practice-create-first-html-document",
          title: "Practice: Create Your First HTML Document",
          lessonType: "practice",
          position: 3,
          estimatedMinutes: 10,
          isPreview: false,
          isPublished: true,
        },
      ],
    },
    {
      id: "mod-2-text-structure",
      title: "Text & Content Structure",
      description:
        "Master headings, paragraphs, horizontal rules, line breaks, and semantic text formatting tags.",
      position: 2,
      estimatedMinutes: 35,
      lessonCount: 3,
      lessons: [
        {
          id: "les-2-1-headings-paragraphs",
          slug: "headings-paragraphs-text-formatting",
          title: "Headings, Paragraphs & Text Formatting",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 20,
          isPreview: false,
          isPublished: true,
        },
        {
          id: "les-2-2-comments",
          slug: "html-comments-and-readability",
          title: "HTML Comments & Code Readability",
          lessonType: "article",
          position: 2,
          estimatedMinutes: 5,
          isPreview: false,
          isPublished: true,
        },
        {
          id: "les-2-3-practice-article",
          slug: "practice-structuring-article",
          title: "Practice: Structuring an Article with Headings & Paragraphs",
          lessonType: "practice",
          position: 3,
          estimatedMinutes: 10,
          isPreview: false,
          isPublished: true,
        },
      ],
    },
    {
      id: "mod-3-lists-tables",
      title: "Lists & Tables",
      description:
        "Organize items and tabular data using unordered lists, ordered lists, nested lists, and accessible data tables.",
      position: 3,
      estimatedMinutes: 38,
      lessonCount: 3,
      lessons: [
        {
          id: "les-3-1-lists",
          slug: "ordered-unordered-nested-lists",
          title: "Ordered, Unordered & Nested Lists",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 10,
          isPreview: false,
          isPublished: true,
        },
        {
          id: "les-3-2-tables",
          slug: "creating-and-structuring-html-tables",
          title: "Creating & Structuring HTML Tables",
          lessonType: "video",
          position: 2,
          estimatedMinutes: 16,
          isPreview: false,
          isPublished: true,
        },
        {
          id: "les-3-3-practice-tables",
          slug: "practice-build-schedule-table",
          title: "Practice: Build a Student Schedule Table",
          lessonType: "practice",
          position: 3,
          estimatedMinutes: 12,
          isPreview: false,
          isPublished: true,
        },
      ],
    },
    {
      id: "mod-4-links-nav",
      title: "Links & Navigation",
      description:
        "Master hyperlinks, page navigation, absolute vs relative paths, in-page bookmarks, and security attributes.",
      position: 4,
      estimatedMinutes: 46,
      lessonCount: 3,
      lessons: [
        {
          id: "les-4-1-anchor-links",
          slug: "anchor-elements-and-page-links",
          title: "Anchor Elements & Page Links",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 30,
          isPreview: false,
          isPublished: true,
        },
        {
          id: "les-4-2-relative-urls",
          slug: "relative-vs-absolute-urls",
          title: "Relative vs Absolute URLs Explained",
          lessonType: "article",
          position: 2,
          estimatedMinutes: 6,
          isPreview: false,
          isPublished: true,
        },
        {
          id: "les-4-3-practice-nav",
          slug: "practice-build-navigation-bar",
          title: "Practice: Build a Multi-Page Navigation Bar",
          lessonType: "practice",
          position: 3,
          estimatedMinutes: 10,
          isPreview: false,
          isPublished: true,
        },
      ],
    },
    {
      id: "mod-5-images-media",
      title: "Images & Media",
      description:
        "Learn how to embed images, audio, and video with accessible alternative text, figures, and dimensions.",
      position: 5,
      estimatedMinutes: 48,
      lessonCount: 3,
      lessons: [
        {
          id: "les-5-1-images-alt",
          slug: "adding-images-alt-text-figures",
          title: "Adding Images, Alt Text & Accessible Figures",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 30,
          isPreview: false,
          isPublished: true,
        },
        {
          id: "les-5-2-image-a11y",
          slug: "image-accessibility-best-practices",
          title: "Image Best Practices & Accessibility Basics",
          lessonType: "article",
          position: 2,
          estimatedMinutes: 8,
          isPreview: false,
          isPublished: true,
        },
        {
          id: "les-5-3-practice-images",
          slug: "practice-product-showcase-images",
          title: "Practice: Build a Product Showcase with Images",
          lessonType: "practice",
          position: 3,
          estimatedMinutes: 10,
          isPreview: false,
          isPublished: true,
        },
      ],
    },
    {
      id: "mod-6-semantic-html",
      title: "Semantic HTML5",
      description:
        "Understand landmark layout tags including header, nav, main, section, article, aside, and footer.",
      position: 6,
      estimatedMinutes: 43,
      lessonCount: 3,
      lessons: [
        {
          id: "les-6-1-semantic-layout",
          slug: "semantic-html5-layout-elements",
          title: "Semantic HTML5 Layout Elements",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 24,
          isPreview: false,
          isPublished: true,
        },
        {
          id: "les-6-2-why-semantic",
          slug: "why-semantic-html-matters",
          title: "Why Semantic HTML Matters for SEO & Accessibility",
          lessonType: "article",
          position: 2,
          estimatedMinutes: 7,
          isPreview: false,
          isPublished: true,
        },
        {
          id: "les-6-3-practice-semantic",
          slug: "practice-refactor-to-semantic-html",
          title: "Practice: Refactor a Non-Semantic Page to Semantic HTML",
          lessonType: "practice",
          position: 3,
          estimatedMinutes: 12,
          isPreview: false,
          isPublished: true,
        },
      ],
    },
    {
      id: "mod-7-forms",
      title: "HTML Forms & User Input",
      description:
        "Build forms, inputs, labels, textareas, selects, radio buttons, checkboxes, fieldsets, and accessible validation.",
      position: 7,
      estimatedMinutes: 67,
      lessonCount: 3,
      lessons: [
        {
          id: "les-7-1-form-controls",
          slug: "building-forms-inputs-and-controls",
          title: "Building Forms, Inputs & Form Controls",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 44,
          isPreview: false,
          isPublished: true,
        },
        {
          id: "les-7-2-form-validation",
          slug: "accessible-form-validation",
          title: "Accessible Form Validation & Input Types",
          lessonType: "article",
          position: 2,
          estimatedMinutes: 8,
          isPreview: false,
          isPublished: true,
        },
        {
          id: "les-7-3-practice-forms",
          slug: "practice-user-registration-form",
          title: "Practice: Build a User Registration & Feedback Form",
          lessonType: "practice",
          position: 3,
          estimatedMinutes: 15,
          isPreview: false,
          isPublished: true,
        },
      ],
    },
    {
      id: "mod-8-capstone",
      title: "Capstone Project: Build Your First Website",
      description:
        "Combine everything you learned to build a complete multi-section restaurant or personal portfolio webpage using pure HTML.",
      position: 8,
      estimatedMinutes: 67,
      lessonCount: 2,
      lessons: [
        {
          id: "les-8-1-taco-shop-walkthrough",
          slug: "project-walkthrough-little-taco-shop",
          title: "Project Walkthrough: The Little Taco Shop Webpage",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 42,
          isPreview: false,
          isPublished: true,
        },
        {
          id: "les-8-2-personal-profile-capstone",
          slug: "capstone-build-personal-profile-webpage",
          title: "Capstone: Build Your Personal Profile Webpage",
          lessonType: "practice",
          position: 2,
          estimatedMinutes: 25,
          isPreview: false,
          isPublished: true,
        },
      ],
    },
  ],
};

export const HTML_LESSON_DETAILS_MAP: Record<
  string,
  {
    videoUrl?: string | null;
    keyTakeaway: string;
    summary: string;
    objectives: string[];
    content: string;
  }
> = {
  "what-is-html-and-editor-setup": {
    videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=55s",
    keyTakeaway:
      "HTML (HyperText Markup Language) describes the structure of web pages using elements denoted by tags.",
    summary:
      "Discover what HTML is, how it works in the browser, and how to set up Visual Studio Code with the Live Server extension for web development.",
    objectives: [
      "Understand what HTML is and how browsers interpret markup",
      "Install and configure Visual Studio Code for web development",
      "Use the Live Server extension for instant browser reloading",
    ],
    content: `## Introduction to Web Development

HTML stands for **HyperText Markup Language**. It is the standard markup language used to structure content on the web. Every web page you visit—from news websites to video platforms—relies on HTML as its structural backbone.

### Essential Tools

To begin coding HTML, you only need two tools:

1. **A Code Editor**: We recommend [Visual Studio Code (VS Code)](https://code.visualstudio.com/), a free and powerful editor.
2. **A Web Browser**: Google Chrome, Firefox, Safari, or Microsoft Edge.

### Recommended VS Code Extensions

- **Live Server**: Enables a local development server with live browser reload as soon as you save your files.
- **Prettier**: Automatically formats your HTML markup for maximum readability.`,
  },
  "html-document-structure-and-head": {
    videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=1213s",
    keyTakeaway:
      "The <head> element contains metadata about the webpage, while the <body> element contains the visible content.",
    summary:
      "Understand the boilerplate anatomy of an HTML5 document including <!DOCTYPE html>, <html>, <head>, <meta>, <title>, and <body> tags.",
    objectives: [
      "Declare a standard HTML5 <!DOCTYPE html> doctype",
      "Configure character encoding with <meta charset=\"UTF-8\">",
      "Set an accessible browser page title with <title>",
    ],
    content: `## The Anatomy of an HTML Document

Every standard HTML5 document follows a clear, predictable structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    <p>Welcome to web development with Meritloom.</p>
  </body>
</html>
\`\`\`

### Breakdown of Key Elements

- \`<!DOCTYPE html>\`: Informs the browser that this document is HTML5.
- \`<html lang="en">\`: The root element wrapping the whole document, specifying English as the primary language.
- \`<head>\`: Container for document metadata that is not directly rendered on the page.
- \`<meta charset="UTF-8">\`: Specifies the UTF-8 character encoding covering almost all human languages.
- \`<title>\`: Defines the document title displayed in the browser tab and search results.
- \`<body>\`: Contains all visible elements (headings, text, images, buttons).`,
  },
  "practice-create-first-html-document": {
    videoUrl: null,
    keyTakeaway:
      "Every valid HTML page begins with <!DOCTYPE html> followed by <html>, <head>, and <body> tags.",
    summary:
      "Write a clean, valid HTML5 boilerplate document from scratch and preview it in your browser.",
    objectives: [
      "Write a complete HTML5 boilerplate from scratch",
      "Verify proper element nesting and tag closures",
      "View the rendered page in a browser",
    ],
    content: `## Exercise: Build Your First HTML Page

In this exercise, you will create a new HTML file called \`index.html\` on your computer.

### Instructions

1. Open VS Code and create a new project folder named \`my-first-website\`.
2. Inside the folder, create a file named \`index.html\`.
3. Type the complete HTML5 document structure without using Emmet shortcuts.
4. Set the page \`<title>\` to **"Learner Profile | Meritloom"**.
5. Inside the \`<body>\`, add an \`<h1>\` heading with your name and a \`<p>\` paragraph describing your learning goals.
6. Open the file in your browser using Live Server or by double-clicking the file.

### Expected Solution

\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Learner Profile | Meritloom</title>
  </head>
  <body>
    <h1>Alex Mercer</h1>
    <p>I am learning HTML on Meritloom to build accessible, modern websites.</p>
  </body>
</html>
\`\`\``,
  },
  "headings-paragraphs-text-formatting": {
    videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=1742s",
    keyTakeaway:
      "Maintain a single <h1> per page and nest headings sequentially without skipping levels for accessibility and SEO.",
    summary:
      "Learn how to structure readable content using heading levels (h1 through h6), paragraphs, line breaks, horizontal rules, and semantic text formatting.",
    objectives: [
      "Apply heading levels h1 through h6 in hierarchical order",
      "Format text using <p>, <hr>, <br>, <strong>, and <em>",
      "Distinguish between visual formatting and semantic meaning",
    ],
    content: `## Heading Hierarchy & Formatting

HTML provides 6 levels of headings: \`<h1>\` through \`<h6>\`. \`<h1>\` is the most important heading on the page, representing the primary topic.

### Formatting Tags

- \`<strong>\`: Represents strong importance or urgency (typically rendered bold).
- \`<em>\`: Represents stress emphasis (typically rendered italic).
- \`<hr>\`: Represents a thematic break or transition between topics.
- \`<br>\`: Inserts a line break inside a paragraph or poem.

\`\`\`html
<h1>Web Development Fundamentals</h1>
<p>HTML is <strong>essential</strong> for all web builders.</p>
<hr>
<h2>Getting Started</h2>
<p>Practice every day to build <em>lasting</em> confidence.</p>
\`\`\``,
  },
  "html-comments-and-readability": {
    videoUrl: null,
    keyTakeaway:
      "HTML comments are ignored by the browser parser but remain visible in page source code.",
    summary:
      "Learn how to use HTML comments <!-- comment --> to annotate sections, leave notes for developers, and organize complex templates.",
    objectives: [
      "Write single-line and multi-line HTML comments",
      "Use comments to document page sections effectively",
    ],
    content: `## Writing Comments in HTML

Comments are snippets of text inside your HTML file that are ignored by the web browser when rendering the page.

### Syntax

\`\`\`html
<!-- This is a single line HTML comment -->

<!--
  Multi-line comments are helpful
  for explaining large blocks of code
  or leaving developer notes.
-->
\`\`\`

### Best Practices

- Use comments to indicate the start and end of major page sections (e.g. \`<!-- START: Main Navigation -->\`).
- Never put sensitive information (passwords, private API keys) in HTML comments, as anyone can view page source.`,
  },
  "practice-structuring-article": {
    videoUrl: null,
    keyTakeaway:
      "Clear visual and semantic hierarchy makes content easier to navigate for both screen readers and human readers.",
    summary:
      "Format a multi-section article using sequential headings, paragraphs, and emphasis tags.",
    objectives: [
      "Build an article with h1, h2, and h3 headings",
      "Format key terms using <strong> and <em>",
      "Validate proper tag nesting",
    ],
    content: `## Exercise: Build an Article Structure

Create a new file \`article.html\` and structure a blog post about learning web development.

### Requirements

- One main \`<h1>\` title
- Two sections each introduced by an \`<h2>\` heading
- At least 3 \`<p>\` paragraphs containing \`<strong>\` and \`<em>\` tags
- An \`<hr>\` divider between sections

\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>The Journey into Code</title>
  </head>
  <body>
    <h1>The Journey into Code</h1>
    <p>Starting out in programming feels <strong>exciting</strong> yet challenging.</p>
    <hr>
    <h2>Why HTML Matters</h2>
    <p>Without HTML, there is <em>no structure</em> to display on the web.</p>
  </body>
</html>
\`\`\``,
  },
  "ordered-unordered-nested-lists": {
    videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=2985s",
    keyTakeaway:
      "Use <ol> when sequence matters and <ul> when items are non-sequential. Always place <li> elements directly inside <ul> or <ol>.",
    summary:
      "Explore unordered lists (<ul>), ordered lists (<ol>), list items (<li>), and description lists (<dl>) along with list nesting.",
    objectives: [
      "Create numbered ordered lists and bulleted unordered lists",
      "Build multi-level nested lists",
      "Create description lists with <dl>, <dt>, and <dd>",
    ],
    content: `## Lists in HTML

Lists allow you to group related items clearly.

### Unordered Lists (\`<ul>\`)

Used when the order of list items does not affect the meaning:

\`\`\`html
<ul>
  <li>HTML5</li>
  <li>CSS3</li>
  <li>JavaScript</li>
</ul>
\`\`\`

### Ordered Lists (\`<ol>\`)

Used for step-by-step instructions or ranked items:

\`\`\`html
<ol>
  <li>Install code editor</li>
  <li>Write HTML boilerplate</li>
  <li>Preview in browser</li>
</ol>
\`\`\`

### Nested Lists

Lists can be nested inside an \`<li>\` element to create sub-menus or hierarchical outlines.`,
  },
  "creating-and-structuring-html-tables": {
    videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=8693s",
    keyTakeaway:
      "Use <th> elements with the scope attribute to provide accessible headers for rows and columns in tabular data.",
    summary:
      "Learn how to present structured tabular data using <table>, <caption>, <thead>, <tbody>, <tr>, <th>, and <td> elements.",
    objectives: [
      "Structure tables with <thead>, <tbody>, and <tfoot>",
      "Define accessible row and column headers with <th scope=\"...\">",
      "Merge cells using colspan and rowspan attributes",
    ],
    content: `## Tabular Data in HTML

HTML tables present information in a grid of rows and columns.

\`\`\`html
<table>
  <caption>Weekly Learning Schedule</caption>
  <thead>
    <tr>
      <th scope="col">Day</th>
      <th scope="col">Topic</th>
      <th scope="col">Duration</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Monday</td>
      <td>HTML Basics</td>
      <td>45 min</td>
    </tr>
    <tr>
      <td>Tuesday</td>
      <td>Links & Lists</td>
      <td>45 min</td>
    </tr>
  </tbody>
</table>
\`\`\`

### Essential Table Elements

- \`<table>\`: The wrapper for all table content.
- \`<caption>\`: Describes the table purpose for accessibility.
- \`<thead>\` & \`<tbody>\`: Separate table header rows from data body rows.
- \`<tr>\`: Table row.
- \`<th>\`: Header cell with \`scope="col"\` or \`scope="row"\`.
- \`<td>\`: Standard data cell.`,
  },
  "practice-build-schedule-table": {
    videoUrl: null,
    keyTakeaway:
      "Tables should strictly be used for tabular data, never for general page layouts.",
    summary:
      "Construct an accessible weekly class schedule table with proper headings, captions, and merged cells.",
    objectives: [
      "Create a multi-column table with a descriptive <caption>",
      "Use <thead> and <tbody> blocks properly",
      "Implement colspan or rowspan to represent spanning schedule blocks",
    ],
    content: `## Exercise: Course Schedule Table

Create an HTML file \`schedule.html\` containing an accessible table.

### Checklist

1. Include a descriptive \`<caption>\`
2. Define a \`<thead>\` with column header cells (\`<th scope="col">\`)
3. Include at least 4 rows in \`<tbody>\`
4. Use \`colspan="2"\` to span a lunch break across multiple columns

\`\`\`html
<table>
  <caption>Meritloom Study Plan</caption>
  <thead>
    <tr>
      <th scope="col">Time</th>
      <th scope="col">Module</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>9:00 AM</td>
      <td>HTML Tables</td>
    </tr>
    <tr>
      <td colspan="2">Break</td>
    </tr>
  </tbody>
</table>
\`\`\``,
  },
  "anchor-elements-and-page-links": {
    videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=3595s",
    keyTakeaway:
      "When opening external links in a new tab with target=\"_blank\", always include rel=\"noopener noreferrer\" for security.",
    summary:
      "Master the anchor element (<a>) to connect pages, link to external sites, create in-page jump links, and configure target=\"_blank\" safely.",
    objectives: [
      "Create links using the href attribute",
      "Link between multiple local HTML files using relative paths",
      "Implement in-page jump navigation using id attributes",
      "Secure external links with rel=\"noopener noreferrer\"",
    ],
    content: `## The Power of the Hyperlink

The web is interconnected through hyperlinks created using the \`<a>\` (anchor) element and the \`href\` attribute.

### External Links

\`\`\`html
<a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">
  Visit MDN Web Docs
</a>
\`\`\`

### Internal Page Links

\`\`\`html
<a href="about.html">About Us</a>
<a href="contact.html">Contact</a>
\`\`\`

### In-Page Jump Links

\`\`\`html
<!-- Link trigger -->
<a href="#faq-section">Jump to FAQ</a>

<!-- Target section -->
<h2 id="faq-section">Frequently Asked Questions</h2>
\`\`\``,
  },
  "relative-vs-absolute-urls": {
    videoUrl: null,
    keyTakeaway:
      "Use relative paths for internal website assets and pages; use absolute URLs for external domains.",
    summary:
      "Understand the vital differences between absolute URLs (full web addresses) and relative file paths (parent, sibling, and subfolder references).",
    objectives: [
      "Navigate up directory trees using ../",
      "Reference files in subdirectories using folder/file.html",
    ],
    content: `## Understanding Paths in Web Development

- **Absolute URLs**: Include the protocol and domain name (e.g. \`https://example.com/about.html\`). Used for external websites.
- **Relative URLs**: Point to a file relative to the current file location on your server.

### Relative Path Cheatsheet

- \`about.html\`: Sibling file in the same folder.
- \`pages/about.html\`: File inside a subfolder named \`pages\`.
- \`../index.html\`: Go up one directory level to find \`index.html\`.`,
  },
  "practice-build-navigation-bar": {
    videoUrl: null,
    keyTakeaway:
      "Wrap website navigation in a semantic <nav> element and use an unordered list (<ul>) for menu items.",
    summary:
      "Construct a multi-page website header navigation bar containing links to Home, About, and Contact pages.",
    objectives: [
      "Group navigation links inside <nav> and <ul>",
      "Connect relative links across multiple pages",
      "Add in-page jump anchor links",
    ],
    content: `## Exercise: Site Navigation Bar

Build a standard navigation header component in HTML.

### Requirements

\`\`\`html
<header>
  <nav aria-label="Main Navigation">
    <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="courses.html">Courses</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
  </nav>
</header>
\`\`\``,
  },
  "adding-images-alt-text-figures": {
    videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=5438s",
    keyTakeaway:
      "Every <img> must have an alt attribute. Provide concise, descriptive text for informative images or alt=\"\" for decorative images.",
    summary:
      "Learn how to embed images using the <img> tag, write descriptive alt text for accessibility, specify width and height, and use <figure> and <figcaption>.",
    objectives: [
      "Embed images with src, alt, width, and height attributes",
      "Write meaningful alt text for screen readers",
      "Wrap captioned images in <figure> and <figcaption>",
      "Prevent layout shifts by specifying aspect ratio dimensions",
    ],
    content: `## Working with Images in HTML

The \`<img>\` element embeds visual graphics into web pages. It is a self-closing void element.

\`\`\`html
<figure>
  <img
    src="images/html-logo.png"
    alt="HTML5 shield logo on orange background"
    width="300"
    height="200"
    loading="lazy"
  >
  <figcaption>Figure 1: Official HTML5 Logo</figcaption>
</figure>
\`\`\`

### Essential Attributes

- \`src\`: Path or URL of the image file.
- \`alt\`: Text equivalent read by screen readers and shown if the image fails to load.
- \`width\` & \`height\`: Prevents Cumulative Layout Shift (CLS) as pages load.
- \`loading="lazy"\`: Defers offscreen image loading until the user scrolls near.`,
  },
  "image-accessibility-best-practices": {
    videoUrl: null,
    keyTakeaway:
      "Using loading=\"lazy\" on below-the-fold images dramatically accelerates initial page load times.",
    summary:
      "Explore modern image formats (WebP, SVG, PNG, JPG), loading=\"lazy\" performance optimization, and Web Content Accessibility Guidelines (WCAG).",
    objectives: [
      "Select appropriate image formats for photos versus logos",
      "Implement native browser lazy loading with loading=\"lazy\"",
    ],
    content: `## Image Optimization & Accessibility

- **Photos**: Use WebP or JPG for high compression.
- **Icons & Logos**: Use SVG (vector format) for crisp rendering at any resolution.
- **Screenshots**: Use PNG or WebP with lossless compression.`,
  },
  "practice-product-showcase-images": {
    videoUrl: null,
    keyTakeaway:
      "Combining <a> and <img> allows creating accessible clickable image links.",
    summary:
      "Create a responsive product showcase card using <figure>, <figcaption>, descriptive alt text, and linked imagery.",
    objectives: [
      "Wrap an image inside a <figure> element",
      "Add a descriptive <figcaption> with price and details",
      "Ensure all accessibility criteria are met",
    ],
    content: `## Exercise: Product Card

\`\`\`html
<article>
  <figure>
    <a href="product-details.html">
      <img
        src="taco.jpg"
        alt="Two crispy beef tacos topped with fresh salsa and cilantro"
        width="400"
        height="300"
      >
    </a>
    <figcaption>Signature Street Tacos — $9.50</figcaption>
  </figure>
  <p>Fresh handmade corn tortillas with slow-cooked shredded beef.</p>
</article>
\`\`\``,
  },
  "semantic-html5-layout-elements": {
    videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=7258s",
    keyTakeaway:
      "Semantic HTML elements communicate the role and purpose of content to browsers, screen readers, and search engines.",
    summary:
      "Learn why semantic elements like <header>, <nav>, <main>, <article>, <section>, <aside>, and <footer> are superior to generic <div> containers.",
    objectives: [
      "Replace generic <div> tags with semantic HTML5 structural elements",
      "Distinguish between <article> and <section>",
      "Organize main content landmarks with <header>, <main>, and <footer>",
    ],
    content: `## The Power of Semantic HTML

Semantic elements clearly describe their meaning to both the browser and the developer.

### Common Semantic Landmarks

- \`<header>\`: Introductory content or navigation header.
- \`<nav>\`: Major navigation links.
- \`<main>\`: The dominant, unique content of the page (only one \`<main>\` per page).
- \`<article>\`: Self-contained content that could be syndicated (e.g. blog post, product card).
- \`<section>\`: A thematic grouping of content, typically with a heading.
- \`<aside>\`: Tangentially related content (sidebar, related links, callouts).
- \`<footer>\`: Copyright, author info, or secondary links.`,
  },
  "why-semantic-html-matters": {
    videoUrl: null,
    keyTakeaway:
      "Landmark elements allow assistive technology users to quickly jump between main content, navigation, and supplementary info.",
    summary:
      "Examine how screen readers navigate landmark regions and how search engine crawlers rank semantically structured documents.",
    objectives: [
      "Explain accessibility landmark navigation",
      "Understand how semantic structure boosts search engine discoverability",
    ],
    content: `## Accessibility & Search Engine Ranking

Assistive technologies provide shortcut keys (e.g. "D" in NVDA or "R" in VoiceOver) allowing users to leap directly between landmarks.

When a page is composed exclusively of \`<div>\` tags, screen reader users are forced to listen through the entire page linearly.`,
  },
  "practice-refactor-to-semantic-html": {
    videoUrl: null,
    keyTakeaway:
      "Refactoring to semantic tags improves readability and accessibility without requiring CSS changes.",
    summary:
      "Take a legacy div-heavy webpage and refactor it into clean, accessible HTML5 semantic landmarks.",
    objectives: [
      "Identify and replace generic div containers with semantic elements",
      "Validate proper nesting of <main>, <section>, and <article>",
    ],
    content: `## Exercise: Semantic Refactor

\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Semantic Magazine</title>
  </head>
  <body>
    <header>
      <h1>The Code Journal</h1>
      <nav>
        <a href="#latest">Latest Articles</a>
      </nav>
    </header>
    <main>
      <article id="latest">
        <h2>Mastering Semantic HTML</h2>
        <p>Using the right elements elevates your code quality.</p>
      </article>
      <aside>
        <h3>Author Bio</h3>
        <p>Dave Gray is a passionate educator.</p>
      </aside>
    </main>
    <footer>
      <p>&copy; 2026 The Code Journal</p>
    </footer>
  </body>
</html>
\`\`\``,
  },
  "building-forms-inputs-and-controls": {
    videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=9642s",
    keyTakeaway:
      "Always associate every input with a <label> using the for attribute matching the input id.",
    summary:
      "Master HTML forms using <form>, <label>, <input> (text, email, password, number), <textarea>, <select>, radio buttons, checkboxes, and buttons.",
    objectives: [
      "Connect labels to inputs using matching for and id attributes",
      "Work with text, email, tel, password, number, and date input types",
      "Build radio button groups with shared name attributes",
      "Group related fields with <fieldset> and <legend>",
    ],
    content: `## Interactive Forms in HTML

Forms collect user input and submit it to a server.

\`\`\`html
<form action="/submit" method="post">
  <fieldset>
    <legend>Contact Information</legend>
    
    <label for="user-name">Your Name:</label>
    <input type="text" id="user-name" name="name" required>

    <label for="user-email">Email Address:</label>
    <input type="email" id="user-email" name="email" required>
  </fieldset>

  <button type="submit">Submit Form</button>
</form>
\`\`\``,
  },
  "accessible-form-validation": {
    videoUrl: null,
    keyTakeaway:
      "Native HTML5 validation attributes provide immediate accessible feedback without requiring custom JavaScript.",
    summary:
      "Learn how to enforce client-side form validation using required, pattern, min, max, and maxlength attributes.",
    objectives: [
      "Use required, minlength, and maxlength for text constraints",
      "Specify email and URL formats with native input types",
      "Add helpful placeholder and autocomplete attributes",
    ],
    content: `## Built-in HTML5 Form Validation

- \`required\`: Field must not be empty.
- \`minlength\` / \`maxlength\`: String length constraints.
- \`type="email"\` / \`type="url"\`: Built-in syntax format verification.
- \`pattern="[0-9]{3}-[0-9]{4}"\`: Regular expression matching.`,
  },
  "practice-user-registration-form": {
    videoUrl: null,
    keyTakeaway:
      "A well-structured form ensures every interactive control is accessible via keyboard and screen reader.",
    summary:
      "Construct a complete registration form with text inputs, radio selections, dropdown menus, checkboxes, and a submit button.",
    objectives: [
      "Create a form with method=\"post\" and action=\"#\"",
      "Implement <fieldset> and <legend> for personal details",
      "Validate required fields natively",
    ],
    content: `## Exercise: Registration Form

\`\`\`html
<form action="#" method="post">
  <fieldset>
    <legend>Account Details</legend>
    <label for="fullname">Full Name:</label>
    <input type="text" id="fullname" name="fullname" required>
    
    <label for="role">Primary Goal:</label>
    <select id="role" name="role">
      <option value="skills">Build practical skills</option>
      <option value="explore">Explore something new</option>
    </select>
  </fieldset>
  <button type="submit">Sign Up</button>
</form>
\`\`\``,
  },
  "project-walkthrough-little-taco-shop": {
    videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=12316s",
    keyTakeaway:
      "A complete HTML website combines semantic landmarks, accessible media, structured data, and interactive forms into cohesive pages.",
    summary:
      "Watch the full step-by-step project build of the Little Taco Shop website, combining document structure, navigation, images, tables, and forms.",
    objectives: [
      "Plan the multi-page structure of a real-world website",
      "Combine header navigation, article content, hours table, and contact form",
      "Review complete HTML5 best practices in action",
    ],
    content: `## The Capstone Project: Little Taco Shop

In this walkthrough video, Dave Gray builds a complete multi-page HTML website from scratch.

### Features Demonstrated

1. Proper semantic layout (\`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<footer>\`)
2. Internal navigation across multiple pages
3. High-quality accessible images with \`<figure>\` and \`<figcaption>\`
4. Business hours data table
5. Customer feedback and order contact form`,
  },
  "capstone-build-personal-profile-webpage": {
    videoUrl: null,
    keyTakeaway:
      "Writing clean, semantic HTML creates the strong structural backbone that you will style with CSS in the next course.",
    summary:
      "Combine everything you have learned in this course to build your own multi-section personal profile or portfolio webpage using pure semantic HTML.",
    objectives: [
      "Build a complete HTML5 webpage from scratch",
      "Include a header, navigation bar, hero bio, skills list, project table, and contact form",
      "Validate semantic correctness and accessibility without styling",
    ],
    content: `## Capstone Project: Personal Profile Webpage

Congratulations on reaching the final lesson of HTML Fundamentals! Now it is time to build your own complete personal webpage.

### Project Requirements

- [x] Valid \`<!DOCTYPE html>\` and \`<html lang="en">\` structure
- [x] \`<head>\` with descriptive \`<title>\` and UTF-8 charset
- [x] Semantic \`<header>\` with \`<h1>\` and navigation menu
- [x] \`<main>\` section containing:
  - About me biography with \`<strong>\` and \`<em>\` tags
  - Profile image inside \`<figure>\` with descriptive \`alt\` and \`<figcaption>\`
  - Unordered list of your technical skills
  - Table listing projects or coursework completed
  - Accessible contact form with name, email, topic select, and message textarea
- [x] Semantic \`<footer>\` with copyright and social links with \`target="_blank"\` and \`rel="noopener noreferrer"\`

### Next Step: CSS Fundamentals

Once your HTML structure is complete and validated, you will be ready for **Course 2: CSS Fundamentals** to bring your website to life with colors, layouts, and animations!`,
  },
};

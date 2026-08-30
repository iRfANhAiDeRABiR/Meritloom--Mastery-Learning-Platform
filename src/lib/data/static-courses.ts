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
  estimatedMinutes: 110,
  lessonCount: 23,
  categoryName: "Web Development",
  categorySlug: "web-development",
  thumbnailUrl: null,
  isFree: true,
  instructorName: "W3Schools.com",
};

export const HTML_FUNDAMENTALS_COURSE: CourseDetail = {
  id: "course-html-fundamentals",
  slug: "html-fundamentals",
  title: "HTML Fundamentals",
  summary:
    "Learn the foundations of HTML and build well-structured web pages using headings, text, links, images, forms, tables and semantic HTML.",
  description:
    "HTML is the foundation of every website. In this beginner-friendly course powered by the official W3Schools HTML video series, learners will understand how web pages are structured using HTML and gradually build confidence with the most important HTML elements. The course covers HTML basics, text styling, colors, CSS integration, links, images, tables, lists, layout concepts, iframes, scripting, head metadata, and interactive forms. Lessons use real W3Schools video tutorials alongside original Meritloom summaries, takeaways, and learning objectives.",
  difficulty: "beginner",
  language: "English",
  estimatedMinutes: 110,
  lessonCount: 23,
  requiredLessonsCount: 22,
  bonusLessonsCount: 1,
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
    id: "inst-w3schools",
    name: "W3Schools.com",
    title: "Web Learning Platform",
    avatarUrl: null,
    bio: "W3Schools is the world's largest web developer learning platform, creating concise, practical web tutorials.",
  },
  learningOutcomes: [
    "Understand what HTML is and how browsers interpret web documents",
    "Create and edit HTML files using standard text editors",
    "Structure headings, paragraphs, line breaks, and semantic text formatting",
    "Work with colors, inline styles, and external CSS stylesheets",
    "Create hyperlinks, target attributes, and in-page bookmark anchors",
    "Embed images with accessible alt text and responsive sizing",
    "Build structured HTML tables and nested lists",
    "Understand block vs inline elements, classes, and ID attributes",
    "Embed external content with iframes and link JavaScript scripts",
    "Configure <head> metadata and build interactive HTML forms",
  ],
  prerequisites: [
    "No previous coding experience required",
    "Basic computer skills",
    "A modern web browser (Chrome, Firefox, Safari, or Edge)",
    "A text editor such as VS Code, Notepad, or TextEdit",
  ],
  skills: [
    "HTML",
    "HTML Elements",
    "HTML Attributes",
    "HTML Forms",
    "HTML Tables",
    "Web Development",
  ],
  targetAudience: [
    "Beginners who want to start their journey into web development",
    "Learners looking for a clear, hands-on video foundation in HTML",
    "Anyone preparing to learn CSS, JavaScript, or modern frontend frameworks",
  ],
  modules: [
    {
      id: "mod-1-html-basics",
      title: "HTML Basics",
      description:
        "Understand what HTML is, configure text editors, and learn the anatomy of HTML elements and attributes.",
      position: 1,
      estimatedMinutes: 18,
      lessonCount: 4,
      isBonus: false,
      lessons: [
        {
          id: "les-1-1-intro",
          slug: "html-introduction",
          title: "HTML - Introduction",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 5,
          isPreview: true,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "it1rTvBcfRg",
        },
        {
          id: "les-1-2-editors",
          slug: "html-editors",
          title: "HTML - Editors",
          lessonType: "video",
          position: 2,
          estimatedMinutes: 4,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "bBP0ckEln4Y",
        },
        {
          id: "les-1-3-elements",
          slug: "html-elements",
          title: "HTML - Elements",
          lessonType: "video",
          position: 3,
          estimatedMinutes: 4,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "vIoO52MdZFE",
        },
        {
          id: "les-1-4-attributes",
          slug: "html-attributes",
          title: "HTML - Attributes",
          lessonType: "video",
          position: 4,
          estimatedMinutes: 5,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "yMX901oVtn8",
        },
      ],
    },
    {
      id: "mod-2-text-styling",
      title: "Text & Basic Styling",
      description:
        "Master headings, paragraphs, inline styles, text formatting tags, and developer comments.",
      position: 2,
      estimatedMinutes: 21,
      lessonCount: 5,
      isBonus: false,
      lessons: [
        {
          id: "les-2-1-headings",
          slug: "html-headings",
          title: "HTML - Headings",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 4,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "9gHPpwq6IaY",
        },
        {
          id: "les-2-2-paragraphs",
          slug: "html-paragraphs",
          title: "HTML - Paragraphs",
          lessonType: "video",
          position: 2,
          estimatedMinutes: 4,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "qis4kAOThLw",
        },
        {
          id: "les-2-3-styles",
          slug: "html-styles",
          title: "HTML - Styles",
          lessonType: "video",
          position: 3,
          estimatedMinutes: 5,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "twdNPJfbj_8",
        },
        {
          id: "les-2-4-formatting",
          slug: "html-formatting",
          title: "HTML - Formatting",
          lessonType: "video",
          position: 4,
          estimatedMinutes: 5,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "7FqQLqNIEY8",
        },
        {
          id: "les-2-5-comments",
          slug: "html-comments",
          title: "HTML - Comments",
          lessonType: "video",
          position: 5,
          estimatedMinutes: 3,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "229HYq40vaA",
        },
      ],
    },
    {
      id: "mod-3-colors-css-links",
      title: "Colors, CSS & Links",
      description:
        "Learn color representation formats, linking CSS stylesheets, and creating hyperlinks and bookmark anchors.",
      position: 3,
      estimatedMinutes: 17,
      lessonCount: 3,
      isBonus: false,
      lessons: [
        {
          id: "les-3-1-colors",
          slug: "html-colors",
          title: "HTML - Colors",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 5,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "zCrolmdqmF8",
        },
        {
          id: "les-3-2-css",
          slug: "html-css",
          title: "HTML - CSS",
          lessonType: "video",
          position: 2,
          estimatedMinutes: 6,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "cZHp-Oozg6I",
        },
        {
          id: "les-3-3-links",
          slug: "html-links",
          title: "HTML - Links",
          lessonType: "video",
          position: 3,
          estimatedMinutes: 6,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "HA6bByKdAQM",
        },
      ],
    },
    {
      id: "mod-4-images-data-structure",
      title: "Images & Data Structure",
      description:
        "Embed images with accessible alt text, present tabular data with tables, and organize items into ordered and unordered lists.",
      position: 4,
      estimatedMinutes: 18,
      lessonCount: 3,
      isBonus: false,
      lessons: [
        {
          id: "les-4-1-images",
          slug: "html-images",
          title: "HTML - Images",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 6,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "FmoYRiepmOE",
        },
        {
          id: "les-4-2-tables",
          slug: "html-tables",
          title: "HTML - Tables",
          lessonType: "video",
          position: 2,
          estimatedMinutes: 7,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "e62D-aayveY",
        },
        {
          id: "les-4-3-lists",
          slug: "html-lists",
          title: "HTML - Lists",
          lessonType: "video",
          position: 3,
          estimatedMinutes: 5,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "-QuK8taGLCs",
        },
      ],
    },
    {
      id: "mod-5-layout-concepts",
      title: "HTML Layout Concepts",
      description:
        "Understand block vs inline element behavior and use class and id attributes for styling and targeting.",
      position: 5,
      estimatedMinutes: 14,
      lessonCount: 3,
      isBonus: false,
      lessons: [
        {
          id: "les-5-1-block-inline",
          slug: "html-block-inline",
          title: "HTML - Block and Inline",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 5,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "M4n-WSkehmI",
        },
        {
          id: "les-5-2-classes",
          slug: "html-classes",
          title: "HTML - Classes",
          lessonType: "video",
          position: 2,
          estimatedMinutes: 5,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "tWIkDOJo0Ts",
        },
        {
          id: "les-5-3-id",
          slug: "html-id",
          title: "HTML - Id",
          lessonType: "video",
          position: 3,
          estimatedMinutes: 4,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "rZ0k516qZmc",
        },
      ],
    },
    {
      id: "mod-6-embedding-scripting",
      title: "Embedding & Scripting",
      description:
        "Embed external pages with iframes and connect client-side JavaScript for dynamic behavior.",
      position: 6,
      estimatedMinutes: 10,
      lessonCount: 2,
      isBonus: false,
      lessons: [
        {
          id: "les-6-1-iframes",
          slug: "html-iframes",
          title: "HTML - Iframes",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 5,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "qP23O70ve7k",
        },
        {
          id: "les-6-2-javascript",
          slug: "html-javascript",
          title: "HTML - JavaScript",
          lessonType: "video",
          position: 2,
          estimatedMinutes: 5,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "uSgcWDkwc3U",
        },
      ],
    },
    {
      id: "mod-7-metadata-forms",
      title: "Page Metadata & Forms",
      description:
        "Configure <head> document metadata and build accessible user input forms with common controls.",
      position: 7,
      estimatedMinutes: 12,
      lessonCount: 2,
      isBonus: false,
      lessons: [
        {
          id: "les-7-1-head",
          slug: "html-head",
          title: "HTML - Head",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 5,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "WeuVX5x2MJE",
        },
        {
          id: "les-7-2-forms",
          slug: "html-forms",
          title: "HTML - Forms",
          lessonType: "video",
          position: 2,
          estimatedMinutes: 7,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "VLeERv_dR6Q",
        },
      ],
    },
    {
      id: "mod-8-bonus",
      title: "Bonus",
      description:
        "Optional behind-the-scenes bloopers from the W3Schools HTML tutorial recording.",
      position: 8,
      estimatedMinutes: 3,
      lessonCount: 1,
      isBonus: true,
      lessons: [
        {
          id: "les-8-1-bloopers",
          slug: "html-bloopers",
          title: "HTML - Bloopers",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 3,
          isPreview: false,
          isPublished: true,
          isBonus: true,
          youtubeVideoId: "HHxPoYUrSQ0",
        },
      ],
    },
  ],
};

export const HTML_LESSON_DETAILS_MAP: Record<
  string,
  {
    videoPosition: number;
    youtubeVideoId: string;
    videoUrl: string;
    sourceUrl: string;
    sourceChannel: string;
    playlistId: string;
    isBonus: boolean;
    keyTakeaway: string;
    summary: string;
    objectives: string[];
    content: string;
  }
> = {
  "html-introduction": {
    videoPosition: 1,
    youtubeVideoId: "it1rTvBcfRg",
    videoUrl: "https://www.youtube.com/watch?v=it1rTvBcfRg",
    sourceUrl: "https://www.youtube.com/watch?v=it1rTvBcfRg",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "HTML (HyperText Markup Language) is the standard markup language used to create and structure web pages.",
    summary:
      "Learn what HTML is, how HTML tags describe page structure, and how browsers interpret HTML documents.",
    objectives: [
      "Understand what HTML is and how browsers interpret web markup",
      "Learn how tags describe page headings, paragraphs, and links",
      "Identify the basic building blocks of an HTML document",
    ],
    content: `## What is HTML?

HTML stands for **HyperText Markup Language**. It is the standard markup language used by developers worldwide to create and structure content on the web.

### Key Takeaways from W3Schools

1. **HTML describes the structure of web pages**: Using a series of elements, HTML tells the browser how to display content.
2. **HTML Elements**: Elements label pieces of content such as "this is a heading", "this is a paragraph", or "this is a link".
3. **Browser Rendering**: Web browsers (Chrome, Edge, Firefox, Safari) read HTML documents and compose them into visible web pages without showing the raw HTML tags.`,
  },
  "html-editors": {
    videoPosition: 2,
    youtubeVideoId: "bBP0ckEln4Y",
    videoUrl: "https://www.youtube.com/watch?v=bBP0ckEln4Y",
    sourceUrl: "https://www.youtube.com/watch?v=bBP0ckEln4Y",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "You can write HTML in any plain text editor and view the result by opening the .html file in any web browser.",
    summary:
      "Learn how to create, save, and open your first HTML document using a basic text editor or modern code editor.",
    objectives: [
      "Set up a text editor for writing HTML code",
      "Save files properly with the .html extension and UTF-8 encoding",
      "View and test HTML files locally in a web browser",
    ],
    content: `## Writing HTML in Code Editors

A simple text editor is all you need to start learning HTML.

### Step-by-Step Workflow

1. **Open your editor**: Use VS Code, Notepad (Windows), TextEdit (Mac), or any editor of your choice.
2. **Write HTML code**: Add standard document tags like \`<!DOCTYPE html>\`, \`<html>\`, \`<head>\`, and \`<body>\`.
3. **Save the file**: Save the file as \`index.html\` and ensure the encoding is set to UTF-8.
4. **View in browser**: Double-click the saved file or drag it into your browser to view your live webpage.`,
  },
  "html-elements": {
    videoPosition: 3,
    youtubeVideoId: "vIoO52MdZFE",
    videoUrl: "https://www.youtube.com/watch?v=vIoO52MdZFE",
    sourceUrl: "https://www.youtube.com/watch?v=vIoO52MdZFE",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "An HTML element is defined by a start tag, content, and an end tag. Elements can be nested inside one another.",
    summary:
      "Understand HTML elements, opening and closing tags, nested element hierarchies, and empty self-closing elements.",
    objectives: [
      "Understand the anatomy of an HTML element (start tag, content, end tag)",
      "Learn the rules for correctly nesting elements",
      "Identify empty elements like <br> that do not have a closing tag",
    ],
    content: `## Anatomy of an HTML Element

An HTML element usually consists of a **start tag** and an **end tag**, with the content inserted in between:

\`\`\`html
<tagname>Content goes here...</tagname>
\`\`\`

### Nested Elements & Empty Elements

- **Nested Elements**: HTML elements can contain other elements. For example, \`<body>\` contains \`<h1>\` and \`<p>\`.
- **Empty Elements**: Some HTML elements have no content and no closing tag, such as \`<br>\` for line breaks.`,
  },
  "html-attributes": {
    videoPosition: 4,
    youtubeVideoId: "yMX901oVtn8",
    videoUrl: "https://www.youtube.com/watch?v=yMX901oVtn8",
    sourceUrl: "https://www.youtube.com/watch?v=yMX901oVtn8",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "HTML attributes always appear in the opening tag as name=\"value\" pairs, providing extra details or behavior.",
    summary:
      "Learn how attributes add additional information, links, dimensions, and styling to HTML elements.",
    objectives: [
      "Understand how attributes modify HTML elements",
      "Learn common attributes like href, src, alt, width, and style",
      "Follow best practices by using lowercase attribute names and quotes",
    ],
    content: `## What are HTML Attributes?

Attributes provide additional information about HTML elements.

### Important Attribute Rules

- All HTML elements can have attributes.
- Attributes are always specified in the **start tag**.
- Attributes usually come in name/value pairs like: \`name="value"\`.

### Common Examples

- \`href\`: Specifies the URL for a link (\`<a href="https://w3schools.com">\`).
- \`src\`: Specifies the path to an image (\`<img src="img.jpg">\`).
- \`alt\`: Specifies alternate text for an image if it cannot be displayed.`,
  },
  "html-headings": {
    videoPosition: 5,
    youtubeVideoId: "9gHPpwq6IaY",
    videoUrl: "https://www.youtube.com/watch?v=9gHPpwq6IaY",
    sourceUrl: "https://www.youtube.com/watch?v=9gHPpwq6IaY",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "Use headings to show document hierarchy (h1 through h6), not merely to make text bigger or bolder.",
    summary:
      "Master heading levels from <h1> to <h6> to establish clear hierarchical structure and improve accessibility and SEO.",
    objectives: [
      "Use heading tags from <h1> (most important) to <h6> (least important)",
      "Understand why heading structure is critical for search engines and screen readers",
      "Maintain a single main <h1> per page for semantic clarity",
    ],
    content: `## HTML Headings

HTML headings are defined with the \`<h1>\` to \`<h6>\` tags.

\`\`\`html
<h1>Heading 1 - Most Important</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6 - Least Important</h6>
\`\`\`

### Best Practices

- Search engines use headings to index the structure and content of your web pages.
- Users often skim a page by its headings. Always structure headings hierarchically without skipping levels.`,
  },
  "html-paragraphs": {
    videoPosition: 6,
    youtubeVideoId: "qis4kAOThLw",
    videoUrl: "https://www.youtube.com/watch?v=qis4kAOThLw",
    sourceUrl: "https://www.youtube.com/watch?v=qis4kAOThLw",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "Browsers automatically add margin around <p> elements and collapse multiple spaces into a single space.",
    summary:
      "Learn how to structure body text using paragraph tags (<p>), line breaks (<br>), and thematic dividers (<hr>).",
    objectives: [
      "Define paragraphs using the <p> tag",
      "Insert line breaks with <br> and thematic horizontal rules with <hr>",
      "Understand how browsers handle whitespace and line wrapping",
    ],
    content: `## Paragraphs in HTML

The HTML \`<p>\` element defines a paragraph.

\`\`\`html
<p>This is a paragraph of text.</p>
<p>This is another paragraph with a line break<br>right here.</p>
<hr>
<p>The hr tag above creates a thematic horizontal divider.</p>
\`\`\`

### Whitespace Handling

In HTML, consecutive spaces and newlines are collapsed into a single space by default. Use \`<br>\` when you need an explicit line break.`,
  },
  "html-styles": {
    videoPosition: 7,
    youtubeVideoId: "twdNPJfbj_8",
    videoUrl: "https://www.youtube.com/watch?v=twdNPJfbj_8",
    sourceUrl: "https://www.youtube.com/watch?v=twdNPJfbj_8",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "The style attribute allows adding CSS rules directly inside an element tag using property:value syntax.",
    summary:
      "Explore the HTML style attribute to apply inline CSS properties including color, background-color, font-family, and text-align.",
    objectives: [
      "Use the style attribute to customize element presentation",
      "Set text colors, background colors, and font sizes",
      "Apply text alignment with text-align: center",
    ],
    content: `## The HTML Style Attribute

The HTML \`style\` attribute is used to add styles to an element, such as color, font, size, and more.

\`\`\`html
<p style="color:red;">I am a red paragraph.</p>
<p style="color:blue; font-size:20px;">I am a blue paragraph with 20px font.</p>
<body style="background-color:powderblue;">
\`\`\`

### Syntax Structure

The syntax is \`style="property:value;"\`. You can specify multiple properties separated by semicolons.`,
  },
  "html-formatting": {
    videoPosition: 8,
    youtubeVideoId: "7FqQLqNIEY8",
    videoUrl: "https://www.youtube.com/watch?v=7FqQLqNIEY8",
    sourceUrl: "https://www.youtube.com/watch?v=7FqQLqNIEY8",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "Use <strong> for strong importance and <em> for stress emphasis rather than purely visual <b> or <i> tags.",
    summary:
      "Learn semantic and visual text formatting tags like <strong>, <em>, <mark>, <small>, <del>, <ins>, <sub>, and <sup>.",
    objectives: [
      "Format important text with <strong> and <em>",
      "Highlight keywords with <mark> and represent edits with <del> and <ins>",
      "Format formulas and footnotes with <sub> and <sup>",
    ],
    content: `## HTML Text Formatting Elements

HTML contains several elements for defining text with special meaning and formatting:

- \`<strong>\`: Important text (semantic bold)
- \`<em>\`: Emphasized text (semantic italics)
- \`<mark>\`: Highlighted text
- \`<small>\`: Smaller side comments
- \`<del>\`: Deleted/struck-through text
- \`<ins>\`: Inserted/underlined text
- \`<sub>\` and \`<sup>\`: Subscript and superscript text (e.g. H<sub>2</sub>O or x<sup>2</sup>)`,
  },
  "html-comments": {
    videoPosition: 9,
    youtubeVideoId: "229HYq40vaA",
    videoUrl: "https://www.youtube.com/watch?v=229HYq40vaA",
    sourceUrl: "https://www.youtube.com/watch?v=229HYq40vaA",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "HTML comments (<!-- comment -->) are ignored by the browser renderer but remain visible in the page source.",
    summary:
      "Learn how to write single-line and multi-line comments in HTML to document your code and troubleshoot layouts.",
    objectives: [
      "Write comments using <!-- and --> syntax",
      "Use comments to organize sections and document complex markup",
      "Temporarily comment out code blocks during debugging",
    ],
    content: `## HTML Comments

Comments are not displayed by the browser, but they can help document your HTML source code.

\`\`\`html
<!-- This is a single line comment -->

<!--
  This is a multi-line comment.
  Great for explaining sections of your layout.
-->
\`\`\`

### Developer Tip

You can also use comments to quickly hide portions of HTML code for debugging purposes without permanently deleting them.`,
  },
  "html-colors": {
    videoPosition: 10,
    youtubeVideoId: "zCrolmdqmF8",
    videoUrl: "https://www.youtube.com/watch?v=zCrolmdqmF8",
    sourceUrl: "https://www.youtube.com/watch?v=zCrolmdqmF8",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "Colors can be specified by predefined names or precise values like HEX (#ff0000) and RGB/RGBA for transparency.",
    summary:
      "Understand how colors are defined in HTML using color names, RGB, HEX, HSL, RGBA, and HSLA values.",
    objectives: [
      "Specify colors using standard color names (e.g. Tomato, DodgerBlue)",
      "Understand RGB and HEX color formats",
      "Control opacity and transparency using RGBA and HSLA values",
    ],
    content: `## Color Representation in HTML

HTML colors are specified with predefined color names, or with RGB, HEX, HSL, RGBA, or HSLA values.

### Color Formats

1. **Color Names**: 140 standard names like \`Tomato\`, \`DodgerBlue\`, \`MediumSeaGreen\`.
2. **RGB**: \`rgb(255, 99, 71)\` defines red, green, and blue intensities between 0 and 255.
3. **HEX**: \`#ff6347\` uses hexadecimal digits \`#RRGGBB\`.
4. **RGBA**: \`rgba(255, 99, 71, 0.5)\` adds an Alpha channel (0.0 to 1.0) for transparency.`,
  },
  "html-css": {
    videoPosition: 11,
    youtubeVideoId: "cZHp-Oozg6I",
    videoUrl: "https://www.youtube.com/watch?v=cZHp-Oozg6I",
    sourceUrl: "https://www.youtube.com/watch?v=cZHp-Oozg6I",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "External stylesheets linked in the <head> element are the standard best practice for styling multi-page websites.",
    summary:
      "Learn the three ways to add CSS styling to HTML: inline styles, internal <style> blocks, and external stylesheets with <link>.",
    objectives: [
      "Compare inline, internal, and external CSS approaches",
      "Link an external stylesheet using <link rel=\"stylesheet\" href=\"...\">",
      "Understand CSS syntax consisting of selectors, properties, and values",
    ],
    content: `## Adding CSS to HTML

CSS stands for **Cascading Style Sheets**. CSS saves a lot of work by controlling the layout of multiple web pages all at once.

### Three Ways to Insert CSS

1. **Inline**: By using the \`style\` attribute inside HTML elements.
2. **Internal**: By using a \`<style>\` element in the \`<head>\` section.
3. **External**: By using a \`<link>\` element in \`<head>\` pointing to an external \`.css\` file (recommended).

\`\`\`html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
\`\`\``,
  },
  "html-links": {
    videoPosition: 12,
    youtubeVideoId: "HA6bByKdAQM",
    videoUrl: "https://www.youtube.com/watch?v=HA6bByKdAQM",
    sourceUrl: "https://www.youtube.com/watch?v=HA6bByKdAQM",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "The <a> tag creates hyperlinks to external sites, other pages on your site, or specific sections on the same page.",
    summary:
      "Master hyperlinks using the <a> tag, the href attribute, link targets, bookmark jump links, and mailto links.",
    objectives: [
      "Create clickable links with the <a href=\"...\"> element",
      "Open links in new browser tabs with target=\"_blank\"",
      "Create in-page jump bookmarks with #id anchors",
    ],
    content: `## Hyperlinks in HTML

HTML links are hyperlinks. You can click on a link and jump to another document or section.

\`\`\`html
<a href="https://www.w3schools.com" target="_blank" rel="noopener noreferrer">
  Visit W3Schools
</a>
\`\`\`

### Link Target Attributes

- \`target="_self"\`: Default. Opens the link in the same window/tab.
- \`target="_blank"\`: Opens the link in a new tab or window.
- In-page bookmarks: \`<a href="#section2">Jump to Section 2</a>\` targets an element with \`id="section2"\`.`,
  },
  "html-images": {
    videoPosition: 13,
    youtubeVideoId: "FmoYRiepmOE",
    videoUrl: "https://www.youtube.com/watch?v=FmoYRiepmOE",
    sourceUrl: "https://www.youtube.com/watch?v=FmoYRiepmOE",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "The <img> element requires src and alt attributes; alt text is essential for screen readers and SEO.",
    summary:
      "Learn how to embed graphics and photos with the <img> tag, write accessible alt text, and set responsive dimensions.",
    objectives: [
      "Embed images using <img src=\"...\" alt=\"...\">",
      "Write descriptive and accessible alternative text",
      "Specify width and height to prevent page layout shifts",
    ],
    content: `## Embedding Images in HTML

Images are not inserted into a webpage directly; images are linked to web pages using the \`<img>\` tag.

\`\`\`html
<img src="img_girl.jpg" alt="Girl in a jacket" width="500" height="600">
\`\`\`

### Essential Attributes

- \`src\`: The path or URL of the image.
- \`alt\`: Alternate text for an image, used when the image cannot be displayed or by screen readers.
- \`width\` & \`height\`: Reserve the required dimensions before the image finishes loading.`,
  },
  "html-tables": {
    videoPosition: 14,
    youtubeVideoId: "e62D-aayveY",
    videoUrl: "https://www.youtube.com/watch?v=e62D-aayveY",
    sourceUrl: "https://www.youtube.com/watch?v=e62D-aayveY",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "Tables are strictly for tabular data; use <th> for table headers and merge cells with colspan and rowspan.",
    summary:
      "Learn how to present structured tabular data using <table>, <tr>, <th>, and <td> elements, along with colspan and rowspan.",
    objectives: [
      "Build accessible tables with <table>, <tr>, <th>, and <td>",
      "Structure header rows and data cells cleanly",
      "Span multiple columns or rows using colspan and rowspan",
    ],
    content: `## HTML Tables

HTML tables allow web developers to arrange data into rows and columns.

\`\`\`html
<table>
  <tr>
    <th>Company</th>
    <th>Contact</th>
    <th>Country</th>
  </tr>
  <tr>
    <td>Alfreds Futterkiste</td>
    <td>Maria Anders</td>
    <td>Germany</td>
  </tr>
</table>
\`\`\`

### Table Structure Tags

- \`<table>\`: The container element.
- \`<tr>\`: Defines a table row.
- \`<th>\`: Defines a header cell (bold and centered by default).
- \`<td>\`: Defines a standard table data cell.`,
  },
  "html-lists": {
    videoPosition: 15,
    youtubeVideoId: "-QuK8taGLCs",
    videoUrl: "https://www.youtube.com/watch?v=-QuK8taGLCs",
    sourceUrl: "https://www.youtube.com/watch?v=-QuK8taGLCs",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "Use <ol> for sequential items, <ul> for non-sequential items, and <dl> for key-value terms and definitions.",
    summary:
      "Organize related items into unordered bulleted lists (<ul>), numbered ordered lists (<ol>), and description lists (<dl>).",
    objectives: [
      "Create bulleted lists with <ul> and numbered lists with <ol>",
      "Nest lists inside list items to create sub-menus",
      "Create description lists with <dl>, <dt>, and <dd>",
    ],
    content: `## Lists in HTML

HTML lists allow web developers to group a set of related items in lists.

### Types of Lists

1. **Unordered List (\`<ul>\`)**: Items are marked with bullets.
2. **Ordered List (\`<ol>\`)**: Items are marked with numbers or letters.
3. **Description List (\`<dl>\`)**: List of terms (\`<dt>\`) with description of each term (\`<dd>\`).

\`\`\`html
<ul>
  <li>Coffee</li>
  <li>Tea</li>
  <li>Milk</li>
</ul>
\`\`\``,
  },
  "html-block-inline": {
    videoPosition: 16,
    youtubeVideoId: "M4n-WSkehmI",
    videoUrl: "https://www.youtube.com/watch?v=M4n-WSkehmI",
    sourceUrl: "https://www.youtube.com/watch?v=M4n-WSkehmI",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "Block elements start on a new line and take up full width; inline elements only take up as much width as necessary.",
    summary:
      "Understand the fundamental difference between block-level elements (<div>, <p>, <h1>) and inline elements (<span>, <a>, <strong>).",
    objectives: [
      "Distinguish between block-level and inline HTML elements",
      "Use <div> as a block-level container and <span> as an inline container",
      "Understand how display behavior affects page layout flow",
    ],
    content: `## Block-level vs Inline Elements

Every HTML element has a default display value, depending on what type of element it is.

### Block-level Elements
- Always starts on a new line and takes up the full width available.
- Examples: \`<div>\`, \`<p>\`, \`<h1>\`-\`<h6>\`, \`<form>\`, \`<header>\`, \`<footer>\`.

### Inline Elements
- Does not start on a new line and only takes up as much width as necessary.
- Examples: \`<span>\`, \`<a>\`, \`<img>\`, \`<strong>\`, \`<em>\`.`,
  },
  "html-classes": {
    videoPosition: 17,
    youtubeVideoId: "tWIkDOJo0Ts",
    videoUrl: "https://www.youtube.com/watch?v=tWIkDOJo0Ts",
    sourceUrl: "https://www.youtube.com/watch?v=tWIkDOJo0Ts",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "The class attribute can be shared across multiple elements to apply consistent styling or targeting.",
    summary:
      "Learn how the class attribute assigns reusable style and script identifiers to multiple HTML elements.",
    objectives: [
      "Assign class names using class=\"className\"",
      "Apply multiple space-separated classes to a single element",
      "Target class names in CSS with .className syntax",
    ],
    content: `## The HTML Class Attribute

The HTML \`class\` attribute is used to specify a class for an HTML element. Multiple HTML elements can share the same class.

\`\`\`html
<div class="city">
  <h2>London</h2>
  <p>London is the capital of England.</p>
</div>

<div class="city">
  <h2>Paris</h2>
  <p>Paris is the capital of France.</p>
</div>
\`\`\`

### Targeting in CSS

In CSS, to select elements with a specific class, write a period (\`.\`) character followed by the name of the class: \`.city { background-color: tomato; }\`.`,
  },
  "html-id": {
    videoPosition: 18,
    youtubeVideoId: "rZ0k516qZmc",
    videoUrl: "https://www.youtube.com/watch?v=rZ0k516qZmc",
    sourceUrl: "https://www.youtube.com/watch?v=rZ0k516qZmc",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "An id must be unique within an HTML document; use id for unique element targeting and in-page navigation anchors.",
    summary:
      "Learn how the id attribute assigns a unique identifier to a single HTML element on the page for styling, scripting, and bookmarks.",
    objectives: [
      "Assign unique IDs to elements with id=\"uniqueId\"",
      "Target IDs in CSS with #uniqueId syntax",
      "Understand the difference between reusable classes and unique IDs",
    ],
    content: `## The HTML ID Attribute

The HTML \`id\` attribute is used to specify a unique id for an HTML element. You cannot have more than one element with the same id in an HTML document.

\`\`\`html
<h1 id="myHeader">My Header</h1>
\`\`\`

### Difference Between Class and ID

- A **class name** can be used by multiple HTML elements.
- An **id name** must only be used by one HTML element within the page.
- In CSS, select an ID with the hash (\`#\`) symbol: \`#myHeader { color: red; }\`.`,
  },
  "html-iframes": {
    videoPosition: 19,
    youtubeVideoId: "qP23O70ve7k",
    videoUrl: "https://www.youtube.com/watch?v=qP23O70ve7k",
    sourceUrl: "https://www.youtube.com/watch?v=qP23O70ve7k",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "An iframe displays a nested browsing context; always provide a descriptive title attribute for accessibility.",
    summary:
      "Learn how the <iframe> element embeds external web pages, video players, maps, and interactive widgets inside your HTML.",
    objectives: [
      "Embed external pages and media using <iframe src=\"...\">",
      "Set iframe dimensions and borders with CSS",
      "Use the title attribute for screen reader accessibility",
    ],
    content: `## HTML Iframes

An HTML iframe is used to display a web page within a web page.

\`\`\`html
<iframe src="demo_iframe.htm" height="200" width="300" title="Iframe Example"></iframe>
\`\`\`

### Accessibility Requirement

Always add the \`title\` attribute to an \`<iframe>\`. This is used by screen readers to read out what the content of the iframe is to assistive tech users.`,
  },
  "html-javascript": {
    videoPosition: 20,
    youtubeVideoId: "uSgcWDkwc3U",
    videoUrl: "https://www.youtube.com/watch?v=uSgcWDkwc3U",
    sourceUrl: "https://www.youtube.com/watch?v=uSgcWDkwc3U",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "The <script> tag is used to embed or link client-side JavaScript to make web pages dynamic and interactive.",
    summary:
      "Discover how HTML and JavaScript interact using the <script> tag to manipulate the DOM, handle events, and create interactivity.",
    objectives: [
      "Insert client-side scripts using <script> tags",
      "Link external JavaScript files with <script src=\"app.js\">",
      "Provide fallback content for disabled scripts using <noscript>",
    ],
    content: `## JavaScript in HTML

JavaScript makes HTML pages more dynamic and interactive.

\`\`\`html
<p id="demo">JavaScript can change HTML content.</p>

<button type="button" onclick='document.getElementById("demo").innerHTML = "Hello JavaScript!"'>
  Click Me!
</button>
\`\`\`

### The <script> and <noscript> Tags

- The \`<script>\` tag is used to define a client-side script (JavaScript).
- The \`<noscript>\` tag provides an alternate content for users that have disabled scripts in their browser.`,
  },
  "html-head": {
    videoPosition: 21,
    youtubeVideoId: "WeuVX5x2MJE",
    videoUrl: "https://www.youtube.com/watch?v=WeuVX5x2MJE",
    sourceUrl: "https://www.youtube.com/watch?v=WeuVX5x2MJE",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "The <head> container holds machine-readable metadata about the page that is not directly rendered in the main viewport.",
    summary:
      "Explore the <head> element and its essential tags: <title>, <meta>, <link>, <style>, and <base>.",
    objectives: [
      "Set page titles and favicons in the <head> section",
      "Configure UTF-8 charset and responsive viewport meta tags",
      "Link external stylesheets and resources",
    ],
    content: `## The HTML <head> Element

The \`<head>\` element is a container for metadata (data about data) and is placed between the \`<html>\` tag and the \`<body>\` tag.

### Elements inside <head>

- \`<title>\`: Defines the title of the document in browser tabs and search engine results.
- \`<style>\`: Used to define internal CSS style rules.
- \`<link>\`: Most often used to link to external style sheets.
- \`<meta>\`: Specifies character set, page description, keywords, author, and viewport settings.`,
  },
  "html-forms": {
    videoPosition: 22,
    youtubeVideoId: "VLeERv_dR6Q",
    videoUrl: "https://www.youtube.com/watch?v=VLeERv_dR6Q",
    sourceUrl: "https://www.youtube.com/watch?v=VLeERv_dR6Q",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: false,
    keyTakeaway:
      "Forms collect user input for server processing; always pair input elements with explicit <label> tags for accessibility.",
    summary:
      "Learn how to build user input forms using <form>, <input>, <label>, <select>, <textarea>, and <button> elements.",
    objectives: [
      "Explain the purpose and structure of HTML forms",
      "Add common form controls (text, password, submit, checkboxes, radio buttons)",
      "Associate <label> elements with <input> fields using for and id",
    ],
    content: `## HTML Forms

An HTML form is used to collect user input. The user input is most often sent to a server for processing.

\`\`\`html
<form action="/action_page.php" method="POST">
  <label for="fname">First name:</label><br>
  <input type="text" id="fname" name="fname" value="John"><br>
  <label for="lname">Last name:</label><br>
  <input type="text" id="lname" name="lname" value="Doe"><br><br>
  <input type="submit" value="Submit">
</form>
\`\`\`

### Form Accessibility

Always use the \`<label>\` element. The \`for\` attribute of the \`<label>\` tag should be equal to the \`id\` attribute of the \`<input>\` element to bind them together for assistive technology.`,
  },
  "html-bloopers": {
    videoPosition: 23,
    youtubeVideoId: "HHxPoYUrSQ0",
    videoUrl: "https://www.youtube.com/watch?v=HHxPoYUrSQ0",
    sourceUrl: "https://www.youtube.com/watch?v=HHxPoYUrSQ0",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s",
    isBonus: true,
    keyTakeaway:
      "Learning to code takes practice, patience, and having fun along the way!",
    summary:
      "A fun bonus from the W3Schools HTML tutorial recording.",
    objectives: [
      "Enjoy behind-the-scenes moments from the W3Schools HTML tutorial recording",
    ],
    content: `## Bonus: Behind the Scenes Bloopers!

Congratulations on completing all 22 required lessons in **HTML Fundamentals**!

This bonus lesson features fun outtakes and behind-the-scenes bloopers recorded during the creation of the W3Schools HTML course.

### Ready for Next Steps?

Now that you have mastered HTML tags, attributes, formatting, tables, lists, layouts, and forms, you are ready to style your pages in **Course 2: CSS Fundamentals**!`,
  },
};

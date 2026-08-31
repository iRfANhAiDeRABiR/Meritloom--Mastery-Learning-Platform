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

export const CSS_FUNDAMENTALS_SUMMARY: CourseSummary = {
  id: "course-css-fundamentals",
  slug: "css-fundamentals",
  title: "CSS Fundamentals",
  shortDescription:
    "Learn how to style modern web pages with CSS, from selectors, colors and the box model to layout, Flexbox, responsive design and practical styling.",
  difficulty: "beginner",
  estimatedMinutes: 65,
  lessonCount: 18,
  categoryName: "Web Development",
  categorySlug: "web-development",
  thumbnailUrl: null,
  isFree: true,
  instructorName: "W3Schools.com",
};

export const CSS_FUNDAMENTALS_COURSE: CourseDetail = {
  id: "course-css-fundamentals",
  slug: "css-fundamentals",
  title: "CSS Fundamentals",
  summary:
    "Learn how to style modern web pages with CSS, from selectors, colors and the box model to layout, Flexbox, responsive design and practical styling.",
  description:
    "CSS controls how web pages look and feel. In this beginner-friendly course, you'll learn how to transform plain HTML into attractive, organized and responsive web pages. Starting with CSS syntax and selectors, the course gradually introduces colors, backgrounds, borders, spacing, typography, layout and modern CSS techniques. The video lessons come from the W3Schools CSS tutorial series and are organized inside Meritloom with structured modules, lesson summaries, practice activities and progress tracking. A basic understanding of HTML is recommended before starting this course.",
  difficulty: "beginner",
  language: "English",
  estimatedMinutes: 65,
  lessonCount: 18,
  requiredLessonsCount: 18,
  bonusLessonsCount: 0,
  moduleCount: 4,
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
    "Explain how CSS styles HTML documents and separates structure from presentation",
    "Write valid CSS rules using selectors, properties, and values",
    "Apply external, internal, and inline CSS to HTML pages",
    "Use element, class, ID, and universal selectors effectively",
    "Work with color names, RGB, RGBA, HEX, and HSL color formats",
    "Style background colors, images, position, repeat, and attachment",
    "Write clean background shorthand declarations to streamline stylesheets",
    "Combine HTML and CSS into a complete, attractively styled personal website",
  ],
  prerequisites: [
    "Recommended before starting: HTML Fundamentals (/courses/html-fundamentals)",
    "A modern web browser (Chrome, Firefox, Safari, or Edge)",
    "A text editor such as VS Code, Notepad, or TextEdit",
  ],
  skills: [
    "CSS",
    "CSS Selectors",
    "CSS Colors",
    "CSS Backgrounds",
    "Web Styling",
    "Web Development",
  ],
  targetAudience: [
    "Beginners who want to learn how to make websites look beautiful and professional",
    "Learners who completed HTML Fundamentals and want to style their markup",
    "Anyone looking for a structured, hands-on video series in CSS styling",
  ],
  modules: [
    {
      id: "mod-css-1",
      title: "Getting Started with CSS",
      description:
        "Understand what CSS is, learn the syntax of rules and declaration blocks, explore simple selectors, and discover the three ways to add CSS to HTML.",
      position: 1,
      estimatedMinutes: 19,
      lessonCount: 6,
      isBonus: false,
      lessons: [
        {
          id: "les-css-1-1",
          slug: "css-introduction",
          title: "Introduction to CSS",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 2,
          isPreview: true,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "AGDDdsiZ0Ko",
        },
        {
          id: "les-css-1-2",
          slug: "css-syntax",
          title: "CSS Syntax & Declarations",
          lessonType: "video",
          position: 2,
          estimatedMinutes: 2,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "G8r00ZNopTE",
        },
        {
          id: "les-css-1-3",
          slug: "css-selectors",
          title: "CSS Simple Selectors",
          lessonType: "video",
          position: 3,
          estimatedMinutes: 3,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "ZNskBxLVOfs",
        },
        {
          id: "les-css-1-4",
          slug: "css-how-to",
          title: "How to Add CSS to HTML",
          lessonType: "video",
          position: 4,
          estimatedMinutes: 3,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "VSwaoQ3TFkQ",
        },
        {
          id: "les-css-1-5",
          slug: "css-comments",
          title: "CSS Comments",
          lessonType: "video",
          position: 5,
          estimatedMinutes: 2,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "uVtEJD3vBEs",
        },
        {
          id: "les-css-1-6",
          slug: "practice-first-stylesheet",
          title: "Practice — Connect & Write Your First CSS",
          lessonType: "practice",
          position: 6,
          estimatedMinutes: 8,
          isPreview: false,
          isPublished: true,
          isBonus: false,
        },
      ],
    },
    {
      id: "mod-css-2",
      title: "Colors & Color Formats",
      description:
        "Master the web color system: named colors, RGB, RGBA with opacity, Hexadecimal color codes, and intuitive HSL / HSLA coordinates.",
      position: 2,
      estimatedMinutes: 20,
      lessonCount: 5,
      isBonus: false,
      lessons: [
        {
          id: "les-css-2-1",
          slug: "css-colors-intro",
          title: "Introduction to CSS Colors",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 4,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "q0uWmobMf6I",
        },
        {
          id: "les-css-2-2",
          slug: "css-colors-rgb",
          title: "RGB & RGBA Color Values",
          lessonType: "video",
          position: 2,
          estimatedMinutes: 2,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "6tbUo6PXc88",
        },
        {
          id: "les-css-2-3",
          slug: "css-colors-hex",
          title: "HEX Color Codes",
          lessonType: "video",
          position: 3,
          estimatedMinutes: 3,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "LLmCr_201GU",
        },
        {
          id: "les-css-2-4",
          slug: "css-colors-hsl",
          title: "HSL & HSLA Color Values",
          lessonType: "video",
          position: 4,
          estimatedMinutes: 3,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "Vilk0BFQZ4Y",
        },
        {
          id: "les-css-2-5",
          slug: "practice-color-palette",
          title: "Practice — Build a Brand Color Palette",
          lessonType: "practice",
          position: 5,
          estimatedMinutes: 8,
          isPreview: false,
          isPublished: true,
          isBonus: false,
        },
      ],
    },
    {
      id: "mod-css-3",
      title: "CSS Backgrounds",
      description:
        "Learn all aspects of CSS backgrounds: background colors, background images, repeat modes, positioning, attachment scrolling, and shorthand notation.",
      position: 3,
      estimatedMinutes: 19,
      lessonCount: 6,
      isBonus: false,
      lessons: [
        {
          id: "les-css-3-1",
          slug: "css-background-colors",
          title: "CSS Background Colors",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 3,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "-itttmX6HX0",
        },
        {
          id: "les-css-3-2",
          slug: "css-background-images",
          title: "CSS Background Images",
          lessonType: "video",
          position: 2,
          estimatedMinutes: 2,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "FMyU_h8m-0c",
        },
        {
          id: "les-css-3-3",
          slug: "css-background-repeat-position",
          title: "Background Repeat & Position",
          lessonType: "video",
          position: 3,
          estimatedMinutes: 2,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "k9dNFtC2F8A",
        },
        {
          id: "les-css-3-4",
          slug: "css-background-attachment",
          title: "Background Attachment & Scrolling",
          lessonType: "video",
          position: 4,
          estimatedMinutes: 2,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "lXs8BRnrW_M",
        },
        {
          id: "les-css-3-5",
          slug: "css-background-shorthand",
          title: "CSS Background Shorthand",
          lessonType: "video",
          position: 5,
          estimatedMinutes: 2,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "rSEKmi5tR9E",
        },
        {
          id: "les-css-3-6",
          slug: "practice-hero-banner",
          title: "Practice — Style a Hero Banner with Backgrounds",
          lessonType: "practice",
          position: 6,
          estimatedMinutes: 8,
          isPreview: false,
          isPublished: true,
          isBonus: false,
        },
      ],
    },
    {
      id: "mod-css-4",
      title: "Applied Styling & Projects",
      description:
        "Synthesize all CSS fundamentals into a complete, beautifully styled multi-section personal website.",
      position: 4,
      estimatedMinutes: 15,
      lessonCount: 1,
      isBonus: false,
      lessons: [
        {
          id: "les-css-4-1",
          slug: "project-style-personal-site",
          title: "Final Project — Style Your Personal Website",
          lessonType: "practice",
          position: 1,
          estimatedMinutes: 15,
          isPreview: false,
          isPublished: true,
          isBonus: false,
        },
      ],
    },
  ],
};

export const CSS_LESSON_DETAILS_MAP: Record<
  string,
  {
    videoPosition: number;
    youtubeVideoId: string | null;
    videoUrl: string | null;
    sourceUrl: string | null;
    sourceChannel: string | null;
    playlistId: string | null;
    isBonus: boolean;
    keyTakeaway: string;
    summary: string;
    objectives: string[];
    content: string;
  }
> = {
  "css-introduction": {
    videoPosition: 1,
    youtubeVideoId: "AGDDdsiZ0Ko",
    videoUrl: "https://www.youtube.com/watch?v=AGDDdsiZ0Ko",
    sourceUrl: "https://www.youtube.com/watch?v=AGDDdsiZ0Ko",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM",
    isBonus: false,
    keyTakeaway:
      "CSS (Cascading Style Sheets) describes how HTML elements are to be displayed on screen, paper, or in other media.",
    summary:
      "Learn what CSS is, how it works with HTML, and why separating structure from presentation makes web pages easier to style and maintain.",
    objectives: [
      "Understand what CSS stands for and its core role in web development",
      "Learn why CSS saves massive work by controlling layout across multiple pages",
      "Identify the relationship between HTML structure and CSS presentation",
    ],
    content: `## What is CSS?

**CSS** stands for **Cascading Style Sheets**. While HTML provides the skeleton and semantic structure of a web page, CSS describes how HTML elements should be styled and displayed.

### Why Use CSS?

- **Separate content from design**: Keep your HTML files clean and focus on content structure while your CSS handles appearance.
- **Site-wide consistency**: Style thousands of web pages using a single shared stylesheet.
- **Device adaptability**: Format pages for mobile phones, tablets, laptops, and print layouts without touching HTML markup.

\`\`\`css
/* Example CSS styling */
body {
  background-color: #f7f8fc;
  font-family: Arial, sans-serif;
  color: #172033;
}

h1 {
  color: #4338ca;
  text-align: center;
}
\`\`\``,
  },
  "css-syntax": {
    videoPosition: 2,
    youtubeVideoId: "G8r00ZNopTE",
    videoUrl: "https://www.youtube.com/watch?v=G8r00ZNopTE",
    sourceUrl: "https://www.youtube.com/watch?v=G8r00ZNopTE",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM",
    isBonus: false,
    keyTakeaway:
      "A CSS rule consists of a selector and a declaration block containing property-value pairs separated by semicolons.",
    summary:
      "Understand selectors, properties, values, and declaration blocks—the core building blocks of every CSS rule.",
    objectives: [
      "Identify CSS selectors and declaration blocks",
      "Write clean property-value pairs with colons and semicolons",
      "Format CSS rules with curly braces for readability",
    ],
    content: `## CSS Syntax & Rules

A CSS rule consists of a **selector** and a **declaration block**:

\`\`\`css
selector {
  property: value;
  property: value;
}
\`\`\`

### Parts of a CSS Rule:

1. **Selector**: Points to the HTML element you want to style (e.g. \`h1\`, \`p\`, \`.card\`).
2. **Declaration Block**: Enclosed in curly braces \`{ ... }\`, containing one or more declarations separated by semicolons.
3. **Property**: The style attribute you want to change (e.g., \`color\`, \`font-size\`, \`background-color\`).
4. **Value**: The setting you want to apply to that property (e.g., \`blue\`, \`16px\`, \`#ffffff\`).`,
  },
  "css-selectors": {
    videoPosition: 3,
    youtubeVideoId: "ZNskBxLVOfs",
    videoUrl: "https://www.youtube.com/watch?v=ZNskBxLVOfs",
    sourceUrl: "https://www.youtube.com/watch?v=ZNskBxLVOfs",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM",
    isBonus: false,
    keyTakeaway:
      "CSS simple selectors find elements by name, id, or class to apply targeted styles.",
    summary:
      "Master targeting HTML elements using element type selectors, class selectors (.class), ID selectors (#id), and the universal selector (*).",
    objectives: [
      "Target elements by HTML tag name (e.g. p, h1)",
      "Use class selectors (.classname) to style multiple elements",
      "Use ID selectors (#idname) to target a specific unique element",
      "Group multiple selectors using commas to share styles",
    ],
    content: `## CSS Selectors

CSS selectors are used to "find" (or select) the HTML elements you want to style.

### 1. Element Selector
Targets all elements with the specified tag name:
\`\`\`css
p {
  text-align: center;
  color: #333333;
}
\`\`\`

### 2. Class Selector (\`.\`)
Targets elements with a specific \`class\` attribute:
\`\`\`css
.highlight {
  background-color: #fef08a;
  font-weight: bold;
}
\`\`\`

### 3. ID Selector (\`#\`)
Targets a single element with a unique \`id\` attribute:
\`\`\`css
#main-header {
  border-bottom: 2px solid #6366f1;
}
\`\`\`

### 4. Grouping Selectors (\`,\`)
\`\`\`css
h1, h2, p {
  text-align: center;
}
\`\`\``,
  },
  "css-how-to": {
    videoPosition: 4,
    youtubeVideoId: "VSwaoQ3TFkQ",
    videoUrl: "https://www.youtube.com/watch?v=VSwaoQ3TFkQ",
    sourceUrl: "https://www.youtube.com/watch?v=VSwaoQ3TFkQ",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM",
    isBonus: false,
    keyTakeaway:
      "External stylesheets are the industry standard for production websites because they allow one file to style an entire site.",
    summary:
      "Explore the three ways to insert CSS into web pages: External CSS files (<link>), Internal style blocks (<style>), and Inline style attributes.",
    objectives: [
      "Link an external .css stylesheet inside the HTML <head>",
      "Write internal CSS within a <style> tag",
      "Apply inline CSS using the HTML style attribute",
      "Understand cascading priority when multiple styles apply",
    ],
    content: `## Three Ways to Add CSS

### 1. External CSS (Recommended)
Add a \`<link>\` element inside your HTML \`<head>\`:
\`\`\`html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
\`\`\`

### 2. Internal CSS
Use a \`<style>\` block inside the HTML \`<head>\`:
\`\`\`html
<head>
  <style>
    body { background-color: #fafafa; }
    h1 { color: #1e293b; }
  </style>
</head>
\`\`\`

### 3. Inline CSS
Use the \`style\` attribute directly on an HTML element:
\`\`\`html
<h1 style="color: blue; text-align: center;">Welcome</h1>
\`\`\``,
  },
  "css-comments": {
    videoPosition: 5,
    youtubeVideoId: "uVtEJD3vBEs",
    videoUrl: "https://www.youtube.com/watch?v=uVtEJD3vBEs",
    sourceUrl: "https://www.youtube.com/watch?v=uVtEJD3vBEs",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM",
    isBonus: false,
    keyTakeaway:
      "CSS comments begin with /* and end with */, and are completely ignored by browsers.",
    summary:
      "Learn how CSS comments (/* ... */) help document stylesheets, organize sections, and temporarily disable rules during debugging.",
    objectives: [
      "Write single-line and multi-line comments in CSS",
      "Use comments to section and organize large stylesheets",
      "Temporarily disable CSS declarations while troubleshooting",
    ],
    content: `## CSS Comments

CSS comments are notes written inside stylesheets that are completely ignored by web browsers.

\`\`\`css
/* This is a single-line CSS comment */

/* =========================================================
   HEADER SECTION STYLES
   ========================================================= */
header {
  padding: 1.5rem;
  background-color: #1e1b4b;
}

/* Temporarily disable a property while debugging:
p {
  color: red;
}
*/
\`\`\``,
  },
  "practice-first-stylesheet": {
    videoPosition: 6,
    youtubeVideoId: null,
    videoUrl: null,
    sourceUrl: null,
    sourceChannel: null,
    playlistId: null,
    isBonus: false,
    keyTakeaway:
      "Structuring CSS into an external file and using descriptive class names creates clean, maintainable code.",
    summary:
      "Create an external stylesheet, link it to an HTML document, and apply element, class, and ID rules.",
    objectives: [
      "Create a styles.css file and link it using <link rel='stylesheet'>",
      "Apply background and text styles across multiple tags",
      "Use class and ID selectors to create distinct card layouts",
    ],
    content: `## Practice Activity: Your First CSS Stylesheet

### Challenge Instructions:

1. Create an HTML file with a header, paragraph, and two cards.
2. Create a \`styles.css\` file and link it inside the HTML \`<head>\`.
3. Apply element selectors to set body typography and background.
4. Use \`.card\` class to style containers and \`#featured\` for a special highlight.

\`\`\`html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Practice</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Welcome to CSS</h1>
  <div class="card" id="featured">Featured Card</div>
  <div class="card">Regular Card</div>
</body>
</html>
\`\`\`

\`\`\`css
/* styles.css */
body {
  font-family: system-ui, sans-serif;
  background-color: #f1f5f9;
  color: #0f172a;
}

.card {
  background-color: #ffffff;
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

#featured {
  border-left: 4px solid #6366f1;
}
\`\`\``,
  },
  "css-colors-intro": {
    videoPosition: 7,
    youtubeVideoId: "q0uWmobMf6I",
    videoUrl: "https://www.youtube.com/watch?v=q0uWmobMf6I",
    sourceUrl: "https://www.youtube.com/watch?v=q0uWmobMf6I",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM",
    isBonus: false,
    keyTakeaway:
      "Colors in CSS can be set using standard color names or specific numerical color formats.",
    summary:
      "Discover standard predefined color names, foreground text colors with the color property, background colors, and border colors.",
    objectives: [
      "Set text color using the color property",
      "Apply background colors to containers and headings",
      "Style border colors on elements",
    ],
    content: `## Introduction to CSS Colors

CSS supports 140+ standard color names (such as \`Tomato\`, \`DodgerBlue\`, \`MediumSeaGreen\`, \`SlateGray\`).

\`\`\`css
h1 {
  color: DodgerBlue; /* Text color */
}

div.banner {
  background-color: Tomato; /* Background */
  border: 2px solid SlateGray; /* Border color */
}
\`\`\`

### Accessibility Note:
Always ensure sufficient color contrast between text and its background so all users can read your content comfortably.`,
  },
  "css-colors-rgb": {
    videoPosition: 8,
    youtubeVideoId: "6tbUo6PXc88",
    videoUrl: "https://www.youtube.com/watch?v=6tbUo6PXc88",
    sourceUrl: "https://www.youtube.com/watch?v=6tbUo6PXc88",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM",
    isBonus: false,
    keyTakeaway:
      "An RGB color value represents RED, GREEN, and BLUE light sources; RGBA adds an Alpha channel (0.0 to 1.0) for opacity.",
    summary:
      "Specify precise colors using Red, Green, and Blue channels from 0 to 255, and add transparency with alpha channels in RGBA.",
    objectives: [
      "Define colors with rgb(red, green, blue) syntax",
      "Control opacity and background transparency with rgba(r, g, b, a)",
      "Understand how color channels combine to create millions of colors",
    ],
    content: `## RGB and RGBA Colors

An **RGB** color value represents the intensity of Red, Green, and Blue light sources:

\`\`\`css
/* rgb(red, green, blue) - values from 0 to 255 */
.pure-red { color: rgb(255, 0, 0); }
.pure-green { color: rgb(0, 255, 0); }
.pure-blue { color: rgb(0, 0, 255); }
.dark-slate { color: rgb(30, 41, 59); }
\`\`\`

### RGBA with Alpha Transparency:
The **alpha** parameter is a number between \`0.0\` (fully transparent) and \`1.0\` (fully opaque):

\`\`\`css
.card-overlay {
  background-color: rgba(0, 0, 0, 0.5); /* 50% translucent black */
}
\`\`\``,
  },
  "css-colors-hex": {
    videoPosition: 9,
    youtubeVideoId: "LLmCr_201GU",
    videoUrl: "https://www.youtube.com/watch?v=LLmCr_201GU",
    sourceUrl: "https://www.youtube.com/watch?v=LLmCr_201GU",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM",
    isBonus: false,
    keyTakeaway:
      "A hexadecimal color is specified with: #RRGGBB, where the RR (red), GG (green) and BB (blue) are hex values between 00 and FF.",
    summary:
      "Master hexadecimal color codes (#RRGGBB) used by designers and developers worldwide for web color definitions.",
    objectives: [
      "Read and write 6-digit hex color codes",
      "Use 3-digit shorthand hex codes (e.g. #fff, #f00)",
      "Pick and integrate design palette hex codes into stylesheets",
    ],
    content: `## HEX Color Codes

Hexadecimal colors use base-16 notation (\`0-9\` and \`A-F\`) prefixed by a hash (\`#\`):

\`\`\`css
/* #RRGGBB */
.primary-brand { color: #4f46e5; }
.neutral-bg { background-color: #f8fafc; }
.accent-border { border-color: #06b6d4; }
\`\`\`

### 3-Digit Shorthand:
When both characters of each pair are identical, you can use the 3-digit shortcut:
- \`#ff0000\` → \`#f00\`
- \`#ffffff\` → \`#fff\`
- \`#000000\` → \`#000\``,
  },
  "css-colors-hsl": {
    videoPosition: 10,
    youtubeVideoId: "Vilk0BFQZ4Y",
    videoUrl: "https://www.youtube.com/watch?v=Vilk0BFQZ4Y",
    sourceUrl: "https://www.youtube.com/watch?v=Vilk0BFQZ4Y",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM",
    isBonus: false,
    keyTakeaway:
      "HSL stands for Hue (0-360 degree color wheel), Saturation (0-100% grayness), and Lightness (0-100% brightness).",
    summary:
      "Understand Hue, Saturation, and Lightness (HSL)—an intuitive way to create tints, shades, and complementary color palettes.",
    objectives: [
      "Navigate the 360-degree color wheel using Hue",
      "Adjust Saturation and Lightness to create lighter/darker color variations",
      "Use HSLA to add transparency to HSL colors",
    ],
    content: `## HSL & HSLA Color Format

**HSL** represents colors based on human color perception:

- **Hue**: Degree on the color wheel from 0 to 360 (0 = red, 120 = green, 240 = blue).
- **Saturation**: Percentage from 0% (shade of gray) to 100% (full vibrant color).
- **Lightness**: Percentage from 0% (pitch black) to 50% (normal) to 100% (pure white).

\`\`\`css
/* hsl(hue, saturation, lightness) */
.brand-btn {
  background-color: hsl(240, 80%, 60%);
}

.brand-btn:hover {
  background-color: hsl(240, 80%, 45%); /* Easily darkened */
}
\`\`\``,
  },
  "practice-color-palette": {
    videoPosition: 11,
    youtubeVideoId: null,
    videoUrl: null,
    sourceUrl: null,
    sourceChannel: null,
    playlistId: null,
    isBonus: false,
    keyTakeaway:
      "Using consistent color formats and verifying contrast ratios ensures an accessible, attractive visual hierarchy.",
    summary:
      "Build a cohesive color palette for a web project using HEX, RGBA for translucent overlays, and HSL for hover states.",
    objectives: [
      "Define primary, secondary, and neutral colors with HEX",
      "Create frosted translucent card backgrounds with RGBA",
      "Create lighter and darker button hover states using HSL Lightness",
    ],
    content: `## Practice: Build a Brand Color Palette

### Task:
Create a complete color system for a technology startup landing page:

1. **Brand Primary (HEX)**: \`#4338ca\`
2. **Background Neutral (HEX)**: \`#0f172a\`
3. **Card Glassmorphism (RGBA)**: \`rgba(255, 255, 255, 0.08)\`
4. **Interactive Action Button (HSL)**: \`hsl(199, 89%, 48%)\` with \`hsl(199, 89%, 40%)\` hover state.`,
  },
  "css-background-colors": {
    videoPosition: 12,
    youtubeVideoId: "-itttmX6HX0",
    videoUrl: "https://www.youtube.com/watch?v=-itttmX6HX0",
    sourceUrl: "https://www.youtube.com/watch?v=-itttmX6HX0",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM",
    isBonus: false,
    keyTakeaway:
      "The background-color property specifies the background color of an element.",
    summary:
      "Apply background colors to full page bodies, hero sections, cards, and buttons with good contrast for text readability.",
    objectives: [
      "Set page-wide background colors on <body>",
      "Apply distinct backgrounds to cards and navigation bars",
      "Ensure accessible contrast between background-color and text color",
    ],
    content: `## CSS Background Colors

The \`background-color\` property sets the background color of an element.

\`\`\`css
body {
  background-color: #0b0f19;
  color: #f3f4f6;
}

header {
  background-color: #1e293b;
}

.badge {
  background-color: #10b981;
  color: #ffffff;
}
\`\`\``,
  },
  "css-background-images": {
    videoPosition: 13,
    youtubeVideoId: "FMyU_h8m-0c",
    videoUrl: "https://www.youtube.com/watch?v=FMyU_h8m-0c",
    sourceUrl: "https://www.youtube.com/watch?v=FMyU_h8m-0c",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM",
    isBonus: false,
    keyTakeaway:
      "The background-image property sets an image as the background of an element.",
    summary:
      "Embed background images using url() and understand how browsers tile images horizontally and vertically by default.",
    objectives: [
      "Specify background image URLs with url('image.jpg')",
      "Understand default repeating behavior of background images",
      "Choose appropriate imagery for hero banners and cards",
    ],
    content: `## CSS Background Images

The \`background-image\` property specifies an image to use as the background of an element:

\`\`\`css
body {
  background-image: url("paper.gif");
}

.hero {
  background-image: url("mountains.jpg");
}
\`\`\`

By default, the image is repeated so it covers the entire element.`,
  },
  "css-background-repeat-position": {
    videoPosition: 14,
    youtubeVideoId: "k9dNFtC2F8A",
    videoUrl: "https://www.youtube.com/watch?v=k9dNFtC2F8A",
    sourceUrl: "https://www.youtube.com/watch?v=k9dNFtC2F8A",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM",
    isBonus: false,
    keyTakeaway:
      "Combine no-repeat with background-position (center, top right, etc.) to place hero graphics and background accents accurately.",
    summary:
      "Control whether images tile with background-repeat (no-repeat, repeat-x, repeat-y) and align backgrounds with background-position.",
    objectives: [
      "Prevent image tiling using background-repeat: no-repeat",
      "Repeat images along a single axis (repeat-x or repeat-y)",
      "Position background graphics using keywords and pixel/percentage offsets",
    ],
    content: `## Background Repeat & Position

### 1. \`background-repeat\`
- \`repeat\`: Default tiles in both directions.
- \`repeat-x\`: Tiles horizontally only.
- \`repeat-y\`: Tiles vertically only.
- \`no-repeat\`: Shows image only once.

### 2. \`background-position\`
Positions the image inside its container:
\`\`\`css
.hero {
  background-image: url("logo.png");
  background-repeat: no-repeat;
  background-position: right top; /* Or center center, 50% 50% */
}
\`\`\``,
  },
  "css-background-attachment": {
    videoPosition: 15,
    youtubeVideoId: "lXs8BRnrW_M",
    videoUrl: "https://www.youtube.com/watch?v=lXs8BRnrW_M",
    sourceUrl: "https://www.youtube.com/watch?v=lXs8BRnrW_M",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM",
    isBonus: false,
    keyTakeaway:
      "background-attachment: fixed keeps the background in place while page content scrolls over it, creating a parallax effect.",
    summary:
      "Learn how background-attachment controls whether a background scrolls with the rest of the page or remains fixed in place.",
    objectives: [
      "Use background-attachment: scroll (default behavior)",
      "Apply background-attachment: fixed for stationary backgrounds",
      "Understand visual impact and mobile considerations",
    ],
    content: `## Background Attachment

The \`background-attachment\` property sets whether a background image scrolls with the rest of the page, or is fixed:

\`\`\`css
body {
  background-image: url("sky.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed; /* Image stays in viewport */
}
\`\`\``,
  },
  "css-background-shorthand": {
    videoPosition: 16,
    youtubeVideoId: "rSEKmi5tR9E",
    videoUrl: "https://www.youtube.com/watch?v=rSEKmi5tR9E",
    sourceUrl: "https://www.youtube.com/watch?v=rSEKmi5tR9E",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM",
    isBonus: false,
    keyTakeaway:
      "The background shorthand property lets you specify all background properties in one line.",
    summary:
      "Condense multiple background properties (color, image, repeat, attachment, position) into a single concise background declaration.",
    objectives: [
      "Write valid background shorthand rules",
      "Memorize the standard property order for shorthand syntax",
      "Refactor verbose background declarations into clean shorthand",
    ],
    content: `## CSS Background Shorthand

Instead of writing 5 separate declarations:
\`\`\`css
body {
  background-color: #ffffff;
  background-image: url("img_tree.png");
  background-repeat: no-repeat;
  background-position: right top;
}
\`\`\`

You can write them all in a single \`background\` shorthand rule:
\`\`\`css
body {
  background: #ffffff url("img_tree.png") no-repeat right top;
}
\`\`\`

### Shorthand Property Order:
1. \`background-color\`
2. \`background-image\`
3. \`background-repeat\`
4. \`background-attachment\`
5. \`background-position\``,
  },
  "practice-hero-banner": {
    videoPosition: 17,
    youtubeVideoId: null,
    videoUrl: null,
    sourceUrl: null,
    sourceChannel: null,
    playlistId: null,
    isBonus: false,
    keyTakeaway:
      "Combining background-image, background-position, and background-repeat shorthand produces polished, responsive banners.",
    summary:
      "Design a full-width hero header with a centered background image, translucent overlay, and crisp typography.",
    objectives: [
      "Set a background image centered with no-repeat",
      "Apply background shorthand for clean stylesheet rules",
      "Add high-contrast typography over background visuals",
    ],
    content: `## Practice: Style a Hero Banner

### Challenge:
Build a hero banner section with:
1. A dark background fallback color (\`#090d16\`).
2. A hero background image centered with \`no-repeat\`.
3. High contrast white headline text and an accent button.`,
  },
  "project-style-personal-site": {
    videoPosition: 18,
    youtubeVideoId: null,
    videoUrl: null,
    sourceUrl: null,
    sourceChannel: null,
    playlistId: null,
    isBonus: false,
    keyTakeaway:
      "Clean CSS organization and consistent design tokens turn plain HTML markup into professional web experiences.",
    summary:
      "Transform your HTML website from Course 1 into a modern styled portfolio with external CSS, custom typography, brand colors, and layered backgrounds.",
    objectives: [
      "Structure an external CSS stylesheet linked to your HTML portfolio",
      "Apply an accessible color system using HEX, RGB, and HSL",
      "Style headers, navigation bars, cards, and footer sections with backgrounds",
      "Prepare your styled layout for interactive JavaScript in the upcoming course",
    ],
    content: `## Final Project: Style Your Personal Website

Congratulations on completing **CSS Fundamentals**!

### Your Project Mission:
Take the multi-page or single-page website you built in **HTML Fundamentals (Course 1)** and style it with professional CSS!

### Project Requirements:
1. **External Stylesheet**: Connect an external \`styles.css\` file to all HTML pages using \`<link rel="stylesheet">\`.
2. **Color Palette**: Establish primary, secondary, text, and background colors using HEX, RGB, and HSL.
3. **Typography**: Define clean font families, hierarchy, and readable line heights.
4. **Card & Header Backgrounds**: Style hero sections and portfolio cards using background colors, images, and shorthand syntax.
5. **Clean Selectors**: Use semantic element, class (\`.btn\`, \`.card\`), and ID selectors without unnecessary repetition.

### What's Next?
In **Course 3: JavaScript Fundamentals**, you will bring your styled site to life with dynamic interactivity, event listeners, and live DOM manipulation!`,
  },
};
export const JAVASCRIPT_FUNDAMENTALS_SUMMARY: CourseSummary = {
  id: "course-javascript-fundamentals",
  slug: "javascript-fundamentals",
  title: "JavaScript Fundamentals",
  shortDescription:
    "Learn the foundations of JavaScript and make web pages interactive with variables, functions, objects, conditions, loops, arrays, events and practical browser scripting.",
  difficulty: "beginner",
  estimatedMinutes: 105,
  lessonCount: 17,
  categoryName: "Web Development",
  categorySlug: "web-development",
  thumbnailUrl: null,
  isFree: true,
  instructorName: "W3Schools.com",
};

export const JAVASCRIPT_FUNDAMENTALS_COURSE: CourseDetail = {
  id: "course-javascript-fundamentals",
  slug: "javascript-fundamentals",
  title: "JavaScript Fundamentals",
  summary:
    "Learn the foundations of JavaScript and make web pages interactive with variables, functions, objects, conditions, loops, arrays, events and practical browser scripting.",
  description:
    "JavaScript adds behavior and interactivity to websites. In this beginner-friendly course, you'll learn the core concepts behind JavaScript step by step, starting with basic syntax and values before moving into variables, operators, functions, objects, conditions, loops and browser interactions. The video lessons come from the W3Schools JavaScript tutorial series and are organized inside Meritloom into clear modules with short summaries, objectives, hands-on practice activities and progress tracking. A basic understanding of HTML is recommended, and some CSS knowledge will help when building interactive webpage projects.",
  difficulty: "beginner",
  language: "English",
  estimatedMinutes: 105,
  lessonCount: 17,
  requiredLessonsCount: 17,
  bonusLessonsCount: 0,
  moduleCount: 4,
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
    "Explain what JavaScript does in a webpage and how it executes alongside HTML and CSS",
    "Add JavaScript to an HTML document using inline scripts, internal script tags, and external files",
    "Use JavaScript output methods including console.log, innerHTML, document.write, and alert",
    "Write valid JavaScript statements, understand code blocks, case sensitivity, and semicolons",
    "Add single-line and multi-line comments to document code logic and prevent execution",
    "Declare, initialize, and update variables using var, let, and const with proper block scoping",
    "Work with JavaScript arithmetic operators, expressions, and operator precedence",
    "Build an interactive web project combining HTML structure, CSS styles, and JavaScript logic",
  ],
  prerequisites: [
    "Recommended before starting: HTML Fundamentals (/courses/html-fundamentals)",
    "Recommended before starting: CSS Fundamentals (/courses/css-fundamentals)",
    "A modern web browser (Chrome, Firefox, Safari, or Edge)",
    "A text editor such as VS Code, Notepad, or TextEdit",
  ],
  skills: [
    "JavaScript",
    "JavaScript Fundamentals",
    "Variables & Scoping",
    "Arithmetic Operators",
    "DOM & Output",
    "Web Interactivity",
    "Web Development",
  ],
  targetAudience: [
    "Beginners who want to learn how to add interactivity and dynamic behavior to websites",
    "Learners who completed HTML and CSS Fundamentals and want to learn coding logic",
    "Anyone looking for a structured, hands-on video series in core JavaScript fundamentals",
  ],
  modules: [
    {
      id: "mod-js-1",
      title: "Getting Started with JavaScript",
      description:
        "Learn what JavaScript is, how to include it in web pages, display output, write statements, and understand syntax and comments.",
      position: 1,
      estimatedMinutes: 30,
      lessonCount: 8,
      isBonus: false,
      lessons: [
        {
          id: "les-js-1-1",
          slug: "javascript-introduction",
          title: "Introduction to JavaScript",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 3,
          isPreview: true,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "zofMnllkVfI",
        },
        {
          id: "les-js-1-2",
          slug: "javascript-where-to",
          title: "Where to Add JavaScript",
          lessonType: "video",
          position: 2,
          estimatedMinutes: 2,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "W-3vp79-d3Y",
        },
        {
          id: "les-js-1-3",
          slug: "javascript-output",
          title: "JavaScript Output",
          lessonType: "video",
          position: 3,
          estimatedMinutes: 3,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "we8YhT-NiOA",
        },
        {
          id: "les-js-1-4",
          slug: "javascript-statements",
          title: "JavaScript Statements",
          lessonType: "video",
          position: 4,
          estimatedMinutes: 2,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "ZjotKN861EI",
        },
        {
          id: "les-js-1-5",
          slug: "javascript-syntax",
          title: "JavaScript Syntax",
          lessonType: "video",
          position: 5,
          estimatedMinutes: 4,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "4BBlc_qDs8g",
        },
        {
          id: "les-js-1-6",
          slug: "javascript-comments",
          title: "JavaScript Comments",
          lessonType: "video",
          position: 6,
          estimatedMinutes: 2,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "8yroEebhaEk",
        },
        {
          id: "les-js-1-7",
          slug: "practice-first-javascript-statements",
          title: "Practice — Your First JavaScript Statements",
          lessonType: "practice",
          position: 7,
          estimatedMinutes: 10,
          isPreview: false,
          isPublished: true,
          isBonus: false,
        },
        {
          id: "les-js-1-8",
          slug: "quiz-javascript-basics",
          title: "Checkpoint — JavaScript Fundamentals Check",
          lessonType: "quiz",
          position: 8,
          estimatedMinutes: 5,
          isPreview: false,
          isPublished: true,
          isBonus: false,
        },
      ],
    },
    {
      id: "mod-js-2",
      title: "Variables & Data Values",
      description:
        "Master JavaScript containers for data storage: declare, initialize, and update values using var, let, and const with block scope.",
      position: 2,
      estimatedMinutes: 25,
      lessonCount: 5,
      isBonus: false,
      lessons: [
        {
          id: "les-js-2-1",
          slug: "javascript-variables",
          title: "JavaScript Variables",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 4,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "7xStNKTM3bE",
        },
        {
          id: "les-js-2-2",
          slug: "javascript-let-keyword",
          title: "The let Keyword",
          lessonType: "video",
          position: 2,
          estimatedMinutes: 3,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "-rpU6z9O88o",
        },
        {
          id: "les-js-2-3",
          slug: "javascript-const-keyword",
          title: "The const Keyword",
          lessonType: "video",
          position: 3,
          estimatedMinutes: 3,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "8UjRPL3Foh0",
        },
        {
          id: "les-js-2-4",
          slug: "practice-working-with-let-and-const",
          title: "Practice — Working with let and const",
          lessonType: "practice",
          position: 4,
          estimatedMinutes: 10,
          isPreview: false,
          isPublished: true,
          isBonus: false,
        },
        {
          id: "les-js-2-5",
          slug: "quiz-variables-and-scope",
          title: "Checkpoint — Variables & Scope Check",
          lessonType: "quiz",
          position: 5,
          estimatedMinutes: 5,
          isPreview: false,
          isPublished: true,
          isBonus: false,
        },
      ],
    },
    {
      id: "mod-js-3",
      title: "Operators & Expressions",
      description:
        "Perform calculations, evaluate expressions, and combine strings and numbers using JavaScript arithmetic and assignment operators.",
      position: 3,
      estimatedMinutes: 20,
      lessonCount: 3,
      isBonus: false,
      lessons: [
        {
          id: "les-js-3-1",
          slug: "javascript-arithmetic-operators",
          title: "JavaScript Arithmetic Operators",
          lessonType: "video",
          position: 1,
          estimatedMinutes: 3,
          isPreview: false,
          isPublished: true,
          isBonus: false,
          youtubeVideoId: "yEJ94pMiT-o",
        },
        {
          id: "les-js-3-2",
          slug: "practice-arithmetic-calculations",
          title: "Practice — Arithmetic & Expression Calculations",
          lessonType: "practice",
          position: 2,
          estimatedMinutes: 10,
          isPreview: false,
          isPublished: true,
          isBonus: false,
        },
        {
          id: "les-js-3-3",
          slug: "quiz-operators-and-expressions",
          title: "Checkpoint — Operators & Expressions Check",
          lessonType: "quiz",
          position: 3,
          estimatedMinutes: 5,
          isPreview: false,
          isPublished: true,
          isBonus: false,
        },
      ],
    },
    {
      id: "mod-js-4",
      title: "Practical Project & Integration",
      description:
        "Connect HTML structure, CSS styling, and JavaScript logic to build a fully interactive personal portfolio and greeting web page.",
      position: 4,
      estimatedMinutes: 30,
      lessonCount: 1,
      isBonus: false,
      lessons: [
        {
          id: "les-js-4-1",
          slug: "javascript-final-project",
          title: "Final Project — Build an Interactive Web Page",
          lessonType: "practice",
          position: 1,
          estimatedMinutes: 30,
          isPreview: false,
          isPublished: true,
          isBonus: false,
        },
      ],
    },
  ],
};

export const JS_LESSON_DETAILS_MAP: Record<string, {
  videoPosition: number;
  youtubeVideoId: string | null;
  videoUrl: string | null;
  sourceUrl: string | null;
  sourceChannel: string | null;
  playlistId: string | null;
  isBonus: boolean;
  keyTakeaway: string;
  summary: string;
  objectives: string[];
  content?: string;
}> = {
  "javascript-introduction": {
    videoPosition: 1,
    youtubeVideoId: "zofMnllkVfI",
    videoUrl: "https://www.youtube.com/watch?v=zofMnllkVfI",
    sourceUrl: "https://www.youtube.com/watch?v=zofMnllkVfI",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz",
    isBonus: false,
    keyTakeaway: "JavaScript adds interactivity and logic to web pages, transforming static HTML and CSS documents into responsive applications.",
    summary: "Learn what JavaScript is, how it adds dynamic behavior to web pages, and why it is the core programming language of the web.",
    objectives: [
      "Explain the role of JavaScript in web development",
      "Distinguish between HTML structure, CSS presentation, and JavaScript behavior",
      "Understand how web browsers parse and execute JavaScript",
    ],
  },
  "javascript-where-to": {
    videoPosition: 2,
    youtubeVideoId: "W-3vp79-d3Y",
    videoUrl: "https://www.youtube.com/watch?v=W-3vp79-d3Y",
    sourceUrl: "https://www.youtube.com/watch?v=W-3vp79-d3Y",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz",
    isBonus: false,
    keyTakeaway: "JavaScript can be embedded directly with <script> tags or loaded from external .js files for better maintainability.",
    summary: "Learn how to insert JavaScript inside the HTML head, before the closing body tag, and in clean external .js files.",
    objectives: [
      "Add internal JavaScript using the <script> element",
      "Link external script files using the src attribute",
      "Understand the advantages of external script files for caching and organization",
    ],
  },
  "javascript-output": {
    videoPosition: 3,
    youtubeVideoId: "we8YhT-NiOA",
    videoUrl: "https://www.youtube.com/watch?v=we8YhT-NiOA",
    sourceUrl: "https://www.youtube.com/watch?v=we8YhT-NiOA",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz",
    isBonus: false,
    keyTakeaway: "console.log() is ideal for debugging data, while innerHTML is the standard method to update HTML elements dynamically.",
    summary: "Discover the primary ways JavaScript displays information: innerHTML, document.write(), window.alert(), and console.log().",
    objectives: [
      "Log diagnostic messages using console.log()",
      "Modify web page contents dynamically with innerHTML",
      "Display simple modal popups using window.alert()",
    ],
  },
  "javascript-statements": {
    videoPosition: 4,
    youtubeVideoId: "ZjotKN861EI",
    videoUrl: "https://www.youtube.com/watch?v=ZjotKN861EI",
    sourceUrl: "https://www.youtube.com/watch?v=ZjotKN861EI",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz",
    isBonus: false,
    keyTakeaway: "A JavaScript statement is a distinct instruction executed by the browser; statements are terminated with semicolons.",
    summary: "Learn how JavaScript programs are constructed from statements, how statements are executed in sequence, and the role of semicolons.",
    objectives: [
      "Construct valid JavaScript statements",
      "Understand sequential line-by-line program execution",
      "Group related statements into code blocks with curly braces {}",
    ],
  },
  "javascript-syntax": {
    videoPosition: 5,
    youtubeVideoId: "4BBlc_qDs8g",
    videoUrl: "https://www.youtube.com/watch?v=4BBlc_qDs8g",
    sourceUrl: "https://www.youtube.com/watch?v=4BBlc_qDs8g",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz",
    isBonus: false,
    keyTakeaway: "JavaScript is strictly case-sensitive and distinguishes between fixed literal values and dynamic variable identifiers.",
    summary: "Understand fundamental JavaScript syntax rules, literals, identifiers, expressions, keywords, and case sensitivity.",
    objectives: [
      "Identify number and string literals",
      "Follow standard camelCase identifier naming conventions",
      "Avoid reserved keyword naming collisions in code",
    ],
  },
  "javascript-comments": {
    videoPosition: 6,
    youtubeVideoId: "8yroEebhaEk",
    videoUrl: "https://www.youtube.com/watch?v=8yroEebhaEk",
    sourceUrl: "https://www.youtube.com/watch?v=8yroEebhaEk",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz",
    isBonus: false,
    keyTakeaway: "Comments are ignored by the JavaScript engine and serve to explain code logic to yourself and collaborators.",
    summary: "Learn how to write single-line and multi-line comments to document logic and temporarily disable code during testing.",
    objectives: [
      "Write single-line comments using //",
      "Write multi-line block comments using /* */",
      "Use comments to document code intent and debug script flow",
    ],
  },
  "practice-first-javascript-statements": {
    videoPosition: 7,
    youtubeVideoId: null,
    videoUrl: null,
    sourceUrl: null,
    sourceChannel: null,
    playlistId: null,
    isBonus: false,
    keyTakeaway: "Writing clean, well-commented statements with consistent semicolons builds reliable coding habits.",
    summary: "Put what you learned into practice: write console logs, create script blocks, and update HTML element text dynamically.",
    objectives: [
      "Open and inspect the browser developer console",
      "Write clean JavaScript statements terminated by semicolons",
      "Update HTML element content using getElementById and innerHTML",
    ],
  },
  "quiz-javascript-basics": {
    videoPosition: 8,
    youtubeVideoId: null,
    videoUrl: null,
    sourceUrl: null,
    sourceChannel: null,
    playlistId: null,
    isBonus: false,
    keyTakeaway: "Checking your knowledge helps solidify key terminology and core syntax.",
    summary: "Test your understanding of JavaScript script tags, output methods, statements, and syntax rules.",
    objectives: [
      "Review script tags and where JavaScript executes",
      "Verify console.log and innerHTML differences",
    ],
  },
  "javascript-variables": {
    videoPosition: 9,
    youtubeVideoId: "7xStNKTM3bE",
    videoUrl: "https://www.youtube.com/watch?v=7xStNKTM3bE",
    sourceUrl: "https://www.youtube.com/watch?v=7xStNKTM3bE",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz",
    isBonus: false,
    keyTakeaway: "Variables give names to values so those values can be stored, referenced, and modified throughout a program.",
    summary: "Learn how variables act as containers for storing data values and how the assignment operator = assigns values to variable identifiers.",
    objectives: [
      "Understand the concept of variable storage in memory",
      "Declare variables and assign values using =",
      "Distinguish between variable declaration and variable value assignment",
    ],
  },
  "javascript-let-keyword": {
    videoPosition: 10,
    youtubeVideoId: "-rpU6z9O88o",
    videoUrl: "https://www.youtube.com/watch?v=-rpU6z9O88o",
    sourceUrl: "https://www.youtube.com/watch?v=-rpU6z9O88o",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz",
    isBonus: false,
    keyTakeaway: "Variables declared with let have block scope and cannot be accidentally redeclared in the same scope.",
    summary: "Discover why modern JavaScript uses the let keyword for block-scoped variables that can be reassigned over time.",
    objectives: [
      "Declare variables with let for mutable data",
      "Understand block scope {} boundaries with let",
      "Prevent accidental identifier redeclarations",
    ],
  },
  "javascript-const-keyword": {
    videoPosition: 11,
    youtubeVideoId: "8UjRPL3Foh0",
    videoUrl: "https://www.youtube.com/watch?v=8UjRPL3Foh0",
    sourceUrl: "https://www.youtube.com/watch?v=8UjRPL3Foh0",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz",
    isBonus: false,
    keyTakeaway: "Always use const by default unless a variable needs to be reassigned; const prevents bugs from unintended reassignment.",
    summary: "Learn how to create immutable variable bindings using const for constant values that should never be reassigned.",
    objectives: [
      "Declare constants using the const keyword",
      "Understand mandatory initialization at declaration time with const",
      "Follow the rule of thumb: const by default, let when reassignment is needed",
    ],
  },
  "practice-working-with-let-and-const": {
    videoPosition: 12,
    youtubeVideoId: null,
    videoUrl: null,
    sourceUrl: null,
    sourceChannel: null,
    playlistId: null,
    isBonus: false,
    keyTakeaway: "Knowing when to use const versus let ensures code intent is clear and prevents unexpected mutations.",
    summary: "Practice choosing the right declaration keyword: manage user scores, constants, and changing values in JavaScript.",
    objectives: [
      "Declare immutable values with const",
      "Declare and reassign mutable variables with let",
      "Inspect variable types and values in console outputs",
    ],
  },
  "quiz-variables-and-scope": {
    videoPosition: 13,
    youtubeVideoId: null,
    videoUrl: null,
    sourceUrl: null,
    sourceChannel: null,
    playlistId: null,
    isBonus: false,
    keyTakeaway: "Mastering let and const is essential for all modern JavaScript development.",
    summary: "Test your understanding of var, let, const, and block scoping in JavaScript.",
    objectives: [
      "Verify understanding of variable immutability with const",
      "Identify valid and invalid let declarations",
    ],
  },
  "javascript-arithmetic-operators": {
    videoPosition: 14,
    youtubeVideoId: "yEJ94pMiT-o",
    videoUrl: "https://www.youtube.com/watch?v=yEJ94pMiT-o",
    sourceUrl: "https://www.youtube.com/watch?v=yEJ94pMiT-o",
    sourceChannel: "W3Schools.com",
    playlistId: "PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz",
    isBonus: false,
    keyTakeaway: "Arithmetic operators perform mathematical calculations on numbers and can concatenate strings with the + operator.",
    summary: "Master arithmetic operators: addition (+), subtraction (-), multiplication (*), division (/), modulus (%), exponentiation (**), increment (++), and decrement (--).",
    objectives: [
      "Perform arithmetic operations with +, -, *, /, %, and **",
      "Apply increment (++) and decrement (--) shorthand operators",
      "Understand string concatenation with the + operator",
    ],
  },
  "practice-arithmetic-calculations": {
    videoPosition: 15,
    youtubeVideoId: null,
    videoUrl: null,
    sourceUrl: null,
    sourceChannel: null,
    playlistId: null,
    isBonus: false,
    keyTakeaway: "Combining arithmetic operators with variables allows JavaScript to perform dynamic calculations on user data.",
    summary: "Solve real-world calculation problems: build a shopping cart price totalizer and calculate percentage discounts.",
    objectives: [
      "Compute mathematical expressions accurately",
      "Use parentheses to control operator precedence",
      "Concatenate string labels with calculated numeric values",
    ],
  },
  "quiz-operators-and-expressions": {
    videoPosition: 16,
    youtubeVideoId: null,
    videoUrl: null,
    sourceUrl: null,
    sourceChannel: null,
    playlistId: null,
    isBonus: false,
    keyTakeaway: "Solid arithmetic knowledge prevents math errors in web calculations and logic.",
    summary: "Review your understanding of JavaScript arithmetic, assignment, and increment operators.",
    objectives: [
      "Identify division remainders with modulus %",
      "Understand string type coercion with addition +",
    ],
  },
  "javascript-final-project": {
    videoPosition: 17,
    youtubeVideoId: null,
    videoUrl: null,
    sourceUrl: null,
    sourceChannel: null,
    playlistId: null,
    isBonus: false,
    keyTakeaway: "Connecting HTML, CSS, and JavaScript into a cohesive page is the foundational milestone of front-end web development.",
    summary: "Combine HTML structure, CSS styling, and JavaScript variables, statements, and output to create an interactive web page project.",
    objectives: [
      "Integrate HTML structure, CSS styling, and JavaScript logic",
      "Use variables, statements, and event-driven DOM updates",
      "Create a working interactive web project portfolio item",
    ],
  },
};

export const ALL_STATIC_COURSES: CourseDetail[] = [
  HTML_FUNDAMENTALS_COURSE,
  CSS_FUNDAMENTALS_COURSE,
  JAVASCRIPT_FUNDAMENTALS_COURSE,
];

export const ALL_STATIC_SUMMARIES: CourseSummary[] = [
  HTML_FUNDAMENTALS_SUMMARY,
  CSS_FUNDAMENTALS_SUMMARY,
  JAVASCRIPT_FUNDAMENTALS_SUMMARY,
];

export const ALL_LESSON_DETAILS_MAP = {
  ...HTML_LESSON_DETAILS_MAP,
  ...CSS_LESSON_DETAILS_MAP,
  ...JS_LESSON_DETAILS_MAP,
};

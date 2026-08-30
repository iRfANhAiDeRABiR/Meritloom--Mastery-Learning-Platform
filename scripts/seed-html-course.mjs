import { readFileSync, existsSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  const envContent = readFileSync(".env.local", "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...vals] = trimmed.split("=");
    if (key && vals.length > 0) {
      process.env[key.trim()] = vals.join("=").trim();
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedHtmlCourse() {
  console.log("🚀 Starting HTML Fundamentals Course Seed...");

  // 1. Category
  console.log("1. Seeding Category: Web Development...");
  const { data: category, error: catErr } = await supabase
    .from("categories")
    .upsert(
      {
        slug: "web-development",
        name: "Web Development",
        description:
          "Learn foundational technologies to build accessible, high-performance web applications.",
        icon_name: "Layers",
        position: 1,
        is_active: true,
      },
      { onConflict: "slug" },
    )
    .select("id")
    .single();

  if (catErr) {
    console.error("Error upserting category:", catErr);
    return;
  }

  const categoryId = category.id;
  console.log(`✅ Category ID: ${categoryId}`);

  // 2. Course
  console.log("2. Seeding Course: HTML Fundamentals...");
  const { data: course, error: courseErr } = await supabase
    .from("courses")
    .upsert(
      {
        slug: "html-fundamentals",
        title: "HTML Fundamentals",
        summary:
          "Learn the foundations of HTML and build well-structured web pages using headings, text, links, images, forms, tables and semantic HTML.",
        description:
          "HTML is the foundation of every website. In this beginner-friendly course, learners will understand how web pages are structured using HTML and gradually build confidence with the most important HTML elements. The course starts with the basic document structure and then covers text, links, images, lists, tables, forms and semantic HTML. Lessons use real video tutorials together with short Meritloom lesson summaries and practice opportunities. No previous web-development experience is required.",
        category_id: categoryId,
        difficulty: "beginner",
        language: "English",
        estimated_minutes: 285,
        is_free: true,
        is_published: true,
        published_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    )
    .select("id")
    .single();

  if (courseErr) {
    console.error("Error upserting course:", courseErr);
    return;
  }

  const courseId = course.id;
  console.log(`✅ Course ID: ${courseId}`);

  // 3. Learning Outcomes
  console.log("3. Seeding Learning Outcomes...");
  const outcomes = [
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
  ];

  await supabase.from("course_learning_outcomes").delete().eq("course_id", courseId);
  const outcomeRows = outcomes.map((outcome, idx) => ({
    course_id: courseId,
    outcome,
    position: idx + 1,
  }));
  const { error: outErr } = await supabase
    .from("course_learning_outcomes")
    .insert(outcomeRows);
  if (outErr) console.warn("Learning outcomes note:", outErr.message);

  // 4. Prerequisites
  console.log("4. Seeding Prerequisites...");
  const prerequisites = [
    "No previous coding experience required",
    "Basic computer skills",
    "A modern web browser",
    "A text editor such as VS Code",
  ];

  await supabase.from("course_prerequisites").delete().eq("course_id", courseId);
  const prereqRows = prerequisites.map((prerequisite, idx) => ({
    course_id: courseId,
    prerequisite,
    position: idx + 1,
  }));
  const { error: preErr } = await supabase
    .from("course_prerequisites")
    .insert(prereqRows);
  if (preErr) console.warn("Prerequisites note:", preErr.message);

  // 5. Skills
  console.log("5. Seeding Skills...");
  const skills = [
    { name: "HTML", slug: "html" },
    { name: "Semantic HTML", slug: "semantic-html" },
    { name: "HTML Forms", slug: "html-forms" },
    { name: "Web Development", slug: "web-development" },
    { name: "Web Accessibility", slug: "web-accessibility" },
    { name: "Web Page Structure", slug: "web-page-structure" },
  ];

  const skillIds = [];
  for (const s of skills) {
    const { data: sk } = await supabase
      .from("skills")
      .upsert({ name: s.name, slug: s.slug, is_active: true }, { onConflict: "slug" })
      .select("id")
      .single();
    if (sk) skillIds.push(sk.id);
  }

  await supabase.from("course_skills").delete().eq("course_id", courseId);
  if (skillIds.length > 0) {
    await supabase.from("course_skills").insert(
      skillIds.map((skill_id) => ({
        course_id: courseId,
        skill_id,
      })),
    );
  }

  // 6. Modules and Lessons Data
  const modulesData = [
    {
      slug: "getting-started",
      title: "Getting Started with HTML",
      description:
        "Understand what HTML is, set up your development environment in VS Code, and create your first valid HTML5 document.",
      position: 1,
      estimated_minutes: 38,
      lessons: [
        {
          slug: "what-is-html-and-editor-setup",
          title: "What is HTML & Setting Up Your Editor",
          summary:
            "Discover what HTML is, how it works in the browser, and how to set up Visual Studio Code with the Live Server extension for web development.",
          lesson_type: "video",
          video_url: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=55s",
          key_takeaway:
            "HTML (HyperText Markup Language) describes the structure of web pages using elements denoted by tags.",
          estimated_minutes: 19,
          position: 1,
          is_preview: true,
          content:
            "## Introduction to Web Development\n\nHTML stands for **HyperText Markup Language**. It is the standard markup language used to structure content on the web. Every web page you visit—from news websites to video platforms—relies on HTML as its structural backbone.\n\n### Essential Tools\n\nTo begin coding HTML, you only need two tools:\n\n1. **A Code Editor**: We recommend [Visual Studio Code (VS Code)](https://code.visualstudio.com/), a free and powerful editor.\n2. **A Web Browser**: Google Chrome, Firefox, Safari, or Microsoft Edge.\n\n### Recommended VS Code Extensions\n\n- **Live Server**: Enables a local development server with live browser reload as soon as you save your files.\n- **Prettier**: Automatically formats your HTML markup for maximum readability.",
          objectives: [
            "Understand what HTML is and how browsers interpret markup",
            "Install and configure Visual Studio Code for web development",
            "Use the Live Server extension for instant browser reloading",
          ],
        },
        {
          slug: "html-document-structure-and-head",
          title: "HTML Document Structure & The Head Element",
          summary:
            "Understand the boilerplate anatomy of an HTML5 document including <!DOCTYPE html>, <html>, <head>, <meta>, <title>, and <body> tags.",
          lesson_type: "video",
          video_url: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=1213s",
          key_takeaway:
            "The <head> element contains metadata about the webpage, while the <body> element contains the visible content.",
          estimated_minutes: 9,
          position: 2,
          is_preview: false,
          content:
            "## The Anatomy of an HTML Document\n\nEvery standard HTML5 document follows a clear, predictable structure:\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>My First Web Page</title>\n  </head>\n  <body>\n    <h1>Hello World!</h1>\n    <p>Welcome to web development with Meritloom.</p>\n  </body>\n</html>\n```\n\n### Breakdown of Key Elements\n\n- `<!DOCTYPE html>`: Informs the browser that this document is HTML5.\n- `<html lang=\"en\">`: The root element wrapping the whole document, specifying English as the primary language.\n- `<head>`: Container for document metadata that is not directly rendered on the page.\n- `<meta charset=\"UTF-8\">`: Specifies the UTF-8 character encoding covering almost all human languages.\n- `<title>`: Defines the document title displayed in the browser tab and search results.\n- `<body>`: Contains all visible elements (headings, text, images, buttons).",
          objectives: [
            "Declare a standard HTML5 <!DOCTYPE html> doctype",
            "Configure character encoding with <meta charset=\"UTF-8\">",
            "Set an accessible browser page title with <title>",
          ],
        },
        {
          slug: "practice-create-first-html-document",
          title: "Practice: Create Your First HTML Document",
          summary:
            "Write a clean, valid HTML5 boilerplate document from scratch and preview it in your browser.",
          lesson_type: "practice",
          video_url: null,
          key_takeaway:
            "Every valid HTML page begins with <!DOCTYPE html> followed by <html>, <head>, and <body> tags.",
          estimated_minutes: 10,
          position: 3,
          is_preview: false,
          content:
            "## Exercise: Build Your First HTML Page\n\nIn this exercise, you will create a new HTML file called `index.html` on your computer.\n\n### Instructions\n\n1. Open VS Code and create a new project folder named `my-first-website`.\n2. Inside the folder, create a file named `index.html`.\n3. Type the complete HTML5 document structure without using Emmet shortcuts.\n4. Set the page `<title>` to **\"Learner Profile | Meritloom\"**.\n5. Inside the `<body>`, add an `<h1>` heading with your name and a `<p>` paragraph describing your learning goals.\n6. Open the file in your browser using Live Server or by double-clicking the file.\n\n### Expected Solution\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Learner Profile | Meritloom</title>\n  </head>\n  <body>\n    <h1>Alex Mercer</h1>\n    <p>I am learning HTML on Meritloom to build accessible, modern websites.</p>\n  </body>\n</html>\n```",
          objectives: [
            "Write a complete HTML5 boilerplate from scratch",
            "Verify proper element nesting and tag closures",
            "View the rendered page in a browser",
          ],
        },
      ],
    },
    {
      slug: "text-content-structure",
      title: "Text & Content Structure",
      description:
        "Master headings, paragraphs, horizontal rules, line breaks, and semantic text formatting tags.",
      position: 2,
      estimated_minutes: 35,
      lessons: [
        {
          slug: "headings-paragraphs-text-formatting",
          title: "Headings, Paragraphs & Text Formatting",
          summary:
            "Learn how to structure readable content using heading levels (h1 through h6), paragraphs, line breaks, horizontal rules, and semantic text formatting.",
          lesson_type: "video",
          video_url: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=1742s",
          key_takeaway:
            "Maintain a single <h1> per page and nest headings sequentially without skipping levels for accessibility and SEO.",
          estimated_minutes: 20,
          position: 1,
          is_preview: false,
          content:
            "## Heading Hierarchy & Formatting\n\nHTML provides 6 levels of headings: `<h1>` through `<h6>`. `<h1>` is the most important heading on the page, representing the primary topic.\n\n### Formatting Tags\n\n- `<strong>`: Represents strong importance or urgency (typically rendered bold).\n- `<em>`: Represents stress emphasis (typically rendered italic).\n- `<hr>`: Represents a thematic break or transition between topics.\n- `<br>`: Inserts a line break inside a paragraph or poem.\n\n```html\n<h1>Web Development Fundamentals</h1>\n<p>HTML is <strong>essential</strong> for all web builders.</p>\n<hr>\n<h2>Getting Started</h2>\n<p>Practice every day to build <em>lasting</em> confidence.</p>\n```",
          objectives: [
            "Apply heading levels h1 through h6 in hierarchical order",
            "Format text using <p>, <hr>, <br>, <strong>, and <em>",
            "Distinguish between visual formatting and semantic meaning",
          ],
        },
        {
          slug: "html-comments-and-readability",
          title: "HTML Comments & Code Readability",
          summary:
            "Learn how to use HTML comments <!-- comment --> to annotate sections, leave notes for developers, and organize complex templates.",
          lesson_type: "article",
          video_url: null,
          key_takeaway:
            "HTML comments are ignored by the browser parser but remain visible in page source code.",
          estimated_minutes: 5,
          position: 2,
          is_preview: false,
          content:
            "## Writing Comments in HTML\n\nComments are snippets of text inside your HTML file that are ignored by the web browser when rendering the page.\n\n### Syntax\n\n```html\n<!-- This is a single line HTML comment -->\n\n<!--\n  Multi-line comments are helpful\n  for explaining large blocks of code\n  or leaving developer notes.\n-->\n```\n\n### Best Practices\n\n- Use comments to indicate the start and end of major page sections (e.g. `<!-- START: Main Navigation -->`).\n- Never put sensitive information (passwords, private API keys) in HTML comments, as anyone can view page source.",
          objectives: [
            "Write single-line and multi-line HTML comments",
            "Use comments to document page sections effectively",
          ],
        },
        {
          slug: "practice-structuring-article",
          title: "Practice: Structuring an Article with Headings & Paragraphs",
          summary:
            "Format a multi-section article using sequential headings, paragraphs, and emphasis tags.",
          lesson_type: "practice",
          video_url: null,
          key_takeaway:
            "Clear visual and semantic hierarchy makes content easier to navigate for both screen readers and human readers.",
          estimated_minutes: 10,
          position: 3,
          is_preview: false,
          content:
            "## Exercise: Build an Article Structure\n\nCreate a new file `article.html` and structure a blog post about learning web development.\n\n### Requirements\n\n- One main `<h1>` title\n- Two sections each introduced by an `<h2>` heading\n- At least 3 `<p>` paragraphs containing `<strong>` and `<em>` tags\n- An `<hr>` divider between sections\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <title>The Journey into Code</title>\n  </head>\n  <body>\n    <h1>The Journey into Code</h1>\n    <p>Starting out in programming feels <strong>exciting</strong> yet challenging.</p>\n    <hr>\n    <h2>Why HTML Matters</h2>\n    <p>Without HTML, there is <em>no structure</em> to display on the web.</p>\n  </body>\n</html>\n```",
          objectives: [
            "Build an article with h1, h2, and h3 headings",
            "Format key terms using <strong> and <em>",
            "Validate proper tag nesting",
          ],
        },
      ],
    },
    {
      slug: "lists-and-tables",
      title: "Lists & Tables",
      description:
        "Organize items and tabular data using unordered lists, ordered lists, nested lists, and accessible data tables.",
      position: 3,
      estimated_minutes: 38,
      lessons: [
        {
          slug: "ordered-unordered-nested-lists",
          title: "Ordered, Unordered & Nested Lists",
          summary:
            "Explore unordered lists (<ul>), ordered lists (<ol>), list items (<li>), and description lists (<dl>) along with list nesting.",
          lesson_type: "video",
          video_url: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=2985s",
          key_takeaway:
            "Use <ol> when sequence matters and <ul> when items are non-sequential. Always place <li> elements directly inside <ul> or <ol>.",
          estimated_minutes: 10,
          position: 1,
          is_preview: false,
          content:
            "## Lists in HTML\n\nLists allow you to group related items clearly.\n\n### Unordered Lists (`<ul>`)\n\nUsed when the order of list items does not affect the meaning:\n\n```html\n<ul>\n  <li>HTML5</li>\n  <li>CSS3</li>\n  <li>JavaScript</li>\n</ul>\n```\n\n### Ordered Lists (`<ol>`)\n\nUsed for step-by-step instructions or ranked items:\n\n```html\n<ol>\n  <li>Install code editor</li>\n  <li>Write HTML boilerplate</li>\n  <li>Preview in browser</li>\n</ol>\n```\n\n### Nested Lists\n\nLists can be nested inside an `<li>` element to create sub-menus or hierarchical outlines.",
          objectives: [
            "Create numbered ordered lists and bulleted unordered lists",
            "Build multi-level nested lists",
            "Create description lists with <dl>, <dt>, and <dd>",
          ],
        },
        {
          slug: "creating-and-structuring-html-tables",
          title: "Creating & Structuring HTML Tables",
          summary:
            "Learn how to present structured tabular data using <table>, <caption>, <thead>, <tbody>, <tr>, <th>, and <td> elements.",
          lesson_type: "video",
          video_url: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=8693s",
          key_takeaway:
            "Use <th> elements with the scope attribute to provide accessible headers for rows and columns in tabular data.",
          estimated_minutes: 16,
          position: 2,
          is_preview: false,
          content:
            "## Tabular Data in HTML\n\nHTML tables present information in a grid of rows and columns.\n\n```html\n<table>\n  <caption>Weekly Learning Schedule</caption>\n  <thead>\n    <tr>\n      <th scope=\"col\">Day</th>\n      <th scope=\"col\">Topic</th>\n      <th scope=\"col\">Duration</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Monday</td>\n      <td>HTML Basics</td>\n      <td>45 min</td>\n    </tr>\n    <tr>\n      <td>Tuesday</td>\n      <td>Links & Lists</td>\n      <td>45 min</td>\n    </tr>\n  </tbody>\n</table>\n```\n\n### Essential Table Elements\n\n- `<table>`: The wrapper for all table content.\n- `<caption>`: Describes the table purpose for accessibility.\n- `<thead>` & `<tbody>`: Separate table header rows from data body rows.\n- `<tr>`: Table row.\n- `<th>`: Header cell with `scope=\"col\"` or `scope=\"row\"`.\n- `<td>`: Standard data cell.",
          objectives: [
            "Structure tables with <thead>, <tbody>, and <tfoot>",
            "Define accessible row and column headers with <th scope=\"...\">",
            "Merge cells using colspan and rowspan attributes",
          ],
        },
        {
          slug: "practice-build-schedule-table",
          title: "Practice: Build a Student Schedule Table",
          summary:
            "Construct an accessible weekly class schedule table with proper headings, captions, and merged cells.",
          lesson_type: "practice",
          video_url: null,
          key_takeaway:
            "Tables should strictly be used for tabular data, never for general page layouts.",
          estimated_minutes: 12,
          position: 3,
          is_preview: false,
          content:
            "## Exercise: Course Schedule Table\n\nCreate an HTML file `schedule.html` containing an accessible table.\n\n### Checklist\n\n1. Include a descriptive `<caption>`\n2. Define a `<thead>` with column header cells (`<th scope=\"col\">`)\n3. Include at least 4 rows in `<tbody>`\n4. Use `colspan=\"2\"` to span a lunch break across multiple columns\n\n```html\n<table>\n  <caption>Meritloom Study Plan</caption>\n  <thead>\n    <tr>\n      <th scope=\"col\">Time</th>\n      <th scope=\"col\">Module</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>9:00 AM</td>\n      <td>HTML Tables</td>\n    </tr>\n    <tr>\n      <td colspan=\"2\">Break</td>\n    </tr>\n  </tbody>\n</table>\n```",
          objectives: [
            "Create a multi-column table with a descriptive <caption>",
            "Use <thead> and <tbody> blocks properly",
            "Implement colspan or rowspan to represent spanning schedule blocks",
          ],
        },
      ],
    },
    {
      slug: "links-and-navigation",
      title: "Links & Navigation",
      description:
        "Master hyperlinks, page navigation, absolute vs relative paths, in-page bookmarks, and security attributes.",
      position: 4,
      estimated_minutes: 46,
      lessons: [
        {
          slug: "anchor-elements-and-page-links",
          title: "Anchor Elements & Page Links",
          summary:
            "Master the anchor element (<a>) to connect pages, link to external sites, create in-page jump links, and configure target=\"_blank\" safely.",
          lesson_type: "video",
          video_url: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=3595s",
          key_takeaway:
            "When opening external links in a new tab with target=\"_blank\", always include rel=\"noopener noreferrer\" for security.",
          estimated_minutes: 30,
          position: 1,
          is_preview: false,
          content:
            "## The Power of the Hyperlink\n\nThe web is interconnected through hyperlinks created using the `<a>` (anchor) element and the `href` attribute.\n\n### External Links\n\n```html\n<a href=\"https://developer.mozilla.org\" target=\"_blank\" rel=\"noopener noreferrer\">\n  Visit MDN Web Docs\n</a>\n```\n\n### Internal Page Links\n\n```html\n<a href=\"about.html\">About Us</a>\n<a href=\"contact.html\">Contact</a>\n```\n\n### In-Page Jump Links\n\n```html\n<!-- Link trigger -->\n<a href=\"#faq-section\">Jump to FAQ</a>\n\n<!-- Target section -->\n<h2 id=\"faq-section\">Frequently Asked Questions</h2>\n```",
          objectives: [
            "Create links using the href attribute",
            "Link between multiple local HTML files using relative paths",
            "Implement in-page jump navigation using id attributes",
            "Secure external links with rel=\"noopener noreferrer\"",
          ],
        },
        {
          slug: "relative-vs-absolute-urls",
          title: "Relative vs Absolute URLs Explained",
          summary:
            "Understand the vital differences between absolute URLs (full web addresses) and relative file paths (parent, sibling, and subfolder references).",
          lesson_type: "article",
          video_url: null,
          key_takeaway:
            "Use relative paths for internal website assets and pages; use absolute URLs for external domains.",
          estimated_minutes: 6,
          position: 2,
          is_preview: false,
          content:
            "## Understanding Paths in Web Development\n\n- **Absolute URLs**: Include the protocol and domain name (e.g. `https://example.com/about.html`). Used for external websites.\n- **Relative URLs**: Point to a file relative to the current file location on your server.\n\n### Relative Path Cheatsheet\n\n- `about.html`: Sibling file in the same folder.\n- `pages/about.html`: File inside a subfolder named `pages`.\n- `../index.html`: Go up one directory level to find `index.html`.",
          objectives: [
            "Navigate up directory trees using ../",
            "Reference files in subdirectories using folder/file.html",
          ],
        },
        {
          slug: "practice-build-navigation-bar",
          title: "Practice: Build a Multi-Page Navigation Bar",
          summary:
            "Construct a multi-page website header navigation bar containing links to Home, About, and Contact pages.",
          lesson_type: "practice",
          video_url: null,
          key_takeaway:
            "Wrap website navigation in a semantic <nav> element and use an unordered list (<ul>) for menu items.",
          estimated_minutes: 10,
          position: 3,
          is_preview: false,
          content:
            "## Exercise: Site Navigation Bar\n\nBuild a standard navigation header component in HTML.\n\n### Requirements\n\n```html\n<header>\n  <nav aria-label=\"Main Navigation\">\n    <ul>\n      <li><a href=\"index.html\">Home</a></li>\n      <li><a href=\"about.html\">About</a></li>\n      <li><a href=\"courses.html\">Courses</a></li>\n      <li><a href=\"contact.html\">Contact</a></li>\n    </ul>\n  </nav>\n</header>\n```",
          objectives: [
            "Group navigation links inside <nav> and <ul>",
            "Connect relative links across multiple pages",
            "Add in-page jump anchor links",
          ],
        },
      ],
    },
    {
      slug: "images-and-media",
      title: "Images & Media",
      description:
        "Learn how to embed images, audio, and video with accessible alternative text, figures, and dimensions.",
      position: 5,
      estimated_minutes: 48,
      lessons: [
        {
          slug: "adding-images-alt-text-figures",
          title: "Adding Images, Alt Text & Accessible Figures",
          summary:
            "Learn how to embed images using the <img> tag, write descriptive alt text for accessibility, specify width and height, and use <figure> and <figcaption>.",
          lesson_type: "video",
          video_url: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=5438s",
          key_takeaway:
            "Every <img> must have an alt attribute. Provide concise, descriptive text for informative images or alt=\"\" for decorative images.",
          estimated_minutes: 30,
          position: 1,
          is_preview: false,
          content:
            "## Working with Images in HTML\n\nThe `<img>` element embeds visual graphics into web pages. It is a self-closing void element.\n\n```html\n<figure>\n  <img\n    src=\"images/html-logo.png\"\n    alt=\"HTML5 shield logo on orange background\"\n    width=\"300\"\n    height=\"200\"\n    loading=\"lazy\"\n  >\n  <figcaption>Figure 1: Official HTML5 Logo</figcaption>\n</figure>\n```\n\n### Essential Attributes\n\n- `src`: Path or URL of the image file.\n- `alt`: Text equivalent read by screen readers and shown if the image fails to load.\n- `width` & `height`: Prevents Cumulative Layout Shift (CLS) as pages load.\n- `loading=\"lazy\"`: Defers offscreen image loading until the user scrolls near.",
          objectives: [
            "Embed images with src, alt, width, and height attributes",
            "Write meaningful alt text for screen readers",
            "Wrap captioned images in <figure> and <figcaption>",
            "Prevent layout shifts by specifying aspect ratio dimensions",
          ],
        },
        {
          slug: "image-accessibility-best-practices",
          title: "Image Best Practices & Accessibility Basics",
          summary:
            "Explore modern image formats (WebP, SVG, PNG, JPG), loading=\"lazy\" performance optimization, and Web Content Accessibility Guidelines (WCAG).",
          lesson_type: "article",
          video_url: null,
          key_takeaway:
            "Using loading=\"lazy\" on below-the-fold images dramatically accelerates initial page load times.",
          estimated_minutes: 8,
          position: 2,
          is_preview: false,
          content:
            "## Image Optimization & Accessibility\n\n- **Photos**: Use WebP or JPG for high compression.\n- **Icons & Logos**: Use SVG (vector format) for crisp rendering at any resolution.\n- **Screenshots**: Use PNG or WebP with lossless compression.",
          objectives: [
            "Select appropriate image formats for photos versus logos",
            "Implement native browser lazy loading with loading=\"lazy\"",
          ],
        },
        {
          slug: "practice-product-showcase-images",
          title: "Practice: Build a Product Showcase with Images",
          summary:
            "Create a responsive product showcase card using <figure>, <figcaption>, descriptive alt text, and linked imagery.",
          lesson_type: "practice",
          video_url: null,
          key_takeaway:
            "Combining <a> and <img> allows creating accessible clickable image links.",
          estimated_minutes: 10,
          position: 3,
          is_preview: false,
          content:
            "## Exercise: Product Card\n\n```html\n<article>\n  <figure>\n    <a href=\"product-details.html\">\n      <img\n        src=\"taco.jpg\"\n        alt=\"Two crispy beef tacos topped with fresh salsa and cilantro\"\n        width=\"400\"\n        height=\"300\"\n      >\n    </a>\n    <figcaption>Signature Street Tacos — $9.50</figcaption>\n  </figure>\n  <p>Fresh handmade corn tortillas with slow-cooked shredded beef.</p>\n</article>\n```",
          objectives: [
            "Wrap an image inside a <figure> element",
            "Add a descriptive <figcaption> with price and details",
            "Ensure all accessibility criteria are met",
          ],
        },
      ],
    },
    {
      slug: "semantic-html5",
      title: "Semantic HTML5",
      description:
        "Understand landmark layout tags including header, nav, main, section, article, aside, and footer.",
      position: 6,
      estimated_minutes: 43,
      lessons: [
        {
          slug: "semantic-html5-layout-elements",
          title: "Semantic HTML5 Layout Elements",
          summary:
            "Learn why semantic elements like <header>, <nav>, <main>, <article>, <section>, <aside>, and <footer> are superior to generic <div> containers.",
          lesson_type: "video",
          video_url: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=7258s",
          key_takeaway:
            "Semantic HTML elements communicate the role and purpose of content to browsers, screen readers, and search engines.",
          estimated_minutes: 24,
          position: 1,
          is_preview: false,
          content:
            "## The Power of Semantic HTML\n\nSemantic elements clearly describe their meaning to both the browser and the developer.\n\n### Common Semantic Landmarks\n\n- `<header>`: Introductory content or navigation header.\n- `<nav>`: Major navigation links.\n- `<main>`: The dominant, unique content of the page (only one `<main>` per page).\n- `<article>`: Self-contained content that could be syndicated (e.g. blog post, product card).\n- `<section>`: A thematic grouping of content, typically with a heading.\n- `<aside>`: Tangentially related content (sidebar, related links, callouts).\n- `<footer>`: Copyright, author info, or secondary links.",
          objectives: [
            "Replace generic <div> tags with semantic HTML5 structural elements",
            "Distinguish between <article> and <section>",
            "Organize main content landmarks with <header>, <main>, and <footer>",
          ],
        },
        {
          slug: "why-semantic-html-matters",
          title: "Why Semantic HTML Matters for SEO & Accessibility",
          summary:
            "Examine how screen readers navigate landmark regions and how search engine crawlers rank semantically structured documents.",
          lesson_type: "article",
          video_url: null,
          key_takeaway:
            "Landmark elements allow assistive technology users to quickly jump between main content, navigation, and supplementary info.",
          estimated_minutes: 7,
          position: 2,
          is_preview: false,
          content:
            "## Accessibility & Search Engine Ranking\n\nAssistive technologies provide shortcut keys (e.g. \"D\" in NVDA or \"R\" in VoiceOver) allowing users to leap directly between landmarks.\n\nWhen a page is composed exclusively of `<div>` tags, screen reader users are forced to listen through the entire page linearly.",
          objectives: [
            "Explain accessibility landmark navigation",
            "Understand how semantic structure boosts search engine discoverability",
          ],
        },
        {
          slug: "practice-refactor-to-semantic-html",
          title: "Practice: Refactor a Non-Semantic Page to Semantic HTML",
          summary:
            "Take a legacy div-heavy webpage and refactor it into clean, accessible HTML5 semantic landmarks.",
          lesson_type: "practice",
          video_url: null,
          key_takeaway:
            "Refactoring to semantic tags improves readability and accessibility without requiring CSS changes.",
          estimated_minutes: 12,
          position: 3,
          is_preview: false,
          content:
            "## Exercise: Semantic Refactor\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <title>Semantic Magazine</title>\n  </head>\n  <body>\n    <header>\n      <h1>The Code Journal</h1>\n      <nav>\n        <a href=\"#latest\">Latest Articles</a>\n      </nav>\n    </header>\n    <main>\n      <article id=\"latest\">\n        <h2>Mastering Semantic HTML</h2>\n        <p>Using the right elements elevates your code quality.</p>\n      </article>\n      <aside>\n        <h3>Author Bio</h3>\n        <p>Dave Gray is a passionate educator.</p>\n      </aside>\n    </main>\n    <footer>\n      <p>&copy; 2026 The Code Journal</p>\n    </footer>\n  </body>\n</html>\n```",
          objectives: [
            "Identify and replace generic div containers with semantic elements",
            "Validate proper nesting of <main>, <section>, and <article>",
          ],
        },
      ],
    },
    {
      slug: "forms-and-user-input",
      title: "HTML Forms & User Input",
      description:
        "Build forms, inputs, labels, textareas, selects, radio buttons, checkboxes, fieldsets, and accessible validation.",
      position: 7,
      estimated_minutes: 67,
      lessons: [
        {
          slug: "building-forms-inputs-and-controls",
          title: "Building Forms, Inputs & Form Controls",
          summary:
            "Master HTML forms using <form>, <label>, <input> (text, email, password, number), <textarea>, <select>, radio buttons, checkboxes, and buttons.",
          lesson_type: "video",
          video_url: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=9642s",
          key_takeaway:
            "Always associate every input with a <label> using the for attribute matching the input id.",
          estimated_minutes: 44,
          position: 1,
          is_preview: false,
          content:
            "## Interactive Forms in HTML\n\nForms collect user input and submit it to a server.\n\n```html\n<form action=\"/submit\" method=\"post\">\n  <fieldset>\n    <legend>Contact Information</legend>\n    \n    <label for=\"user-name\">Your Name:</label>\n    <input type=\"text\" id=\"user-name\" name=\"name\" required>\n\n    <label for=\"user-email\">Email Address:</label>\n    <input type=\"email\" id=\"user-email\" name=\"email\" required>\n  </fieldset>\n\n  <button type=\"submit\">Submit Form</button>\n</form>\n```",
          objectives: [
            "Connect labels to inputs using matching for and id attributes",
            "Work with text, email, tel, password, number, and date input types",
            "Build radio button groups with shared name attributes",
            "Group related fields with <fieldset> and <legend>",
          ],
        },
        {
          slug: "accessible-form-validation",
          title: "Accessible Form Validation & Input Types",
          summary:
            "Learn how to enforce client-side form validation using required, pattern, min, max, and maxlength attributes.",
          lesson_type: "article",
          video_url: null,
          key_takeaway:
            "Native HTML5 validation attributes provide immediate accessible feedback without requiring custom JavaScript.",
          estimated_minutes: 8,
          position: 2,
          is_preview: false,
          content:
            "## Built-in HTML5 Form Validation\n\n- `required`: Field must not be empty.\n- `minlength` / `maxlength`: String length constraints.\n- `type=\"email\"` / `type=\"url\"`: Built-in syntax format verification.\n- `pattern=\"[0-9]{3}-[0-9]{4}\"`: Regular expression matching.",
          objectives: [
            "Use required, minlength, and maxlength for text constraints",
            "Specify email and URL formats with native input types",
            "Add helpful placeholder and autocomplete attributes",
          ],
        },
        {
          slug: "practice-user-registration-form",
          title: "Practice: Build a User Registration & Feedback Form",
          summary:
            "Construct a complete registration form with text inputs, radio selections, dropdown menus, checkboxes, and a submit button.",
          lesson_type: "practice",
          video_url: null,
          key_takeaway:
            "A well-structured form ensures every interactive control is accessible via keyboard and screen reader.",
          estimated_minutes: 15,
          position: 3,
          is_preview: false,
          content:
            "## Exercise: Registration Form\n\n```html\n<form action=\"#\" method=\"post\">\n  <fieldset>\n    <legend>Account Details</legend>\n    <label for=\"fullname\">Full Name:</label>\n    <input type=\"text\" id=\"fullname\" name=\"fullname\" required>\n    \n    <label for=\"role\">Primary Goal:</label>\n    <select id=\"role\" name=\"role\">\n      <option value=\"skills\">Build practical skills</option>\n      <option value=\"explore\">Explore something new</option>\n    </select>\n  </fieldset>\n  <button type=\"submit\">Sign Up</button>\n</form>\n```",
          objectives: [
            "Create a form with method=\"post\" and action=\"#\"",
            "Implement <fieldset> and <legend> for personal details",
            "Validate required fields natively",
          ],
        },
      ],
    },
    {
      slug: "capstone-project",
      title: "Capstone Project: Build Your First Website",
      description:
        "Combine everything you learned to build a complete multi-section restaurant or personal portfolio webpage using pure HTML.",
      position: 8,
      estimated_minutes: 67,
      lessons: [
        {
          slug: "project-walkthrough-little-taco-shop",
          title: "Project Walkthrough: The Little Taco Shop Webpage",
          summary:
            "Watch the full step-by-step project build of the Little Taco Shop website, combining document structure, navigation, images, tables, and forms.",
          lesson_type: "video",
          video_url: "https://www.youtube.com/watch?v=kUMe1FH4CHE&t=12316s",
          key_takeaway:
            "A complete HTML website combines semantic landmarks, accessible media, structured data, and interactive forms into cohesive pages.",
          estimated_minutes: 42,
          position: 1,
          is_preview: false,
          content:
            "## The Capstone Project: Little Taco Shop\n\nIn this walkthrough video, Dave Gray builds a complete multi-page HTML website from scratch.\n\n### Features Demonstrated\n\n1. Proper semantic layout (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)\n2. Internal navigation across multiple pages\n3. High-quality accessible images with `<figure>` and `<figcaption>`\n4. Business hours data table\n5. Customer feedback and order contact form",
          objectives: [
            "Plan the multi-page structure of a real-world website",
            "Combine header navigation, article content, hours table, and contact form",
            "Review complete HTML5 best practices in action",
          ],
        },
        {
          slug: "capstone-build-personal-profile-webpage",
          title: "Capstone: Build Your Personal Profile Webpage",
          summary:
            "Combine everything you have learned in this course to build your own multi-section personal profile or portfolio webpage using pure semantic HTML.",
          lesson_type: "practice",
          video_url: null,
          key_takeaway:
            "Writing clean, semantic HTML creates the strong structural backbone that you will style with CSS in the next course.",
          estimated_minutes: 25,
          position: 2,
          is_preview: false,
          content:
            "## Capstone Project: Personal Profile Webpage\n\nCongratulations on reaching the final lesson of HTML Fundamentals! Now it is time to build your own complete personal webpage.\n\n### Project Requirements\n\n- [x] Valid `<!DOCTYPE html>` and `<html lang=\"en\">` structure\n- [x] `<head>` with descriptive `<title>` and UTF-8 charset\n- [x] Semantic `<header>` with `<h1>` and navigation menu\n- [x] `<main>` section containing:\n  - About me biography with `<strong>` and `<em>` tags\n  - Profile image inside `<figure>` with descriptive `alt` and `<figcaption>`\n  - Unordered list of your technical skills\n  - Table listing projects or coursework completed\n  - Accessible contact form with name, email, topic select, and message textarea\n- [x] Semantic `<footer>` with copyright and social links with `target=\"_blank\"` and `rel=\"noopener noreferrer\"`\n\n### Next Step: CSS Fundamentals\n\nOnce your HTML structure is complete and validated, you will be ready for **Course 2: CSS Fundamentals** to bring your website to life with colors, layouts, and animations!",
          objectives: [
            "Build a complete HTML5 webpage from scratch",
            "Include a header, navigation bar, hero bio, skills list, project table, and contact form",
            "Validate semantic correctness and accessibility without styling",
          ],
        },
      ],
    },
  ];

  // Insert Modules & Lessons
  for (const m of modulesData) {
    console.log(`📂 Seeding Module ${m.position}: ${m.title}...`);
    const { data: mod, error: modErr } = await supabase
      .from("course_modules")
      .upsert(
        {
          course_id: courseId,
          slug: m.slug,
          title: m.title,
          description: m.description,
          position: m.position,
          estimated_minutes: m.estimated_minutes,
          is_published: true,
        },
        { onConflict: "course_id, slug" },
      )
      .select("id")
      .single();

    if (modErr) {
      console.error(`Error upserting module ${m.slug}:`, modErr);
      continue;
    }

    const moduleId = mod.id;

    for (const l of m.lessons) {
      console.log(`   📄 Lesson ${l.position}: ${l.title}...`);
      const { data: lessonRow, error: lErr } = await supabase
        .from("lessons")
        .upsert(
          {
            module_id: moduleId,
            slug: l.slug,
            title: l.title,
            summary: l.summary,
            lesson_type: l.lesson_type,
            video_url: l.video_url,
            key_takeaway: l.key_takeaway,
            estimated_minutes: l.estimated_minutes,
            position: l.position,
            is_preview: l.is_preview,
            is_published: true,
            content: l.content,
          },
          { onConflict: "slug" },
        )
        .select("id")
        .single();

      if (lErr) {
        console.error(`   ❌ Error upserting lesson ${l.slug}:`, lErr);
        continue;
      }

      const lessonId = lessonRow.id;

      // Lesson Objectives
      if (l.objectives && l.objectives.length > 0) {
        await supabase.from("lesson_objectives").delete().eq("lesson_id", lessonId);
        const objRows = l.objectives.map((objective, idx) => ({
          lesson_id: lessonId,
          objective,
          position: idx + 1,
        }));
        await supabase.from("lesson_objectives").insert(objRows);
      }
    }
  }

  console.log("🎉 HTML Fundamentals Course Successfully Seeded!");
}

seedHtmlCourse().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});

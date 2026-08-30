-- =========================================================
-- MERITLOOM COURSE 1 SEED: HTML Fundamentals
-- Idempotent seed script for HTML Fundamentals course,
-- modules, video lessons, practice exercises, learning outcomes,
-- prerequisites, skills, lesson objectives, and resources.
-- =========================================================

do $$
declare
  v_category_id uuid;
  v_course_id uuid;
  v_mod1_id uuid;
  v_mod2_id uuid;
  v_mod3_id uuid;
  v_mod4_id uuid;
  v_mod5_id uuid;
  v_mod6_id uuid;
  v_mod7_id uuid;
  v_mod8_id uuid;
  v_lesson_id uuid;
  v_skill_html_id uuid;
  v_skill_semantic_id uuid;
  v_skill_forms_id uuid;
  v_skill_webdev_id uuid;
  v_skill_a11y_id uuid;
  v_skill_structure_id uuid;
begin

  -- 1. UPSERT WEB DEVELOPMENT CATEGORY
  insert into public.categories (slug, name, description, icon_name, position, is_active)
  values (
    'web-development',
    'Web Development',
    'Learn foundational technologies to build accessible, high-performance web applications.',
    'Layers',
    1,
    true
  )
  on conflict (slug) do update set
    name = excluded.name,
    description = excluded.description,
    is_active = true
  returning id into v_category_id;

  -- 2. UPSERT HTML FUNDAMENTALS COURSE
  insert into public.courses (
    slug,
    title,
    summary,
    description,
    category_id,
    difficulty,
    language,
    estimated_minutes,
    is_free,
    is_published,
    published_at
  )
  values (
    'html-fundamentals',
    'HTML Fundamentals',
    'Learn the foundations of HTML and build well-structured web pages using headings, text, links, images, forms, tables and semantic HTML.',
    'HTML is the foundation of every website. In this beginner-friendly course, learners will understand how web pages are structured using HTML and gradually build confidence with the most important HTML elements. The course starts with the basic document structure and then covers text, links, images, lists, tables, forms and semantic HTML. Lessons use real video tutorials together with short Meritloom lesson summaries and practice opportunities. No previous web-development experience is required.',
    v_category_id,
    'beginner',
    'English',
    285,
    true,
    true,
    now()
  )
  on conflict (slug) do update set
    title = excluded.title,
    summary = excluded.summary,
    description = excluded.description,
    category_id = excluded.category_id,
    difficulty = excluded.difficulty,
    language = excluded.language,
    estimated_minutes = excluded.estimated_minutes,
    is_free = true,
    is_published = true,
    published_at = coalesce(courses.published_at, now()),
    updated_at = now()
  returning id into v_course_id;

  -- 3. UPSERT COURSE LEARNING OUTCOMES
  delete from public.course_learning_outcomes where course_id = v_course_id;

  insert into public.course_learning_outcomes (course_id, outcome, position) values
    (v_course_id, 'Understand how HTML structures a webpage', 1),
    (v_course_id, 'Create a valid HTML document', 2),
    (v_course_id, 'Work with headings, paragraphs and text formatting', 3),
    (v_course_id, 'Create links and navigation', 4),
    (v_course_id, 'Add images and media', 5),
    (v_course_id, 'Build ordered and unordered lists', 6),
    (v_course_id, 'Create HTML tables', 7),
    (v_course_id, 'Build accessible HTML forms', 8),
    (v_course_id, 'Use semantic HTML elements', 9),
    (v_course_id, 'Build a complete basic webpage', 10);

  -- 4. UPSERT COURSE PREREQUISITES
  delete from public.course_prerequisites where course_id = v_course_id;

  insert into public.course_prerequisites (course_id, prerequisite, position) values
    (v_course_id, 'No previous coding experience required', 1),
    (v_course_id, 'Basic computer skills', 2),
    (v_course_id, 'A modern web browser', 3),
    (v_course_id, 'A text editor such as VS Code', 4);

  -- 5. UPSERT SKILLS & COURSE_SKILLS
  insert into public.skills (name, slug, is_active) values ('HTML', 'html', true)
    on conflict (slug) do update set name = excluded.name returning id into v_skill_html_id;

  insert into public.skills (name, slug, is_active) values ('Semantic HTML', 'semantic-html', true)
    on conflict (slug) do update set name = excluded.name returning id into v_skill_semantic_id;

  insert into public.skills (name, slug, is_active) values ('HTML Forms', 'html-forms', true)
    on conflict (slug) do update set name = excluded.name returning id into v_skill_forms_id;

  insert into public.skills (name, slug, is_active) values ('Web Development', 'web-development', true)
    on conflict (slug) do update set name = excluded.name returning id into v_skill_webdev_id;

  insert into public.skills (name, slug, is_active) values ('Web Accessibility', 'web-accessibility', true)
    on conflict (slug) do update set name = excluded.name returning id into v_skill_a11y_id;

  insert into public.skills (name, slug, is_active) values ('Web Page Structure', 'web-page-structure', true)
    on conflict (slug) do update set name = excluded.name returning id into v_skill_structure_id;

  delete from public.course_skills where course_id = v_course_id;

  insert into public.course_skills (course_id, skill_id) values
    (v_course_id, v_skill_html_id),
    (v_course_id, v_skill_semantic_id),
    (v_course_id, v_skill_forms_id),
    (v_course_id, v_skill_webdev_id),
    (v_course_id, v_skill_a11y_id),
    (v_course_id, v_skill_structure_id)
  on conflict do nothing;

  -- 6. MODULE 1: Getting Started with HTML
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (
    v_course_id,
    'getting-started',
    'Getting Started with HTML',
    'Understand what HTML is, set up your development environment in VS Code, and create your first valid HTML5 document.',
    1,
    38,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod1_id;

  -- Lesson 1.1 (Video)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod1_id,
    'what-is-html-and-editor-setup',
    'What is HTML & Setting Up Your Editor',
    'Discover what HTML is, how it works in the browser, and how to set up Visual Studio Code with the Live Server extension for web development.',
    'video',
    'https://www.youtube.com/watch?v=kUMe1FH4CHE&t=55s',
    'HTML (HyperText Markup Language) describes the structure of web pages using elements denoted by tags.',
    19,
    1,
    true,
    true,
    '## Introduction to Web Development\n\nHTML stands for **HyperText Markup Language**. It is the standard markup language used to structure content on the web. Every web page you visit—from news websites to video platforms—relies on HTML as its structural backbone.\n\n### Essential Tools\n\nTo begin coding HTML, you only need two tools:\n\n1. **A Code Editor**: We recommend [Visual Studio Code (VS Code)](https://code.visualstudio.com/), a free and powerful editor.\n2. **A Web Browser**: Google Chrome, Firefox, Safari, or Microsoft Edge.\n\n### Recommended VS Code Extensions\n\n- **Live Server**: Enables a local development server with live browser reload as soon as you save your files.\n- **Prettier**: Automatically formats your HTML markup for maximum readability.'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Understand what HTML is and how browsers interpret markup', 1),
    (v_lesson_id, 'Install and configure Visual Studio Code for web development', 2),
    (v_lesson_id, 'Use the Live Server extension for instant browser reloading', 3);

  -- Lesson 1.2 (Video)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod1_id,
    'html-document-structure-and-head',
    'HTML Document Structure & The Head Element',
    'Understand the boilerplate anatomy of an HTML5 document including <!DOCTYPE html>, <html>, <head>, <meta>, <title>, and <body> tags.',
    'video',
    'https://www.youtube.com/watch?v=kUMe1FH4CHE&t=1213s',
    'The <head> element contains metadata about the webpage, while the <body> element contains the visible content.',
    9,
    2,
    false,
    true,
    '## The Anatomy of an HTML Document\n\nEvery standard HTML5 document follows a clear, predictable structure:\n\n```html\n<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>My First Web Page</title>\n  </head>\n  <body>\n    <h1>Hello World!</h1>\n    <p>Welcome to web development with Meritloom.</p>\n  </body>\n</html>\n```\n\n### Breakdown of Key Elements\n\n- `<!DOCTYPE html>`: Informs the browser that this document is HTML5.\n- `<html lang="en">`: The root element wrapping the whole document, specifying English as the primary language.\n- `<head>`: Container for document metadata that is not directly rendered on the page.\n- `<meta charset="UTF-8">`: Specifies the UTF-8 character encoding covering almost all human languages.\n- `<title>`: Defines the document title displayed in the browser tab and search results.\n- `<body>`: Contains all visible elements (headings, text, images, buttons).'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Declare a standard HTML5 <!DOCTYPE html> doctype', 1),
    (v_lesson_id, 'Configure character encoding with <meta charset="UTF-8">', 2),
    (v_lesson_id, 'Set an accessible browser page title with <title>', 3);

  -- Lesson 1.3 (Practice)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod1_id,
    'practice-create-first-html-document',
    'Practice: Create Your First HTML Document',
    'Write a clean, valid HTML5 boilerplate document from scratch and preview it in your browser.',
    'practice',
    null,
    'Every valid HTML page begins with <!DOCTYPE html> followed by <html>, <head>, and <body> tags.',
    10,
    3,
    false,
    true,
    '## Exercise: Build Your First HTML Page\n\nIn this exercise, you will create a new HTML file called `index.html` on your computer.\n\n### Instructions\n\n1. Open VS Code and create a new project folder named `my-first-website`.\n2. Inside the folder, create a file named `index.html`.\n3. Type the complete HTML5 document structure without using Emmet shortcuts.\n4. Set the page `<title>` to **"Learner Profile | Meritloom"**.\n5. Inside the `<body>`, add an `<h1>` heading with your name and a `<p>` paragraph describing your learning goals.\n6. Open the file in your browser using Live Server or by double-clicking the file.\n\n### Expected Solution\n\n```html\n<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Learner Profile | Meritloom</title>\n  </head>\n  <body>\n    <h1>Alex Mercer</h1>\n    <p>I am learning HTML on Meritloom to build accessible, modern websites.</p>\n  </body>\n</html>\n```'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Write a complete HTML5 boilerplate from scratch', 1),
    (v_lesson_id, 'Verify proper element nesting and tag closures', 2),
    (v_lesson_id, 'View the rendered page in a browser', 3);

  -- 7. MODULE 2: Text & Content Structure
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (
    v_course_id,
    'text-content-structure',
    'Text & Content Structure',
    'Master headings, paragraphs, horizontal rules, line breaks, and semantic text formatting tags.',
    2,
    35,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod2_id;

  -- Lesson 2.1 (Video)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod2_id,
    'headings-paragraphs-text-formatting',
    'Headings, Paragraphs & Text Formatting',
    'Learn how to structure readable content using heading levels (h1 through h6), paragraphs, line breaks, horizontal rules, and semantic text formatting.',
    'video',
    'https://www.youtube.com/watch?v=kUMe1FH4CHE&t=1742s',
    'Maintain a single <h1> per page and nest headings sequentially without skipping levels for accessibility and SEO.',
    20,
    1,
    false,
    true,
    '## Heading Hierarchy & Formatting\n\nHTML provides 6 levels of headings: `<h1>` through `<h6>`. `<h1>` is the most important heading on the page, representing the primary topic.\n\n### Formatting Tags\n\n- `<strong>`: Represents strong importance or urgency (typically rendered bold).\n- `<em>`: Represents stress emphasis (typically rendered italic).\n- `<hr>`: Represents a thematic break or transition between topics.\n- `<br>`: Inserts a line break inside a paragraph or poem.\n\n```html\n<h1>Web Development Fundamentals</h1>\n<p>HTML is <strong>essential</strong> for all web builders.</p>\n<hr>\n<h2>Getting Started</h2>\n<p>Practice every day to build <em>lasting</em> confidence.</p>\n```'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Apply heading levels h1 through h6 in hierarchical order', 1),
    (v_lesson_id, 'Format text using <p>, <hr>, <br>, <strong>, and <em>', 2),
    (v_lesson_id, 'Distinguish between visual formatting and semantic meaning', 3);

  -- Lesson 2.2 (Article)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod2_id,
    'html-comments-and-readability',
    'HTML Comments & Code Readability',
    'Learn how to use HTML comments <!-- comment --> to annotate sections, leave notes for developers, and organize complex templates.',
    'article',
    null,
    'HTML comments are ignored by the browser parser but remain visible in page source code.',
    5,
    2,
    false,
    true,
    '## Writing Comments in HTML\n\nComments are snippets of text inside your HTML file that are ignored by the web browser when rendering the page.\n\n### Syntax\n\n```html\n<!-- This is a single line HTML comment -->\n\n<!--\n  Multi-line comments are helpful\n  for explaining large blocks of code\n  or leaving developer notes.\n-->\n```\n\n### Best Practices\n\n- Use comments to indicate the start and end of major page sections (e.g. `<!-- START: Main Navigation -->`).\n- Never put sensitive information (passwords, private API keys) in HTML comments, as anyone can view page source.'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Write single-line and multi-line HTML comments', 1),
    (v_lesson_id, 'Use comments to document page sections effectively', 2);

  -- Lesson 2.3 (Practice)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod2_id,
    'practice-structuring-article',
    'Practice: Structuring an Article with Headings & Paragraphs',
    'Format a multi-section article using sequential headings, paragraphs, and emphasis tags.',
    'practice',
    null,
    'Clear visual and semantic hierarchy makes content easier to navigate for both screen readers and human readers.',
    10,
    3,
    false,
    true,
    '## Exercise: Build an Article Structure\n\nCreate a new file `article.html` and structure a blog post about learning web development.\n\n### Requirements\n\n- One main `<h1>` title\n- Two sections each introduced by an `<h2>` heading\n- At least 3 `<p>` paragraphs containing `<strong>` and `<em>` tags\n- An `<hr>` divider between sections\n\n```html\n<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <title>The Journey into Code</title>\n  </head>\n  <body>\n    <h1>The Journey into Code</h1>\n    <p>Starting out in programming feels <strong>exciting</strong> yet challenging.</p>\n    <hr>\n    <h2>Why HTML Matters</h2>\n    <p>Without HTML, there is <em>no structure</em> to display on the web.</p>\n  </body>\n</html>\n```'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Build an article with h1, h2, and h3 headings', 1),
    (v_lesson_id, 'Format key terms using <strong> and <em>', 2),
    (v_lesson_id, 'Validate proper tag nesting', 3);

  -- 8. MODULE 3: Lists & Tables
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (
    v_course_id,
    'lists-and-tables',
    'Lists & Tables',
    'Organize items and tabular data using unordered lists, ordered lists, nested lists, and accessible data tables.',
    3,
    38,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod3_id;

  -- Lesson 3.1 (Video)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod3_id,
    'ordered-unordered-nested-lists',
    'Ordered, Unordered & Nested Lists',
    'Explore unordered lists (<ul>), ordered lists (<ol>), list items (<li>), and description lists (<dl>) along with list nesting.',
    'video',
    'https://www.youtube.com/watch?v=kUMe1FH4CHE&t=2985s',
    'Use <ol> when sequence matters and <ul> when items are non-sequential. Always place <li> elements directly inside <ul> or <ol>.',
    10,
    1,
    false,
    true,
    '## Lists in HTML\n\nLists allow you to group related items clearly.\n\n### Unordered Lists (`<ul>`)\n\nUsed when the order of list items does not affect the meaning:\n\n```html\n<ul>\n  <li>HTML5</li>\n  <li>CSS3</li>\n  <li>JavaScript</li>\n</ul>\n```\n\n### Ordered Lists (`<ol>`)\n\nUsed for step-by-step instructions or ranked items:\n\n```html\n<ol>\n  <li>Install code editor</li>\n  <li>Write HTML boilerplate</li>\n  <li>Preview in browser</li>\n</ol>\n```\n\n### Nested Lists\n\nLists can be nested inside an `<li>` element to create sub-menus or hierarchical outlines.'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Create numbered ordered lists and bulleted unordered lists', 1),
    (v_lesson_id, 'Build multi-level nested lists', 2),
    (v_lesson_id, 'Create description lists with <dl>, <dt>, and <dd>', 3);

  -- Lesson 3.2 (Video)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod3_id,
    'creating-and-structuring-html-tables',
    'Creating & Structuring HTML Tables',
    'Learn how to present structured tabular data using <table>, <caption>, <thead>, <tbody>, <tr>, <th>, and <td> elements.',
    'video',
    'https://www.youtube.com/watch?v=kUMe1FH4CHE&t=8693s',
    'Use <th> elements with the scope attribute to provide accessible headers for rows and columns in tabular data.',
    16,
    2,
    false,
    true,
    '## Tabular Data in HTML\n\nHTML tables present information in a grid of rows and columns.\n\n```html\n<table>\n  <caption>Weekly Learning Schedule</caption>\n  <thead>\n    <tr>\n      <th scope="col">Day</th>\n      <th scope="col">Topic</th>\n      <th scope="col">Duration</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Monday</td>\n      <td>HTML Basics</td>\n      <td>45 min</td>\n    </tr>\n    <tr>\n      <td>Tuesday</td>\n      <td>Links & Lists</td>\n      <td>45 min</td>\n    </tr>\n  </tbody>\n</table>\n```\n\n### Essential Table Elements\n\n- `<table>`: The wrapper for all table content.\n- `<caption>`: Describes the table purpose for accessibility.\n- `<thead>` & `<tbody>`: Separate table header rows from data body rows.\n- `<tr>`: Table row.\n- `<th>`: Header cell with `scope="col"` or `scope="row"`.\n- `<td>`: Standard data cell.'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Structure tables with <thead>, <tbody>, and <tfoot>', 1),
    (v_lesson_id, 'Define accessible row and column headers with <th scope="...">', 2),
    (v_lesson_id, 'Merge cells using colspan and rowspan attributes', 3);

  -- Lesson 3.3 (Practice)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod3_id,
    'practice-build-schedule-table',
    'Practice: Build a Student Schedule Table',
    'Construct an accessible weekly class schedule table with proper headings, captions, and merged cells.',
    'practice',
    null,
    'Tables should strictly be used for tabular data, never for general page layouts.',
    12,
    3,
    false,
    true,
    '## Exercise: Course Schedule Table\n\nCreate an HTML file `schedule.html` containing an accessible table.\n\n### Checklist\n\n1. Include a descriptive `<caption>`\n2. Define a `<thead>` with column header cells (`<th scope="col">`)\n3. Include at least 4 rows in `<tbody>`\n4. Use `colspan="2"` to span a lunch break across multiple columns\n\n```html\n<table>\n  <caption>Meritloom Study Plan</caption>\n  <thead>\n    <tr>\n      <th scope="col">Time</th>\n      <th scope="col">Module</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>9:00 AM</td>\n      <td>HTML Tables</td>\n    </tr>\n    <tr>\n      <td colspan="2">Break</td>\n    </tr>\n  </tbody>\n</table>\n```'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Create a multi-column table with a descriptive <caption>', 1),
    (v_lesson_id, 'Use <thead> and <tbody> blocks properly', 2),
    (v_lesson_id, 'Implement colspan or rowspan to represent spanning schedule blocks', 3);

  -- 9. MODULE 4: Links & Navigation
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (
    v_course_id,
    'links-and-navigation',
    'Links & Navigation',
    'Master hyperlinks, page navigation, absolute vs relative paths, in-page bookmarks, and security attributes.',
    4,
    46,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod4_id;

  -- Lesson 4.1 (Video)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod4_id,
    'anchor-elements-and-page-links',
    'Anchor Elements & Page Links',
    'Master the anchor element (<a>) to connect pages, link to external sites, create in-page jump links, and configure target="_blank" safely.',
    'video',
    'https://www.youtube.com/watch?v=kUMe1FH4CHE&t=3595s',
    'When opening external links in a new tab with target="_blank", always include rel="noopener noreferrer" for security.',
    30,
    1,
    false,
    true,
    '## The Power of the Hyperlink\n\nThe web is interconnected through hyperlinks created using the `<a>` (anchor) element and the `href` attribute.\n\n### External Links\n\n```html\n<a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">\n  Visit MDN Web Docs\n</a>\n```\n\n### Internal Page Links\n\n```html\n<a href="about.html">About Us</a>\n<a href="contact.html">Contact</a>\n```\n\n### In-Page Jump Links\n\n```html\n<!-- Link trigger -->\n<a href="#faq-section">Jump to FAQ</a>\n\n<!-- Target section -->\n<h2 id="faq-section">Frequently Asked Questions</h2>\n```'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Create links using the href attribute', 1),
    (v_lesson_id, 'Link between multiple local HTML files using relative paths', 2),
    (v_lesson_id, 'Implement in-page jump navigation using id attributes', 3),
    (v_lesson_id, 'Secure external links with rel="noopener noreferrer"', 4);

  -- Lesson 4.2 (Article)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod4_id,
    'relative-vs-absolute-urls',
    'Relative vs Absolute URLs Explained',
    'Understand the vital differences between absolute URLs (full web addresses) and relative file paths (parent, sibling, and subfolder references).',
    'article',
    null,
    'Use relative paths for internal website assets and pages; use absolute URLs for external domains.',
    6,
    2,
    false,
    true,
    '## Understanding Paths in Web Development\n\n- **Absolute URLs**: Include the protocol and domain name (e.g. `https://example.com/about.html`). Used for external websites.\n- **Relative URLs**: Point to a file relative to the current file location on your server.\n\n### Relative Path Cheatsheet\n\n- `about.html`: Sibling file in the same folder.\n- `pages/about.html`: File inside a subfolder named `pages`.\n- `../index.html`: Go up one directory level to find `index.html`.'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Navigate up directory trees using ../', 1),
    (v_lesson_id, 'Reference files in subdirectories using folder/file.html', 2);

  -- Lesson 4.3 (Practice)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod4_id,
    'practice-build-navigation-bar',
    'Practice: Build a Multi-Page Navigation Bar',
    'Construct a multi-page website header navigation bar containing links to Home, About, and Contact pages.',
    'practice',
    null,
    'Wrap website navigation in a semantic <nav> element and use an unordered list (<ul>) for menu items.',
    10,
    3,
    false,
    true,
    '## Exercise: Site Navigation Bar\n\nBuild a standard navigation header component in HTML.\n\n### Requirements\n\n```html\n<header>\n  <nav aria-label="Main Navigation">\n    <ul>\n      <li><a href="index.html">Home</a></li>\n      <li><a href="about.html">About</a></li>\n      <li><a href="courses.html">Courses</a></li>\n      <li><a href="contact.html">Contact</a></li>\n    </ul>\n  </nav>\n</header>\n```'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Group navigation links inside <nav> and <ul>', 1),
    (v_lesson_id, 'Connect relative links across multiple pages', 2),
    (v_lesson_id, 'Add in-page jump anchor links', 3);

  -- 10. MODULE 5: Images & Media
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (
    v_course_id,
    'images-and-media',
    'Images & Media',
    'Learn how to embed images, audio, and video with accessible alternative text, figures, and dimensions.',
    5,
    48,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod5_id;

  -- Lesson 5.1 (Video)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod5_id,
    'adding-images-alt-text-figures',
    'Adding Images, Alt Text & Accessible Figures',
    'Learn how to embed images using the <img> tag, write descriptive alt text for accessibility, specify width and height, and use <figure> and <figcaption>.',
    'video',
    'https://www.youtube.com/watch?v=kUMe1FH4CHE&t=5438s',
    'Every <img> must have an alt attribute. Provide concise, descriptive text for informative images or alt="" for decorative images.',
    30,
    1,
    false,
    true,
    '## Working with Images in HTML\n\nThe `<img>` element embeds visual graphics into web pages. It is a self-closing void element.\n\n```html\n<figure>\n  <img\n    src="images/html-logo.png"\n    alt="HTML5 shield logo on orange background"\n    width="300"\n    height="200"\n    loading="lazy"\n  >\n  <figcaption>Figure 1: Official HTML5 Logo</figcaption>\n</figure>\n```\n\n### Essential Attributes\n\n- `src`: Path or URL of the image file.\n- `alt`: Text equivalent read by screen readers and shown if the image fails to load.\n- `width` & `height`: Prevents Cumulative Layout Shift (CLS) as pages load.\n- `loading="lazy"`: Defers offscreen image loading until the user scrolls near.'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Embed images with src, alt, width, and height attributes', 1),
    (v_lesson_id, 'Write meaningful alt text for screen readers', 2),
    (v_lesson_id, 'Wrap captioned images in <figure> and <figcaption>', 3),
    (v_lesson_id, 'Prevent layout shifts by specifying aspect ratio dimensions', 4);

  -- Lesson 5.2 (Article)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod5_id,
    'image-accessibility-best-practices',
    'Image Best Practices & Accessibility Basics',
    'Explore modern image formats (WebP, SVG, PNG, JPG), loading="lazy" performance optimization, and Web Content Accessibility Guidelines (WCAG).',
    'article',
    null,
    'Using loading="lazy" on below-the-fold images dramatically accelerates initial page load times.',
    8,
    2,
    false,
    true,
    '## Image Optimization & Accessibility\n\n- **Photos**: Use WebP or JPG for high compression.\n- **Icons & Logos**: Use SVG (vector format) for crisp rendering at any resolution.\n- **Screenshots**: Use PNG or WebP with lossless compression.'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Select appropriate image formats for photos versus logos', 1),
    (v_lesson_id, 'Implement native browser lazy loading with loading="lazy"', 2);

  -- Lesson 5.3 (Practice)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod5_id,
    'practice-product-showcase-images',
    'Practice: Build a Product Showcase with Images',
    'Create a responsive product showcase card using <figure>, <figcaption>, descriptive alt text, and linked imagery.',
    'practice',
    null,
    'Combining <a> and <img> allows creating accessible clickable image links.',
    10,
    3,
    false,
    true,
    '## Exercise: Product Card\n\n```html\n<article>\n  <figure>\n    <a href="product-details.html">\n      <img\n        src="taco.jpg"\n        alt="Two crispy beef tacos topped with fresh salsa and cilantro"\n        width="400"\n        height="300"\n      >\n    </a>\n    <figcaption>Signature Street Tacos — $9.50</figcaption>\n  </figure>\n  <p>Fresh handmade corn tortillas with slow-cooked shredded beef.</p>\n</article>\n```'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Wrap an image inside a <figure> element', 1),
    (v_lesson_id, 'Add a descriptive <figcaption> with price and details', 2),
    (v_lesson_id, 'Ensure all accessibility criteria are met', 3);

  -- 11. MODULE 6: Semantic HTML5
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (
    v_course_id,
    'semantic-html5',
    'Semantic HTML5',
    'Understand landmark layout tags including header, nav, main, section, article, aside, and footer.',
    6,
    43,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod6_id;

  -- Lesson 6.1 (Video)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod6_id,
    'semantic-html5-layout-elements',
    'Semantic HTML5 Layout Elements',
    'Learn why semantic elements like <header>, <nav>, <main>, <article>, <section>, <aside>, and <footer> are superior to generic <div> containers.',
    'video',
    'https://www.youtube.com/watch?v=kUMe1FH4CHE&t=7258s',
    'Semantic HTML elements communicate the role and purpose of content to browsers, screen readers, and search engines.',
    24,
    1,
    false,
    true,
    '## The Power of Semantic HTML\n\nSemantic elements clearly describe their meaning to both the browser and the developer.\n\n### Common Semantic Landmarks\n\n- `<header>`: Introductory content or navigation header.\n- `<nav>`: Major navigation links.\n- `<main>`: The dominant, unique content of the page (only one `<main>` per page).\n- `<article>`: Self-contained content that could be syndicated (e.g. blog post, product card).\n- `<section>`: A thematic grouping of content, typically with a heading.\n- `<aside>`: Tangentially related content (sidebar, related links, callouts).\n- `<footer>`: Copyright, author info, or secondary links.'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Replace generic <div> tags with semantic HTML5 structural elements', 1),
    (v_lesson_id, 'Distinguish between <article> and <section>', 2),
    (v_lesson_id, 'Organize main content landmarks with <header>, <main>, and <footer>', 3);

  -- Lesson 6.2 (Article)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod6_id,
    'why-semantic-html-matters',
    'Why Semantic HTML Matters for SEO & Accessibility',
    'Examine how screen readers navigate landmark regions and how search engine crawlers rank semantically structured documents.',
    'article',
    null,
    'Landmark elements allow assistive technology users to quickly jump between main content, navigation, and supplementary info.',
    7,
    2,
    false,
    true,
    '## Accessibility & Search Engine Ranking\n\nAssistive technologies provide shortcut keys (e.g. "D" in NVDA or "R" in VoiceOver) allowing users to leap directly between landmarks.\n\nWhen a page is composed exclusively of `<div>` tags, screen reader users are forced to listen through the entire page linearly.'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Explain accessibility landmark navigation', 1),
    (v_lesson_id, 'Understand how semantic structure boosts search engine discoverability', 2);

  -- Lesson 6.3 (Practice)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod6_id,
    'practice-refactor-to-semantic-html',
    'Practice: Refactor a Non-Semantic Page to Semantic HTML',
    'Take a legacy div-heavy webpage and refactor it into clean, accessible HTML5 semantic landmarks.',
    'practice',
    null,
    'Refactoring to semantic tags improves readability and accessibility without requiring CSS changes.',
    12,
    3,
    false,
    true,
    '## Exercise: Semantic Refactor\n\n```html\n<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <title>Semantic Magazine</title>\n  </head>\n  <body>\n    <header>\n      <h1>The Code Journal</h1>\n      <nav>\n        <a href="#latest">Latest Articles</a>\n      </nav>\n    </header>\n    <main>\n      <article id="latest">\n        <h2>Mastering Semantic HTML</h2>\n        <p>Using the right elements elevates your code quality.</p>\n      </article>\n      <aside>\n        <h3>Author Bio</h3>\n        <p>Dave Gray is a passionate educator.</p>\n      </aside>\n    </main>\n    <footer>\n      <p>&copy; 2026 The Code Journal</p>\n    </footer>\n  </body>\n</html>\n```'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Identify and replace generic div containers with semantic elements', 1),
    (v_lesson_id, 'Validate proper nesting of <main>, <section>, and <article>', 2);

  -- 12. MODULE 7: HTML Forms & User Input
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (
    v_course_id,
    'forms-and-user-input',
    'HTML Forms & User Input',
    'Build forms, inputs, labels, textareas, selects, radio buttons, checkboxes, fieldsets, and accessible validation.',
    7,
    67,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod7_id;

  -- Lesson 7.1 (Video)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod7_id,
    'building-forms-inputs-and-controls',
    'Building Forms, Inputs & Form Controls',
    'Master HTML forms using <form>, <label>, <input> (text, email, password, number), <textarea>, <select>, radio buttons, checkboxes, and buttons.',
    'video',
    'https://www.youtube.com/watch?v=kUMe1FH4CHE&t=9642s',
    'Always associate every input with a <label> using the for attribute matching the input id.',
    44,
    1,
    false,
    true,
    '## Interactive Forms in HTML\n\nForms collect user input and submit it to a server.\n\n```html\n<form action="/submit" method="post">\n  <fieldset>\n    <legend>Contact Information</legend>\n    \n    <label for="user-name">Your Name:</label>\n    <input type="text" id="user-name" name="name" required>\n\n    <label for="user-email">Email Address:</label>\n    <input type="email" id="user-email" name="email" required>\n  </fieldset>\n\n  <button type="submit">Submit Form</button>\n</form>\n```'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Connect labels to inputs using matching for and id attributes', 1),
    (v_lesson_id, 'Work with text, email, tel, password, number, and date input types', 2),
    (v_lesson_id, 'Build radio button groups with shared name attributes', 3),
    (v_lesson_id, 'Group related fields with <fieldset> and <legend>', 4);

  -- Lesson 7.2 (Article)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod7_id,
    'accessible-form-validation',
    'Accessible Form Validation & Input Types',
    'Learn how to enforce client-side form validation using required, pattern, min, max, and maxlength attributes.',
    'article',
    null,
    'Native HTML5 validation attributes provide immediate accessible feedback without requiring custom JavaScript.',
    8,
    2,
    false,
    true,
    '## Built-in HTML5 Form Validation\n\n- `required`: Field must not be empty.\n- `minlength` / `maxlength`: String length constraints.\n- `type="email"` / `type="url"`: Built-in syntax format verification.\n- `pattern="[0-9]{3}-[0-9]{4}"`: Regular expression matching.'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Use required, minlength, and maxlength for text constraints', 1),
    (v_lesson_id, 'Specify email and URL formats with native input types', 2),
    (v_lesson_id, 'Add helpful placeholder and autocomplete attributes', 3);

  -- Lesson 7.3 (Practice)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod7_id,
    'practice-user-registration-form',
    'Practice: Build a User Registration & Feedback Form',
    'Construct a complete registration form with text inputs, radio selections, dropdown menus, checkboxes, and a submit button.',
    'practice',
    null,
    'A well-structured form ensures every interactive control is accessible via keyboard and screen reader.',
    15,
    3,
    false,
    true,
    '## Exercise: Registration Form\n\n```html\n<form action="#" method="post">\n  <fieldset>\n    <legend>Account Details</legend>\n    <label for="fullname">Full Name:</label>\n    <input type="text" id="fullname" name="fullname" required>\n    \n    <label for="role">Primary Goal:</label>\n    <select id="role" name="role">\n      <option value="skills">Build practical skills</option>\n      <option value="explore">Explore something new</option>\n    </select>\n  </fieldset>\n  <button type="submit">Sign Up</button>\n</form>\n```'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Create a form with method="post" and action="#"', 1),
    (v_lesson_id, 'Implement <fieldset> and <legend> for personal details', 2),
    (v_lesson_id, 'Validate required fields natively', 3);

  -- 13. MODULE 8: Capstone Project: Build Your First Website
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (
    v_course_id,
    'capstone-project',
    'Capstone Project: Build Your First Website',
    'Combine everything you learned to build a complete multi-section restaurant or personal portfolio webpage using pure HTML.',
    8,
    67,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod8_id;

  -- Lesson 8.1 (Video)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod8_id,
    'project-walkthrough-little-taco-shop',
    'Project Walkthrough: The Little Taco Shop Webpage',
    'Watch the full step-by-step project build of the Little Taco Shop website, combining document structure, navigation, images, tables, and forms.',
    'video',
    'https://www.youtube.com/watch?v=kUMe1FH4CHE&t=12316s',
    'A complete HTML website combines semantic landmarks, accessible media, structured data, and interactive forms into cohesive pages.',
    42,
    1,
    false,
    true,
    '## The Capstone Project: Little Taco Shop\n\nIn this walkthrough video, Dave Gray builds a complete multi-page HTML website from scratch.\n\n### Features Demonstrated\n\n1. Proper semantic layout (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)\n2. Internal navigation across multiple pages\n3. High-quality accessible images with `<figure>` and `<figcaption>`\n4. Business hours data table\n5. Customer feedback and order contact form'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Plan the multi-page structure of a real-world website', 1),
    (v_lesson_id, 'Combine header navigation, article content, hours table, and contact form', 2),
    (v_lesson_id, 'Review complete HTML5 best practices in action', 3);

  -- Lesson 8.2 (Practice)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (
    v_mod8_id,
    'capstone-build-personal-profile-webpage',
    'Capstone: Build Your Personal Profile Webpage',
    'Combine everything you have learned in this course to build your own multi-section personal profile or portfolio webpage using pure semantic HTML.',
    'practice',
    null,
    'Writing clean, semantic HTML creates the strong structural backbone that you will style with CSS in the next course.',
    25,
    2,
    false,
    true,
    '## Capstone Project: Personal Profile Webpage\n\nCongratulations on reaching the final lesson of HTML Fundamentals! Now it is time to build your own complete personal webpage.\n\n### Project Requirements\n\n- [x] Valid `<!DOCTYPE html>` and `<html lang="en">` structure\n- [x] `<head>` with descriptive `<title>` and UTF-8 charset\n- [x] Semantic `<header>` with `<h1>` and navigation menu\n- [x] `<main>` section containing:\n  - About me biography with `<strong>` and `<em>` tags\n  - Profile image inside `<figure>` with descriptive `alt` and `<figcaption>`\n  - Unordered list of your technical skills\n  - Table listing projects or coursework completed\n  - Accessible contact form with name, email, topic select, and message textarea\n- [x] Semantic `<footer>` with copyright and social links with `target="_blank"` and `rel="noopener noreferrer"`\n\n### Next Step: CSS Fundamentals\n\nOnce your HTML structure is complete and validated, you will be ready for **Course 2: CSS Fundamentals** to bring your website to life with colors, layouts, and animations!'
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    lesson_type = excluded.lesson_type,
    video_url = excluded.video_url,
    key_takeaway = excluded.key_takeaway,
    estimated_minutes = excluded.estimated_minutes,
    position = excluded.position,
    is_published = true,
    content = excluded.content
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Build a complete HTML5 webpage from scratch', 1),
    (v_lesson_id, 'Include a header, navigation bar, hero bio, skills list, project table, and contact form', 2),
    (v_lesson_id, 'Validate semantic correctness and accessibility without styling', 3);

end $$;

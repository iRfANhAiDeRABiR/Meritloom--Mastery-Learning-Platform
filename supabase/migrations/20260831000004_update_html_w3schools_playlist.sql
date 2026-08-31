-- =========================================================
-- MERITLOOM MIGRATION & SEED: W3Schools HTML Fundamentals
-- Updates lessons schema with video provider & bonus support,
-- and seeds the exact 23-video W3Schools HTML playlist.
-- =========================================================

-- 1. ADD COLUMNS TO LESSONS TABLE
alter table public.lessons
  add column if not exists video_provider text default 'youtube',
  add column if not exists youtube_video_id text,
  add column if not exists source_channel text,
  add column if not exists source_url text,
  add column if not exists playlist_id text,
  add column if not exists is_bonus boolean not null default false;

-- 2. SEED W3SCHOOLS HTML FUNDAMENTALS DATA
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
  v_skill_elements_id uuid;
  v_skill_attributes_id uuid;
  v_skill_forms_id uuid;
  v_skill_tables_id uuid;
  v_skill_webdev_id uuid;
begin

  -- Category: Web Development
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

  -- Course: HTML Fundamentals
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
    'HTML is the foundation of every website. In this beginner-friendly course powered by the official W3Schools HTML video series, learners will understand how web pages are structured using HTML and gradually build confidence with the most important HTML elements. The course covers HTML basics, text styling, colors, CSS integration, links, images, tables, lists, layout concepts, iframes, scripting, head metadata, and interactive forms. Lessons use real W3Schools video tutorials alongside original Meritloom summaries, takeaways, and learning objectives.',
    v_category_id,
    'beginner',
    'English',
    110,
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

  -- Learning Outcomes
  delete from public.course_learning_outcomes where course_id = v_course_id;
  insert into public.course_learning_outcomes (course_id, outcome, position) values
    (v_course_id, 'Understand what HTML is and how browsers interpret web documents', 1),
    (v_course_id, 'Create and edit HTML files using standard text editors', 2),
    (v_course_id, 'Structure headings, paragraphs, line breaks, and semantic text formatting', 3),
    (v_course_id, 'Work with colors, inline styles, and external CSS stylesheets', 4),
    (v_course_id, 'Create hyperlinks, target attributes, and in-page bookmark anchors', 5),
    (v_course_id, 'Embed images with accessible alt text and responsive sizing', 6),
    (v_course_id, 'Build structured HTML tables and nested lists', 7),
    (v_course_id, 'Understand block vs inline elements, classes, and ID attributes', 8),
    (v_course_id, 'Embed external content with iframes and link JavaScript scripts', 9),
    (v_course_id, 'Configure <head> metadata and build interactive HTML forms', 10);

  -- Prerequisites
  delete from public.course_prerequisites where course_id = v_course_id;
  insert into public.course_prerequisites (course_id, prerequisite, position) values
    (v_course_id, 'No previous coding experience required', 1),
    (v_course_id, 'Basic computer skills', 2),
    (v_course_id, 'A modern web browser (Chrome, Firefox, Safari, or Edge)', 3),
    (v_course_id, 'A text editor such as VS Code, Notepad, or TextEdit', 4);

  -- Skills
  insert into public.skills (name, slug, is_active) values ('HTML', 'html', true)
    on conflict (slug) do update set name = excluded.name returning id into v_skill_html_id;
  insert into public.skills (name, slug, is_active) values ('HTML Elements', 'html-elements', true)
    on conflict (slug) do update set name = excluded.name returning id into v_skill_elements_id;
  insert into public.skills (name, slug, is_active) values ('HTML Attributes', 'html-attributes', true)
    on conflict (slug) do update set name = excluded.name returning id into v_skill_attributes_id;
  insert into public.skills (name, slug, is_active) values ('HTML Forms', 'html-forms', true)
    on conflict (slug) do update set name = excluded.name returning id into v_skill_forms_id;
  insert into public.skills (name, slug, is_active) values ('HTML Tables', 'html-tables', true)
    on conflict (slug) do update set name = excluded.name returning id into v_skill_tables_id;
  insert into public.skills (name, slug, is_active) values ('Web Development', 'web-development', true)
    on conflict (slug) do update set name = excluded.name returning id into v_skill_webdev_id;

  delete from public.course_skills where course_id = v_course_id;
  insert into public.course_skills (course_id, skill_id) values
    (v_course_id, v_skill_html_id),
    (v_course_id, v_skill_elements_id),
    (v_course_id, v_skill_attributes_id),
    (v_course_id, v_skill_forms_id),
    (v_course_id, v_skill_tables_id),
    (v_course_id, v_skill_webdev_id)
  on conflict do nothing;

  -- MODULE 1: HTML Basics
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (v_course_id, 'html-basics', 'HTML Basics', 'Understand what HTML is, configure text editors, and learn the anatomy of HTML elements and attributes.', 1, 18, true)
  on conflict (course_id, slug) do update set title = excluded.title, description = excluded.description, position = excluded.position, estimated_minutes = excluded.estimated_minutes, is_published = true
  returning id into v_mod1_id;

  -- 1. HTML - Introduction (it1rTvBcfRg)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod1_id, 'html-introduction', 'HTML - Introduction', 'Learn what HTML is, how HTML tags describe page structure, and how browsers interpret HTML documents.', 'video', 'https://www.youtube.com/watch?v=it1rTvBcfRg', 'youtube', 'it1rTvBcfRg', 'W3Schools.com', 'https://www.youtube.com/watch?v=it1rTvBcfRg', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'HTML (HyperText Markup Language) is the standard markup language used to create and structure web pages.', 5, 1, true, true, '## What is HTML?\n\nHTML stands for **HyperText Markup Language**. It is the standard markup language used by developers worldwide to create and structure content on the web.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Understand what HTML is and how browsers interpret web markup', 1),
    (v_lesson_id, 'Learn how tags describe page headings, paragraphs, and links', 2),
    (v_lesson_id, 'Identify the basic building blocks of an HTML document', 3);

  -- 2. HTML - Editors (bBP0ckEln4Y)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod1_id, 'html-editors', 'HTML - Editors', 'Learn how to create, save, and open your first HTML document using code editors like VS Code, Notepad, or TextEdit.', 'video', 'https://www.youtube.com/watch?v=bBP0ckEln4Y', 'youtube', 'bBP0ckEln4Y', 'W3Schools.com', 'https://www.youtube.com/watch?v=bBP0ckEln4Y', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'You can write HTML in any plain text editor and view the result by opening the .html file in any web browser.', 4, 2, false, true, '## Writing HTML in Code Editors\n\nA simple text editor is all you need to start learning HTML.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Set up a text editor for writing HTML code', 1),
    (v_lesson_id, 'Save files properly with the .html extension and UTF-8 encoding', 2),
    (v_lesson_id, 'View and test HTML files locally in a web browser', 3);

  -- 3. HTML - Elements (vIoO52MdZFE)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod1_id, 'html-elements', 'HTML - Elements', 'Understand HTML elements, opening and closing tags, nested element hierarchies, and empty self-closing elements.', 'video', 'https://www.youtube.com/watch?v=vIoO52MdZFE', 'youtube', 'vIoO52MdZFE', 'W3Schools.com', 'https://www.youtube.com/watch?v=vIoO52MdZFE', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'An HTML element is defined by a start tag, content, and an end tag. Elements can be nested inside one another.', 4, 3, false, true, '## Anatomy of an HTML Element\n\nAn HTML element usually consists of a start tag and an end tag, with the content inserted in between.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Understand the anatomy of an HTML element (start tag, content, end tag)', 1),
    (v_lesson_id, 'Learn the rules for correctly nesting elements', 2),
    (v_lesson_id, 'Identify empty elements like <br> that do not have a closing tag', 3);

  -- 4. HTML - Attributes (yMX901oVtn8)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod1_id, 'html-attributes', 'HTML - Attributes', 'Learn how attributes add additional information, links, dimensions, and styling to HTML elements.', 'video', 'https://www.youtube.com/watch?v=yMX901oVtn8', 'youtube', 'yMX901oVtn8', 'W3Schools.com', 'https://www.youtube.com/watch?v=yMX901oVtn8', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'HTML attributes always appear in the opening tag as name="value" pairs, providing extra details or behavior.', 5, 4, false, true, '## What are HTML Attributes?\n\nAttributes provide additional information about HTML elements.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Understand how attributes modify HTML elements', 1),
    (v_lesson_id, 'Learn common attributes like href, src, alt, width, and style', 2),
    (v_lesson_id, 'Follow best practices by using lowercase attribute names and quotes', 3);

  -- MODULE 2: Text & Basic Styling
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (v_course_id, 'text-basic-styling', 'Text & Basic Styling', 'Master headings, paragraphs, inline styles, text formatting tags, and developer comments.', 2, 21, true)
  on conflict (course_id, slug) do update set title = excluded.title, description = excluded.description, position = excluded.position, estimated_minutes = excluded.estimated_minutes, is_published = true
  returning id into v_mod2_id;

  -- 5. HTML - Headings (9gHPpwq6IaY)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod2_id, 'html-headings', 'HTML - Headings', 'Master heading levels from <h1> to <h6> to establish clear hierarchical structure and improve accessibility and SEO.', 'video', 'https://www.youtube.com/watch?v=9gHPpwq6IaY', 'youtube', '9gHPpwq6IaY', 'W3Schools.com', 'https://www.youtube.com/watch?v=9gHPpwq6IaY', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'Use headings to show document hierarchy (h1 through h6), not merely to make text bigger or bolder.', 4, 1, false, true, '## HTML Headings\n\nHTML headings are defined with the <h1> to <h6> tags.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Use heading tags from <h1> to <h6>', 1),
    (v_lesson_id, 'Understand why heading structure is critical for SEO and accessibility', 2),
    (v_lesson_id, 'Maintain a single main <h1> per page', 3);

  -- 6. HTML - Paragraphs (qis4kAOThLw)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod2_id, 'html-paragraphs', 'HTML - Paragraphs', 'Learn how to structure body text using paragraph tags (<p>), line breaks (<br>), and thematic dividers (<hr>).', 'video', 'https://www.youtube.com/watch?v=qis4kAOThLw', 'youtube', 'qis4kAOThLw', 'W3Schools.com', 'https://www.youtube.com/watch?v=qis4kAOThLw', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'Browsers automatically add margin around <p> elements and collapse multiple spaces into a single space.', 4, 2, false, true, '## Paragraphs in HTML\n\nThe HTML <p> element defines a paragraph.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Define paragraphs using the <p> tag', 1),
    (v_lesson_id, 'Insert line breaks with <br> and horizontal rules with <hr>', 2),
    (v_lesson_id, 'Understand browser whitespace collapse', 3);

  -- 7. HTML - Styles (twdNPJfbj_8)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod2_id, 'html-styles', 'HTML - Styles', 'Explore the HTML style attribute to apply inline CSS properties including color, background-color, font-family, and text-align.', 'video', 'https://www.youtube.com/watch?v=twdNPJfbj_8', 'youtube', 'twdNPJfbj_8', 'W3Schools.com', 'https://www.youtube.com/watch?v=twdNPJfbj_8', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'The style attribute allows adding CSS rules directly inside an element tag using property:value syntax.', 5, 3, false, true, '## The HTML Style Attribute\n\nThe HTML style attribute is used to add styles to an element.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Use the style attribute to customize element presentation', 1),
    (v_lesson_id, 'Set text colors, background colors, and font sizes', 2),
    (v_lesson_id, 'Apply text alignment with text-align: center', 3);

  -- 8. HTML - Formatting (7FqQLqNIEY8)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod2_id, 'html-formatting', 'HTML - Formatting', 'Learn semantic and visual text formatting tags like <strong>, <em>, <mark>, <small>, <del>, <ins>, <sub>, and <sup>.', 'video', 'https://www.youtube.com/watch?v=7FqQLqNIEY8', 'youtube', '7FqQLqNIEY8', 'W3Schools.com', 'https://www.youtube.com/watch?v=7FqQLqNIEY8', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'Use <strong> for strong importance and <em> for stress emphasis rather than purely visual <b> or <i> tags.', 5, 4, false, true, '## HTML Text Formatting Elements\n\nHTML contains several elements for defining text with special meaning and formatting.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Format important text with <strong> and <em>', 1),
    (v_lesson_id, 'Highlight keywords with <mark> and represent edits with <del> and <ins>', 2),
    (v_lesson_id, 'Format formulas with <sub> and <sup>', 3);

  -- 9. HTML - Comments (229HYq40vaA)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod2_id, 'html-comments', 'HTML - Comments', 'Learn how to write single-line and multi-line comments in HTML to document your code and troubleshoot layouts.', 'video', 'https://www.youtube.com/watch?v=229HYq40vaA', 'youtube', '229HYq40vaA', 'W3Schools.com', 'https://www.youtube.com/watch?v=229HYq40vaA', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'HTML comments (<!-- comment -->) are ignored by the browser renderer but remain visible in the page source.', 3, 5, false, true, '## HTML Comments\n\nComments are not displayed by the browser, but they help document your HTML source code.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Write comments using <!-- and --> syntax', 1),
    (v_lesson_id, 'Use comments to organize sections and document markup', 2),
    (v_lesson_id, 'Temporarily comment out code blocks during debugging', 3);

  -- MODULE 3: Colors, CSS & Links
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (v_course_id, 'colors-css-links', 'Colors, CSS & Links', 'Learn color representation formats, linking CSS stylesheets, and creating hyperlinks and bookmark anchors.', 3, 17, true)
  on conflict (course_id, slug) do update set title = excluded.title, description = excluded.description, position = excluded.position, estimated_minutes = excluded.estimated_minutes, is_published = true
  returning id into v_mod3_id;

  -- 10. HTML - Colors (zCrolmdqmF8)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod3_id, 'html-colors', 'HTML - Colors', 'Understand how colors are defined in HTML using color names, RGB, HEX, HSL, RGBA, and HSLA values.', 'video', 'https://www.youtube.com/watch?v=zCrolmdqmF8', 'youtube', 'zCrolmdqmF8', 'W3Schools.com', 'https://www.youtube.com/watch?v=zCrolmdqmF8', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'Colors can be specified by predefined names or precise values like HEX (#ff0000) and RGB/RGBA for transparency.', 5, 1, false, true, '## Color Representation in HTML\n\nHTML colors are specified with predefined color names, or with RGB, HEX, HSL, RGBA, or HSLA values.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Specify colors using standard color names', 1),
    (v_lesson_id, 'Understand RGB and HEX color formats', 2),
    (v_lesson_id, 'Control opacity and transparency using RGBA and HSLA values', 3);

  -- 11. HTML - CSS (cZHp-Oozg6I)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod3_id, 'html-css', 'HTML - CSS', 'Learn the three ways to add CSS styling to HTML: inline styles, internal <style> blocks, and external stylesheets with <link>.', 'video', 'https://www.youtube.com/watch?v=cZHp-Oozg6I', 'youtube', 'cZHp-Oozg6I', 'W3Schools.com', 'https://www.youtube.com/watch?v=cZHp-Oozg6I', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'External stylesheets linked in the <head> element are the standard best practice for styling multi-page websites.', 6, 2, false, true, '## Adding CSS to HTML\n\nCSS stands for Cascading Style Sheets. CSS controls the layout and appearance of HTML pages.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Compare inline, internal, and external CSS approaches', 1),
    (v_lesson_id, 'Link an external stylesheet using <link rel="stylesheet">', 2),
    (v_lesson_id, 'Understand CSS selectors, properties, and values', 3);

  -- 12. HTML - Links (HA6bByKdAQM)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod3_id, 'html-links', 'HTML - Links', 'Master hyperlinks using the <a> tag, the href attribute, link targets, bookmark jump links, and mailto links.', 'video', 'https://www.youtube.com/watch?v=HA6bByKdAQM', 'youtube', 'HA6bByKdAQM', 'W3Schools.com', 'https://www.youtube.com/watch?v=HA6bByKdAQM', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'The <a> tag creates hyperlinks to external sites, other pages on your site, or specific sections on the same page.', 6, 3, false, true, '## Hyperlinks in HTML\n\nHTML links are hyperlinks. You can click on a link and jump to another document or section.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Create clickable links with <a href="...">', 1),
    (v_lesson_id, 'Open links in new tabs with target="_blank"', 2),
    (v_lesson_id, 'Create in-page jump bookmarks with #id anchors', 3);

  -- MODULE 4: Images & Data Structure
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (v_course_id, 'images-data-structure', 'Images & Data Structure', 'Embed images with accessible alt text, present tabular data with tables, and organize items into ordered and unordered lists.', 4, 18, true)
  on conflict (course_id, slug) do update set title = excluded.title, description = excluded.description, position = excluded.position, estimated_minutes = excluded.estimated_minutes, is_published = true
  returning id into v_mod4_id;

  -- 13. HTML - Images (FmoYRiepmOE)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod4_id, 'html-images', 'HTML - Images', 'Learn how to embed graphics and photos with the <img> tag, write accessible alt text, and set responsive dimensions.', 'video', 'https://www.youtube.com/watch?v=FmoYRiepmOE', 'youtube', 'FmoYRiepmOE', 'W3Schools.com', 'https://www.youtube.com/watch?v=FmoYRiepmOE', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'The <img> element requires src and alt attributes; alt text is essential for screen readers and SEO.', 6, 1, false, true, '## Embedding Images in HTML\n\nImages are linked to web pages using the <img> tag.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Embed images using <img src="..." alt="...">', 1),
    (v_lesson_id, 'Write descriptive alternative text', 2),
    (v_lesson_id, 'Specify width and height to prevent layout shifts', 3);

  -- 14. HTML - Tables (e62D-aayveY)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod4_id, 'html-tables', 'HTML - Tables', 'Learn how to present structured tabular data using <table>, <tr>, <th>, and <td> elements, along with colspan and rowspan.', 'video', 'https://www.youtube.com/watch?v=e62D-aayveY', 'youtube', 'e62D-aayveY', 'W3Schools.com', 'https://www.youtube.com/watch?v=e62D-aayveY', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'Tables are strictly for tabular data; use <th> for table headers and merge cells with colspan and rowspan.', 7, 2, false, true, '## HTML Tables\n\nHTML tables allow web developers to arrange data into rows and columns.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Build accessible tables with <table>, <tr>, <th>, and <td>', 1),
    (v_lesson_id, 'Structure header rows and data cells cleanly', 2),
    (v_lesson_id, 'Span multiple columns or rows using colspan and rowspan', 3);

  -- 15. HTML - Lists (-QuK8taGLCs)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod4_id, 'html-lists', 'HTML - Lists', 'Organize related items into unordered bulleted lists (<ul>), numbered ordered lists (<ol>), and description lists (<dl>).', 'video', 'https://www.youtube.com/watch?v=-QuK8taGLCs', 'youtube', '-QuK8taGLCs', 'W3Schools.com', 'https://www.youtube.com/watch?v=-QuK8taGLCs', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'Use <ol> for sequential items, <ul> for non-sequential items, and <dl> for key-value terms and definitions.', 5, 3, false, true, '## Lists in HTML\n\nHTML lists allow web developers to group a set of related items.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Create bulleted lists with <ul> and numbered lists with <ol>', 1),
    (v_lesson_id, 'Nest lists inside list items to create sub-menus', 2),
    (v_lesson_id, 'Create description lists with <dl>, <dt>, and <dd>', 3);

  -- MODULE 5: HTML Layout Concepts
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (v_course_id, 'html-layout-concepts', 'HTML Layout Concepts', 'Understand block vs inline element behavior and use class and id attributes for styling and targeting.', 5, 14, true)
  on conflict (course_id, slug) do update set title = excluded.title, description = excluded.description, position = excluded.position, estimated_minutes = excluded.estimated_minutes, is_published = true
  returning id into v_mod5_id;

  -- 16. HTML - Block and Inline (M4n-WSkehmI)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod5_id, 'html-block-inline', 'HTML - Block and Inline', 'Understand the fundamental difference between block-level elements (<div>, <p>, <h1>) and inline elements (<span>, <a>, <strong>).', 'video', 'https://www.youtube.com/watch?v=M4n-WSkehmI', 'youtube', 'M4n-WSkehmI', 'W3Schools.com', 'https://www.youtube.com/watch?v=M4n-WSkehmI', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'Block elements start on a new line and take up full width; inline elements only take up as much width as necessary.', 5, 1, false, true, '## Block-level vs Inline Elements\n\nEvery HTML element has a default display value (block or inline).')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Distinguish between block-level and inline HTML elements', 1),
    (v_lesson_id, 'Use <div> as a block-level container and <span> as an inline container', 2),
    (v_lesson_id, 'Understand display behavior impact on page flow', 3);

  -- 17. HTML - Classes (tWIkDOJo0Ts)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod5_id, 'html-classes', 'HTML - Classes', 'Learn how the class attribute assigns reusable style and script identifiers to multiple HTML elements.', 'video', 'https://www.youtube.com/watch?v=tWIkDOJo0Ts', 'youtube', 'tWIkDOJo0Ts', 'W3Schools.com', 'https://www.youtube.com/watch?v=tWIkDOJo0Ts', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'The class attribute can be shared across multiple elements to apply consistent styling or targeting.', 5, 2, false, true, '## The HTML Class Attribute\n\nThe HTML class attribute is used to specify a class for an HTML element.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Assign class names using class="className"', 1),
    (v_lesson_id, 'Apply multiple space-separated classes to a single element', 2),
    (v_lesson_id, 'Target class names in CSS with .className syntax', 3);

  -- 18. HTML - Id (rZ0k516qZmc)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod5_id, 'html-id', 'HTML - Id', 'Learn how the id attribute assigns a unique identifier to a single HTML element on the page for styling, scripting, and bookmarks.', 'video', 'https://www.youtube.com/watch?v=rZ0k516qZmc', 'youtube', 'rZ0k516qZmc', 'W3Schools.com', 'https://www.youtube.com/watch?v=rZ0k516qZmc', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'An id must be unique within an HTML document; use id for unique element targeting and in-page navigation anchors.', 4, 3, false, true, '## The HTML ID Attribute\n\nThe HTML id attribute is used to specify a unique id for an HTML element.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Assign unique IDs to elements with id="uniqueId"', 1),
    (v_lesson_id, 'Target IDs in CSS with #uniqueId syntax', 2),
    (v_lesson_id, 'Understand the difference between reusable classes and unique IDs', 3);

  -- MODULE 6: Embedding & Scripting
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (v_course_id, 'embedding-scripting', 'Embedding & Scripting', 'Embed external pages with iframes and connect client-side JavaScript for dynamic behavior.', 6, 10, true)
  on conflict (course_id, slug) do update set title = excluded.title, description = excluded.description, position = excluded.position, estimated_minutes = excluded.estimated_minutes, is_published = true
  returning id into v_mod6_id;

  -- 19. HTML - Iframes (qP23O70ve7k)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod6_id, 'html-iframes', 'HTML - Iframes', 'Learn how the <iframe> element embeds external web pages, video players, maps, and interactive widgets inside your HTML.', 'video', 'https://www.youtube.com/watch?v=qP23O70ve7k', 'youtube', 'qP23O70ve7k', 'W3Schools.com', 'https://www.youtube.com/watch?v=qP23O70ve7k', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'An iframe displays a nested browsing context; always provide a descriptive title attribute for accessibility.', 5, 1, false, true, '## HTML Iframes\n\nAn HTML iframe is used to display a web page within a web page.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Embed external pages and media using <iframe src="...">', 1),
    (v_lesson_id, 'Set iframe dimensions and borders with CSS', 2),
    (v_lesson_id, 'Use the title attribute for screen reader accessibility', 3);

  -- 20. HTML - JavaScript (uSgcWDkwc3U)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod6_id, 'html-javascript', 'HTML - JavaScript', 'Discover how HTML and JavaScript interact using the <script> tag to manipulate the DOM, handle events, and create interactivity.', 'video', 'https://www.youtube.com/watch?v=uSgcWDkwc3U', 'youtube', 'uSgcWDkwc3U', 'W3Schools.com', 'https://www.youtube.com/watch?v=uSgcWDkwc3U', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'The <script> tag is used to embed or link client-side JavaScript to make web pages dynamic and interactive.', 5, 2, false, true, '## JavaScript in HTML\n\nJavaScript makes HTML pages more dynamic and interactive.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Insert client-side scripts using <script> tags', 1),
    (v_lesson_id, 'Link external JavaScript files with <script src="app.js">', 2),
    (v_lesson_id, 'Provide fallback content for disabled scripts using <noscript>', 3);

  -- MODULE 7: Page Metadata & Forms
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (v_course_id, 'page-metadata-forms', 'Page Metadata & Forms', 'Configure <head> document metadata and build accessible user input forms with common controls.', 7, 12, true)
  on conflict (course_id, slug) do update set title = excluded.title, description = excluded.description, position = excluded.position, estimated_minutes = excluded.estimated_minutes, is_published = true
  returning id into v_mod7_id;

  -- 21. HTML - Head (WeuVX5x2MJE)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod7_id, 'html-head', 'HTML - Head', 'Explore the <head> element and its essential tags: <title>, <meta>, <link>, <style>, and <base>.', 'video', 'https://www.youtube.com/watch?v=WeuVX5x2MJE', 'youtube', 'WeuVX5x2MJE', 'W3Schools.com', 'https://www.youtube.com/watch?v=WeuVX5x2MJE', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'The <head> container holds machine-readable metadata about the page that is not directly rendered in the main viewport.', 5, 1, false, true, '## The HTML <head> Element\n\nThe <head> element is a container for metadata placed between <html> and <body>.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Set page titles and favicons in the <head> section', 1),
    (v_lesson_id, 'Configure UTF-8 charset and responsive viewport meta tags', 2),
    (v_lesson_id, 'Link external stylesheets and resources', 3);

  -- 22. HTML - Forms (VLeERv_dR6Q)
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod7_id, 'html-forms', 'HTML - Forms', 'Learn how to build user input forms using <form>, <input>, <label>, <select>, <textarea>, and <button> elements.', 'video', 'https://www.youtube.com/watch?v=VLeERv_dR6Q', 'youtube', 'VLeERv_dR6Q', 'W3Schools.com', 'https://www.youtube.com/watch?v=VLeERv_dR6Q', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', false, 'Forms collect user input for server processing; always pair input elements with explicit <label> tags for accessibility.', 7, 2, false, true, '## HTML Forms\n\nAn HTML form is used to collect user input and submit it to a server.')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Explain the purpose and structure of HTML forms', 1),
    (v_lesson_id, 'Add common form controls (text, password, submit, checkboxes, radio buttons)', 2),
    (v_lesson_id, 'Associate <label> elements with <input> fields using for and id', 3);

  -- MODULE 8: Bonus
  insert into public.course_modules (course_id, slug, title, description, position, estimated_minutes, is_published)
  values (v_course_id, 'bonus', 'Bonus', 'Optional behind-the-scenes bloopers from the W3Schools HTML tutorial recording.', 8, 3, true)
  on conflict (course_id, slug) do update set title = excluded.title, description = excluded.description, position = excluded.position, estimated_minutes = excluded.estimated_minutes, is_published = true
  returning id into v_mod8_id;

  -- 23. HTML - Bloopers (HHxPoYUrSQ0) -> is_bonus = true
  insert into public.lessons (module_id, slug, title, summary, lesson_type, video_url, video_provider, youtube_video_id, source_channel, source_url, playlist_id, is_bonus, key_takeaway, estimated_minutes, position, is_preview, is_published, content)
  values (v_mod8_id, 'html-bloopers', 'HTML - Bloopers', 'A fun bonus from the W3Schools HTML tutorial recording.', 'video', 'https://www.youtube.com/watch?v=HHxPoYUrSQ0', 'youtube', 'HHxPoYUrSQ0', 'W3Schools.com', 'https://www.youtube.com/watch?v=HHxPoYUrSQ0', 'PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s', true, 'Learning to code takes practice, patience, and having fun along the way!', 3, 1, false, true, '## Bonus: Behind the Scenes Bloopers!\n\nCongratulations on completing all 22 required lessons in HTML Fundamentals!')
  on conflict (slug) do update set module_id = excluded.module_id, title = excluded.title, summary = excluded.summary, lesson_type = excluded.lesson_type, video_url = excluded.video_url, video_provider = excluded.video_provider, youtube_video_id = excluded.youtube_video_id, source_channel = excluded.source_channel, source_url = excluded.source_url, playlist_id = excluded.playlist_id, is_bonus = excluded.is_bonus, key_takeaway = excluded.key_takeaway, estimated_minutes = excluded.estimated_minutes, position = excluded.position, is_published = true, content = excluded.content
  returning id into v_lesson_id;
  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Enjoy behind-the-scenes moments from the W3Schools HTML tutorial recording', 1);

end $$;


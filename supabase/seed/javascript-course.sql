-- Meritloom Course 3: JavaScript Fundamentals
-- Complete W3Schools JavaScript Playlist Seed (PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz)
-- Strictly adheres to docs/COURSE_SEEDING_GUIDELINES.md:
--   - No source_title column on lessons
--   - No category column on skills
--   - ON CONFLICT (slug) on lessons
--   - ON CONFLICT (course_id, slug) on course_modules
--   - ON CONFLICT (slug) on categories and courses
--   - lessons.content is jsonb (omitted in SQL inserts; rich content mapped in application)
--   - lessons.lesson_type must be one of: 'video', 'article', 'exercise', 'practice', 'knowledge_check'
--   - practice_quizzes columns: lesson_id, title, description, estimated_minutes, is_published
--   - practice_questions columns: quiz_id, question_type, question_text, explanation, position
--   - practice_question_options columns: question_id, option_text, position
--   - practice_question_correct_options columns: question_id, option_id

do $$
declare
  v_category_id uuid;
  v_course_id uuid;
  v_mod1_id uuid;
  v_mod2_id uuid;
  v_mod3_id uuid;
  v_mod4_id uuid;
  v_lesson_id uuid;
  v_skill_web_dev uuid;
  v_skill_js uuid;
  v_skill_js_fund uuid;
  v_skill_vars uuid;
  v_skill_ops uuid;
  v_skill_output uuid;
  v_skill_interactivity uuid;
  v_quiz_id uuid;
  v_q1_id uuid;
  v_q2_id uuid;
begin

  -- =========================================================================
  -- 1. CATEGORY: Web Development
  -- =========================================================================
  insert into public.categories (slug, name, description, icon_name, position, is_active)
  values (
    'web-development',
    'Web Development',
    'Learn to build modern, responsive, and interactive websites with HTML, CSS, and JavaScript foundations.',
    'Layers',
    1,
    true
  )
  on conflict (slug) do update set
    name = excluded.name,
    description = excluded.description,
    icon_name = excluded.icon_name,
    position = excluded.position,
    is_active = true
  returning id into v_category_id;

  -- =========================================================================
  -- 2. COURSE: JavaScript Fundamentals
  -- =========================================================================
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
  ) values (
    'javascript-fundamentals',
    'JavaScript Fundamentals',
    'Learn the foundations of JavaScript and make web pages interactive with variables, functions, objects, conditions, loops, arrays, events and practical browser scripting.',
    'JavaScript adds behavior and interactivity to websites.

In this beginner-friendly course, you''ll learn the core concepts behind JavaScript step by step, starting with basic syntax and values before moving into variables, operators, functions, objects, conditions, loops and browser interactions.

The video lessons come from the W3Schools JavaScript tutorial series and are organized inside Meritloom into clear modules with short summaries, objectives, hands-on practice activities and progress tracking.

A basic understanding of HTML is recommended, and some CSS knowledge will help when building interactive webpage projects.',
    v_category_id,
    'beginner',
    'English',
    105,
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
    updated_at = now()
  returning id into v_course_id;

  -- =========================================================================
  -- 3. LEARNING OUTCOMES
  -- =========================================================================
  delete from public.course_learning_outcomes where course_id = v_course_id;
  insert into public.course_learning_outcomes (course_id, outcome, position) values
    (v_course_id, 'Explain what JavaScript does in a webpage and how it executes alongside HTML and CSS', 1),
    (v_course_id, 'Add JavaScript to an HTML document using inline scripts, internal script tags, and external files', 2),
    (v_course_id, 'Use JavaScript output methods including console.log, innerHTML, document.write, and alert', 3),
    (v_course_id, 'Write valid JavaScript statements, understand code blocks, case sensitivity, and semicolons', 4),
    (v_course_id, 'Add single-line and multi-line comments to document code logic and prevent execution', 5),
    (v_course_id, 'Declare, initialize, and update variables using var, let, and const with proper block scoping', 6),
    (v_course_id, 'Work with JavaScript arithmetic operators, expressions, and operator precedence', 7),
    (v_course_id, 'Build an interactive web project combining HTML structure, CSS styles, and JavaScript logic', 8);

  -- =========================================================================
  -- 4. PREREQUISITES
  -- =========================================================================
  delete from public.course_prerequisites where course_id = v_course_id;
  insert into public.course_prerequisites (course_id, prerequisite, position) values
    (v_course_id, 'Recommended before starting: HTML Fundamentals (/courses/html-fundamentals)', 1),
    (v_course_id, 'Recommended before starting: CSS Fundamentals (/courses/css-fundamentals)', 2),
    (v_course_id, 'Basic familiarity with text editors and web browsers', 3);

  -- =========================================================================
  -- 5. SKILLS & COURSE_SKILLS
  -- =========================================================================
  insert into public.skills (name, slug, is_active) values
    ('Web Development', 'web-development', true)
  on conflict (slug) do update set name = excluded.name, is_active = true
  returning id into v_skill_web_dev;

  insert into public.skills (name, slug, is_active) values
    ('JavaScript', 'javascript', true)
  on conflict (slug) do update set name = excluded.name, is_active = true
  returning id into v_skill_js;

  insert into public.skills (name, slug, is_active) values
    ('JavaScript Fundamentals', 'javascript-fundamentals-skill', true)
  on conflict (slug) do update set name = excluded.name, is_active = true
  returning id into v_skill_js_fund;

  insert into public.skills (name, slug, is_active) values
    ('Variables & Scoping', 'variables-and-scoping', true)
  on conflict (slug) do update set name = excluded.name, is_active = true
  returning id into v_skill_vars;

  insert into public.skills (name, slug, is_active) values
    ('Arithmetic Operators', 'arithmetic-operators', true)
  on conflict (slug) do update set name = excluded.name, is_active = true
  returning id into v_skill_ops;

  insert into public.skills (name, slug, is_active) values
    ('DOM & Output', 'dom-and-output', true)
  on conflict (slug) do update set name = excluded.name, is_active = true
  returning id into v_skill_output;

  insert into public.skills (name, slug, is_active) values
    ('Web Interactivity', 'web-interactivity', true)
  on conflict (slug) do update set name = excluded.name, is_active = true
  returning id into v_skill_interactivity;

  delete from public.course_skills where course_id = v_course_id;
  insert into public.course_skills (course_id, skill_id) values
    (v_course_id, v_skill_web_dev),
    (v_course_id, v_skill_js),
    (v_course_id, v_skill_js_fund),
    (v_course_id, v_skill_vars),
    (v_course_id, v_skill_ops),
    (v_course_id, v_skill_output),
    (v_course_id, v_skill_interactivity)
  on conflict do nothing;

  -- =========================================================================
  -- 6. MODULE 1: Getting Started with JavaScript
  -- =========================================================================
  insert into public.course_modules (
    course_id, slug, title, description, position, estimated_minutes, is_published
  ) values (
    v_course_id,
    'getting-started-with-javascript',
    'Getting Started with JavaScript',
    'Learn what JavaScript is, how to include it in web pages, display output, write statements, and understand syntax and comments.',
    1,
    30,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod1_id;

  -- Lesson 1.1 (Video 1): Introduction to JavaScript
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'javascript-introduction',
    'Introduction to JavaScript',
    'Learn what JavaScript is, how it adds dynamic behavior to web pages, and why it is the core programming language of the web.',
    'JavaScript adds interactivity and logic to web pages, transforming static HTML and CSS documents into responsive applications.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=zofMnllkVfI',
    'zofMnllkVfI',
    'W3Schools.com',
    'https://www.youtube.com/watch?v=zofMnllkVfI',
    'PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz',
    1,
    3,
    true,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    video_provider = excluded.video_provider,
    video_url = excluded.video_url,
    youtube_video_id = excluded.youtube_video_id,
    source_channel = excluded.source_channel,
    source_url = excluded.source_url,
    playlist_id = excluded.playlist_id,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Explain the role of JavaScript in web development', 1),
    (v_lesson_id, 'Distinguish between HTML structure, CSS presentation, and JavaScript behavior', 2),
    (v_lesson_id, 'Understand how web browsers parse and execute JavaScript', 3);

  -- Lesson 1.2 (Video 2): Where to Add JavaScript
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'javascript-where-to',
    'Where to Add JavaScript',
    'Learn how to insert JavaScript inside the HTML head, before the closing body tag, and in clean external .js files.',
    'JavaScript can be embedded directly with <script> tags or loaded from external .js files for better maintainability.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=W-3vp79-d3Y',
    'W-3vp79-d3Y',
    'W3Schools.com',
    'https://www.youtube.com/watch?v=W-3vp79-d3Y',
    'PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz',
    2,
    2,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    video_provider = excluded.video_provider,
    video_url = excluded.video_url,
    youtube_video_id = excluded.youtube_video_id,
    source_channel = excluded.source_channel,
    source_url = excluded.source_url,
    playlist_id = excluded.playlist_id,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Add internal JavaScript using the <script> element', 1),
    (v_lesson_id, 'Link external script files using the src attribute', 2),
    (v_lesson_id, 'Understand the advantages of external script files for caching and organization', 3);

  -- Lesson 1.3 (Video 3): JavaScript Output
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'javascript-output',
    'JavaScript Output',
    'Discover the primary ways JavaScript displays information: innerHTML, document.write(), window.alert(), and console.log().',
    'console.log() is ideal for debugging data, while innerHTML is the standard method to update HTML elements dynamically.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=we8YhT-NiOA',
    'we8YhT-NiOA',
    'W3Schools.com',
    'https://www.youtube.com/watch?v=we8YhT-NiOA',
    'PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz',
    3,
    3,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    video_provider = excluded.video_provider,
    video_url = excluded.video_url,
    youtube_video_id = excluded.youtube_video_id,
    source_channel = excluded.source_channel,
    source_url = excluded.source_url,
    playlist_id = excluded.playlist_id,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Log diagnostic messages using console.log()', 1),
    (v_lesson_id, 'Modify web page contents dynamically with innerHTML', 2),
    (v_lesson_id, 'Display simple modal popups using window.alert()', 3);

  -- Lesson 1.4 (Video 4): JavaScript Statements
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'javascript-statements',
    'JavaScript Statements',
    'Learn how JavaScript programs are constructed from statements, how statements are executed in sequence, and the role of semicolons.',
    'A JavaScript statement is a distinct instruction executed by the browser; statements are terminated with semicolons.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=ZjotKN861EI',
    'ZjotKN861EI',
    'W3Schools.com',
    'https://www.youtube.com/watch?v=ZjotKN861EI',
    'PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz',
    4,
    2,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    video_provider = excluded.video_provider,
    video_url = excluded.video_url,
    youtube_video_id = excluded.youtube_video_id,
    source_channel = excluded.source_channel,
    source_url = excluded.source_url,
    playlist_id = excluded.playlist_id,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Construct valid JavaScript statements', 1),
    (v_lesson_id, 'Understand sequential line-by-line program execution', 2),
    (v_lesson_id, 'Group related statements into code blocks with curly braces {}', 3);

  -- Lesson 1.5 (Video 5): JavaScript Syntax
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'javascript-syntax',
    'JavaScript Syntax',
    'Understand fundamental JavaScript syntax rules, literals, identifiers, expressions, keywords, and case sensitivity.',
    'JavaScript is strictly case-sensitive and distinguishes between fixed literal values and dynamic variable identifiers.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=4BBlc_qDs8g',
    '4BBlc_qDs8g',
    'W3Schools.com',
    'https://www.youtube.com/watch?v=4BBlc_qDs8g',
    'PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz',
    5,
    4,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    video_provider = excluded.video_provider,
    video_url = excluded.video_url,
    youtube_video_id = excluded.youtube_video_id,
    source_channel = excluded.source_channel,
    source_url = excluded.source_url,
    playlist_id = excluded.playlist_id,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Identify number and string literals', 1),
    (v_lesson_id, 'Follow standard camelCase identifier naming conventions', 2),
    (v_lesson_id, 'Avoid reserved keyword naming collisions in code', 3);

  -- Lesson 1.6 (Video 6): JavaScript Comments
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'javascript-comments',
    'JavaScript Comments',
    'Learn how to write single-line and multi-line comments to document logic and temporarily disable code during testing.',
    'Comments are ignored by the JavaScript engine and serve to explain code logic to yourself and collaborators.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=8yroEebhaEk',
    '8yroEebhaEk',
    'W3Schools.com',
    'https://www.youtube.com/watch?v=8yroEebhaEk',
    'PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz',
    6,
    2,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    video_provider = excluded.video_provider,
    video_url = excluded.video_url,
    youtube_video_id = excluded.youtube_video_id,
    source_channel = excluded.source_channel,
    source_url = excluded.source_url,
    playlist_id = excluded.playlist_id,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Write single-line comments using //', 1),
    (v_lesson_id, 'Write multi-line block comments using /* */', 2),
    (v_lesson_id, 'Use comments to document code intent and debug script flow', 3);

  -- Lesson 1.7 (Practice): Practice — Your First JavaScript Statements
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'practice-first-javascript-statements',
    'Practice — Your First JavaScript Statements',
    'Put what you learned into practice: write console logs, create script blocks, and update HTML element text dynamically.',
    'Writing clean, well-commented statements with consistent semicolons builds reliable coding habits.',
    'practice',
    7,
    10,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Open and inspect the browser developer console', 1),
    (v_lesson_id, 'Write clean JavaScript statements terminated by semicolons', 2),
    (v_lesson_id, 'Update HTML element content using getElementById and innerHTML', 3);

  -- Lesson 1.8 (Checkpoint / Quiz): Checkpoint — JavaScript Fundamentals Check
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'quiz-javascript-basics',
    'Checkpoint — JavaScript Fundamentals Check',
    'Test your understanding of JavaScript script tags, output methods, statements, and syntax rules.',
    'Checking your knowledge helps solidify key terminology and core syntax.',
    'knowledge_check',
    8,
    5,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  -- Quiz Questions for 1.8
  delete from public.practice_quizzes where lesson_id = v_lesson_id;
  insert into public.practice_quizzes (lesson_id, title, description, estimated_minutes, is_published)
  values (v_lesson_id, 'JavaScript Fundamentals Check', 'Review your knowledge of statements and output.', 5, true)
  returning id into v_quiz_id;

  insert into public.practice_questions (quiz_id, question_text, explanation, position, question_type)
  values (v_quiz_id, 'Which HTML tag is used to embed or reference JavaScript code?', 'The <script> tag is used to contain inline JavaScript or link to an external .js script.', 1, 'single_choice')
  returning id into v_q1_id;

  insert into public.practice_question_options (question_id, option_text, position) values
    (v_q1_id, '<javascript>', 1),
    (v_q1_id, '<script>', 2),
    (v_q1_id, '<js>', 3),
    (v_q1_id, '<code>', 4);

  insert into public.practice_question_correct_options (question_id, option_id)
  select v_q1_id, id from public.practice_question_options where question_id = v_q1_id and option_text = '<script>';

  insert into public.practice_questions (quiz_id, question_text, explanation, position, question_type)
  values (v_quiz_id, 'Which method outputs information directly to the browser developer console?', 'console.log() writes diagnostic messages directly to the browser console window.', 2, 'single_choice')
  returning id into v_q2_id;

  insert into public.practice_question_options (question_id, option_text, position) values
    (v_q2_id, 'window.print()', 1),
    (v_q2_id, 'console.log()', 2),
    (v_q2_id, 'document.console()', 3),
    (v_q2_id, 'terminal.write()', 4);

  insert into public.practice_question_correct_options (question_id, option_id)
  select v_q2_id, id from public.practice_question_options where question_id = v_q2_id and option_text = 'console.log()';

  -- =========================================================================
  -- 7. MODULE 2: Variables & Data Values
  -- =========================================================================
  insert into public.course_modules (
    course_id, slug, title, description, position, estimated_minutes, is_published
  ) values (
    v_course_id,
    'variables-and-data-values',
    'Variables & Data Values',
    'Master JavaScript containers for data storage: declare, initialize, and update values using var, let, and const with block scope.',
    2,
    25,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod2_id;

  -- Lesson 2.1 (Video 7): JavaScript Variables
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod2_id,
    'javascript-variables',
    'JavaScript Variables',
    'Learn how variables store data values and how the assignment operator = assigns values to variable identifiers.',
    'Variables give names to values so those values can be stored, referenced, and modified throughout a program.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=7xStNKTM3bE',
    '7xStNKTM3bE',
    'W3Schools.com',
    'https://www.youtube.com/watch?v=7xStNKTM3bE',
    'PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz',
    1,
    4,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    video_provider = excluded.video_provider,
    video_url = excluded.video_url,
    youtube_video_id = excluded.youtube_video_id,
    source_channel = excluded.source_channel,
    source_url = excluded.source_url,
    playlist_id = excluded.playlist_id,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Understand the concept of variable storage in memory', 1),
    (v_lesson_id, 'Declare variables and assign values using =', 2),
    (v_lesson_id, 'Distinguish between variable declaration and variable value assignment', 3);

  -- Lesson 2.2 (Video 8): JavaScript Let Keyword
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod2_id,
    'javascript-let-keyword',
    'The let Keyword',
    'Discover why modern JavaScript uses the let keyword for block-scoped variables that can be reassigned over time.',
    'Variables declared with let have block scope and cannot be accidentally redeclared in the same scope.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=-rpU6z9O88o',
    '-rpU6z9O88o',
    'W3Schools.com',
    'https://www.youtube.com/watch?v=-rpU6z9O88o',
    'PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz',
    2,
    3,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    video_provider = excluded.video_provider,
    video_url = excluded.video_url,
    youtube_video_id = excluded.youtube_video_id,
    source_channel = excluded.source_channel,
    source_url = excluded.source_url,
    playlist_id = excluded.playlist_id,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Declare variables with let for mutable data', 1),
    (v_lesson_id, 'Understand block scope {} boundaries with let', 2),
    (v_lesson_id, 'Prevent accidental identifier redeclarations', 3);

  -- Lesson 2.3 (Video 9): JavaScript Const Keyword
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod2_id,
    'javascript-const-keyword',
    'The const Keyword',
    'Learn how to create immutable variable bindings using const for constant values that should never be reassigned.',
    'Always use const by default unless a variable needs to be reassigned; const prevents bugs from unintended reassignment.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=8UjRPL3Foh0',
    '8UjRPL3Foh0',
    'W3Schools.com',
    'https://www.youtube.com/watch?v=8UjRPL3Foh0',
    'PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz',
    3,
    3,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    video_provider = excluded.video_provider,
    video_url = excluded.video_url,
    youtube_video_id = excluded.youtube_video_id,
    source_channel = excluded.source_channel,
    source_url = excluded.source_url,
    playlist_id = excluded.playlist_id,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Declare constants using the const keyword', 1),
    (v_lesson_id, 'Understand mandatory initialization at declaration time with const', 2),
    (v_lesson_id, 'Follow the rule of thumb: const by default, let when reassignment is needed', 3);

  -- Lesson 2.4 (Practice): Practice — Working with let and const
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod2_id,
    'practice-working-with-let-and-const',
    'Practice — Working with let and const',
    'Practice choosing the right declaration keyword: manage user scores, constants, and changing values in JavaScript.',
    'Knowing when to use const versus let ensures code intent is clear and prevents unexpected mutations.',
    'practice',
    4,
    10,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Declare immutable values with const', 1),
    (v_lesson_id, 'Declare and reassign mutable variables with let', 2),
    (v_lesson_id, 'Inspect variable types and values in console outputs', 3);

  -- Lesson 2.5 (Checkpoint / Quiz): Checkpoint — Variables & Scope Check
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod2_id,
    'quiz-variables-and-scope',
    'Checkpoint — Variables & Scope Check',
    'Test your understanding of var, let, const, and block scoping in JavaScript.',
    'Mastering let and const is essential for all modern JavaScript development.',
    'knowledge_check',
    5,
    5,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  -- Quiz Questions for 2.5
  delete from public.practice_quizzes where lesson_id = v_lesson_id;
  insert into public.practice_quizzes (lesson_id, title, description, estimated_minutes, is_published)
  values (v_lesson_id, 'Variables & Scope Check', 'Review your understanding of variable keywords.', 5, true)
  returning id into v_quiz_id;

  insert into public.practice_questions (quiz_id, question_text, explanation, position, question_type)
  values (v_quiz_id, 'What happens if you try to reassign a variable declared with const?', 'JavaScript throws a TypeError: Assignment to constant variable because const bindings are immutable.', 1, 'single_choice')
  returning id into v_q1_id;

  insert into public.practice_question_options (question_id, option_text, position) values
    (v_q1_id, 'The variable value updates silently', 1),
    (v_q1_id, 'JavaScript throws an error because const cannot be reassigned', 2),
    (v_q1_id, 'The variable automatically converts into a let variable', 3),
    (v_q1_id, 'The new value is stored in a separate variable', 4);

  insert into public.practice_question_correct_options (question_id, option_id)
  select v_q1_id, id from public.practice_question_options where question_id = v_q1_id and option_text = 'JavaScript throws an error because const cannot be reassigned';

  insert into public.practice_questions (quiz_id, question_text, explanation, position, question_type)
  values (v_quiz_id, 'Which keyword should you use by default when declaring variables whose values will never change?', 'Use const by default for all variables that will not be reassigned.', 2, 'single_choice')
  returning id into v_q2_id;

  insert into public.practice_question_options (question_id, option_text, position) values
    (v_q2_id, 'var', 1),
    (v_q2_id, 'let', 2),
    (v_q2_id, 'const', 3),
    (v_q2_id, 'fixed', 4);

  insert into public.practice_question_correct_options (question_id, option_id)
  select v_q2_id, id from public.practice_question_options where question_id = v_q2_id and option_text = 'const';

  -- =========================================================================
  -- 8. MODULE 3: Operators & Expressions
  -- =========================================================================
  insert into public.course_modules (
    course_id, slug, title, description, position, estimated_minutes, is_published
  ) values (
    v_course_id,
    'operators-and-expressions',
    'Operators & Expressions',
    'Perform calculations, evaluate expressions, and combine strings and numbers using JavaScript arithmetic and assignment operators.',
    3,
    20,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod3_id;

  -- Lesson 3.1 (Video 10): JavaScript Arithmetic Operators
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod3_id,
    'javascript-arithmetic-operators',
    'JavaScript Arithmetic Operators',
    'Master arithmetic operators: addition (+), subtraction (-), multiplication (*), division (/), modulus (%), exponentiation (**), increment (++), and decrement (--).',
    'Arithmetic operators perform mathematical calculations on numbers and can concatenate strings with the + operator.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=yEJ94pMiT-o',
    'yEJ94pMiT-o',
    'W3Schools.com',
    'https://www.youtube.com/watch?v=yEJ94pMiT-o',
    'PLP9IO4UYNF0WWmZpE3W33vVPRl2GvjEqz',
    1,
    3,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    video_provider = excluded.video_provider,
    video_url = excluded.video_url,
    youtube_video_id = excluded.youtube_video_id,
    source_channel = excluded.source_channel,
    source_url = excluded.source_url,
    playlist_id = excluded.playlist_id,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Perform arithmetic operations with +, -, *, /, %, and **', 1),
    (v_lesson_id, 'Apply increment (++) and decrement (--) shorthand operators', 2),
    (v_lesson_id, 'Understand string concatenation with the + operator', 3);

  -- Lesson 3.2 (Practice): Practice — Arithmetic & Expression Calculations
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod3_id,
    'practice-arithmetic-calculations',
    'Practice — Arithmetic & Expression Calculations',
    'Solve real-world calculation problems: build a shopping cart price totalizer and calculate percentage discounts.',
    'Combining arithmetic operators with variables allows JavaScript to perform dynamic calculations on user data.',
    'practice',
    2,
    10,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Compute mathematical expressions accurately', 1),
    (v_lesson_id, 'Use parentheses to control operator precedence', 2),
    (v_lesson_id, 'Concatenate string labels with calculated numeric values', 3);

  -- Lesson 3.3 (Checkpoint / Quiz): Checkpoint — Operators & Expressions Check
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod3_id,
    'quiz-operators-and-expressions',
    'Checkpoint — Operators & Expressions Check',
    'Review your understanding of JavaScript arithmetic, assignment, and increment operators.',
    'Solid arithmetic knowledge prevents math errors in web calculations and logic.',
    'knowledge_check',
    3,
    5,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  -- Quiz Questions for 3.3
  delete from public.practice_quizzes where lesson_id = v_lesson_id;
  insert into public.practice_quizzes (lesson_id, title, description, estimated_minutes, is_published)
  values (v_lesson_id, 'Operators & Expressions Check', 'Test your knowledge of operators.', 5, true)
  returning id into v_quiz_id;

  insert into public.practice_questions (quiz_id, question_text, explanation, position, question_type)
  values (v_quiz_id, 'What is the value of 10 % 3 in JavaScript?', 'The modulus operator (%) returns the division remainder. 10 divided by 3 is 3 with a remainder of 1.', 1, 'single_choice')
  returning id into v_q1_id;

  insert into public.practice_question_options (question_id, option_text, position) values
    (v_q1_id, '3', 1),
    (v_q1_id, '1', 2),
    (v_q1_id, '0.33', 3),
    (v_q1_id, '10', 4);

  insert into public.practice_question_correct_options (question_id, option_id)
  select v_q1_id, id from public.practice_question_options where question_id = v_q1_id and option_text = '1';

  insert into public.practice_questions (quiz_id, question_text, explanation, position, question_type)
  values (v_quiz_id, 'What does the expression "5" + 5 evaluate to in JavaScript?', 'When a string is added to a number with +, JavaScript converts the number to a string and concatenates them to produce "55".', 2, 'single_choice')
  returning id into v_q2_id;

  insert into public.practice_question_options (question_id, option_text, position) values
    (v_q2_id, '10', 1),
    (v_q2_id, '"55"', 2),
    (v_q2_id, 'NaN', 3),
    (v_q2_id, 'Error', 4);

  insert into public.practice_question_correct_options (question_id, option_id)
  select v_q2_id, id from public.practice_question_options where question_id = v_q2_id and option_text = '"55"';

  -- =========================================================================
  -- 9. MODULE 4: Practical Project & Integration
  -- =========================================================================
  insert into public.course_modules (
    course_id, slug, title, description, position, estimated_minutes, is_published
  ) values (
    v_course_id,
    'practical-project-and-integration',
    'Practical Project & Integration',
    'Connect HTML structure, CSS styling, and JavaScript logic to build a fully interactive personal portfolio and greeting web page.',
    4,
    30,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod4_id;

  -- Lesson 4.1 (Project): Final Project — Build an Interactive Web Page
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod4_id,
    'javascript-final-project',
    'Final Project — Build an Interactive Web Page',
    'Combine HTML structure, CSS styling, and JavaScript variables, statements, and output to create an interactive web page project.',
    'Connecting HTML, CSS, and JavaScript into a cohesive page is the foundational milestone of front-end web development.',
    'practice',
    1,
    30,
    false,
    true,
    false
  )
  on conflict (slug) do update set
    module_id = excluded.module_id,
    title = excluded.title,
    summary = excluded.summary,
    key_takeaway = excluded.key_takeaway,
    lesson_type = excluded.lesson_type,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_preview = excluded.is_preview,
    is_published = excluded.is_published,
    is_bonus = excluded.is_bonus,
    updated_at = now()
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Integrate HTML structure, CSS styling, and JavaScript logic', 1),
    (v_lesson_id, 'Use variables, statements, and event-driven DOM updates', 2),
    (v_lesson_id, 'Create a working interactive web project portfolio item', 3);

end $$;

-- Verify seeded course
select
  c.slug,
  c.title,
  c.difficulty,
  c.estimated_minutes,
  c.is_free,
  c.is_published,
  count(distinct cm.id) as module_count,
  count(distinct l.id) as lesson_count
from public.courses c
left join public.course_modules cm on cm.course_id = c.id
left join public.lessons l on l.module_id = cm.id
where c.slug = 'javascript-fundamentals'
group by c.id, c.slug, c.title, c.difficulty, c.estimated_minutes, c.is_free, c.is_published;

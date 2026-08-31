-- =========================================================
-- MERITLOOM COURSE 2 SEED: CSS Fundamentals
-- Idempotent seed script for CSS Fundamentals course,
-- modules, video lessons, practice exercises, learning outcomes,
-- prerequisites, skills, and lesson objectives.
-- Source: W3Schools.com CSS Tutorial Playlist (PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM)
-- =========================================================

do $$
declare
  v_category_id uuid;
  v_course_id uuid;
  v_mod1_id uuid;
  v_mod2_id uuid;
  v_mod3_id uuid;
  v_mod4_id uuid;
  v_lesson_id uuid;
  v_skill_css_id uuid;
  v_skill_sel_id uuid;
  v_skill_col_id uuid;
  v_skill_bg_id uuid;
  v_skill_style_id uuid;
  v_skill_webdev_id uuid;
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

  -- 2. UPSERT CSS FUNDAMENTALS COURSE
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
    'css-fundamentals',
    'CSS Fundamentals',
    'Learn how to style modern web pages with CSS, from selectors, colors and the box model to layout, Flexbox, responsive design and practical styling.',
    'CSS controls how web pages look and feel. In this beginner-friendly course, you''ll learn how to transform plain HTML into attractive, organized and responsive web pages. Starting with CSS syntax and selectors, the course gradually introduces colors, backgrounds, borders, spacing, typography, layout and modern CSS techniques. The video lessons come from the W3Schools CSS tutorial series and are organized inside Meritloom with structured modules, lesson summaries, practice activities and progress tracking. A basic understanding of HTML is recommended before starting this course.',
    v_category_id,
    'beginner',
    'English',
    65,
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
    (v_course_id, 'Explain how CSS styles HTML documents and separates structure from presentation', 1),
    (v_course_id, 'Write valid CSS rules using selectors, properties, and values', 2),
    (v_course_id, 'Apply external, internal, and inline CSS to HTML pages', 3),
    (v_course_id, 'Use element, class, ID, and universal selectors effectively', 4),
    (v_course_id, 'Work with color names, RGB, RGBA, HEX, and HSL color formats', 5),
    (v_course_id, 'Style background colors, images, position, repeat, and attachment', 6),
    (v_course_id, 'Write clean background shorthand declarations to streamline stylesheets', 7),
    (v_course_id, 'Combine HTML and CSS into a complete, attractively styled personal website', 8);

  -- 4. UPSERT COURSE PREREQUISITES (Recommended, Not Locked)
  delete from public.course_prerequisites where course_id = v_course_id;

  insert into public.course_prerequisites (course_id, prerequisite, position) values
    (v_course_id, 'Recommended before starting: HTML Fundamentals (/courses/html-fundamentals)', 1),
    (v_course_id, 'A modern web browser (Chrome, Firefox, Safari, or Edge)', 2),
    (v_course_id, 'A text editor such as VS Code, Notepad, or TextEdit', 3);

  -- 5. UPSERT SKILLS & COURSE_SKILLS
  insert into public.skills (name, slug, is_active) values
    ('CSS', 'css', true)
  on conflict (slug) do update set is_active = true
  returning id into v_skill_css_id;

  insert into public.skills (name, slug, is_active) values
    ('CSS Selectors', 'css-selectors', true)
  on conflict (slug) do update set is_active = true
  returning id into v_skill_sel_id;

  insert into public.skills (name, slug, is_active) values
    ('CSS Colors', 'css-colors', true)
  on conflict (slug) do update set is_active = true
  returning id into v_skill_col_id;

  insert into public.skills (name, slug, is_active) values
    ('CSS Backgrounds', 'css-backgrounds', true)
  on conflict (slug) do update set is_active = true
  returning id into v_skill_bg_id;

  insert into public.skills (name, slug, is_active) values
    ('Web Styling', 'web-styling', true)
  on conflict (slug) do update set is_active = true
  returning id into v_skill_style_id;

  insert into public.skills (name, slug, is_active) values
    ('Web Development', 'web-development', true)
  on conflict (slug) do update set is_active = true
  returning id into v_skill_webdev_id;

  delete from public.course_skills where course_id = v_course_id;

  insert into public.course_skills (course_id, skill_id) values
    (v_course_id, v_skill_css_id),
    (v_course_id, v_skill_sel_id),
    (v_course_id, v_skill_col_id),
    (v_course_id, v_skill_bg_id),
    (v_course_id, v_skill_style_id),
    (v_course_id, v_skill_webdev_id)
  on conflict do nothing;

  -- =========================================================
  -- MODULE 1: GETTING STARTED WITH CSS (5 Videos + 1 Practice)
  -- =========================================================
  insert into public.course_modules (
    course_id, slug, title, description, position, estimated_minutes, is_published
  )
  values (
    v_course_id,
    'getting-started-css',
    'Getting Started with CSS',
    'Understand what CSS is, learn the syntax of rules and declaration blocks, explore simple selectors, and discover the three ways to add CSS to HTML.',
    1,
    19,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod1_id;

  -- Lesson 1.1: CSS Introduction (AGDDdsiZ0Ko)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel, source_title,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'css-introduction',
    'Introduction to CSS',
    'Learn what CSS is, how it works with HTML, and why separating structure from presentation makes web pages easier to style and maintain.',
    'CSS (Cascading Style Sheets) describes how HTML elements are to be displayed on screen, paper, or in other media.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=AGDDdsiZ0Ko',
    'AGDDdsiZ0Ko',
    'W3Schools.com',
    'CSS - Introduction - W3Schools.com',
    'https://www.youtube.com/watch?v=AGDDdsiZ0Ko',
    'PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM',
    1,
    2,
    true,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    youtube_video_id = excluded.youtube_video_id, is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Understand what CSS stands for and its core role in web development', 1),
    (v_lesson_id, 'Learn why CSS saves massive work by controlling layout across multiple pages', 2),
    (v_lesson_id, 'Identify the relationship between HTML structure and CSS presentation', 3);

  -- Lesson 1.2: CSS Syntax (G8r00ZNopTE)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel, source_title,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'css-syntax',
    'CSS Syntax & Declarations',
    'Understand selectors, properties, values, and declaration blocks—the core building blocks of every CSS rule.',
    'A CSS rule consists of a selector and a declaration block containing property-value pairs separated by semicolons.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=G8r00ZNopTE',
    'G8r00ZNopTE',
    'W3Schools.com',
    'CSS - Syntax - W3Schools.com',
    'https://www.youtube.com/watch?v=G8r00ZNopTE',
    'PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM',
    2,
    2,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    youtube_video_id = excluded.youtube_video_id, is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Identify CSS selectors and declaration blocks', 1),
    (v_lesson_id, 'Write clean property-value pairs with colons and semicolons', 2),
    (v_lesson_id, 'Format CSS rules with curly braces for readability', 3);

  -- Lesson 1.3: CSS Selectors (ZNskBxLVOfs)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel, source_title,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'css-selectors',
    'CSS Simple Selectors',
    'Master targeting HTML elements using element type selectors, class selectors (.class), ID selectors (#id), and the universal selector (*).',
    'CSS simple selectors find elements by name, id, or class to apply targeted styles.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=ZNskBxLVOfs',
    'ZNskBxLVOfs',
    'W3Schools.com',
    'CSS - Simple Selectors - W3Schools.com',
    'https://www.youtube.com/watch?v=ZNskBxLVOfs',
    'PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM',
    3,
    3,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    youtube_video_id = excluded.youtube_video_id, is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Target elements by HTML tag name (e.g. p, h1)', 1),
    (v_lesson_id, 'Use class selectors (.classname) to style multiple elements', 2),
    (v_lesson_id, 'Use ID selectors (#idname) to target a specific unique element', 3),
    (v_lesson_id, 'Group multiple selectors using commas to share styles', 4);

  -- Lesson 1.4: How to Add CSS (VSwaoQ3TFkQ)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel, source_title,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'css-how-to',
    'How to Add CSS to HTML',
    'Explore the three ways to insert CSS into web pages: External CSS files (<link>), Internal style blocks (<style>), and Inline style attributes.',
    'External stylesheets are the industry standard for production websites because they allow one file to style an entire site.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=VSwaoQ3TFkQ',
    'VSwaoQ3TFkQ',
    'W3Schools.com',
    'CSS - How to add CSS to HTML - W3Schools.com',
    'https://www.youtube.com/watch?v=VSwaoQ3TFkQ',
    'PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM',
    4,
    3,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    youtube_video_id = excluded.youtube_video_id, is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Link an external .css stylesheet inside the HTML <head>', 1),
    (v_lesson_id, 'Write internal CSS within a <style> tag', 2),
    (v_lesson_id, 'Apply inline CSS using the HTML style attribute', 3),
    (v_lesson_id, 'Understand cascading priority when multiple styles apply', 4);

  -- Lesson 1.5: CSS Comments (uVtEJD3vBEs)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel, source_title,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'css-comments',
    'CSS Comments',
    'Learn how CSS comments (/* ... */) help document stylesheets, organize sections, and temporarily disable rules during debugging.',
    'CSS comments begin with /* and end with */, and are completely ignored by browsers.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=uVtEJD3vBEs',
    'uVtEJD3vBEs',
    'W3Schools.com',
    'CSS - Comments - W3Schools.com',
    'https://www.youtube.com/watch?v=uVtEJD3vBEs',
    'PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM',
    5,
    2,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    youtube_video_id = excluded.youtube_video_id, is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Write single-line and multi-line comments in CSS', 1),
    (v_lesson_id, 'Use comments to section and organize large stylesheets', 2),
    (v_lesson_id, 'Temporarily disable CSS declarations while troubleshooting', 3);

  -- Lesson 1.6: Practice — Connect & Write Your First CSS
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod1_id,
    'practice-first-stylesheet',
    'Practice — Connect & Write Your First CSS',
    'Create an external stylesheet, link it to an HTML document, and apply element, class, and ID rules.',
    'Structuring CSS into an external file and using descriptive class names creates clean, maintainable code.',
    'practice',
    6,
    8,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Create a styles.css file and link it using <link rel="stylesheet">', 1),
    (v_lesson_id, 'Apply background and text styles across multiple tags', 2),
    (v_lesson_id, 'Use class and ID selectors to create distinct card layouts', 3);

  -- =========================================================
  -- MODULE 2: COLORS & COLOR FORMATS (4 Videos + 1 Practice)
  -- =========================================================
  insert into public.course_modules (
    course_id, slug, title, description, position, estimated_minutes, is_published
  )
  values (
    v_course_id,
    'css-colors',
    'Colors & Color Formats',
    'Master the web color system: named colors, RGB, RGBA with opacity, Hexadecimal color codes, and intuitive HSL / HSLA coordinates.',
    2,
    20,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod2_id;

  -- Lesson 2.1: CSS Colors Intro (q0uWmobMf6I)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel, source_title,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod2_id,
    'css-colors-intro',
    'Introduction to CSS Colors',
    'Discover standard predefined color names, foreground text colors with the color property, background colors, and border colors.',
    'Colors in CSS can be set using standard color names or specific numerical color formats.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=q0uWmobMf6I',
    'q0uWmobMf6I',
    'W3Schools.com',
    'CSS - Colors Introduction - W3Schools.com',
    'https://www.youtube.com/watch?v=q0uWmobMf6I',
    'PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM',
    1,
    4,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    youtube_video_id = excluded.youtube_video_id, is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Set text color using the color property', 1),
    (v_lesson_id, 'Apply background colors to containers and headings', 2),
    (v_lesson_id, 'Style border colors on elements', 3);

  -- Lesson 2.2: CSS Colors RGB & RGBA (6tbUo6PXc88)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel, source_title,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod2_id,
    'css-colors-rgb',
    'RGB & RGBA Color Values',
    'Specify precise colors using Red, Green, and Blue channels from 0 to 255, and add transparency with alpha channels in RGBA.',
    'An RGB color value represents RED, GREEN, and BLUE light sources; RGBA adds an Alpha channel (0.0 to 1.0) for opacity.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=6tbUo6PXc88',
    '6tbUo6PXc88',
    'W3Schools.com',
    'CSS - Colors RGB & RGBA - W3Schools.com',
    'https://www.youtube.com/watch?v=6tbUo6PXc88',
    'PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM',
    2,
    2,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    youtube_video_id = excluded.youtube_video_id, is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Define colors with rgb(red, green, blue) syntax', 1),
    (v_lesson_id, 'Control opacity and background transparency with rgba(r, g, b, a)', 2),
    (v_lesson_id, 'Understand how color channels combine to create millions of colors', 3);

  -- Lesson 2.3: CSS Colors Hex (LLmCr_201GU)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel, source_title,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod2_id,
    'css-colors-hex',
    'HEX Color Codes',
    'Master hexadecimal color codes (#RRGGBB) used by designers and developers worldwide for web color definitions.',
    'A hexadecimal color is specified with: #RRGGBB, where the RR (red), GG (green) and BB (blue) are hex values between 00 and FF.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=LLmCr_201GU',
    'LLmCr_201GU',
    'W3Schools.com',
    'CSS - Colors Hex - W3Schools.com',
    'https://www.youtube.com/watch?v=LLmCr_201GU',
    'PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM',
    3,
    3,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    youtube_video_id = excluded.youtube_video_id, is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Read and write 6-digit hex color codes', 1),
    (v_lesson_id, 'Use 3-digit shorthand hex codes (e.g. #fff, #f00)', 2),
    (v_lesson_id, 'Pick and integrate design palette hex codes into stylesheets', 3);

  -- Lesson 2.4: CSS Colors HSL (Vilk0BFQZ4Y)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel, source_title,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod2_id,
    'css-colors-hsl',
    'HSL & HSLA Color Values',
    'Understand Hue, Saturation, and Lightness (HSL)—an intuitive way to create tints, shades, and complementary color palettes.',
    'HSL stands for Hue (0-360 degree color wheel), Saturation (0-100% grayness), and Lightness (0-100% brightness).',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=Vilk0BFQZ4Y',
    'Vilk0BFQZ4Y',
    'W3Schools.com',
    'CSS - Colors HSL - W3Schools.com',
    'https://www.youtube.com/watch?v=Vilk0BFQZ4Y',
    'PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM',
    4,
    3,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    youtube_video_id = excluded.youtube_video_id, is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Navigate the 360-degree color wheel using Hue', 1),
    (v_lesson_id, 'Adjust Saturation and Lightness to create lighter/darker color variations', 2),
    (v_lesson_id, 'Use HSLA to add transparency to HSL colors', 3);

  -- Lesson 2.5: Practice — Build a Brand Color Palette
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod2_id,
    'practice-color-palette',
    'Practice — Build a Brand Color Palette',
    'Build a cohesive color palette for a web project using HEX, RGBA for translucent overlays, and HSL for hover states.',
    'Using consistent color formats and verifying contrast ratios ensures an accessible, attractive visual hierarchy.',
    'practice',
    5,
    8,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Define primary, secondary, and neutral colors with HEX', 1),
    (v_lesson_id, 'Create frosted translucent card backgrounds with RGBA', 2),
    (v_lesson_id, 'Create lighter and darker button hover states using HSL Lightness', 3);

  -- =========================================================
  -- MODULE 3: CSS BACKGROUNDS (5 Videos + 1 Practice)
  -- =========================================================
  insert into public.course_modules (
    course_id, slug, title, description, position, estimated_minutes, is_published
  )
  values (
    v_course_id,
    'css-backgrounds',
    'CSS Backgrounds',
    'Learn all aspects of CSS backgrounds: background colors, background images, repeat modes, positioning, attachment scrolling, and shorthand notation.',
    3,
    19,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod3_id;

  -- Lesson 3.1: CSS Background Colors (-itttmX6HX0)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel, source_title,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod3_id,
    'css-background-colors',
    'CSS Background Colors',
    'Apply background colors to full page bodies, hero sections, cards, and buttons with good contrast for text readability.',
    'The background-color property specifies the background color of an element.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=-itttmX6HX0',
    '-itttmX6HX0',
    'W3Schools.com',
    'CSS - Background Colors - W3Schools.com',
    'https://www.youtube.com/watch?v=-itttmX6HX0',
    'PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM',
    1,
    3,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    youtube_video_id = excluded.youtube_video_id, is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Set page-wide background colors on <body>', 1),
    (v_lesson_id, 'Apply distinct backgrounds to cards and navigation bars', 2),
    (v_lesson_id, 'Ensure accessible contrast between background-color and text color', 3);

  -- Lesson 3.2: CSS Background Images (FMyU_h8m-0c)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel, source_title,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod3_id,
    'css-background-images',
    'CSS Background Images',
    'Embed background images using url() and understand how browsers tile images horizontally and vertically by default.',
    'The background-image property sets an image as the background of an element.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=FMyU_h8m-0c',
    'FMyU_h8m-0c',
    'W3Schools.com',
    'CSS - Background Images - W3Schools.com',
    'https://www.youtube.com/watch?v=FMyU_h8m-0c',
    'PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM',
    2,
    2,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    youtube_video_id = excluded.youtube_video_id, is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Specify background image URLs with url(''image.jpg'')', 1),
    (v_lesson_id, 'Understand default repeating behavior of background images', 2),
    (v_lesson_id, 'Choose appropriate imagery for hero banners and cards', 3);

  -- Lesson 3.3: Background Repeat and Position (k9dNFtC2F8A)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel, source_title,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod3_id,
    'css-background-repeat-position',
    'Background Repeat & Position',
    'Control whether images tile with background-repeat (no-repeat, repeat-x, repeat-y) and align backgrounds with background-position.',
    'Combine no-repeat with background-position (center, top right, etc.) to place hero graphics and background accents accurately.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=k9dNFtC2F8A',
    'k9dNFtC2F8A',
    'W3Schools.com',
    'CSS - Background Repeat and Position - W3Schools.com',
    'https://www.youtube.com/watch?v=k9dNFtC2F8A',
    'PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM',
    3,
    2,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    youtube_video_id = excluded.youtube_video_id, is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Prevent image tiling using background-repeat: no-repeat', 1),
    (v_lesson_id, 'Repeat images along a single axis (repeat-x or repeat-y)', 2),
    (v_lesson_id, 'Position background graphics using keywords and pixel/percentage offsets', 3);

  -- Lesson 3.4: Background Attachment (lXs8BRnrW_M)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel, source_title,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod3_id,
    'css-background-attachment',
    'Background Attachment & Scrolling',
    'Learn how background-attachment controls whether a background scrolls with the rest of the page or remains fixed in place.',
    'background-attachment: fixed keeps the background in place while page content scrolls over it, creating a parallax effect.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=lXs8BRnrW_M',
    'lXs8BRnrW_M',
    'W3Schools.com',
    'CSS - Background Attachment - W3Schools.com',
    'https://www.youtube.com/watch?v=lXs8BRnrW_M',
    'PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM',
    4,
    2,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    youtube_video_id = excluded.youtube_video_id, is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Use background-attachment: scroll (default behavior)', 1),
    (v_lesson_id, 'Apply background-attachment: fixed for stationary backgrounds', 2),
    (v_lesson_id, 'Understand visual impact and mobile considerations', 3);

  -- Lesson 3.5: Background Shorthand (rSEKmi5tR9E)
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    video_provider, video_url, youtube_video_id, source_channel, source_title,
    source_url, playlist_id, position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod3_id,
    'css-background-shorthand',
    'CSS Background Shorthand',
    'Condense multiple background properties (color, image, repeat, attachment, position) into a single concise background declaration.',
    'The background shorthand property lets you specify all background properties in one line.',
    'video',
    'youtube',
    'https://www.youtube.com/watch?v=rSEKmi5tR9E',
    'rSEKmi5tR9E',
    'W3Schools.com',
    'CSS - Background Shorthand - W3Schools.com',
    'https://www.youtube.com/watch?v=rSEKmi5tR9E',
    'PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM',
    5,
    2,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    youtube_video_id = excluded.youtube_video_id, is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Write valid background shorthand rules', 1),
    (v_lesson_id, 'Memorize the standard property order for shorthand syntax', 2),
    (v_lesson_id, 'Refactor verbose background declarations into clean shorthand', 3);

  -- Lesson 3.6: Practice — Style a Hero Banner with Backgrounds
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod3_id,
    'practice-hero-banner',
    'Practice — Style a Hero Banner with Backgrounds',
    'Design a full-width hero header with a centered background image, translucent overlay, and crisp typography.',
    'Combining background-image, background-position, and background-repeat shorthand produces polished, responsive banners.',
    'practice',
    6,
    8,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Set a background image centered with no-repeat', 1),
    (v_lesson_id, 'Apply background shorthand for clean stylesheet rules', 2),
    (v_lesson_id, 'Add high-contrast typography over background visuals', 3);

  -- =========================================================
  -- MODULE 4: APPLIED STYLING & PROJECTS (1 Final Project)
  -- =========================================================
  insert into public.course_modules (
    course_id, slug, title, description, position, estimated_minutes, is_published
  )
  values (
    v_course_id,
    'applied-styling-project',
    'Applied Styling & Projects',
    'Synthesize all CSS fundamentals into a complete, beautifully styled multi-section personal website.',
    4,
    15,
    true
  )
  on conflict (course_id, slug) do update set
    title = excluded.title,
    description = excluded.description,
    position = excluded.position,
    estimated_minutes = excluded.estimated_minutes,
    is_published = true
  returning id into v_mod4_id;

  -- Lesson 4.1: Final Project
  insert into public.lessons (
    module_id, slug, title, summary, key_takeaway, lesson_type,
    position, estimated_minutes, is_preview, is_published, is_bonus
  ) values (
    v_mod4_id,
    'project-style-personal-site',
    'Final Project — Style Your Personal Website',
    'Transform your HTML website from Course 1 into a modern styled portfolio with external CSS, custom typography, brand colors, and layered backgrounds.',
    'Clean CSS organization and consistent design tokens turn plain HTML markup into professional web experiences.',
    'practice',
    1,
    15,
    false,
    true,
    false
  )
  on conflict (module_id, slug) do update set
    title = excluded.title, summary = excluded.summary, key_takeaway = excluded.key_takeaway,
    is_published = true
  returning id into v_lesson_id;

  delete from public.lesson_objectives where lesson_id = v_lesson_id;
  insert into public.lesson_objectives (lesson_id, objective, position) values
    (v_lesson_id, 'Structure an external CSS stylesheet linked to your HTML portfolio', 1),
    (v_lesson_id, 'Apply an accessible color system using HEX, RGB, and HSL', 2),
    (v_lesson_id, 'Style headers, navigation bars, cards, and footer sections with backgrounds', 3),
    (v_lesson_id, 'Prepare your styled layout for interactive JavaScript in the upcoming course', 4);

end $$;


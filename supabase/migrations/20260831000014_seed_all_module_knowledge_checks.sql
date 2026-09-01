-- =========================================================================
-- MIGRATION: 20260831000014_seed_all_module_knowledge_checks.sql
-- Description: Seed Knowledge Checks for every course module in HTML, CSS, and JS.
-- =========================================================================

do $$
declare
  v_course_id uuid;
  v_module_id uuid;
  v_lesson_id uuid;
  v_quiz_id uuid;
  v_q_id uuid;
  v_opt_id uuid;
  v_max_pos int;
begin

  -- -----------------------------------------------------------------------
  -- html-fundamentals: Knowledge Check — HTML Basics
  -- -----------------------------------------------------------------------
  select id into v_course_id from public.courses where slug = 'html-fundamentals' limit 1;
  if v_course_id is not null then
    -- Find target module by position or slug
    select id into v_module_id from public.course_modules where course_id = v_course_id order by position offset 0 limit 1;
    if v_module_id is not null then
      -- Get next position in module
      select coalesce(max(position), 0) + 1 into v_max_pos from public.lessons where module_id = v_module_id and slug != 'html-basics-knowledge-check';
      
      -- Insert or update lesson
      insert into public.lessons (
        module_id, slug, title, summary, lesson_type, key_takeaway, estimated_minutes, position, is_preview, is_bonus, is_published
      ) values (
        v_module_id, 'html-basics-knowledge-check', 'Knowledge Check — HTML Basics', 'Test your understanding of foundational HTML concepts, elements, attributes, and text editor configuration.', 'knowledge_check', 'Understanding the core syntax of elements, tags, and attributes is the foundation for creating valid web pages.', 5, v_max_pos, false, false, true
      )
      on conflict (slug) do update set
        title = excluded.title,
        summary = excluded.summary,
        lesson_type = excluded.lesson_type,
        key_takeaway = excluded.key_takeaway,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_lesson_id;
      
      -- Insert or update practice_quizzes
      insert into public.practice_quizzes (lesson_id, title, description, estimated_minutes, is_published)
      values (v_lesson_id, 'HTML Basics Check', 'Review your knowledge of core HTML concepts, elements, and attributes.', 5, true)
      on conflict (lesson_id) do update set
        title = excluded.title,
        description = excluded.description,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_quiz_id;
      
      -- Rebuild questions for this quiz
      delete from public.practice_questions where quiz_id = v_quiz_id;
      
      -- Question 1
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'What is the primary purpose of HTML in web development?', 'HTML Introduction', null, 'HTML (HyperText Markup Language) is the standard markup language used to structure the content and layout of a web page.', 1)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Structuring the content and layout of a web page', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Styling the visual presentation, fonts, and colors of web elements', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Handling database transactions and server logic', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Running background asynchronous computations', 4)
      returning id into v_opt_id;
      
      -- Question 2
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Which declaration informs web browsers that a document is written in modern HTML5?', 'HTML Document Structure', null, '<!DOCTYPE html> is the standard, case-insensitive document type declaration required at the very top of HTML5 documents.', 2)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<!DOCTYPE html>', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<html version="5.0">', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<?xml html="5"?>', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<doctype html5>', 4)
      returning id into v_opt_id;
      
      -- Question 3
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'multiple_choice', 'Which of the following statements about HTML attributes are correct? (Select all that apply)', 'HTML Attributes', null, 'HTML attributes provide extra properties/configuration (like href or src), are always specified in the start tag, and should be written in lowercase in modern standards.', 3)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Attributes provide additional configuration or metadata for HTML elements', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Attributes are always specified inside the element''s start tag', 2)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Attribute names should be written in lowercase in modern HTML5', 3)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Attributes must always be placed inside the closing tag', 4)
      returning id into v_opt_id;
      
      -- Question 4
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'true_false', 'True or False: In HTML, elements without content or closing tags (such as <img> and <br>) are called empty or void elements.', 'HTML Elements', null, 'Empty (void) elements do not have closing tags and cannot contain child text or elements.', 4)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'True', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'False', 2)
      returning id into v_opt_id;
      
      -- Question 5
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'What happens when an .html file saved on your computer is opened in a web browser?', 'HTML Editors & Browsers', null, 'Web browsers read HTML files directly and interpret the markup tags to render the elements as a visual web page.', 5)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The browser interprets the HTML tags and renders a formatted web page', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The browser displays only the raw unformatted source code text', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The file must first be compiled by a Node.js server', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The browser requires an active internet connection to open local files', 4)
      returning id into v_opt_id;
      
    end if;
  end if;

  -- -----------------------------------------------------------------------
  -- html-fundamentals: Knowledge Check — Text & Formatting
  -- -----------------------------------------------------------------------
  select id into v_course_id from public.courses where slug = 'html-fundamentals' limit 1;
  if v_course_id is not null then
    -- Find target module by position or slug
    select id into v_module_id from public.course_modules where course_id = v_course_id order by position offset 1 limit 1;
    if v_module_id is not null then
      -- Get next position in module
      select coalesce(max(position), 0) + 1 into v_max_pos from public.lessons where module_id = v_module_id and slug != 'html-text-formatting-knowledge-check';
      
      -- Insert or update lesson
      insert into public.lessons (
        module_id, slug, title, summary, lesson_type, key_takeaway, estimated_minutes, position, is_preview, is_bonus, is_published
      ) values (
        v_module_id, 'html-text-formatting-knowledge-check', 'Knowledge Check — Text & Formatting', 'Test your understanding of heading hierarchy, paragraph spacing, text formatting elements, and HTML comments.', 'knowledge_check', 'Semantic text tags give structure and meaning to web content while improving accessibility.', 5, v_max_pos, false, false, true
      )
      on conflict (slug) do update set
        title = excluded.title,
        summary = excluded.summary,
        lesson_type = excluded.lesson_type,
        key_takeaway = excluded.key_takeaway,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_lesson_id;
      
      -- Insert or update practice_quizzes
      insert into public.practice_quizzes (lesson_id, title, description, estimated_minutes, is_published)
      values (v_lesson_id, 'Text & Formatting Check', 'Review headings, paragraphs, text formatting tags, and comments.', 5, true)
      on conflict (lesson_id) do update set
        title = excluded.title,
        description = excluded.description,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_quiz_id;
      
      -- Rebuild questions for this quiz
      delete from public.practice_questions where quiz_id = v_quiz_id;
      
      -- Question 1
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Which heading tag represents the highest and most important level of heading in an HTML document?', 'HTML Headings', null, '<h1> is the top-level heading in HTML, with <h2> through <h6> representing subheadings of decreasing importance.', 1)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<h1>', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<head>', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<h6>', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<header>', 4)
      returning id into v_opt_id;
      
      -- Question 2
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'What does a web browser automatically do when rendering a <p> paragraph element?', 'HTML Paragraphs', null, 'Browsers apply default user-agent styling that inserts vertical margin before and after <p> elements to separate paragraphs.', 2)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It adds default vertical margin/spacing before and after the paragraph', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It centers the text horizontally on the page', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It converts all text to bold font weight', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It underlines every word in the paragraph', 4)
      returning id into v_opt_id;
      
      -- Question 3
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'multiple_choice', 'Which of the following tags are used for semantic or visual text formatting in HTML? (Select all that apply)', 'HTML Text Formatting', null, '<strong> conveys strong importance, <em> indicates emphasized stress, and <mark> highlights text. <format> is not a valid HTML element.', 3)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<strong> for strong importance or bold emphasis', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<em> for emphasized stress text', 2)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<mark> for highlighted text', 3)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<format> for generic typography styling', 4)
      returning id into v_opt_id;
      
      -- Question 4
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'true_false', 'True or False: HTML comments written with <!-- comment --> are rendered visually for visitors on the web page.', 'HTML Comments', null, 'HTML comments are ignored by the browser renderer, though they remain accessible in the page''s source code.', 4)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'True', 1)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'False', 2)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      
      -- Question 5
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'How is an inline CSS style correctly added to an HTML element?', 'HTML Styles', null, 'Inline styles are specified using the style attribute containing CSS property-value pairs separated by semicolons.', 5)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<p style="color: blue; font-size: 16px;">Text</p>', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<p css="color: blue;">Text</p>', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<p text-color="blue">Text</p>', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<p style={color: ''blue''}>Text</p>', 4)
      returning id into v_opt_id;
      
    end if;
  end if;

  -- -----------------------------------------------------------------------
  -- html-fundamentals: Knowledge Check — Colors, CSS & Links
  -- -----------------------------------------------------------------------
  select id into v_course_id from public.courses where slug = 'html-fundamentals' limit 1;
  if v_course_id is not null then
    -- Find target module by position or slug
    select id into v_module_id from public.course_modules where course_id = v_course_id order by position offset 2 limit 1;
    if v_module_id is not null then
      -- Get next position in module
      select coalesce(max(position), 0) + 1 into v_max_pos from public.lessons where module_id = v_module_id and slug != 'html-colors-css-links-knowledge-check';
      
      -- Insert or update lesson
      insert into public.lessons (
        module_id, slug, title, summary, lesson_type, key_takeaway, estimated_minutes, position, is_preview, is_bonus, is_published
      ) values (
        v_module_id, 'html-colors-css-links-knowledge-check', 'Knowledge Check — Colors, CSS & Links', 'Test your understanding of color representations, CSS inclusion, hyperlinks, and target attributes.', 'knowledge_check', 'Hyperlinks interconnect the web, and understanding href targets and CSS linking is essential for navigation and styling.', 5, v_max_pos, false, false, true
      )
      on conflict (slug) do update set
        title = excluded.title,
        summary = excluded.summary,
        lesson_type = excluded.lesson_type,
        key_takeaway = excluded.key_takeaway,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_lesson_id;
      
      -- Insert or update practice_quizzes
      insert into public.practice_quizzes (lesson_id, title, description, estimated_minutes, is_published)
      values (v_lesson_id, 'Colors, CSS & Links Check', 'Review color values, linking stylesheets, and creating hyperlinks.', 5, true)
      on conflict (lesson_id) do update set
        title = excluded.title,
        description = excluded.description,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_quiz_id;
      
      -- Rebuild questions for this quiz
      delete from public.practice_questions where quiz_id = v_quiz_id;
      
      -- Question 1
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Which HTML attribute is used in an <a> anchor element to specify the destination URL of a hyperlink?', 'HTML Links', null, 'The href (Hypertext REFerence) attribute specifies the target URL or destination address for the link.', 1)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'href', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'src', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'link', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'target', 4)
      returning id into v_opt_id;
      
      -- Question 2
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'How do you configure an HTML link to open in a new browser tab or window?', 'HTML Links', null, 'The target="_blank" attribute instructs the browser to open the linked document in a new tab or browsing context.', 2)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<a href="https://example.com" target="_blank">', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<a href="https://example.com" new-tab="true">', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<a href="https://example.com" window="new">', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<a href="https://example.com" target="_self">', 4)
      returning id into v_opt_id;
      
      -- Question 3
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'multiple_choice', 'Which of the following are valid ways to define the color red in HTML and CSS? (Select all that apply)', 'HTML Colors', null, 'Colors can be defined using pre-defined color names (''red''), 6-digit hex codes (''#ff0000''), or RGB notation (''rgb(255, 0, 0)'').', 3)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'rgb(255, 0, 0)', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '#ff0000', 2)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'red', 3)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'color(red, 100)', 4)
      returning id into v_opt_id;
      
      -- Question 4
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'true_false', 'True or False: An anchor link with href="#section2" will smoothly navigate to an element on the same page with id="section2".', 'HTML Bookmark Links', null, 'Bookmarking in HTML uses a hash symbol followed by the target element''s unique id attribute.', 4)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'True', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'False', 2)
      returning id into v_opt_id;
      
      -- Question 5
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Where should an external CSS stylesheet link <link rel="stylesheet" href="style.css"> typically be placed?', 'HTML & CSS Integration', null, 'The <link> tag for external stylesheets belongs inside the <head> section so styles load before page elements render.', 5)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Inside the <head> section of the HTML document', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'At the very bottom of the <body> element', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Inside a <footer> element', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Inside an <h1> heading tag', 4)
      returning id into v_opt_id;
      
    end if;
  end if;

  -- -----------------------------------------------------------------------
  -- html-fundamentals: Knowledge Check — Images, Tables & Lists
  -- -----------------------------------------------------------------------
  select id into v_course_id from public.courses where slug = 'html-fundamentals' limit 1;
  if v_course_id is not null then
    -- Find target module by position or slug
    select id into v_module_id from public.course_modules where course_id = v_course_id order by position offset 3 limit 1;
    if v_module_id is not null then
      -- Get next position in module
      select coalesce(max(position), 0) + 1 into v_max_pos from public.lessons where module_id = v_module_id and slug != 'html-images-tables-lists-knowledge-check';
      
      -- Insert or update lesson
      insert into public.lessons (
        module_id, slug, title, summary, lesson_type, key_takeaway, estimated_minutes, position, is_preview, is_bonus, is_published
      ) values (
        v_module_id, 'html-images-tables-lists-knowledge-check', 'Knowledge Check — Images, Tables & Lists', 'Test your understanding of embedding images with alt text, building table structures, and creating ordered and unordered lists.', 'knowledge_check', 'Structured data representations like tables and lists organize content clearly for both humans and search engines.', 5, v_max_pos, false, false, true
      )
      on conflict (slug) do update set
        title = excluded.title,
        summary = excluded.summary,
        lesson_type = excluded.lesson_type,
        key_takeaway = excluded.key_takeaway,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_lesson_id;
      
      -- Insert or update practice_quizzes
      insert into public.practice_quizzes (lesson_id, title, description, estimated_minutes, is_published)
      values (v_lesson_id, 'Images, Tables & Lists Check', 'Review embedding images, building tables, and creating lists in HTML.', 5, true)
      on conflict (lesson_id) do update set
        title = excluded.title,
        description = excluded.description,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_quiz_id;
      
      -- Rebuild questions for this quiz
      delete from public.practice_questions where quiz_id = v_quiz_id;
      
      -- Question 1
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Why is the alt attribute essential when adding images with the <img> tag?', 'HTML Images', null, 'The alt attribute provides alternative text for screen readers (accessibility) and displays fallback text if the image fails to load.', 1)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It provides alternative text for screen readers and when the image fails to load', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It specifies the compression quality of the image file', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It adds a decorative border shadow around the image container', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It configures the download speed of the image asset', 4)
      returning id into v_opt_id;
      
      -- Question 2
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Which HTML element defines a table header cell that displays bold, centered text by default?', 'HTML Tables', null, '<th> defines a table header cell, <td> defines standard data cells, and <tr> defines rows.', 2)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<th>', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<td>', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<tr>', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<header>', 4)
      returning id into v_opt_id;
      
      -- Question 3
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'multiple_choice', 'Which of the following statements about HTML lists are correct? (Select all that apply)', 'HTML Lists', null, '<ul> creates bulleted lists, <ol> creates numbered lists, and individual list items are always marked with <li>. Lists can be nested freely.', 3)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<ul> creates an unordered list rendered with bullet points', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<ol> creates an ordered list rendered with numbers or letters', 2)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Each individual list item inside <ul> or <ol> is enclosed in <li>', 3)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<ol> elements cannot be nested inside <ul> elements', 4)
      returning id into v_opt_id;
      
      -- Question 4
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'true_false', 'True or False: Specifying width and height attributes directly on an <img> tag helps prevent Cumulative Layout Shift (CLS) as the page loads.', 'HTML Images', null, 'Explicit width and height attributes allow the browser to calculate the aspect ratio and reserve layout space before the image file finishes downloading.', 4)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'True', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'False', 2)
      returning id into v_opt_id;
      
      -- Question 5
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Consider this table snippet:
<table>
  <tr><th>Course</th><th>Level</th></tr>
  <tr><td>HTML</td><td>Beginner</td></tr>
</table>
How many total data rows (excluding the header row) does this table contain?', 'HTML Tables', '<table>
  <tr><th>Course</th><th>Level</th></tr>
  <tr><td>HTML</td><td>Beginner</td></tr>
</table>', 'The table contains two <tr> elements: the first is the header row (containing <th> tags), and the second is the single data row (containing <td> tags).', 5)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '1 data row', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '2 data rows', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '4 data rows', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '0 data rows', 4)
      returning id into v_opt_id;
      
    end if;
  end if;

  -- -----------------------------------------------------------------------
  -- html-fundamentals: Knowledge Check — HTML Layout Concepts
  -- -----------------------------------------------------------------------
  select id into v_course_id from public.courses where slug = 'html-fundamentals' limit 1;
  if v_course_id is not null then
    -- Find target module by position or slug
    select id into v_module_id from public.course_modules where course_id = v_course_id order by position offset 4 limit 1;
    if v_module_id is not null then
      -- Get next position in module
      select coalesce(max(position), 0) + 1 into v_max_pos from public.lessons where module_id = v_module_id and slug != 'html-layout-concepts-knowledge-check';
      
      -- Insert or update lesson
      insert into public.lessons (
        module_id, slug, title, summary, lesson_type, key_takeaway, estimated_minutes, position, is_preview, is_bonus, is_published
      ) values (
        v_module_id, 'html-layout-concepts-knowledge-check', 'Knowledge Check — HTML Layout Concepts', 'Test your understanding of block vs inline elements, container elements, class vs id attributes, and semantic layout tags.', 'knowledge_check', 'Understanding block and inline display models and class/id attributes is the gateway to CSS layout design.', 5, v_max_pos, false, false, true
      )
      on conflict (slug) do update set
        title = excluded.title,
        summary = excluded.summary,
        lesson_type = excluded.lesson_type,
        key_takeaway = excluded.key_takeaway,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_lesson_id;
      
      -- Insert or update practice_quizzes
      insert into public.practice_quizzes (lesson_id, title, description, estimated_minutes, is_published)
      values (v_lesson_id, 'HTML Layout Concepts Check', 'Review block/inline elements, class and id attributes, and containers.', 5, true)
      on conflict (lesson_id) do update set
        title = excluded.title,
        description = excluded.description,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_quiz_id;
      
      -- Rebuild questions for this quiz
      delete from public.practice_questions where quiz_id = v_quiz_id;
      
      -- Question 1
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'What is the primary difference between a block-level element and an inline element in HTML?', 'Block vs Inline', null, 'Block-level elements (like <div> and <p>) always start on a new line and take up the full available width, whereas inline elements (like <span> and <a>) only occupy as much width as necessary.', 1)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Block elements start on a new line and span full width; inline elements only take up necessary width', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Inline elements cannot contain text characters', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Block elements cannot have CSS background colors applied', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Inline elements are deprecated in modern HTML standards', 4)
      returning id into v_opt_id;
      
      -- Question 2
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Which generic HTML element is a block-level container commonly used for grouping and layout styling?', 'HTML Containers', null, '<div> is the standard generic block-level container in HTML; <span> is the generic inline container.', 2)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<div>', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<span>', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<b>', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<i>', 4)
      returning id into v_opt_id;
      
      -- Question 3
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'multiple_choice', 'Which statements about HTML class and id attributes are correct? (Select all that apply)', 'Class vs Id Attributes', null, 'Classes can be shared by multiple elements and an element can have multiple classes. An id must be unique to a single element per page.', 3)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Multiple elements on the same page can share the same class name', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'An id attribute should be unique to a single element on a web page', 2)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'An HTML element can specify multiple class names separated by spaces', 3)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'A single HTML element can have multiple id attributes', 4)
      returning id into v_opt_id;
      
      -- Question 4
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'true_false', 'True or False: In semantic HTML, the <main> element should contain content that is unique to the document and exclude headers, navbars, and sidebars shared across pages.', 'Semantic HTML', null, 'The <main> tag represents the central, unique content of the page, excluding recurring components like headers, navigation bars, and footers.', 4)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'True', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'False', 2)
      returning id into v_opt_id;
      
      -- Question 5
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Which CSS selector targets an element with class="btn primary"?', 'CSS Class Selectors', null, 'Classes in CSS are selected using a dot (.). Chaining classes like .btn.primary targets elements that have both classes.', 5)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '.btn.primary', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '#btn #primary', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'btn.primary', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '@btn-primary', 4)
      returning id into v_opt_id;
      
    end if;
  end if;

  -- -----------------------------------------------------------------------
  -- html-fundamentals: Knowledge Check — Embedding & Scripting
  -- -----------------------------------------------------------------------
  select id into v_course_id from public.courses where slug = 'html-fundamentals' limit 1;
  if v_course_id is not null then
    -- Find target module by position or slug
    select id into v_module_id from public.course_modules where course_id = v_course_id order by position offset 5 limit 1;
    if v_module_id is not null then
      -- Get next position in module
      select coalesce(max(position), 0) + 1 into v_max_pos from public.lessons where module_id = v_module_id and slug != 'html-embedding-scripting-knowledge-check';
      
      -- Insert or update lesson
      insert into public.lessons (
        module_id, slug, title, summary, lesson_type, key_takeaway, estimated_minutes, position, is_preview, is_bonus, is_published
      ) values (
        v_module_id, 'html-embedding-scripting-knowledge-check', 'Knowledge Check — Embedding & Scripting', 'Test your understanding of embedding external content with iframes and integrating JavaScript scripts into HTML.', 'knowledge_check', 'iframes and script tags allow web pages to embed third-party media and add rich client-side interactivity.', 5, v_max_pos, false, false, true
      )
      on conflict (slug) do update set
        title = excluded.title,
        summary = excluded.summary,
        lesson_type = excluded.lesson_type,
        key_takeaway = excluded.key_takeaway,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_lesson_id;
      
      -- Insert or update practice_quizzes
      insert into public.practice_quizzes (lesson_id, title, description, estimated_minutes, is_published)
      values (v_lesson_id, 'Embedding & Scripting Check', 'Review iframes and JavaScript integration in HTML.', 5, true)
      on conflict (lesson_id) do update set
        title = excluded.title,
        description = excluded.description,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_quiz_id;
      
      -- Rebuild questions for this quiz
      delete from public.practice_questions where quiz_id = v_quiz_id;
      
      -- Question 1
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'What is the primary function of the <iframe> element in HTML?', 'HTML Iframes', null, 'An <iframe> (Inline Frame) is used to embed another independent HTML document, map, or video player inside the current web page.', 1)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'To embed another independent HTML page or media player inside the current document', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'To compile TypeScript code directly in the browser', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'To define responsive layout grid breakpoints', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'To create scalable vector SVG icon animations', 4)
      returning id into v_opt_id;
      
      -- Question 2
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Which attribute on an <iframe> applies security restrictions on embedded content (such as restricting scripts, forms, and popups)?', 'Iframe Security', null, 'The sandbox attribute enables an extra set of restrictions for the content in the iframe.', 2)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'sandbox', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'secure', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'restrict', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'guard', 4)
      returning id into v_opt_id;
      
      -- Question 3
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'multiple_choice', 'Which of the following are valid ways to include JavaScript in an HTML document? (Select all that apply)', 'HTML & JavaScript', null, 'JavaScript can be included via external script files (<script src="..."></script>), inline <script> tags, or inline event attributes.', 3)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Linking an external script file using <script src="app.js"></script>', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Writing inline JavaScript code between <script> and </script> tags', 2)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Adding inline event attributes like onclick="..." to elements', 3)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Using <javascript href="app.js">', 4)
      returning id into v_opt_id;
      
      -- Question 4
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'true_false', 'True or False: Adding the defer attribute to an external <script src="..."> tag allows HTML parsing to continue while the script downloads, executing it once HTML parsing is complete.', 'Script Loading', null, 'The defer attribute tells the browser not to wait for the script; it continues building the HTML DOM and runs the script in order when ready.', 4)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'True', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'False', 2)
      returning id into v_opt_id;
      
      -- Question 5
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Where does client-side JavaScript code embedded in an HTML document execute by default?', 'JavaScript Runtime', null, 'Client-side JavaScript runs directly inside the end-user''s web browser JavaScript engine.', 5)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Inside the client web browser''s JavaScript engine', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'On the remote DNS server', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Inside the database query planner', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Inside the router firmware', 4)
      returning id into v_opt_id;
      
    end if;
  end if;

  -- -----------------------------------------------------------------------
  -- html-fundamentals: Knowledge Check — Head Metadata & Forms
  -- -----------------------------------------------------------------------
  select id into v_course_id from public.courses where slug = 'html-fundamentals' limit 1;
  if v_course_id is not null then
    -- Find target module by position or slug
    select id into v_module_id from public.course_modules where course_id = v_course_id order by position offset 6 limit 1;
    if v_module_id is not null then
      -- Get next position in module
      select coalesce(max(position), 0) + 1 into v_max_pos from public.lessons where module_id = v_module_id and slug != 'html-head-forms-knowledge-check';
      
      -- Insert or update lesson
      insert into public.lessons (
        module_id, slug, title, summary, lesson_type, key_takeaway, estimated_minutes, position, is_preview, is_bonus, is_published
      ) values (
        v_module_id, 'html-head-forms-knowledge-check', 'Knowledge Check — Head Metadata & Forms', 'Test your understanding of <head> metadata, <title>, character encoding, and building accessible interactive HTML forms.', 'knowledge_check', 'Head metadata configures SEO and character encodings, while forms collect and submit user inputs.', 5, v_max_pos, false, false, true
      )
      on conflict (slug) do update set
        title = excluded.title,
        summary = excluded.summary,
        lesson_type = excluded.lesson_type,
        key_takeaway = excluded.key_takeaway,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_lesson_id;
      
      -- Insert or update practice_quizzes
      insert into public.practice_quizzes (lesson_id, title, description, estimated_minutes, is_published)
      values (v_lesson_id, 'Head Metadata & Forms Check', 'Review head metadata, SEO elements, and interactive HTML forms.', 5, true)
      on conflict (lesson_id) do update set
        title = excluded.title,
        description = excluded.description,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_quiz_id;
      
      -- Rebuild questions for this quiz
      delete from public.practice_questions where quiz_id = v_quiz_id;
      
      -- Question 1
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'What is the primary role of the <head> element in an HTML document?', 'HTML Head Element', null, 'The <head> section contains document metadata, page title, character set definitions, and linked resources not directly visible in the page body.', 1)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It contains metadata, document title, character set definitions, and linked resources', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It renders the top visual header banner of the web page', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It creates a sticky navigation bar across the viewport', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It displays the primary <h1> heading on the page', 4)
      returning id into v_opt_id;
      
      -- Question 2
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Which <input> attribute defines the type of control to display (such as text, password, checkbox, or radio)?', 'HTML Forms', null, 'The type attribute defines the specific user input control behavior (e.g. type="text", type="password", type="email").', 2)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'type', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'name', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'value', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'placeholder', 4)
      returning id into v_opt_id;
      
      -- Question 3
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'multiple_choice', 'Which attributes on an HTML <form> element define where and how form data is sent upon submission? (Select all that apply)', 'HTML Forms', null, 'action defines the destination URL, method specifies the HTTP verb (GET or POST), and target controls where the response displays.', 3)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'action (the URL endpoint that processes the form submission)', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'method (the HTTP method used, such as GET or POST)', 2)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'target (where to display the response after submission)', 3)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'compression (the archive format of the payload)', 4)
      returning id into v_opt_id;
      
      -- Question 4
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'true_false', 'True or False: Linking a <label for="userEmail"> to an <input id="userEmail"> improves accessibility and allows clicking the label to focus the input field.', 'Form Accessibility', null, 'Connecting a label''s for attribute to an input''s id creates an accessible association for screen readers and increases the clickable touch target.', 4)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'True', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'False', 2)
      returning id into v_opt_id;
      
      -- Question 5
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Which <meta> tag is universally recommended to ensure proper international character encoding in HTML5?', 'HTML Metadata', null, '<meta charset="UTF-8"> specifies the standard UTF-8 character encoding covering almost all written human languages.', 5)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<meta charset="UTF-8">', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<meta encoding="HTML5">', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<meta language="en-US">', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<meta format="unicode">', 4)
      returning id into v_opt_id;
      
    end if;
  end if;

  -- -----------------------------------------------------------------------
  -- css-fundamentals: Knowledge Check — CSS Introduction & Selectors
  -- -----------------------------------------------------------------------
  select id into v_course_id from public.courses where slug = 'css-fundamentals' limit 1;
  if v_course_id is not null then
    -- Find target module by position or slug
    select id into v_module_id from public.course_modules where course_id = v_course_id order by position offset 0 limit 1;
    if v_module_id is not null then
      -- Get next position in module
      select coalesce(max(position), 0) + 1 into v_max_pos from public.lessons where module_id = v_module_id and slug != 'css-introduction-knowledge-check';
      
      -- Insert or update lesson
      insert into public.lessons (
        module_id, slug, title, summary, lesson_type, key_takeaway, estimated_minutes, position, is_preview, is_bonus, is_published
      ) values (
        v_module_id, 'css-introduction-knowledge-check', 'Knowledge Check — CSS Introduction & Selectors', 'Test your understanding of CSS syntax, rule declarations, selectors, stylesheet inclusion, and CSS comments.', 'knowledge_check', 'CSS controls the visual layout, typography, and styling of HTML elements using selective rule declarations.', 5, v_max_pos, false, false, true
      )
      on conflict (slug) do update set
        title = excluded.title,
        summary = excluded.summary,
        lesson_type = excluded.lesson_type,
        key_takeaway = excluded.key_takeaway,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_lesson_id;
      
      -- Insert or update practice_quizzes
      insert into public.practice_quizzes (lesson_id, title, description, estimated_minutes, is_published)
      values (v_lesson_id, 'CSS Introduction & Selectors Check', 'Review CSS rule syntax, selectors, comments, and stylesheet inclusion.', 5, true)
      on conflict (lesson_id) do update set
        title = excluded.title,
        description = excluded.description,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_quiz_id;
      
      -- Rebuild questions for this quiz
      delete from public.practice_questions where quiz_id = v_quiz_id;
      
      -- Question 1
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'What is the primary role of CSS (Cascading Style Sheets) in web development?', 'CSS Introduction', null, 'CSS is used to format, layout, and style the visual presentation of HTML elements across screen sizes.', 1)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Controlling the visual presentation, layout, colors, and typography of HTML elements', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Defining the semantic document hierarchy and raw database tables', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Executing asynchronous server-side database migrations', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Compiling client-side web assembly binary instructions', 4)
      returning id into v_opt_id;
      
      -- Question 2
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'In the CSS declaration block { color: blue; font-size: 16px; }, what is ''color'' called?', 'CSS Syntax', null, 'In CSS syntax, ''color'' is the property name being styled, and ''blue'' is the value assigned to that property.', 2)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'A CSS Property', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'A CSS Selector', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'A CSS Declaration Block', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'A CSS Value', 4)
      returning id into v_opt_id;
      
      -- Question 3
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'multiple_choice', 'Which of the following are valid ways to apply CSS styles to an HTML document? (Select all that apply)', 'How to Add CSS', null, 'CSS can be linked externally using <link rel="stylesheet">, written internally inside <style> tags in <head>, or written inline via style="...".', 3)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'External CSS via <link rel="stylesheet" href="styles.css">', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Internal CSS within a <style> block in the <head> section', 2)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Inline CSS using the style="..." attribute directly on an element', 3)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Importing CSS files through <script src="styles.css">', 4)
      returning id into v_opt_id;
      
      -- Question 4
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'true_false', 'True or False: In CSS selectors, class names are prefixed with a dot (.card) while ID selectors are prefixed with a hash symbol (#header).', 'CSS Selectors', null, 'In CSS selector syntax, .classname targets classes and #idname targets unique IDs.', 4)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'True', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'False', 2)
      returning id into v_opt_id;
      
      -- Question 5
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'How are comments written in CSS stylesheets?', 'CSS Comments', null, 'CSS comments begin with /* and end with */, and can span single or multiple lines.', 5)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '/* This is a comment */', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '<!-- This is a comment -->', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '// This is a comment', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '## This is a comment', 4)
      returning id into v_opt_id;
      
    end if;
  end if;

  -- -----------------------------------------------------------------------
  -- css-fundamentals: Knowledge Check — CSS Colors & Formats
  -- -----------------------------------------------------------------------
  select id into v_course_id from public.courses where slug = 'css-fundamentals' limit 1;
  if v_course_id is not null then
    -- Find target module by position or slug
    select id into v_module_id from public.course_modules where course_id = v_course_id order by position offset 1 limit 1;
    if v_module_id is not null then
      -- Get next position in module
      select coalesce(max(position), 0) + 1 into v_max_pos from public.lessons where module_id = v_module_id and slug != 'css-colors-knowledge-check';
      
      -- Insert or update lesson
      insert into public.lessons (
        module_id, slug, title, summary, lesson_type, key_takeaway, estimated_minutes, position, is_preview, is_bonus, is_published
      ) values (
        v_module_id, 'css-colors-knowledge-check', 'Knowledge Check — CSS Colors & Formats', 'Test your understanding of CSS color properties, RGB, RGBA alpha transparency, HEX codes, and HSL/HSLA values.', 'knowledge_check', 'Mastering RGB, HEX, and HSL color notations gives you complete control over brand palettes and opacity.', 5, v_max_pos, false, false, true
      )
      on conflict (slug) do update set
        title = excluded.title,
        summary = excluded.summary,
        lesson_type = excluded.lesson_type,
        key_takeaway = excluded.key_takeaway,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_lesson_id;
      
      -- Insert or update practice_quizzes
      insert into public.practice_quizzes (lesson_id, title, description, estimated_minutes, is_published)
      values (v_lesson_id, 'CSS Colors & Formats Check', 'Review text colors, background colors, HEX, RGB, and HSL values.', 5, true)
      on conflict (lesson_id) do update set
        title = excluded.title,
        description = excluded.description,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_quiz_id;
      
      -- Rebuild questions for this quiz
      delete from public.practice_questions where quiz_id = v_quiz_id;
      
      -- Question 1
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'What does the ''color'' CSS property style on an element?', 'CSS Color Property', null, 'The ''color'' property sets the foreground text and icon color; ''background-color'' sets the background fill color.', 1)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The foreground text color of the element', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The background fill color of the container', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The outer border stroke color', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The drop shadow color around the box', 4)
      returning id into v_opt_id;
      
      -- Question 2
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'What does the 4th parameter ''a'' (alpha) represent in the color rgba(255, 0, 0, 0.5)?', 'RGBA Alpha Channel', null, 'The alpha channel specifies opacity from 0.0 (completely transparent) to 1.0 (completely opaque). 0.5 is 50% opacity.', 2)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The opacity/transparency level ranging from 0.0 (transparent) to 1.0 (opaque)', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The hue angle in degrees around the color wheel', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The brightness level from 0% to 100%', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The anti-aliasing blur radius', 4)
      returning id into v_opt_id;
      
      -- Question 3
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'multiple_choice', 'Which of the following are valid CSS color representations? (Select all that apply)', 'CSS Color Formats', null, 'CSS supports HEX codes (#3b82f6), HSL/HSLA notation (hsl(217, 91%, 60%)), RGB/RGBA (rgb(59, 130, 246)), and named colors.', 3)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '#3b82f6 (6-digit HEX)', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'hsl(217, 91%, 60%) (HSL)', 2)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'rgb(59, 130, 246) (RGB)', 3)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'cmyk(10, 20, 30, 0) (CMYK)', 4)
      returning id into v_opt_id;
      
      -- Question 4
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'true_false', 'True or False: In HSL color notation hsl(hue, saturation, lightness), hue is specified as an angle from 0 to 360 degrees on the color circle.', 'HSL Color Model', null, 'Hue represents the color wheel angle: 0° is red, 120° is green, and 240° is blue.', 4)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'True', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'False', 2)
      returning id into v_opt_id;
      
      -- Question 5
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'What color does the 6-digit hex code #ffffff represent in CSS?', 'HEX Color Codes', null, '#ffffff sets maximum red (ff), green (ff), and blue (ff) channels, producing pure white.', 5)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Pure White', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Pure Black', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Bright Red', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Transparent', 4)
      returning id into v_opt_id;
      
    end if;
  end if;

  -- -----------------------------------------------------------------------
  -- css-fundamentals: Knowledge Check — CSS Backgrounds
  -- -----------------------------------------------------------------------
  select id into v_course_id from public.courses where slug = 'css-fundamentals' limit 1;
  if v_course_id is not null then
    -- Find target module by position or slug
    select id into v_module_id from public.course_modules where course_id = v_course_id order by position offset 2 limit 1;
    if v_module_id is not null then
      -- Get next position in module
      select coalesce(max(position), 0) + 1 into v_max_pos from public.lessons where module_id = v_module_id and slug != 'css-backgrounds-knowledge-check';
      
      -- Insert or update lesson
      insert into public.lessons (
        module_id, slug, title, summary, lesson_type, key_takeaway, estimated_minutes, position, is_preview, is_bonus, is_published
      ) values (
        v_module_id, 'css-backgrounds-knowledge-check', 'Knowledge Check — CSS Backgrounds', 'Test your understanding of background colors, images, repeat patterns, position, attachment, and shorthand syntax.', 'knowledge_check', 'CSS background properties let you style containers with solid fills, gradient accents, or fixed hero images.', 5, v_max_pos, false, false, true
      )
      on conflict (slug) do update set
        title = excluded.title,
        summary = excluded.summary,
        lesson_type = excluded.lesson_type,
        key_takeaway = excluded.key_takeaway,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_lesson_id;
      
      -- Insert or update practice_quizzes
      insert into public.practice_quizzes (lesson_id, title, description, estimated_minutes, is_published)
      values (v_lesson_id, 'CSS Backgrounds Check', 'Review background images, repeats, positioning, attachment, and shorthand.', 5, true)
      on conflict (lesson_id) do update set
        title = excluded.title,
        description = excluded.description,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_quiz_id;
      
      -- Rebuild questions for this quiz
      delete from public.practice_questions where quiz_id = v_quiz_id;
      
      -- Question 1
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Which CSS property is used to specify an image file as the background of an element?', 'CSS Background Images', null, 'background-image takes a url(...) value pointing to the background asset path or URL.', 1)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'background-image: url(''hero.jpg'');', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'image-source: ''hero.jpg'';', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'background: file(''hero.jpg'');', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'src: url(''hero.jpg'');', 4)
      returning id into v_opt_id;
      
      -- Question 2
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'What does setting background-repeat: no-repeat; accomplish on an element?', 'Background Repeat', null, 'By default, background images tile horizontally and vertically; no-repeat ensures the image renders only once.', 2)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It prevents the background image from tiling horizontally or vertically', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It removes the background color when the web page is printed', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It disables all background transitions and animations', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'It forces the image to stretch into a square aspect ratio', 4)
      returning id into v_opt_id;
      
      -- Question 3
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'multiple_choice', 'Which values are valid for the background-position property? (Select all that apply)', 'Background Position', null, 'background-position accepts keywords (top, center, bottom, left, right), percentages (50% 50%), and length units (10px 20px).', 3)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'center center', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'top right', 2)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '50% 50%', 3)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '10px 20px', 4)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      
      -- Question 4
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'true_false', 'True or False: Setting background-attachment: fixed; locks the background image relative to the viewport so it stays in place while page content scrolls.', 'Background Attachment', null, 'background-attachment: fixed keeps the background anchored to the viewport window, creating a fixed parallax effect.', 4)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'True', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'False', 2)
      returning id into v_opt_id;
      
      -- Question 5
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Look at this shorthand background rule:
body { background: #0f172a url(''stars.png'') no-repeat fixed center; }
Which individual properties does this declaration configure?', 'Background Shorthand', 'body {
  background: #0f172a url(''stars.png'') no-repeat fixed center;
}', 'The background shorthand property allows setting color, image, repeat, attachment, and position simultaneously.', 5)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'background-color, background-image, background-repeat, background-attachment, and background-position', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Only background-color and background-image', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'background-filter and background-clip exclusively', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'background-size and background-origin exclusively', 4)
      returning id into v_opt_id;
      
    end if;
  end if;

  -- -----------------------------------------------------------------------
  -- css-fundamentals: Knowledge Check — Applied CSS Styling
  -- -----------------------------------------------------------------------
  select id into v_course_id from public.courses where slug = 'css-fundamentals' limit 1;
  if v_course_id is not null then
    -- Find target module by position or slug
    select id into v_module_id from public.course_modules where course_id = v_course_id order by position offset 3 limit 1;
    if v_module_id is not null then
      -- Get next position in module
      select coalesce(max(position), 0) + 1 into v_max_pos from public.lessons where module_id = v_module_id and slug != 'css-applied-styling-knowledge-check';
      
      -- Insert or update lesson
      insert into public.lessons (
        module_id, slug, title, summary, lesson_type, key_takeaway, estimated_minutes, position, is_preview, is_bonus, is_published
      ) values (
        v_module_id, 'css-applied-styling-knowledge-check', 'Knowledge Check — Applied CSS Styling', 'Test your understanding of the CSS Box Model, the cascade, font stacks, and practical page styling.', 'knowledge_check', 'Combining box model spacing, typography, and clean selector architecture enables polished website layouts.', 5, v_max_pos, false, false, true
      )
      on conflict (slug) do update set
        title = excluded.title,
        summary = excluded.summary,
        lesson_type = excluded.lesson_type,
        key_takeaway = excluded.key_takeaway,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_lesson_id;
      
      -- Insert or update practice_quizzes
      insert into public.practice_quizzes (lesson_id, title, description, estimated_minutes, is_published)
      values (v_lesson_id, 'Applied CSS Styling Check', 'Review box model layers, cascade rules, typography, and practical layout styling.', 5, true)
      on conflict (lesson_id) do update set
        title = excluded.title,
        description = excluded.description,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_quiz_id;
      
      -- Rebuild questions for this quiz
      delete from public.practice_questions where quiz_id = v_quiz_id;
      
      -- Question 1
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'In the CSS Box Model, which layer represents the transparent space inside the border around an element''s content?', 'CSS Box Model', null, 'Padding creates space inside the border around the content; margin creates space outside the border.', 1)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Padding', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Margin', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Outline', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Baseline', 4)
      returning id into v_opt_id;
      
      -- Question 2
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'When two conflicting CSS rules target the same element with identical specificity, which rule is applied by the browser?', 'CSS Cascade', null, 'According to the cascade principle, when specificity is identical, the rule declared later (lower down in the stylesheet) takes precedence.', 2)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The rule defined later (lower down) in the stylesheet', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The rule defined earlier in the stylesheet', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The rule with the shorter selector string', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'The browser chooses randomly between the rules', 4)
      returning id into v_opt_id;
      
      -- Question 3
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'multiple_choice', 'Which of the following techniques are recommended when building and debugging CSS layouts? (Select all that apply)', 'CSS Best Practices', null, 'Using browser DevTools, semantic reusable classes, and responsive testing across viewport sizes are standard CSS practices.', 3)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Inspecting elements using browser Developer Tools to inspect computed styles and box model dimensions', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Using meaningful semantic class names for reusable components', 2)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Testing layouts across multiple viewport widths for responsive design', 3)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Editing browser engine binary source files directly', 4)
      returning id into v_opt_id;
      
      -- Question 4
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'true_false', 'True or False: The CSS property font-family accepts a comma-separated list of fallback fonts so the browser can choose secondary fonts if the primary font is missing.', 'CSS Typography', null, 'A font stack like font-family: ''Inter'', system-ui, sans-serif; provides prioritized fallbacks for cross-platform consistency.', 4)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'True', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'False', 2)
      returning id into v_opt_id;
      
      -- Question 5
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'What is the total rendered width of an element with:
box-sizing: content-box;
width: 200px;
padding: 20px;
border: 5px solid black;
?', 'Box Model Calculation', 'div {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}', 'Under default content-box: Total width = width (200px) + left/right padding (20px * 2 = 40px) + left/right border (5px * 2 = 10px) = 250px.', 5)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '250px (200px + 40px padding + 10px border)', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '200px', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '220px', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, '240px', 4)
      returning id into v_opt_id;
      
    end if;
  end if;

  -- -----------------------------------------------------------------------
  -- javascript-fundamentals: Knowledge Check — Applied JavaScript Concepts
  -- -----------------------------------------------------------------------
  select id into v_course_id from public.courses where slug = 'javascript-fundamentals' limit 1;
  if v_course_id is not null then
    -- Find target module by position or slug
    select id into v_module_id from public.course_modules where course_id = v_course_id order by position offset 3 limit 1;
    if v_module_id is not null then
      -- Get next position in module
      select coalesce(max(position), 0) + 1 into v_max_pos from public.lessons where module_id = v_module_id and slug != 'quiz-javascript-applied-project';
      
      -- Insert or update lesson
      insert into public.lessons (
        module_id, slug, title, summary, lesson_type, key_takeaway, estimated_minutes, position, is_preview, is_bonus, is_published
      ) values (
        v_module_id, 'quiz-javascript-applied-project', 'Knowledge Check — Applied JavaScript Concepts', 'Test your understanding of DOM selection, event listeners, updating elements, and organizing modular JavaScript code for interactive projects.', 'knowledge_check', 'Connecting JavaScript event listeners and DOM manipulation transforms static HTML/CSS pages into dynamic applications.', 5, v_max_pos, false, false, true
      )
      on conflict (slug) do update set
        title = excluded.title,
        summary = excluded.summary,
        lesson_type = excluded.lesson_type,
        key_takeaway = excluded.key_takeaway,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_lesson_id;
      
      -- Insert or update practice_quizzes
      insert into public.practice_quizzes (lesson_id, title, description, estimated_minutes, is_published)
      values (v_lesson_id, 'Applied JavaScript Concepts Check', 'Review DOM selection, event handling, dynamic content updates, and project debugging.', 5, true)
      on conflict (lesson_id) do update set
        title = excluded.title,
        description = excluded.description,
        estimated_minutes = excluded.estimated_minutes,
        is_published = true
      returning id into v_quiz_id;
      
      -- Rebuild questions for this quiz
      delete from public.practice_questions where quiz_id = v_quiz_id;
      
      -- Question 1
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'Which DOM method is standard in modern JavaScript to select an element by its CSS selector (such as ''#submit-btn'')?', 'DOM Selection', null, 'document.querySelector(selector) returns the first matching element in the DOM tree that matches the CSS selector string.', 1)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'document.querySelector(''#submit-btn'')', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'document.findElement(''submit-btn'')', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'window.selectElement(''#submit-btn'')', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'document.locateNode(''submit-btn'')', 4)
      returning id into v_opt_id;
      
      -- Question 2
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'How do you register a click event handler function on a button element stored in variable ''btn''?', 'DOM Event Listeners', null, 'addEventListener(''click'', handlerFunction) is the standard web API method for attaching event listeners to DOM elements.', 2)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'btn.addEventListener(''click'', handleClick);', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'btn.attachEvent(''click'', handleClick);', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'btn.listenFor(''click'', handleClick);', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'btn.on(''click'', handleClick);', 4)
      returning id into v_opt_id;
      
      -- Question 3
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'multiple_choice', 'Which properties and methods can be used to update the text or CSS classes of an HTML element in JavaScript? (Select all that apply)', 'DOM Manipulation', null, 'textContent safely updates element text, while classList.add() and classList.toggle() modify CSS class lists.', 3)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'element.textContent = "New Message";', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'element.classList.add("active");', 2)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'element.classList.toggle("hidden");', 3)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'element.setDOMProperties({ text: "New" });', 4)
      returning id into v_opt_id;
      
      -- Question 4
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'true_false', 'True or False: In interactive JavaScript projects, using console.log() to inspect variable values and event triggers is an effective method for debugging runtime behavior.', 'JavaScript Debugging', null, 'console.log() outputs data directly to the browser Developer Tools console, allowing developers to inspect variable states and execution order.', 4)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'True', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'False', 2)
      returning id into v_opt_id;
      
      -- Question 5
      insert into public.practice_questions (quiz_id, question_type, question_text, topic, code_content, explanation, position)
      values (v_quiz_id, 'single_choice', 'What is the primary benefit of organizing project code into small, focused functions instead of a single global script block?', 'Code Architecture', null, 'Functions provide encapsulation, improve readability, allow code reuse across events, and make testing and maintenance significantly simpler.', 5)
      returning id into v_q_id;
      
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Functions improve code readability, reusability, testability, and separation of concerns', 1)
      returning id into v_opt_id;
      insert into public.practice_question_correct_options (question_id, option_id)
      values (v_q_id, v_opt_id) on conflict do nothing;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Functions automatically double the execution speed of the JavaScript engine', 2)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Functions eliminate the need for HTML markup', 3)
      returning id into v_opt_id;
      insert into public.practice_question_options (question_id, option_text, position)
      values (v_q_id, 'Functions prevent any syntax errors from ever occurring', 4)
      returning id into v_opt_id;
      
    end if;
  end if;

end $$;

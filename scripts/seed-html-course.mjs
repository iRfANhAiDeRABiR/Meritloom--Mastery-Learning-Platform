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
  console.log("🚀 Starting W3Schools HTML Fundamentals Course Seed (23 Videos)...");

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
    console.warn("Category notice (RLS or existing):", catErr.message);
  }

  const categoryId = category?.id;

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
          "HTML is the foundation of every website. In this beginner-friendly course powered by the official W3Schools HTML video series, learners will understand how web pages are structured using HTML and gradually build confidence with the most important HTML elements. The course covers HTML basics, text styling, colors, CSS integration, links, images, tables, lists, layout concepts, iframes, scripting, head metadata, and interactive forms. Lessons use real W3Schools video tutorials alongside original Meritloom summaries, takeaways, and learning objectives.",
        category_id: categoryId,
        difficulty: "beginner",
        language: "English",
        estimated_minutes: 110,
        is_free: true,
        is_published: true,
        published_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    )
    .select("id")
    .single();

  if (courseErr) {
    console.warn("Course notice (RLS or existing):", courseErr.message);
  }

  const courseId = course?.id;

  // 3. Modules & Lessons dataset
  const PLAYLIST_ID = "PLP9IO4UYNF0VdAajP_5pYG-jG2JRrG72s";
  const SOURCE_CHANNEL = "W3Schools.com";

  const modulesData = [
    {
      slug: "html-basics",
      title: "HTML Basics",
      description: "Understand what HTML is, configure text editors, and learn the anatomy of HTML elements and attributes.",
      position: 1,
      estimated_minutes: 18,
      lessons: [
        {
          position: 1,
          title: "HTML - Introduction",
          slug: "html-introduction",
          youtubeVideoId: "it1rTvBcfRg",
          estimated_minutes: 5,
          is_preview: true,
          is_bonus: false,
          summary: "Learn what HTML is, how HTML tags describe page structure, and how browsers interpret HTML documents.",
          key_takeaway: "HTML (HyperText Markup Language) is the standard markup language used to create and structure web pages.",
          objectives: [
            "Understand what HTML is and how browsers interpret web markup",
            "Learn how tags describe page headings, paragraphs, and links",
            "Identify the basic building blocks of an HTML document",
          ],
        },
        {
          position: 2,
          title: "HTML - Editors",
          slug: "html-editors",
          youtubeVideoId: "bBP0ckEln4Y",
          estimated_minutes: 4,
          is_preview: false,
          is_bonus: false,
          summary: "Learn how to create, save, and open your first HTML document using code editors like VS Code, Notepad, or TextEdit.",
          key_takeaway: "You can write HTML in any plain text editor and view the result by opening the .html file in any web browser.",
          objectives: [
            "Set up a text editor for writing HTML code",
            "Save files properly with the .html extension and UTF-8 encoding",
            "View and test HTML files locally in a web browser",
          ],
        },
        {
          position: 3,
          title: "HTML - Elements",
          slug: "html-elements",
          youtubeVideoId: "vIoO52MdZFE",
          estimated_minutes: 4,
          is_preview: false,
          is_bonus: false,
          summary: "Understand HTML elements, opening and closing tags, nested element hierarchies, and empty self-closing elements.",
          key_takeaway: "An HTML element is defined by a start tag, content, and an end tag. Elements can be nested inside one another.",
          objectives: [
            "Understand the anatomy of an HTML element (start tag, content, end tag)",
            "Learn the rules for correctly nesting elements",
            "Identify empty elements like <br> that do not have a closing tag",
          ],
        },
        {
          position: 4,
          title: "HTML - Attributes",
          slug: "html-attributes",
          youtubeVideoId: "yMX901oVtn8",
          estimated_minutes: 5,
          is_preview: false,
          is_bonus: false,
          summary: "Learn how attributes add additional information, links, dimensions, and styling to HTML elements.",
          key_takeaway: "HTML attributes always appear in the opening tag as name=\"value\" pairs, providing extra details or behavior.",
          objectives: [
            "Understand how attributes modify HTML elements",
            "Learn common attributes like href, src, alt, width, and style",
            "Follow best practices by using lowercase attribute names and quotes",
          ],
        },
      ],
    },
    {
      slug: "text-basic-styling",
      title: "Text & Basic Styling",
      description: "Master headings, paragraphs, inline styles, text formatting tags, and developer comments.",
      position: 2,
      estimated_minutes: 21,
      lessons: [
        {
          position: 1,
          title: "HTML - Headings",
          slug: "html-headings",
          youtubeVideoId: "9gHPpwq6IaY",
          estimated_minutes: 4,
          is_preview: false,
          is_bonus: false,
          summary: "Master heading levels from <h1> to <h6> to establish clear hierarchical structure and improve accessibility and SEO.",
          key_takeaway: "Use headings to show document hierarchy (h1 through h6), not merely to make text bigger or bolder.",
          objectives: [
            "Use heading tags from <h1> to <h6>",
            "Understand why heading structure is critical for SEO and accessibility",
            "Maintain a single main <h1> per page",
          ],
        },
        {
          position: 2,
          title: "HTML - Paragraphs",
          slug: "html-paragraphs",
          youtubeVideoId: "qis4kAOThLw",
          estimated_minutes: 4,
          is_preview: false,
          is_bonus: false,
          summary: "Learn how to structure body text using paragraph tags (<p>), line breaks (<br>), and thematic dividers (<hr>).",
          key_takeaway: "Browsers automatically add margin around <p> elements and collapse multiple spaces into a single space.",
          objectives: [
            "Define paragraphs using the <p> tag",
            "Insert line breaks with <br> and horizontal rules with <hr>",
            "Understand browser whitespace collapse",
          ],
        },
        {
          position: 3,
          title: "HTML - Styles",
          slug: "html-styles",
          youtubeVideoId: "twdNPJfbj_8",
          estimated_minutes: 5,
          is_preview: false,
          is_bonus: false,
          summary: "Explore the HTML style attribute to apply inline CSS properties including color, background-color, font-family, and text-align.",
          key_takeaway: "The style attribute allows adding CSS rules directly inside an element tag using property:value syntax.",
          objectives: [
            "Use the style attribute to customize element presentation",
            "Set text colors, background colors, and font sizes",
            "Apply text alignment with text-align: center",
          ],
        },
        {
          position: 4,
          title: "HTML - Formatting",
          slug: "html-formatting",
          youtubeVideoId: "7FqQLqNIEY8",
          estimated_minutes: 5,
          is_preview: false,
          is_bonus: false,
          summary: "Learn semantic and visual text formatting tags like <strong>, <em>, <mark>, <small>, <del>, <ins>, <sub>, and <sup>.",
          key_takeaway: "Use <strong> for strong importance and <em> for stress emphasis rather than purely visual <b> or <i> tags.",
          objectives: [
            "Format important text with <strong> and <em>",
            "Highlight keywords with <mark> and represent edits with <del> and <ins>",
            "Format formulas with <sub> and <sup>",
          ],
        },
        {
          position: 5,
          title: "HTML - Comments",
          slug: "html-comments",
          youtubeVideoId: "229HYq40vaA",
          estimated_minutes: 3,
          is_preview: false,
          is_bonus: false,
          summary: "Learn how to write single-line and multi-line comments in HTML to document your code and troubleshoot layouts.",
          key_takeaway: "HTML comments (<!-- comment -->) are ignored by the browser renderer but remain visible in the page source.",
          objectives: [
            "Write comments using <!-- and --> syntax",
            "Use comments to organize sections and document markup",
            "Temporarily comment out code blocks during debugging",
          ],
        },
      ],
    },
    {
      slug: "colors-css-links",
      title: "Colors, CSS & Links",
      description: "Learn color representation formats, linking CSS stylesheets, and creating hyperlinks and bookmark anchors.",
      position: 3,
      estimated_minutes: 17,
      lessons: [
        {
          position: 1,
          title: "HTML - Colors",
          slug: "html-colors",
          youtubeVideoId: "zCrolmdqmF8",
          estimated_minutes: 5,
          is_preview: false,
          is_bonus: false,
          summary: "Understand how colors are defined in HTML using color names, RGB, HEX, HSL, RGBA, and HSLA values.",
          key_takeaway: "Colors can be specified by predefined names or precise values like HEX (#ff0000) and RGB/RGBA for transparency.",
          objectives: [
            "Specify colors using standard color names",
            "Understand RGB and HEX color formats",
            "Control opacity and transparency using RGBA and HSLA values",
          ],
        },
        {
          position: 2,
          title: "HTML - CSS",
          slug: "html-css",
          youtubeVideoId: "cZHp-Oozg6I",
          estimated_minutes: 6,
          is_preview: false,
          is_bonus: false,
          summary: "Learn the three ways to add CSS styling to HTML: inline styles, internal <style> blocks, and external stylesheets with <link>.",
          key_takeaway: "External stylesheets linked in the <head> element are the standard best practice for styling multi-page websites.",
          objectives: [
            "Compare inline, internal, and external CSS approaches",
            "Link an external stylesheet using <link rel=\"stylesheet\">",
            "Understand CSS selectors, properties, and values",
          ],
        },
        {
          position: 3,
          title: "HTML - Links",
          slug: "html-links",
          youtubeVideoId: "HA6bByKdAQM",
          estimated_minutes: 6,
          is_preview: false,
          is_bonus: false,
          summary: "Master hyperlinks using the <a> tag, the href attribute, link targets, bookmark jump links, and mailto links.",
          key_takeaway: "The <a> tag creates hyperlinks to external sites, other pages on your site, or specific sections on the same page.",
          objectives: [
            "Create clickable links with <a href=\"...\">",
            "Open links in new tabs with target=\"_blank\"",
            "Create in-page jump bookmarks with #id anchors",
          ],
        },
      ],
    },
    {
      slug: "images-data-structure",
      title: "Images & Data Structure",
      description: "Embed images with accessible alt text, present tabular data with tables, and organize items into ordered and unordered lists.",
      position: 4,
      estimated_minutes: 18,
      lessons: [
        {
          position: 1,
          title: "HTML - Images",
          slug: "html-images",
          youtubeVideoId: "FmoYRiepmOE",
          estimated_minutes: 6,
          is_preview: false,
          is_bonus: false,
          summary: "Learn how to embed graphics and photos with the <img> tag, write accessible alt text, and set responsive dimensions.",
          key_takeaway: "The <img> element requires src and alt attributes; alt text is essential for screen readers and SEO.",
          objectives: [
            "Embed images using <img src=\"...\" alt=\"...\">",
            "Write descriptive alternative text",
            "Specify width and height to prevent layout shifts",
          ],
        },
        {
          position: 2,
          title: "HTML - Tables",
          slug: "html-tables",
          youtubeVideoId: "e62D-aayveY",
          estimated_minutes: 7,
          is_preview: false,
          is_bonus: false,
          summary: "Learn how to present structured tabular data using <table>, <tr>, <th>, and <td> elements, along with colspan and rowspan.",
          key_takeaway: "Tables are strictly for tabular data; use <th> for table headers and merge cells with colspan and rowspan.",
          objectives: [
            "Build accessible tables with <table>, <tr>, <th>, and <td>",
            "Structure header rows and data cells cleanly",
            "Span multiple columns or rows using colspan and rowspan",
          ],
        },
        {
          position: 3,
          title: "HTML - Lists",
          slug: "html-lists",
          youtubeVideoId: "-QuK8taGLCs",
          estimated_minutes: 5,
          is_preview: false,
          is_bonus: false,
          summary: "Organize related items into unordered bulleted lists (<ul>), numbered ordered lists (<ol>), and description lists (<dl>).",
          key_takeaway: "Use <ol> for sequential items, <ul> for non-sequential items, and <dl> for key-value terms and definitions.",
          objectives: [
            "Create bulleted lists with <ul> and numbered lists with <ol>",
            "Nest lists inside list items to create sub-menus",
            "Create description lists with <dl>, <dt>, and <dd>",
          ],
        },
      ],
    },
    {
      slug: "html-layout-concepts",
      title: "HTML Layout Concepts",
      description: "Understand block vs inline element behavior and use class and id attributes for styling and targeting.",
      position: 5,
      estimated_minutes: 14,
      lessons: [
        {
          position: 1,
          title: "HTML - Block and Inline",
          slug: "html-block-inline",
          youtubeVideoId: "M4n-WSkehmI",
          estimated_minutes: 5,
          is_preview: false,
          is_bonus: false,
          summary: "Understand the fundamental difference between block-level elements (<div>, <p>, <h1>) and inline elements (<span>, <a>, <strong>).",
          key_takeaway: "Block elements start on a new line and take up full width; inline elements only take up as much width as necessary.",
          objectives: [
            "Distinguish between block-level and inline HTML elements",
            "Use <div> as a block-level container and <span> as an inline container",
            "Understand display behavior impact on page flow",
          ],
        },
        {
          position: 2,
          title: "HTML - Classes",
          slug: "html-classes",
          youtubeVideoId: "tWIkDOJo0Ts",
          estimated_minutes: 5,
          is_preview: false,
          is_bonus: false,
          summary: "Learn how the class attribute assigns reusable style and script identifiers to multiple HTML elements.",
          key_takeaway: "The class attribute can be shared across multiple elements to apply consistent styling or targeting.",
          objectives: [
            "Assign class names using class=\"className\"",
            "Apply multiple space-separated classes to a single element",
            "Target class names in CSS with .className syntax",
          ],
        },
        {
          position: 3,
          title: "HTML - Id",
          slug: "html-id",
          youtubeVideoId: "rZ0k516qZmc",
          estimated_minutes: 4,
          is_preview: false,
          is_bonus: false,
          summary: "Learn how the id attribute assigns a unique identifier to a single HTML element on the page for styling, scripting, and bookmarks.",
          key_takeaway: "An id must be unique within an HTML document; use id for unique element targeting and in-page navigation anchors.",
          objectives: [
            "Assign unique IDs to elements with id=\"uniqueId\"",
            "Target IDs in CSS with #uniqueId syntax",
            "Understand the difference between reusable classes and unique IDs",
          ],
        },
      ],
    },
    {
      slug: "embedding-scripting",
      title: "Embedding & Scripting",
      description: "Embed external pages with iframes and connect client-side JavaScript for dynamic behavior.",
      position: 6,
      estimated_minutes: 10,
      lessons: [
        {
          position: 1,
          title: "HTML - Iframes",
          slug: "html-iframes",
          youtubeVideoId: "qP23O70ve7k",
          estimated_minutes: 5,
          is_preview: false,
          is_bonus: false,
          summary: "Learn how the <iframe> element embeds external web pages, video players, maps, and interactive widgets inside your HTML.",
          key_takeaway: "An iframe displays a nested browsing context; always provide a descriptive title attribute for accessibility.",
          objectives: [
            "Embed external pages and media using <iframe src=\"...\">",
            "Set iframe dimensions and borders with CSS",
            "Use the title attribute for screen reader accessibility",
          ],
        },
        {
          position: 2,
          title: "HTML - JavaScript",
          slug: "html-javascript",
          youtubeVideoId: "uSgcWDkwc3U",
          estimated_minutes: 5,
          is_preview: false,
          is_bonus: false,
          summary: "Discover how HTML and JavaScript interact using the <script> tag to manipulate the DOM, handle events, and create interactivity.",
          key_takeaway: "The <script> tag is used to embed or link client-side JavaScript to make web pages dynamic and interactive.",
          objectives: [
            "Insert client-side scripts using <script> tags",
            "Link external JavaScript files with <script src=\"app.js\">",
            "Provide fallback content for disabled scripts using <noscript>",
          ],
        },
      ],
    },
    {
      slug: "page-metadata-forms",
      title: "Page Metadata & Forms",
      description: "Configure <head> document metadata and build accessible user input forms with common controls.",
      position: 7,
      estimated_minutes: 12,
      lessons: [
        {
          position: 1,
          title: "HTML - Head",
          slug: "html-head",
          youtubeVideoId: "WeuVX5x2MJE",
          estimated_minutes: 5,
          is_preview: false,
          is_bonus: false,
          summary: "Explore the <head> element and its essential tags: <title>, <meta>, <link>, <style>, and <base>.",
          key_takeaway: "The <head> container holds machine-readable metadata about the page that is not directly rendered in the main viewport.",
          objectives: [
            "Set page titles and favicons in the <head> section",
            "Configure UTF-8 charset and responsive viewport meta tags",
            "Link external stylesheets and resources",
          ],
        },
        {
          position: 2,
          title: "HTML - Forms",
          slug: "html-forms",
          youtubeVideoId: "VLeERv_dR6Q",
          estimated_minutes: 7,
          is_preview: false,
          is_bonus: false,
          summary: "Learn how to build user input forms using <form>, <input>, <label>, <select>, <textarea>, and <button> elements.",
          key_takeaway: "Forms collect user input for server processing; always pair input elements with explicit <label> tags for accessibility.",
          objectives: [
            "Explain the purpose and structure of HTML forms",
            "Add common form controls (text, password, submit, checkboxes, radio buttons)",
            "Associate <label> elements with <input> fields using for and id",
          ],
        },
      ],
    },
    {
      slug: "bonus",
      title: "Bonus",
      description: "Optional behind-the-scenes bloopers from the W3Schools HTML tutorial recording.",
      position: 8,
      estimated_minutes: 3,
      lessons: [
        {
          position: 1,
          title: "HTML - Bloopers",
          slug: "html-bloopers",
          youtubeVideoId: "HHxPoYUrSQ0",
          estimated_minutes: 3,
          is_preview: false,
          is_bonus: true,
          summary: "A fun bonus from the W3Schools HTML tutorial recording.",
          key_takeaway: "Learning to code takes practice, patience, and having fun along the way!",
          objectives: [
            "Enjoy behind-the-scenes moments from the W3Schools HTML tutorial recording",
          ],
        },
      ],
    },
  ];

  if (courseId) {
    for (const m of modulesData) {
      console.log(`📂 Seeding Module ${m.position}: ${m.title}...`);
      const { data: mod } = await supabase
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

      const moduleId = mod?.id;
      if (!moduleId) continue;

      for (const l of m.lessons) {
        console.log(`   🎬 Lesson: ${l.title} (${l.youtubeVideoId})`);
        const videoUrl = `https://www.youtube.com/watch?v=${l.youtubeVideoId}`;
        const { data: lessonRow } = await supabase
          .from("lessons")
          .upsert(
            {
              module_id: moduleId,
              slug: l.slug,
              title: l.title,
              summary: l.summary,
              lesson_type: "video",
              video_url: videoUrl,
              video_provider: "youtube",
              youtube_video_id: l.youtubeVideoId,
              source_channel: SOURCE_CHANNEL,
              source_url: videoUrl,
              playlist_id: PLAYLIST_ID,
              is_bonus: l.is_bonus,
              key_takeaway: l.key_takeaway,
              estimated_minutes: l.estimated_minutes,
              position: l.position,
              is_preview: l.is_preview,
              is_published: true,
            },
            { onConflict: "slug" },
          )
          .select("id")
          .single();

        if (lessonRow?.id && l.objectives) {
          await supabase.from("lesson_objectives").delete().eq("lesson_id", lessonRow.id);
          const objRows = l.objectives.map((objective, idx) => ({
            lesson_id: lessonRow.id,
            objective,
            position: idx + 1,
          }));
          await supabase.from("lesson_objectives").insert(objRows);
        }
      }
    }
  }

  console.log("🎉 W3Schools HTML Fundamentals (23 Videos) Dataset Prepared!");
}

seedHtmlCourse().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});

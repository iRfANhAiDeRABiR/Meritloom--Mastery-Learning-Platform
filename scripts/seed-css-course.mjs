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

async function seedCssCourse() {
  console.log("🚀 Starting W3Schools CSS Fundamentals Course Seed (14 Videos + 4 Practices)...");

  // 1. Ensure Category
  console.log("1. Upserting Category: Web Development...");
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
    console.warn("Category warning:", catErr.message);
  }

  let categoryId = category?.id;
  if (!categoryId) {
    const { data: existingCat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "web-development")
      .maybeSingle();
    categoryId = existingCat?.id;
  }

  // 2. Course
  console.log("2. Upserting Course: CSS Fundamentals...");
  const { data: course, error: courseErr } = await supabase
    .from("courses")
    .upsert(
      {
        slug: "css-fundamentals",
        title: "CSS Fundamentals",
        summary:
          "Learn how to style modern web pages with CSS, from selectors, colors and the box model to layout, Flexbox, responsive design and practical styling.",
        description:
          "CSS controls how web pages look and feel. In this beginner-friendly course, you'll learn how to transform plain HTML into attractive, organized and responsive web pages. Starting with CSS syntax and selectors, the course gradually introduces colors, backgrounds, borders, spacing, typography, layout and modern CSS techniques. The video lessons come from the W3Schools CSS tutorial series and are organized inside Meritloom with structured modules, lesson summaries, practice activities and progress tracking. A basic understanding of HTML is recommended before starting this course.",
        category_id: categoryId,
        difficulty: "beginner",
        language: "English",
        estimated_minutes: 65,
        is_free: true,
        is_published: true,
        published_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    )
    .select("id")
    .single();

  if (courseErr) {
    console.warn("Course notice:", courseErr.message);
  }

  let courseId = course?.id;
  if (!courseId) {
    const { data: existingCourse } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", "css-fundamentals")
      .maybeSingle();
    courseId = existingCourse?.id;
  }

  if (!courseId) {
    throw new Error("Failed to find or create CSS Fundamentals course in database.");
  }

  console.log(`Course CSS Fundamentals ID: ${courseId}`);

  // 3. Learning Outcomes
  console.log("3. Seeding Learning Outcomes...");
  const outcomes = [
    "Explain how CSS styles HTML documents and separates structure from presentation",
    "Write valid CSS rules using selectors, properties, and values",
    "Apply external, internal, and inline CSS to HTML pages",
    "Use element, class, ID, and universal selectors effectively",
    "Work with color names, RGB, RGBA, HEX, and HSL color formats",
    "Style background colors, images, position, repeat, and attachment",
    "Write clean background shorthand declarations to streamline stylesheets",
    "Combine HTML and CSS into a complete, attractively styled personal website",
  ];

  for (let i = 0; i < outcomes.length; i++) {
    await supabase.from("course_learning_outcomes").upsert(
      {
        course_id: courseId,
        outcome: outcomes[i],
        position: i + 1,
      },
      { onConflict: "course_id,position" },
    );
  }

  // 4. Prerequisites
  console.log("4. Seeding Prerequisites...");
  const prerequisites = [
    "Recommended before starting: HTML Fundamentals (/courses/html-fundamentals)",
    "A modern web browser (Chrome, Firefox, Safari, or Edge)",
    "A text editor such as VS Code, Notepad, or TextEdit",
  ];

  for (let i = 0; i < prerequisites.length; i++) {
    await supabase.from("course_prerequisites").upsert(
      {
        course_id: courseId,
        prerequisite: prerequisites[i],
        position: i + 1,
      },
      { onConflict: "course_id,position" },
    );
  }

  // 5. Skills
  console.log("5. Seeding Skills...");
  const skillNames = [
    { name: "CSS", slug: "css" },
    { name: "CSS Selectors", slug: "css-selectors" },
    { name: "CSS Colors", slug: "css-colors" },
    { name: "CSS Backgrounds", slug: "css-backgrounds" },
    { name: "Web Styling", slug: "web-styling" },
    { name: "Web Development", slug: "web-development-skill" },
  ];

  for (const sk of skillNames) {
    const { data: skillRow } = await supabase
      .from("skills")
      .upsert(
        {
          name: sk.name,
          slug: sk.slug,
          category: "Technical",
        },
        { onConflict: "slug" },
      )
      .select("id")
      .maybeSingle();

    if (skillRow?.id) {
      await supabase.from("course_skills").upsert(
        {
          course_id: courseId,
          skill_id: skillRow.id,
        },
        { onConflict: "course_id,skill_id" },
      );
    }
  }

  // 6. Modules & Lessons Dataset (All 14 W3Schools Videos + 4 Meritloom Practices)
  const PLAYLIST_ID = "PLP9IO4UYNF0UCaUSF3XNZ1U9f01E5h5PM";
  const SOURCE_CHANNEL = "W3Schools.com";

  const modulesData = [
    {
      slug: "getting-started-css",
      title: "Getting Started with CSS",
      description:
        "Understand what CSS is, learn the syntax of rules and declaration blocks, explore simple selectors, and discover the three ways to add CSS to HTML.",
      position: 1,
      estimated_minutes: 19,
      lessons: [
        {
          position: 1,
          slug: "css-introduction",
          title: "Introduction to CSS",
          sourceTitle: "CSS - Introduction - W3Schools.com",
          youtubeVideoId: "AGDDdsiZ0Ko",
          estimatedMinutes: 2,
          lessonType: "video",
          isBonus: false,
          summary:
            "Learn what CSS is, how it works with HTML, and why separating structure from presentation makes web pages easier to style and maintain.",
          keyTakeaway:
            "CSS (Cascading Style Sheets) describes how HTML elements are to be displayed on screen, paper, or in other media.",
          objectives: [
            "Understand what CSS stands for and its core role in web development",
            "Learn why CSS saves massive work by controlling layout across multiple pages",
            "Identify the relationship between HTML structure and CSS presentation",
          ],
        },
        {
          position: 2,
          slug: "css-syntax",
          title: "CSS Syntax & Declarations",
          sourceTitle: "CSS - Syntax - W3Schools.com",
          youtubeVideoId: "G8r00ZNopTE",
          estimatedMinutes: 2,
          lessonType: "video",
          isBonus: false,
          summary:
            "Understand selectors, properties, values, and declaration blocks—the core building blocks of every CSS rule.",
          keyTakeaway:
            "A CSS rule consists of a selector and a declaration block containing property-value pairs separated by semicolons.",
          objectives: [
            "Identify CSS selectors and declaration blocks",
            "Write clean property-value pairs with colons and semicolons",
            "Format CSS rules with curly braces for readability",
          ],
        },
        {
          position: 3,
          slug: "css-selectors",
          title: "CSS Simple Selectors",
          sourceTitle: "CSS - Simple Selectors - W3Schools.com",
          youtubeVideoId: "ZNskBxLVOfs",
          estimatedMinutes: 3,
          lessonType: "video",
          isBonus: false,
          summary:
            "Master targeting HTML elements using element type selectors, class selectors (.class), ID selectors (#id), and the universal selector (*).",
          keyTakeaway:
            "CSS simple selectors find elements by name, id, or class to apply targeted styles.",
          objectives: [
            "Target elements by HTML tag name (e.g. p, h1)",
            "Use class selectors (.classname) to style multiple elements",
            "Use ID selectors (#idname) to target a specific unique element",
            "Group multiple selectors using commas to share styles",
          ],
        },
        {
          position: 4,
          slug: "css-how-to",
          title: "How to Add CSS to HTML",
          sourceTitle: "CSS - How to add CSS to HTML - W3Schools.com",
          youtubeVideoId: "VSwaoQ3TFkQ",
          estimatedMinutes: 3,
          lessonType: "video",
          isBonus: false,
          summary:
            "Explore the three ways to insert CSS into web pages: External CSS files (<link>), Internal style blocks (<style>), and Inline style attributes.",
          keyTakeaway:
            "External stylesheets are the industry standard for production websites because they allow one file to style an entire site.",
          objectives: [
            "Link an external .css stylesheet inside the HTML <head>",
            "Write internal CSS within a <style> tag",
            "Apply inline CSS using the HTML style attribute",
            "Understand cascading priority when multiple styles apply",
          ],
        },
        {
          position: 5,
          slug: "css-comments",
          title: "CSS Comments",
          sourceTitle: "CSS - Comments - W3Schools.com",
          youtubeVideoId: "uVtEJD3vBEs",
          estimatedMinutes: 2,
          lessonType: "video",
          isBonus: false,
          summary:
            "Learn how CSS comments (/* ... */) help document stylesheets, organize sections, and temporarily disable rules during debugging.",
          keyTakeaway:
            "CSS comments begin with /* and end with */, and are completely ignored by browsers.",
          objectives: [
            "Write single-line and multi-line comments in CSS",
            "Use comments to section and organize large stylesheets",
            "Temporarily disable CSS declarations while troubleshooting",
          ],
        },
        {
          position: 6,
          slug: "practice-first-stylesheet",
          title: "Practice — Connect & Write Your First CSS",
          sourceTitle: null,
          youtubeVideoId: null,
          estimatedMinutes: 8,
          lessonType: "practice",
          isBonus: false,
          summary:
            "Create an external stylesheet, link it to an HTML document, and apply element, class, and ID rules.",
          keyTakeaway:
            "Structuring CSS into an external file and using descriptive class names creates clean, maintainable code.",
          objectives: [
            "Create a styles.css file and link it using <link rel='stylesheet'>",
            "Apply background and text styles across multiple tags",
            "Use class and ID selectors to create distinct card layouts",
          ],
        },
      ],
    },
    {
      slug: "css-colors",
      title: "Colors & Color Formats",
      description:
        "Master the web color system: named colors, RGB, RGBA with opacity, Hexadecimal color codes, and intuitive HSL / HSLA coordinates.",
      position: 2,
      estimated_minutes: 20,
      lessons: [
        {
          position: 7,
          slug: "css-colors-intro",
          title: "Introduction to CSS Colors",
          sourceTitle: "CSS - Colors Introduction - W3Schools.com",
          youtubeVideoId: "q0uWmobMf6I",
          estimatedMinutes: 4,
          lessonType: "video",
          isBonus: false,
          summary:
            "Discover standard predefined color names, foreground text colors with the color property, background colors, and border colors.",
          keyTakeaway:
            "Colors in CSS can be set using standard color names or specific numerical color formats.",
          objectives: [
            "Set text color using the color property",
            "Apply background colors to containers and headings",
            "Style border colors on elements",
          ],
        },
        {
          position: 8,
          slug: "css-colors-rgb",
          title: "RGB & RGBA Color Values",
          sourceTitle: "CSS - Colors RGB & RGBA - W3Schools.com",
          youtubeVideoId: "6tbUo6PXc88",
          estimatedMinutes: 2,
          lessonType: "video",
          isBonus: false,
          summary:
            "Specify precise colors using Red, Green, and Blue channels from 0 to 255, and add transparency with alpha channels in RGBA.",
          keyTakeaway:
            "An RGB color value represents RED, GREEN, and BLUE light sources; RGBA adds an Alpha channel (0.0 to 1.0) for opacity.",
          objectives: [
            "Define colors with rgb(red, green, blue) syntax",
            "Control opacity and background transparency with rgba(r, g, b, a)",
            "Understand how color channels combine to create millions of colors",
          ],
        },
        {
          position: 9,
          slug: "css-colors-hex",
          title: "HEX Color Codes",
          sourceTitle: "CSS - Colors Hex - W3Schools.com",
          youtubeVideoId: "LLmCr_201GU",
          estimatedMinutes: 3,
          lessonType: "video",
          isBonus: false,
          summary:
            "Master hexadecimal color codes (#RRGGBB) used by designers and developers worldwide for web color definitions.",
          keyTakeaway:
            "A hexadecimal color is specified with: #RRGGBB, where the RR (red), GG (green) and BB (blue) are hex values between 00 and FF.",
          objectives: [
            "Read and write 6-digit hex color codes",
            "Use 3-digit shorthand hex codes (e.g. #fff, #f00)",
            "Pick and integrate design palette hex codes into stylesheets",
          ],
        },
        {
          position: 10,
          slug: "css-colors-hsl",
          title: "HSL & HSLA Color Values",
          sourceTitle: "CSS - Colors HSL - W3Schools.com",
          youtubeVideoId: "Vilk0BFQZ4Y",
          estimatedMinutes: 3,
          lessonType: "video",
          isBonus: false,
          summary:
            "Understand Hue, Saturation, and Lightness (HSL)—an intuitive way to create tints, shades, and complementary color palettes.",
          keyTakeaway:
            "HSL stands for Hue (0-360 degree color wheel), Saturation (0-100% grayness), and Lightness (0-100% brightness).",
          objectives: [
            "Navigate the 360-degree color wheel using Hue",
            "Adjust Saturation and Lightness to create lighter/darker color variations",
            "Use HSLA to add transparency to HSL colors",
          ],
        },
        {
          position: 11,
          slug: "practice-color-palette",
          title: "Practice — Build a Brand Color Palette",
          sourceTitle: null,
          youtubeVideoId: null,
          estimatedMinutes: 8,
          lessonType: "practice",
          isBonus: false,
          summary:
            "Build a cohesive color palette for a web project using HEX, RGBA for translucent overlays, and HSL for hover states.",
          keyTakeaway:
            "Using consistent color formats and verifying contrast ratios ensures an accessible, attractive visual hierarchy.",
          objectives: [
            "Define primary, secondary, and neutral colors with HEX",
            "Create frosted translucent card backgrounds with RGBA",
            "Create lighter and darker button hover states using HSL Lightness",
          ],
        },
      ],
    },
    {
      slug: "css-backgrounds",
      title: "CSS Backgrounds",
      description:
        "Learn all aspects of CSS backgrounds: background colors, background images, repeat modes, positioning, attachment scrolling, and shorthand notation.",
      position: 3,
      estimated_minutes: 19,
      lessons: [
        {
          position: 12,
          slug: "css-background-colors",
          title: "CSS Background Colors",
          sourceTitle: "CSS - Background Colors - W3Schools.com",
          youtubeVideoId: "-itttmX6HX0",
          estimatedMinutes: 3,
          lessonType: "video",
          isBonus: false,
          summary:
            "Apply background colors to full page bodies, hero sections, cards, and buttons with good contrast for text readability.",
          keyTakeaway:
            "The background-color property specifies the background color of an element.",
          objectives: [
            "Set page-wide background colors on <body>",
            "Apply distinct backgrounds to cards and navigation bars",
            "Ensure accessible contrast between background-color and text color",
          ],
        },
        {
          position: 13,
          slug: "css-background-images",
          title: "CSS Background Images",
          sourceTitle: "CSS - Background Images - W3Schools.com",
          youtubeVideoId: "FMyU_h8m-0c",
          estimatedMinutes: 2,
          lessonType: "video",
          isBonus: false,
          summary:
            "Embed background images using url() and understand how browsers tile images horizontally and vertically by default.",
          keyTakeaway:
            "The background-image property sets an image as the background of an element.",
          objectives: [
            "Specify background image URLs with url('image.jpg')",
            "Understand default repeating behavior of background images",
            "Choose appropriate imagery for hero banners and cards",
          ],
        },
        {
          position: 14,
          slug: "css-background-repeat-position",
          title: "Background Repeat & Position",
          sourceTitle: "CSS - Background Repeat and Position - W3Schools.com",
          youtubeVideoId: "k9dNFtC2F8A",
          estimatedMinutes: 2,
          lessonType: "video",
          isBonus: false,
          summary:
            "Control whether images tile with background-repeat (no-repeat, repeat-x, repeat-y) and align backgrounds with background-position.",
          keyTakeaway:
            "Combine no-repeat with background-position (center, top right, etc.) to place hero graphics and background accents accurately.",
          objectives: [
            "Prevent image tiling using background-repeat: no-repeat",
            "Repeat images along a single axis (repeat-x or repeat-y)",
            "Position background graphics using keywords and pixel/percentage offsets",
          ],
        },
        {
          position: 15,
          slug: "css-background-attachment",
          title: "Background Attachment & Scrolling",
          sourceTitle: "CSS - Background Attachment - W3Schools.com",
          youtubeVideoId: "lXs8BRnrW_M",
          estimatedMinutes: 2,
          lessonType: "video",
          isBonus: false,
          summary:
            "Learn how background-attachment controls whether a background scrolls with the rest of the page or remains fixed in place.",
          keyTakeaway:
            "background-attachment: fixed keeps the background in place while page content scrolls over it, creating a parallax effect.",
          objectives: [
            "Use background-attachment: scroll (default behavior)",
            "Apply background-attachment: fixed for stationary backgrounds",
            "Understand visual impact and mobile considerations",
          ],
        },
        {
          position: 16,
          slug: "css-background-shorthand",
          title: "CSS Background Shorthand",
          sourceTitle: "CSS - Background Shorthand - W3Schools.com",
          youtubeVideoId: "rSEKmi5tR9E",
          estimatedMinutes: 2,
          lessonType: "video",
          isBonus: false,
          summary:
            "Condense multiple background properties (color, image, repeat, attachment, position) into a single concise background declaration.",
          keyTakeaway:
            "The background shorthand property lets you specify all background properties in one line.",
          objectives: [
            "Write valid background shorthand rules",
            "Memorize the standard property order for shorthand syntax",
            "Refactor verbose background declarations into clean shorthand",
          ],
        },
        {
          position: 17,
          slug: "practice-hero-banner",
          title: "Practice — Style a Hero Banner with Backgrounds",
          sourceTitle: null,
          youtubeVideoId: null,
          estimatedMinutes: 8,
          lessonType: "practice",
          isBonus: false,
          summary:
            "Design a full-width hero header with a centered background image, translucent overlay, and crisp typography.",
          keyTakeaway:
            "Combining background-image, background-position, and background-repeat shorthand produces polished, responsive banners.",
          objectives: [
            "Set a background image centered with no-repeat",
            "Apply background shorthand for clean stylesheet rules",
            "Add high-contrast typography over background visuals",
          ],
        },
      ],
    },
    {
      slug: "applied-styling-project",
      title: "Applied Styling & Projects",
      description:
        "Synthesize all CSS fundamentals into a complete, beautifully styled multi-section personal website.",
      position: 4,
      estimated_minutes: 15,
      lessons: [
        {
          position: 18,
          slug: "project-style-personal-site",
          title: "Final Project — Style Your Personal Website",
          sourceTitle: null,
          youtubeVideoId: null,
          estimatedMinutes: 15,
          lessonType: "practice",
          isBonus: false,
          summary:
            "Transform your HTML website from Course 1 into a modern styled portfolio with external CSS, custom typography, brand colors, and layered backgrounds.",
          keyTakeaway:
            "Clean CSS organization and consistent design tokens turn plain HTML markup into professional web experiences.",
          objectives: [
            "Structure an external CSS stylesheet linked to your HTML portfolio",
            "Apply an accessible color system using HEX, RGB, and HSL",
            "Style headers, navigation bars, cards, and footer sections with backgrounds",
            "Prepare your styled layout for interactive JavaScript in the upcoming course",
          ],
        },
      ],
    },
  ];

  console.log("6. Seeding Modules and Lessons...");
  let totalSeededLessons = 0;
  let totalSeededVideos = 0;

  for (const m of modulesData) {
    const { data: moduleRow, error: modErr } = await supabase
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
        { onConflict: "course_id,slug" },
      )
      .select("id")
      .single();

    if (modErr) {
      console.warn(`Module error on ${m.slug}:`, modErr.message);
    }

    let moduleId = moduleRow?.id;
    if (!moduleId) {
      const { data: existingMod } = await supabase
        .from("course_modules")
        .select("id")
        .eq("course_id", courseId)
        .eq("slug", m.slug)
        .maybeSingle();
      moduleId = existingMod?.id;
    }

    if (!moduleId) {
      console.error(`Failed to get module id for ${m.slug}`);
      continue;
    }

    for (let lIdx = 0; lIdx < m.lessons.length; lIdx++) {
      const les = m.lessons[lIdx];
      const videoUrl = les.youtubeVideoId
        ? `https://www.youtube.com/watch?v=${les.youtubeVideoId}`
        : null;

      const { data: lessonRow, error: lesErr } = await supabase
        .from("lessons")
        .upsert(
          {
            module_id: moduleId,
            slug: les.slug,
            title: les.title,
            summary: les.summary,
            key_takeaway: les.keyTakeaway,
            lesson_type: les.lessonType,
            video_provider: les.youtubeVideoId ? "youtube" : null,
            video_url: videoUrl,
            youtube_video_id: les.youtubeVideoId,
            source_channel: les.youtubeVideoId ? SOURCE_CHANNEL : null,
            source_title: les.sourceTitle,
            source_url: videoUrl,
            playlist_id: les.youtubeVideoId ? PLAYLIST_ID : null,
            position: lIdx + 1,
            estimated_minutes: les.estimatedMinutes,
            is_preview: les.position === 1,
            is_published: true,
            is_bonus: les.isBonus,
          },
          { onConflict: "module_id,slug" },
        )
        .select("id")
        .single();

      if (lesErr) {
        console.warn(`Lesson error on ${les.slug}:`, lesErr.message);
      }

      let lessonId = lessonRow?.id;
      if (!lessonId) {
        const { data: existingLes } = await supabase
          .from("lessons")
          .select("id")
          .eq("module_id", moduleId)
          .eq("slug", les.slug)
          .maybeSingle();
        lessonId = existingLes?.id;
      }

      if (lessonId) {
        totalSeededLessons++;
        if (les.youtubeVideoId) totalSeededVideos++;

        // Upsert lesson objectives
        if (les.objectives && les.objectives.length > 0) {
          for (let oIdx = 0; oIdx < les.objectives.length; oIdx++) {
            await supabase.from("lesson_objectives").upsert(
              {
                lesson_id: lessonId,
                objective: les.objectives[oIdx],
                position: oIdx + 1,
              },
              { onConflict: "lesson_id,position" },
            );
          }
        }
      }
    }
  }

  console.log(`✅ CSS Fundamentals Seed Completed!`);
  console.log(`- Course ID: ${courseId}`);
  console.log(`- Modules: ${modulesData.length}`);
  console.log(`- Total Lessons: ${totalSeededLessons}`);
  console.log(`- YouTube Video Lessons: ${totalSeededVideos}`);
}

seedCssCourse().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});


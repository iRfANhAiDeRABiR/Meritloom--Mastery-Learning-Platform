import type { PracticeConfig } from "./types";

/**
 * Returns default starter configurations for practice lessons when no custom
 * database config is attached.
 */
export function getPracticeConfigForLesson(
  courseSlug: string,
  lessonSlug: string,
  lessonTitle: string,
  customContentJson?: string | null,
): PracticeConfig {
  if (customContentJson) {
    try {
      const parsed = JSON.parse(customContentJson);
      if (parsed.practiceType === "code" && Array.isArray(parsed.languages)) {
        return parsed as PracticeConfig;
      }
    } catch {
      // Ignore parse error and fallback to standard templates
    }
  }

  // 1. HTML Practice Presets
  if (courseSlug.includes("html") || lessonSlug.includes("html")) {
    return {
      practiceType: "code",
      languages: ["html"],
      instructions: "Create a simple personal profile card using semantic HTML elements. Add a main heading for your name, a short paragraph describing yourself, an image avatar, and a link to your portfolio or website.",
      requirements: [
        {
          id: "has-h1",
          label: "Add a main <h1> heading",
          checkType: "element_exists",
          selector: "h1",
        },
        {
          id: "has-p",
          label: "Add a paragraph <p> with descriptive text",
          checkType: "element_exists",
          selector: "p",
        },
        {
          id: "has-img",
          label: "Add an <img> tag with an 'alt' attribute",
          checkType: "attribute_exists",
          selector: "img",
          attribute: "alt",
        },
        {
          id: "has-a",
          label: "Add a link <a> with an 'href' attribute",
          checkType: "attribute_exists",
          selector: "a",
          attribute: "href",
        },
      ],
      starterCode: {
        html: `<div class="profile-card">
  <!-- 1. Add an <h1> heading for your name -->
  
  <!-- 2. Add an <img> with alt text -->
  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Avatar">

  <!-- 3. Add a paragraph about yourself -->
  
  <!-- 4. Add a link to your projects -->
  
</div>`,
        css: `/* Optional CSS styling */
.profile-card {
  max-width: 320px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  text-align: center;
}
.profile-card img {
  border-radius: 50%;
  width: 96px;
  height: 96px;
  object-fit: cover;
  margin-bottom: 12px;
}`,
        javascript: "",
      },
      hints: [
        "Headings in HTML are defined with the <h1> to <h6> tags. Use <h1> for your main title.",
        "Images require the src attribute for the image file URL and an alt attribute describing the image for screen readers.",
        "Links are created using the <a> tag: <a href='https://example.com'>View Portfolio</a>",
      ],
      expectedPreviewDescription: "A profile card showing an avatar image, a name heading, a biography paragraph, and a clickable link.",
      estimatedMinutes: 10,
    };
  }

    // 1.5. Brand Color Palette Preset
  if (lessonSlug.includes("color") || lessonTitle.toLowerCase().includes("color palette")) {
    return {
      practiceType: "code",
      languages: ["html", "css"],
      instructions: "Create a cohesive color system for a technology startup landing page. Define HEX colors for brand primary, a translucent frosted card background with RGBA, and interactive hover states using HSL.",
      requirements: [
        {
          id: "css-primary",
          label: "Use brand primary HEX color (#4338ca)",
          checkType: "css_property_exists",
          property: "background",
        },
        {
          id: "css-rgba",
          label: "Use translucent RGBA for card or overlay",
          checkType: "css_property_exists",
          property: "rgba",
        },
        {
          id: "css-hsl",
          label: "Use HSL for button styling",
          checkType: "css_property_exists",
          property: "hsl",
        },
      ],
      starterCode: {
        html: `<div class="palette-container">
  <div class="color-swatch swatch-primary">
    <span class="label">Brand Primary</span>
    <code>#4338ca</code>
  </div>

  <div class="card glass-card">
    <h2>Tech Startup UI</h2>
    <p>Using RGBA for glassmorphism translucent background.</p>
    <button class="action-btn">Interactive HSL Button</button>
  </div>
</div>`,
        css: `body {
  background-color: #0f172a;
  color: #f8fafc;
  font-family: sans-serif;
  padding: 24px;
}

.palette-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
}

.color-swatch {
  padding: 16px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

/* 1. Set brand primary HEX color */
.swatch-primary {
  background-color: #4338ca;
  color: #ffffff;
}

/* 2. Set frosted translucent background with RGBA */
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(8px);
}

.glass-card h2 {
  margin-top: 0;
  font-size: 18px;
}

/* 3. Style action button with HSL */
.action-btn {
  background-color: hsl(199, 89%, 48%);
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: hsl(199, 89%, 40%);
}`,
        javascript: "",
      },
      hints: [
        "HEX colors are specified with a '#' followed by 6 hex characters, e.g. #4338ca.",
        "RGBA allows an alpha channel for opacity between 0.0 and 1.0, e.g. rgba(255, 255, 255, 0.08).",
        "HSL stands for Hue (0-360), Saturation (0%-100%), and Lightness (0%-100%). Adjusting Lightness creates clean hover states.",
      ],
      expectedPreviewDescription: "A dark theme preview showing a brand primary swatch, a glassmorphic translucent card, and an HSL interactive button.",
      estimatedMinutes: 8,
    };
  }

  // 2. CSS Practice Presets
  if (courseSlug.includes("css") || lessonSlug.includes("css") || lessonSlug.includes("style")) {
    return {
      practiceType: "code",
      languages: ["html", "css"],
      instructions: "Style the provided HTML profile card using CSS. Set a background color, custom text colors, rounded corners, and proper padding to make the card look modern and clean.",
      requirements: [
        {
          id: "css-card-selector",
          label: "Create a CSS rule for .profile-card",
          checkType: "css_selector_exists",
          selector: ".profile-card",
        },
        {
          id: "css-padding",
          label: "Add padding to the card",
          checkType: "css_property_exists",
          property: "padding",
        },
        {
          id: "css-border-radius",
          label: "Add border-radius for rounded corners",
          checkType: "css_property_exists",
          property: "border-radius",
        },
        {
          id: "css-color",
          label: "Set custom background-color or color",
          checkType: "css_property_exists",
          property: "background",
        },
      ],
      starterCode: {
        html: `<div class="profile-card">
  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="Alex Rivera" class="avatar">
  <h2 class="name">Alex Rivera</h2>
  <p class="role">Frontend Developer</p>
  <p class="bio">Passionate about building accessible web interfaces and learning modern CSS.</p>
  <a href="#" class="button">Connect</a>
</div>`,
        css: `/* Style your profile card here */
.profile-card {
  max-width: 320px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
}

.name {
  margin: 0 0 4px 0;
  font-size: 20px;
  color: #1e293b;
}

.role {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #6366f1;
  font-weight: 600;
}

.bio {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 20px;
}

.button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #6366f1;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
}`,
        javascript: "",
      },
      hints: [
        "Use 'border-radius: 16px;' on .profile-card to give it smooth rounded corners.",
        "Use 'padding: 24px;' to provide breathing room between the card border and content.",
        "Change the background color of .button or .profile-card to customize the theme.",
      ],
      expectedPreviewDescription: "A styled card with centered text, circular avatar, modern colors, and a styled button.",
      estimatedMinutes: 10,
    };
  }

  // 3. JavaScript Practice Presets (HTML + CSS + JavaScript)
  return {
    practiceType: "code",
    languages: ["html", "css", "javascript"],
    instructions: "Make the button interactive with JavaScript. Select the button using document.querySelector and attach a 'click' event listener that updates the text of the heading or increments a counter.",
    requirements: [
      {
        id: "has-btn",
        label: "HTML contains a <button> element",
        checkType: "element_exists",
        selector: "button",
      },
      {
        id: "has-h1",
        label: "HTML contains a heading or counter display",
        checkType: "element_exists",
        selector: "h1",
      },
    ],
    starterCode: {
      html: `<div class="card">
  <h1 id="greeting">Hello, World!</h1>
  <p>Click the button below to trigger your JavaScript code.</p>
  <button id="action-btn" class="btn">Click Me</button>
</div>`,
      css: `.card {
  max-width: 320px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  text-align: center;
  font-family: sans-serif;
}
.btn {
  padding: 10px 20px;
  background-color: #6366f1;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 12px;
}
.btn:hover {
  background-color: #4f46e5;
}`,
      javascript: `// 1. Select the button and heading
const button = document.querySelector("#action-btn");
const heading = document.querySelector("#greeting");

// 2. Attach a click event listener
button.addEventListener("click", () => {
  heading.textContent = "You clicked the button!";
  console.log("Button was clicked!");
});`,
    },
    hints: [
      "Use document.querySelector('#action-btn') to find the button element in the DOM.",
      "Use addEventListener('click', () => { ... }) to run code when the learner clicks.",
      "Check the Console tab to view messages outputted with console.log().",
    ],
    expectedPreviewDescription: "An interactive card where clicking 'Click Me' changes the heading text and prints a log to the Console.",
    estimatedMinutes: 10,
  };
}

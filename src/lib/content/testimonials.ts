export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  outcome: string;
  batch: string;
  quote: string;
  rating: number;
  avatarUrl?: string;
  initials: string;
  gradient: string;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "test-1",
    name: "Sarah Jenkins",
    role: "Junior Frontend Developer",
    outcome: "Landed first junior role",
    batch: "HTML & CSS Track",
    quote:
      "Meritloom gave me the structured foundation I was missing from scattered YouTube tutorials. The lesson breakdown and built-in exercises made everything click.",
    rating: 5,
    initials: "SJ",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "test-2",
    name: "Alex Rivera",
    role: "Career Switcher",
    outcome: "Built portfolio from scratch",
    batch: "HTML Fundamentals",
    quote:
      "I had zero coding background. Going from basic tags to structuring complete multi-page websites in a few weeks was an incredible confidence boost.",
    rating: 5,
    initials: "AR",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "test-3",
    name: "Priya Sharma",
    role: "CS Undergraduate",
    outcome: "Scored A in Web Dev Lab",
    batch: "Web Dev Track",
    quote:
      "The video integration with clear checkpoints and cheat-sheet takeaways is 10x better than reading dense slides. It saved my web programming semester.",
    rating: 5,
    initials: "PS",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: "test-4",
    name: "Marcus Chen",
    role: "UI/UX Designer",
    outcome: "Turns Figma directly into code",
    batch: "CSS Fundamentals",
    quote:
      "Understanding the CSS box model, selectors, and background shorthands completely changed how I design in Figma and hand off components to engineers.",
    rating: 5,
    initials: "MC",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "test-5",
    name: "Elena Rostova",
    role: "Self-Taught Builder",
    outcome: "Launched 2 freelance sites",
    batch: "HTML & CSS Track",
    quote:
      "No credit cards, no paywalls halfway through a course, and no fluff. Meritloom focuses purely on learning concepts thoroughly step-by-step.",
    rating: 5,
    initials: "ER",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "test-6",
    name: "Liam O'Connor",
    role: "QA Engineer",
    outcome: "Upskilled to test web UIs",
    batch: "HTML Fundamentals",
    quote:
      "Learning semantic HTML and form attributes helped me write robust automated test selectors at work. The practice activities made it practical immediately.",
    rating: 5,
    initials: "LO",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "test-7",
    name: "Aisha Al-Mansoor",
    role: "Marketing Tech Specialist",
    outcome: "Builds custom landing pages",
    batch: "CSS Fundamentals",
    quote:
      "I used to wait days for dev tickets just to tweak styling or borders. Now I build and customize our campaign landing pages independently.",
    rating: 5,
    initials: "AA",
    gradient: "from-teal-500 to-emerald-600",
  },
  {
    id: "test-8",
    name: "Lucas Silva",
    role: "Graphic Designer",
    outcome: "Expanded into web design",
    batch: "HTML & CSS Track",
    quote:
      "The dark mode workspace, clean typography, and distraction-free video player made studying after my day job feel effortless and fun.",
    rating: 5,
    initials: "LS",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "test-9",
    name: "Hanna Lindqvist",
    role: "Aspiring Web Developer",
    outcome: "Completed both foundational courses",
    batch: "Web Dev Track",
    quote:
      "The lesson roadmap and instant progress saving kept me accountable every evening. I always knew exactly which concept was coming up next.",
    rating: 5,
    initials: "HL",
    gradient: "from-fuchsia-500 to-pink-600",
  },
  {
    id: "test-10",
    name: "Tariq Malik",
    role: "Product Manager",
    outcome: "Speaks developer language fluently",
    batch: "HTML Fundamentals",
    quote:
      "As a PM, understanding how web structure works under the hood made our sprint grooming and technical discussions significantly smoother.",
    rating: 5,
    initials: "TM",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    id: "test-11",
    name: "Chloe Bennett",
    role: "Bootcamp Prep Student",
    outcome: "Tested out of intro modules",
    batch: "HTML & CSS Track",
    quote:
      "Meritloom gave me such a solid foundation that I passed my coding bootcamp entry assessment on the first attempt without extra tutoring.",
    rating: 5,
    initials: "CB",
    gradient: "from-orange-500 to-rose-600",
  },
  {
    id: "test-12",
    name: "Kenji Sato",
    role: "Junior Web Developer",
    outcome: "Refactored company stylesheet",
    batch: "CSS Fundamentals",
    quote:
      "The CSS selectors and specificity lessons cleared up years of confusion. I cleaned up hundreds of lines of legacy redundant CSS at work.",
    rating: 5,
    initials: "KS",
    gradient: "from-sky-500 to-cyan-600",
  },
  {
    id: "test-13",
    name: "Maya Patel",
    role: "High School Educator",
    outcome: "Uses Meritloom in tech club",
    batch: "HTML Fundamentals",
    quote:
      "My students love the bite-sized lessons and interactive practice tasks. It is easily the best free learning platform I have recommended to beginners.",
    rating: 5,
    initials: "MP",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    id: "test-14",
    name: "David Kim",
    role: "Full-Stack Apprentice",
    outcome: "Built 4 responsive project sites",
    batch: "HTML & CSS Track",
    quote:
      "The combination of W3Schools curated video lessons with structured notes, objectives, and progress tracking makes learning stick permanently.",
    rating: 5,
    initials: "DK",
    gradient: "from-blue-600 to-teal-500",
  },
  {
    id: "test-15",
    name: "Noah Williams",
    role: "Content Strategist",
    outcome: "Optimized accessible markup",
    batch: "HTML Fundamentals",
    quote:
      "Understanding semantic HTML tags and document outline improved our content hierarchy and SEO rankings across our entire publication.",
    rating: 5,
    initials: "NW",
    gradient: "from-emerald-600 to-cyan-600",
  },
  {
    id: "test-16",
    name: "Zoe Martinez",
    role: "Design Engineer",
    outcome: "Created design token system",
    batch: "CSS Fundamentals",
    quote:
      "The depth of the CSS fundamentals course is unmatched for a free tool. Clean layout, dark mode, zero ads, and high quality material throughout.",
    rating: 5,
    initials: "ZM",
    gradient: "from-rose-500 to-purple-600",
  },
];

export function getTestimonialColumns(): [
  TestimonialItem[],
  TestimonialItem[],
  TestimonialItem[],
  TestimonialItem[],
] {
  const col1: TestimonialItem[] = [];
  const col2: TestimonialItem[] = [];
  const col3: TestimonialItem[] = [];
  const col4: TestimonialItem[] = [];

  TESTIMONIALS_DATA.forEach((item, index) => {
    switch (index % 4) {
      case 0:
        col1.push(item);
        break;
      case 1:
        col2.push(item);
        break;
      case 2:
        col3.push(item);
        break;
      case 3:
        col4.push(item);
        break;
    }
  });

  return [col1, col2, col3, col4];
}

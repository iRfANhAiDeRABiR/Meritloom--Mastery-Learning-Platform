import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load .env.local
const envFile = fs.readFileSync(".env.local", "utf8");
const envVars = Object.fromEntries(
  envFile
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const idx = line.indexOf("=");
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    }),
);

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const key = envVars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("=========================================================");
console.log("MERITLOOM SUPABASE DATABASE CONNECTIVITY TEST");
console.log("=========================================================");
console.log("Endpoint URL:", url);
console.log("Client Key:  ", key ? `${key.slice(0, 16)}...` : "MISSING");
console.log("---------------------------------------------------------");

const supabase = createClient(url, key);

const TABLES = [
  "profiles",
  "instructor_profiles",
  "categories",
  "courses",
  "course_modules",
  "lessons",
  "course_learning_outcomes",
  "course_prerequisites",
  "skills",
  "course_skills",
  "lesson_objectives",
  "lesson_resources",
  "learner_preferences",
  "learner_interests",
  "course_enrollments",
  "lesson_progress",
  "saved_courses",
  "recent_views",
  "lesson_notes"
];

async function run() {
  // 1. Auth check
  const { error: authError } = await supabase.auth.getSession();
  if (authError) {
    console.log(`[AUTH SERVICE] ❌ Error: ${authError.message}`);
  } else {
    console.log(`[AUTH SERVICE] ✅ Online & Connected`);
  }

  console.log("---------------------------------------------------------");
  console.log("Checking 19 Core Database Tables:");
  console.log("---------------------------------------------------------");

  let accessibleCount = 0;

  for (const table of TABLES) {
    try {
      const { error, count } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      if (error) {
        // PostgREST error codes (PGRST204 / 42P01 etc. indicate whether table exists or RLS applies)
        console.log(` - ${table.padEnd(26)} : ⚠️  ${error.code || "ERR"} (${error.message})`);
      } else {
        accessibleCount++;
        console.log(` - ${table.padEnd(26)} : ✅ Exists (Rows: ${count ?? 0})`);
      }
    } catch (err) {
      console.log(` - ${table.padEnd(26)} : ❌ Exception: ${err.message}`);
    }
  }

  console.log("---------------------------------------------------------");
  console.log(`Summary: ${accessibleCount} of ${TABLES.length} tables verified directly via API.`);
  console.log("=========================================================");
}

run().catch(console.error);


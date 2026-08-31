import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function handleSignOut(request: NextRequest, statusCode = 302) {
  const { origin } = new URL(request.url);
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");

  const response = NextResponse.redirect(`${origin}/`, {
    status: statusCode,
  });

  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );

  return response;
}

export async function GET(request: NextRequest) {
  return handleSignOut(request, 302);
}

export async function POST(request: NextRequest) {
  return handleSignOut(request, 303);
}


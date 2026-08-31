import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { generateContentExport } from "@/lib/admin/content-transfer/export";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const scope = {
      type: body.type || "all",
      courseSlugs: Array.isArray(body.courseSlugs) ? body.courseSlugs : undefined,
      learningPathSlugs: Array.isArray(body.learningPathSlugs) ? body.learningPathSlugs : undefined,
      includeReferencedCourses: body.includeReferencedCourses !== false,
    };

    const result = await generateContentExport(scope);

    return new NextResponse(result.jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${result.filename}"`,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to export content.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
